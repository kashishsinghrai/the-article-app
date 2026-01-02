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
  
  // Actions
  setProfile: (profile: Profile | null) => void;
  setArticles: (articles: Article[]) => void;
  setUsers: (users: Profile[]) => void;
  setChatRequests: (requests: ChatRequest[]) => void;
  
  // Logic
  syncAll: () => Promise<void>;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  profile: null,
  isLoggedIn: false,
  articles: [],
  users: [],
  chatRequests: [],
  isSyncing: false,
  isInitialized: false,

  setProfile: (profile) => set({ profile, isLoggedIn: !!profile }),
  setArticles: (articles) => set({ articles }),
  setUsers: (users) => set({ users }),
  setChatRequests: (chatRequests) => set({ chatRequests }),

  syncAll: async () => {
    if (get().isSyncing) return;
    set({ isSyncing: true });
    try {
      const [artRes, userRes] = await Promise.all([
        supabase.from('articles').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('full_name', { ascending: true })
      ]);

      if (!artRes.error) set({ articles: artRes.data || [] });
      if (!userRes.error) set({ users: userRes.data || [] });
    } finally {
      set({ isSyncing: false });
    }
  },

  hydrate: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
      if (profile) {
        set({ profile, isLoggedIn: true });
        // Fetch pending handshakes
        const { data: reqs } = await supabase.from('chat_requests').select('*').eq('to_id', profile.id).eq('status', 'pending');
        if (reqs) set({ chatRequests: reqs });
      }
    }
    await get().syncAll();
    set({ isInitialized: true });
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    set({ 
      profile: null, 
      isLoggedIn: false, 
      articles: [], 
      users: [], 
      chatRequests: [],
      isInitialized: true 
    });
  }
}));