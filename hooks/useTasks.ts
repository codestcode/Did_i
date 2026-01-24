'use client';

import { useState, useCallback, useEffect } from 'react';
import { Task } from '@/lib/types';
import { taskStorage } from '@/lib/services/storageService';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tasks from storage on mount
  useEffect(() => {
    const loadedTasks = taskStorage.getTasks();
    const taskOrder = taskStorage.getTaskOrder();

    // Sort tasks by saved order if available
    if (taskOrder.length > 0) {
      const sortedTasks = taskOrder
        .map((id) => loadedTasks.find((t) => t.id === id))
        .filter(Boolean) as Task[];
      setTasks(sortedTasks);
    } else {
      setTasks(loadedTasks);
    }
    setIsLoaded(true);
  }, []);

  const addTask = useCallback(
    (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newTask: Task = {
        ...task,
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const updated = [...tasks, newTask];
      setTasks(updated);
      taskStorage.saveTasks(updated);
      return newTask;
    },
    [tasks]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      const updated = tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
      );
      setTasks(updated);
      taskStorage.updateTask(id, updates);
    },
    [tasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      const updated = tasks.filter((t) => t.id !== id);
      setTasks(updated);
      taskStorage.deleteTask(id);
    },
    [tasks]
  );

  const archiveTask = useCallback(
    (id: string) => {
      updateTask(id, { isArchived: true });
    },
    [updateTask]
  );

  const restoreTask = useCallback(
    (id: string) => {
      updateTask(id, { isArchived: false });
    },
    [updateTask]
  );

  const duplicateTask = useCallback(
    (id: string) => {
      const original = tasks.find((t) => t.id === id);
      if (!original) return;
      const duplicate: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
        title: `${original.title} (Copy)`,
        description: original.description,
        category: original.category,
        requiresPhoto: original.requiresPhoto,
        photoIds: [],
        isArchived: false,
        urgency: original.urgency,
      };
      return addTask(duplicate);
    },
    [tasks, addTask]
  );

  const reorderTasks = useCallback((taskIds: string[]) => {
    taskStorage.reorderTasks(taskIds);
  }, []);

  const getActiveTasks = useCallback(() => {
    return tasks.filter((t) => !t.isArchived);
  }, [tasks]);

  const getArchivedTasks = useCallback(() => {
    return tasks.filter((t) => t.isArchived);
  }, [tasks]);

  return {
    tasks,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    archiveTask,
    restoreTask,
    duplicateTask,
    reorderTasks,
    getActiveTasks,
    getArchivedTasks,
  };
}
