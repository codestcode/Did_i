'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, CheckCircle2, Lightbulb, Save, X } from 'lucide-react';
import ChecklistTemplates from './ChecklistTemplates';
import { useTasks } from '@/hooks/useTasks';
import { taskCompletionStorage } from '@/lib/services/storageService';

interface CheckItem {
  id: string;
  name: string;
  category: string;
  completed: boolean;
  hasPhoto: boolean;
  hasVoice: boolean;
  urgency: 'high' | 'medium' | 'low';
  completedAt?: string;
}

export default function ChecklistView() {
  const { tasks, updateTask, deleteTask } = useTasks();
  const [checklistItems, setChecklistItems] = useState<CheckItem[]>([]);
  // Load checklist items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('did_i_checklist_items');
    if (saved) {
      try { setChecklistItems(JSON.parse(saved)); } catch {}
    }
  }, []);

  // Save checklist items to localStorage
  useEffect(() => {
    localStorage.setItem('did_i_checklist_items', JSON.stringify(checklistItems));
  }, [checklistItems]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editUrgency, setEditUrgency] = useState<'high' | 'medium' | 'low'>('medium');

  const toggleItemCompletion = (id: string) => {
    const checkItem = checklistItems.find(item => item.id === id);
    if (checkItem) {
      const nextCompleted = !checkItem.completed;
      setChecklistItems(checklistItems.map(item =>
        item.id === id
          ? {
            ...item,
            completed: nextCompleted,
            completedAt: nextCompleted ? 'just now' : undefined
          }
          : item
      ));
      if (tasks.some((task) => task.id === id)) {
        taskCompletionStorage.setCompletion(id, nextCompleted);
      }
    }
  };

  const startEdit = (id: string, name: string, category: string, urgency: 'high' | 'medium' | 'low') => {
    setEditingId(id);
    setEditName(name);
    setEditCategory(category);
    setEditUrgency(urgency);
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) {
      updateTask(id, {
        title: editName,
        category: editCategory || 'General',
        urgency: editUrgency,
      });
      setChecklistItems(checklistItems.map(item =>
        item.id === id
          ? { ...item, name: editName, category: editCategory }
          : item
      ));
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const convertTasksToCheckItems = () => {
    const completionMap = taskCompletionStorage.getAll();
    const voiceMap = JSON.parse(localStorage.getItem('did_i_voice_confirmations') || '{}');
    const converted = tasks.map(task => ({
      id: task.id,
      name: task.title,
      category: task.category,
      completed: completionMap[task.id]?.completed ?? false,
      hasPhoto: task.photoIds.length > 0,
      hasVoice: !!voiceMap[task.id],
      urgency: task.urgency,
    }));
    setChecklistItems(converted);
  };

  const addTemplateItems = (templateItems: string[]) => {
    const newItems = templateItems.map((item, index) => ({
      id: `template-${Date.now()}-${index}`,
      name: item,
      category: 'Template',
      completed: false,
      hasPhoto: false,
      hasVoice: false,
      urgency: 'high' as const,
    }));
    setChecklistItems([...checklistItems, ...newItems]);
  };

  const deleteItem = (id: string) => {
    deleteTask(id);
    setChecklistItems(checklistItems.filter(item => item.id !== id));
  };

  const completedCount = checklistItems.filter(item => item.completed).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <motion.div
      className="overflow-y-auto h-full p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Load Tasks Button */}
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={convertTasksToCheckItems}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:shadow-lg transition-shadow"
            >
              Load My Tasks ({tasks.length})
            </motion.button>
          </motion.div>
        )}

        {/* Tasks Checklist */}
        {checklistItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass3d bg-card rounded-xl border border-border p-6"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Your Tasks</h2>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {checklistItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-secondary/30 rounded-lg border border-border p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleItemCompletion(item.id)}
                        className="flex-shrink-0"
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          item.completed
                            ? 'bg-accent border-accent'
                            : 'border-primary hover:border-accent'
                        }`}>
                          {item.completed && <CheckCircle2 className="w-5 h-5 text-accent-foreground" />}
                        </div>
                      </motion.button>

                      {editingId === item.id ? (
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-1 rounded bg-background border border-border text-foreground outline-none focus:border-primary"
                          />
                          <input
                            type="text"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="w-full px-3 py-1 rounded bg-background border border-border text-foreground outline-none focus:border-primary text-sm"
                            placeholder="Category"
                          />
                        </div>
                      ) : (
                        <div className="flex-1">
                          <h4 className={`font-semibold ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {item.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {editingId === item.id ? (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => saveEdit(item.id)}
                            className="p-2 rounded-lg hover:bg-accent/20 transition-colors"
                          >
                            <Save className="w-5 h-5 text-accent" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={cancelEdit}
                            className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                          >
                            <X className="w-5 h-5 text-destructive" />
                          </motion.button>
                        </>
                      ) : (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => startEdit(item.id, item.name, item.category, item.urgency)}
                            className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                          >
                            <Edit2 className="w-5 h-5 text-muted-foreground hover:text-primary" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deleteItem(item.id)}
                            className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="w-5 h-5 text-muted-foreground hover:text-destructive" />
                          </motion.button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Templates Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass3d bg-card rounded-xl border border-border p-6"
        >
          <ChecklistTemplates onSelectTemplate={(items) => {
            const newItems = items.map((item, index) => ({
              id: `template-${Date.now()}-${index}`,
              name: item,
              category: 'Template',
              completed: false,
              hasPhoto: false,
              hasVoice: false,
              urgency: 'high' as const,
            }));
            setChecklistItems([...checklistItems, ...newItems]);
          }} />
        </motion.div>

        {/* Confirmation Options Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex gap-3"
        >
          <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Enhance your confirmations</p>
            <p className="text-sm text-foreground">Click the camera or microphone icons next to items to add photo proof or voice confirmation for extra peace of mind.</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
