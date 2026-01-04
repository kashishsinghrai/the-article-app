
export type Role = 'user' | 'admin';
export type Category = 'Investigative' | 'Economic' | 'Regional' | 'All';

export interface UserSettings {
  notifications_enabled: boolean;
  presence_visible: boolean;
  data_sharing: boolean;
  ai_briefings: boolean;
  secure_mode: boolean;
  camera_access: boolean;
  mic_access: boolean;
  location_access: boolean;
  storage_access: boolean;
  contacts_sync: boolean;
}

export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  user_name: string;
  text: string;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  gender: string;
  serial_id: string; 
  budget: number;
  role: Role;
  is_private: boolean;
  bio: string;
  avatar_url?: string;
  cover_url?: string;
  email?: string;
  phone?: string;
  is_online?: boolean; 
  last_seen?: string;
  settings?: UserSettings;
  followers_count?: number;
  following_count?: number;
}

export interface ChatRequest {
  id: string;
  from_id: string;
  to_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  from_name?: string;
}

export interface LiveMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  text: string;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  image_url: string;
  category: Category;
  author_id: string;
  author_name: string;
  author_serial: string;
  created_at: string;
  is_private?: boolean;
  hashtags?: string[]; 
  likes_count?: number;
  dislikes_count?: number;
  comments_count?: number;
  is_liked?: boolean;
  is_disliked?: boolean;
}
