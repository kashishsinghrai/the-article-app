
import { create } from 'zustand';
import { Profile, Article, ChatRequest } from '../types';
import { supabase } from './supabase';
import { toast } from 'react-hot-toast';

interface AppState {
  profile: Profile | null;
  isLoggedIn: boolean;
  articles: Article[];
  users: Profile[];
  chatRequests: ChatRequest[];
  followingIds: string[]; 
  activeHandshake: ChatRequest | null;
  isInitialized: boolean;
  isSyncing: boolean;
  
  setProfile: (profile: Profile | null) => void;
  setActiveHandshake: (req: ChatRequest | null) => void;
  setChatRequests: (reqs: ChatRequest[]) => void;
  
  syncAll: () => Promise<void>;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
  initAuthListener: () => (() => void);
  toggleFollow: (targetId: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  profile: null,
  isLoggedIn: false,
  articles: [],
  users: [],
  chatRequests: [],
  followingIds: [],
  activeHandshake: null,
  isInitialized: false,
  isSyncing: false,

  setProfile: (profile) => set({ profile, isLoggedIn: !!profile }),
  setActiveHandshake: (activeHandshake) => set({ activeHandshake }),
  setChatRequests: (chatRequests) => set({ chatRequests }),

  syncAll: async () => {
    if (get().isSyncing) return;
    set({ isSyncing: true });
    try {
      const [artRes, userRes] = await Promise.all([
        supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('profiles').select('*').order('full_name', { ascending: true })
      ]);
      set({ articles: artRes.data || [], users: userRes.data || [] });
    } finally {
      set({ isSyncing: false });
    }
  },

  toggleFollow: async (targetId: string) => {
    const me = get().profile;
    if (!me) return;
    if (targetId === me.id) return;

    const isFollowing = get().followingIds.includes(targetId);

    // Optimistic UI Update
    if (isFollowing) {
      set({ followingIds: get().followingIds.filter(id => id !== targetId) });
      const { error } = await supabase.from('follows').delete().eq('follower_id', me.id).eq('following_id', targetId);
      if (!error) {
        toast.success("Handshake Terminated", { icon: '🚫' });
      }
    } else {
      set({ followingIds: [...get().followingIds, targetId] });
      const { error } = await supabase.from('follows').insert({ follower_id: me.id, following_id: targetId });
      if (!error) {
        toast.success("Identity Signal Followed", { icon: '📡' });
      } else if (error.code === '23505') {
        // Unique violation means already following
        toast.error("Handshake Already Active");
      }
    }
    
    // Trigger sync to update global counts (assuming triggers handle count logic)
    get().syncAll();
  },

  hydrate: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile) {
          const [following, reqs] = await Promise.all([
            supabase.from('follows').select('following_id').eq('follower_id', profile.id),
            supabase.from('chat_requests').select('*, from_node:from_id(*)').eq('to_id', profile.id).eq('status', 'pending')
          ]);
          
          set({ 
            profile, 
            isLoggedIn: true, 
            followingIds: following.data?.map(f => f.following_id) || [],
            chatRequests: reqs.data || []
          });
        }
      }
    } finally {
      set({ isInitialized: true });
      get().syncAll();
    }
  },

  initAuthListener: () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        set({ profile: null, isLoggedIn: false, chatRequests: [], activeHandshake: null, followingIds: [] });
      } else if (event === 'SIGNED_IN') {
        await get().hydrate();
      }
    });

    // Zero-Latency Engine
    const channel = supabase.channel('node_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_requests' }, async (payload) => {
        const me = get().profile;
        if (!me) return;

        const record = (payload.new || payload.old) as ChatRequest;

        // 1. Instant Request Notification
        if (payload.eventType === 'INSERT' && record.to_id === me.id) {
          const { data: full } = await supabase.from('chat_requests').select('*, from_node:from_id(*)').eq('id', record.id).single();
          if (full) {
            set({ chatRequests: [full, ...get().chatRequests] });
            toast("Incoming Identity Signal", { icon: '📡' });
          }
        }

        // 2. Instant Handshake Acceptance
        if (payload.eventType === 'UPDATE' && record.status === 'accepted') {
          if (record.from_id === me.id || record.to_id === me.id) {
            const { data: full } = await supabase.from('chat_requests').select('*, from_node:from_id(*), to_node:to_id(*)').eq('id', record.id).single();
            if (full) {
              set({ activeHandshake: full, chatRequests: get().chatRequests.filter(r => r.id !== record.id) });
              toast.success("Handshake Synchronized", { icon: '🤝' });
            }
          }
        }

        if (payload.eventType === 'DELETE') {
          set({ chatRequests: get().chatRequests.filter(r => r.id !== record.id) });
          if (get().activeHandshake?.id === record.id) set({ activeHandshake: null });
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
      channel.unsubscribe();
    };
  },

  logout: async () => {
    await supabase.auth.signOut();
  }
}));
