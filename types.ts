
export type Role = 'user' | 'admin';
export type Category = 'Investigative' | 'Economic' | 'Regional';

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
  following?: string[];
  is_online?: boolean; // New presence field
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
}

export interface SupportTicket {
  user_email: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
}
