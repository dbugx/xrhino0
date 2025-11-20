export enum ViewState {
  HOME = 'HOME',
  XPANDA = 'XPANDA',
  XTIGER = 'XTIGER',
  COMMUNITY = 'COMMUNITY',
  STUDIO = 'STUDIO',
  VOICE = 'VOICE'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  groundingMetadata?: any;
}

export interface ServiceMetric {
  name: string;
  value: number;
  fullMark: number;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
  preferences: {
    notifications: boolean;
    theme: 'dark' | 'light';
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: 'xpanda' | 'xtiger' | 'system';
}