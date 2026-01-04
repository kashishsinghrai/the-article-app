
import { create } from 'zustand';
import { Profile, Article, ChatRequest } from '../types';
import { supabase } from './supabase';

interface AppState {
  profile: Profile | null;
  isLoggedIn: boolean;
  articles: Article[];
  users: Profile[];
  chatRequests: ChatRequest[];
  activeHandshake: ChatRequest | null;
  isSyncing: boolean;
  isInitialized: boolean;
  isHydrating: boolean;
  error: string | null;
  
  setProfile: (profile: Profile | null) => void;
  setArticles: (articles: Article[]) => void;
  setUsers: (users: Profile[]) => void;
  setChatRequests: (chatRequests: ChatRequest[]) => void;
  setActiveHandshake: (req: ChatRequest | null) => void;
  
  syncAll: () => Promise<void>;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
  initAuthListener: () => (() => void);
}

export const useStore = create<AppState>((set, get) => ({
  profile: null,
  isLoggedIn: false,
  articles: [],
  users: [],
  chatRequests: [],
  activeHandshake: null,
  isSyncing: false,
  isInitialized: false,
  isHydrating: false,
  error: null,

  setProfile: (profile) => set({ profile, isLoggedIn: !!profile }),
  setArticles: (articles) => set({ articles }),
  setUsers: (users) => set({ users }),
  setChatRequests: (chatRequests) => set({ chatRequests }),
  setActiveHandshake: (activeHandshake) => set({ activeHandshake }),

  syncAll: async () => {
    if (get().isSyncing) return;
    set({ isSyncing: true });
    
    try {
      const [artRes, userRes] = await Promise.all([
        supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('profiles').select('*').order('full_name', { ascending: true })
      ]);
      
      set({ 
        articles: artRes.data || [], 
        users: userRes.data || [] 
      });
    } catch (e: any) {
      console.warn("Sync warning:", e.message);
    } finally {
      set({ isSyncing: false });
    }
  },

  hydrate: async () => {
    if (get().isHydrating) return;
    set({ isHydrating: true });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        set({ isLoggedIn: true });
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (profile) {
          set({ profile });
          // Fetch pending requests for this user
          const { data: reqs } = await supabase.from('chat_requests')
            .select('*, from_node:from_id(*)')
            .eq('to_id', profile.id)
            .eq('status', 'pending');
          if (reqs) set({ chatRequests: reqs });
        }
      } else {
        set({ profile: null, isLoggedIn: false });
      }
    } catch (e: any) {
      console.error("Hydration Error:", e.message);
    } finally {
      set({ isInitialized: true, isHydrating: false });
      get().syncAll();
    }
  },

  initAuthListener: () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        await get().hydrate();
      } else if (event === 'SIGNED_OUT') {
        set({ profile: null, isLoggedIn: false, chatRequests: [], articles: [], users: [] });
      }
    });

    // Real-time listener for chat requests
    const channel = supabase.channel('global_handshakes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_requests' }, async (payload) => {
        const me = get().profile;
        if (!me) return;

        const newReq = payload.new as ChatRequest;
        
        // CASE 1: Incoming pending request for me
        if (newReq.to_id === me.id && newReq.status === 'pending') {
          // Refresh my notifications list
          const { data: reqs } = await supabase.from('chat_requests')
            .select('*, from_node:from_id(*)')
            .eq('to_id', me.id)
            .eq('status', 'pending');
          if (reqs) set({ chatRequests: reqs });
        }

        // CASE 2: A request I sent was accepted
        if (newReq.from_id === me.id && newReq.status === 'accepted') {
          const { data: fullReq } = await supabase.from('chat_requests')
            .select('*, to_node:to_id(*)')
            .eq('id', newReq.id)
            .single();
          if (fullReq) set({ activeHandshake: fullReq });
        }

        // CASE 3: A request sent to me was accepted (by me)
        if (newReq.to_id === me.id && newReq.status === 'accepted') {
          const { data: fullReq } = await supabase.from('chat_requests')
            .select('*, from_node:from_id(*)')
            .eq('id', newReq.id)
            .single();
          if (fullReq) set({ activeHandshake: fullReq });
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
      channel.unsubscribe();
    };
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      localStorage.clear();
      set({ profile: null, isLoggedIn: false, chatRequests: [], activeHandshake: null });
    }
  }
}));
