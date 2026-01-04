import { create } from 'zustand';
import { Profile, Article, ChatRequest } from '../types';
import { supabase } from './supabase';

interface AppState {
  profile: Profile | null;
  isLoggedIn: boolean;
  articles: Article[];
  users: Profile[];
  chatRequests: ChatRequest[];
  isSyncing: boolean;
  isInitialized: boolean;
  isHydrating: boolean;
  error: string | null;
  
  setProfile: (profile: Profile | null) => void;
  setArticles: (articles: Article[]) => void;
  setUsers: (users: Profile[]) => void;
  setChatRequests: (chatRequests: ChatRequest[]) => void;
  
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
  isSyncing: false,
  isInitialized: false,
  isHydrating: false,
  error: null,

  setProfile: (profile) => set({ profile, isLoggedIn: !!profile }),
  setArticles: (articles) => set({ articles }),
  setUsers: (users) => set({ users }),
  setChatRequests: (chatRequests) => set({ chatRequests }),

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
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (profile) {
          set({ profile });
          const { data: reqs } = await supabase.from('chat_requests')
            .select('*')
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
      // Non-blocking sync
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
    return () => subscription.unsubscribe();
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      localStorage.clear();
      set({ profile: null, isLoggedIn: false, chatRequests: [] });
    }
  }
}));