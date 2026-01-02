
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
  
  // Actions
  setProfile: (profile: Profile | null) => void;
  setArticles: (articles: Article[]) => void;
  setUsers: (users: Profile[]) => void;
  setChatRequests: (requests: ChatRequest[]) => void;
  
  // Logic
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
    set({ isSyncing: true, error: null });
    
    try {
      // Parallelize safely with a limit
      const [artRes, userRes] = await Promise.all([
        supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(40),
        supabase.from('profiles').select('*').order('full_name', { ascending: true }).limit(60)
      ]);

      set({ 
        articles: artRes.data || [], 
        users: userRes.data || [] 
      });
    } catch (e: any) {
      console.warn("Sync background warning:", e.message);
    } finally {
      set({ isSyncing: false });
    }
  },

  hydrate: async () => {
    // Prevent redundant hydration attempts
    if (get().isHydrating || get().isInitialized) return;
    set({ isHydrating: true, error: null });

    // Safety timeout for the session check
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Auth Timeout')), 4000)
    );

    try {
      const sessionResult = await Promise.race([
        supabase.auth.getSession(),
        timeoutPromise
      ]) as any;

      const session = sessionResult.data?.session;
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (profile) {
          set({ profile, isLoggedIn: true });
          // Background fetch for handshakes
          supabase.from('chat_requests')
            .select('*')
            .eq('to_id', profile.id)
            .eq('status', 'pending')
            .then(({ data }) => data && set({ chatRequests: data }));
        }
      } else {
        set({ profile: null, isLoggedIn: false });
      }
    } catch (e: any) {
      console.error("Hydration Error:", e.message);
      set({ error: "Initializing Guest Access..." });
    } finally {
      // CRITICAL: Always release the loader here
      set({ isInitialized: true, isHydrating: false });
      // Non-blocking sync
      get().syncAll().catch(err => console.warn("Background sync failed", err));
    }
  },

  initAuthListener: () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        // Hydrate only if profile is not already present to avoid loops
        if (!get().profile) get().hydrate();
      } else if (event === 'SIGNED_OUT') {
        set({ profile: null, isLoggedIn: false, chatRequests: [] });
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
