'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Archive, Copy, Trash2, ChevronDown } from 'lucide-react';
import { Task } from '@/lib/types';
import { useTasks } from '@/hooks/useTasks';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

export default function TaskManager() {
  const { tasks, isLoaded, addTask, updateTask, deleteTask, archiveTask, restoreTask, duplicateTask, getActiveTasks, getArchivedTasks } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const activeTasks = getActiveTasks();
  const archivedTasks = getArchivedTasks();

  const handleAddTask = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    addTask(data);
    setShowForm(false);
  };

  const handleEditTask = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    }
    setEditingTask(null);
  };

  const handleDuplicateTask = (taskId: string) => {
    duplicateTask(taskId);
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Loading tasks...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-center mb-4">
        <img src="/stickers/unwell.png" alt="" className="w-60 h-60 sm:w-72 sm:h-72 select-none" />
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowForm(true)}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
      >
        <Plus className="w-5 h-5" />
        Add New Task
      </motion.button>

      {/* Task Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-xl shadow-lg max-w-lg w-full"
            >
              <TaskForm 
                onSubmit={handleAddTask} 
                onCancel={() => setShowForm(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Task Modal */}
      <AnimatePresence>
        {editingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingTask(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-xl shadow-lg max-w-lg w-full"
            >
              <TaskForm 
                task={editingTask}
                onSubmit={handleEditTask} 
                onCancel={() => setEditingTask(null)}
                isEditing
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Tasks */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Active Tasks ({activeTasks.length})</h2>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {activeTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-8 text-muted-foreground"
              >
                <p>No active tasks yet. Create one to get started!</p>
              </motion.div>
            ) : (
              activeTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => setEditingTask(task)}
                  onArchive={() => archiveTask(task.id)}
                  onDelete={() => deleteTask(task.id)}
                  onDuplicate={() => handleDuplicateTask(task.id)}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Archived Tasks */}
      {archivedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="w-full flex items-center justify-between p-4 rounded-lg glass3d bg-card border border-border hover:bg-secondary/50 transition-colors"
          >
            <span className="font-semibold text-foreground">Archived Tasks ({archivedTasks.length})</span>
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${showArchived ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showArchived && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 mt-3"
              >
                {archivedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isArchived
                    onEdit={() => setEditingTask(task)}
                    onRestore={() => restoreTask(task.id)}
                    onDelete={() => deleteTask(task.id)}
                    onDuplicate={() => handleDuplicateTask(task.id)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
