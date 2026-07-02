export interface TaskPhoto {
  id: string;
  taskId: string;
  url: string; 
  timestamp: number;
  size?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  requiresPhoto: boolean;
  requiresVoice: boolean;
  photoIds: string[];
  createdAt: number;
  updatedAt: number;
  isArchived: boolean;
  urgency: 'high' | 'medium' | 'low';
}

export interface TaskCompletion {
  id: string;
  completed: boolean;
  completedAt?: number;
}

export interface Settings {
  darkMode: boolean;
  calmMode: boolean;
  autoSaveConfirmations: boolean;
  photoRetentionDays: number;
  photoQuality: 'low' | 'medium' | 'high';
  notificationFrequency: 'always' | 'once' | 'never';
  soundEnabled: boolean;
  animationsEnabled: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  darkMode: false,
  calmMode: false,
  autoSaveConfirmations: true,
  photoRetentionDays: 30,
  photoQuality: 'high',
  notificationFrequency: 'always',
  soundEnabled: true,
  animationsEnabled: true,
};
