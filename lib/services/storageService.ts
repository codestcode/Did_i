import { Task, TaskCompletion, TaskPhoto, Settings, DEFAULT_SETTINGS } from '@/lib/types';

const STORAGE_KEYS = {
  TASKS: 'did_i_tasks',
  PHOTOS: 'did_i_photos',
  SETTINGS: 'did_i_settings',
  TASK_ORDER: 'did_i_task_order',
  TASK_COMPLETIONS: 'did_i_task_completions',
};

// Task Storage
export const taskStorage = {
  getTasks: (): Task[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[v0] Failed to get tasks:', error);
      return [];
    }
  },

  saveTasks: (tasks: Task[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('[v0] Failed to save tasks:', error);
    }
  },

  addTask: (task: Task): void => {
    const tasks = taskStorage.getTasks();
    tasks.push(task);
    taskStorage.saveTasks(tasks);
  },

  updateTask: (id: string, updates: Partial<Task>): void => {
    const tasks = taskStorage.getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates, updatedAt: Date.now() };
      taskStorage.saveTasks(tasks);
    }
  },

  deleteTask: (id: string): void => {
    const tasks = taskStorage.getTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    taskStorage.saveTasks(filtered);
    photoStorage.deleteTaskPhotos(id);
    taskCompletionStorage.clearCompletion(id);
  },

  getTask: (id: string): Task | undefined => {
    const tasks = taskStorage.getTasks();
    return tasks.find((t) => t.id === id);
  },

  archiveTask: (id: string): void => {
    taskStorage.updateTask(id, { isArchived: true });
  },

  restoreTask: (id: string): void => {
    taskStorage.updateTask(id, { isArchived: false });
  },

  reorderTasks: (taskIds: string[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.TASK_ORDER, JSON.stringify(taskIds));
    } catch (error) {
      console.error('[v0] Failed to save task order:', error);
    }
  },

  getTaskOrder: (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASK_ORDER);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[v0] Failed to get task order:', error);
      return [];
    }
  },
};

// Task Completion Storage
export const taskCompletionStorage = {
  getAll: (): Record<string, TaskCompletion> => {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASK_COMPLETIONS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('[v0] Failed to get task completions:', error);
      return {};
    }
  },

  getCompletion: (id: string): TaskCompletion | undefined => {
    const all = taskCompletionStorage.getAll();
    return all[id];
  },

  setCompletion: (id: string, completed: boolean): void => {
    if (typeof window === 'undefined') return;
    try {
      const all = taskCompletionStorage.getAll();
      if (completed) {
        all[id] = { id, completed: true, completedAt: Date.now() };
      } else {
        delete all[id];
      }
      localStorage.setItem(STORAGE_KEYS.TASK_COMPLETIONS, JSON.stringify(all));
    } catch (error) {
      console.error('[v0] Failed to set task completion:', error);
    }
  },

  clearCompletion: (id: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const all = taskCompletionStorage.getAll();
      delete all[id];
      localStorage.setItem(STORAGE_KEYS.TASK_COMPLETIONS, JSON.stringify(all));
    } catch (error) {
      console.error('[v0] Failed to clear task completion:', error);
    }
  },
};

// Photo Storage
export const photoStorage = {
  getPhoto: (id: string): TaskPhoto | undefined => {
    if (typeof window === 'undefined') return undefined;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      const photos: TaskPhoto[] = data ? JSON.parse(data) : [];
      return photos.find((p) => p.id === id);
    } catch (error) {
      console.error('[v0] Failed to get photo:', error);
      return undefined;
    }
  },

  getTaskPhotos: (taskId: string): TaskPhoto[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      const photos: TaskPhoto[] = data ? JSON.parse(data) : [];
      return photos.filter((p) => p.taskId === taskId);
    } catch (error) {
      console.error('[v0] Failed to get task photos:', error);
      return [];
    }
  },

  addPhoto: (photo: TaskPhoto): void => {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      const photos: TaskPhoto[] = data ? JSON.parse(data) : [];
      photos.push(photo);
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
    } catch (error) {
      console.error('[v0] Failed to add photo:', error);
    }
  },

  deletePhoto: (photoId: string, taskId: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      let photos: TaskPhoto[] = data ? JSON.parse(data) : [];
      photos = photos.filter((p) => p.id !== photoId);
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));

      // Update task's photoIds
      const task = taskStorage.getTask(taskId);
      if (task) {
        const updatedPhotoIds = task.photoIds.filter((id) => id !== photoId);
        taskStorage.updateTask(taskId, { photoIds: updatedPhotoIds });
      }
    } catch (error) {
      console.error('[v0] Failed to delete photo:', error);
    }
  },

  deleteTaskPhotos: (taskId: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      let photos: TaskPhoto[] = data ? JSON.parse(data) : [];
      photos = photos.filter((p) => p.taskId !== taskId);
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
    } catch (error) {
      console.error('[v0] Failed to delete task photos:', error);
    }
  },

  cleanExpiredPhotos: (retentionDays: number): void => {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      let photos: TaskPhoto[] = data ? JSON.parse(data) : [];
      const cutoffTime = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
      photos = photos.filter((p) => p.timestamp > cutoffTime);
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
    } catch (error) {
      console.error('[v0] Failed to clean expired photos:', error);
    }
  },
};

// Settings Storage
export const settingsStorage = {
  getSettings: (): Settings => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('[v0] Failed to get settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: (settings: Settings): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('[v0] Failed to save settings:', error);
    }
  },

  updateSettings: (updates: Partial<Settings>): Settings => {
    const current = settingsStorage.getSettings();
    const updated = { ...current, ...updates };
    settingsStorage.saveSettings(updated);
    return updated;
  },
};
