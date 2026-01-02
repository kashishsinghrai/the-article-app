
export type Role = 'user' | 'admin';
export type Category = 'Investigative' | 'Economic' | 'Regional' | 'All';

export interface UserSettings {
  notifications_enabled: boolean;
  presence_visible: boolean;
  data_sharing: boolean;
  ai_briefings: boolean;
  secure_mode: boolean;
  // Hardware Permissions
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
  email?: string;
  phone?: string;
  following?: string[]; // IDs of users this person follows
  followers_count?: number;
  following_count?: number;
  is_online?: boolean; 
  last_seen?: string;
  settings?: UserSettings; 
}

export interface ChatRequest {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  timestamp: number;
}

export interface LiveMessage {
  id: string;
  senderId: string;
  senderName?: string; 
  text: string;
  timestamp: number;
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
}
