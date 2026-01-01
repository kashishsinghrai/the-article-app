
export type Role = 'user' | 'admin';
export type Category = 'Investigative' | 'Economic' | 'Regional';

export interface UserSettings {
  notifications_enabled: boolean;
  presence_visible: boolean;
  data_sharing: boolean;
  ai_briefings: boolean;
  secure_mode: boolean;
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
  email?: string;      // Added for administrative tracking
  phone?: string;      // Added for administrative tracking
  following?: string[];
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
}
