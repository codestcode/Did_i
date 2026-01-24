'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, CheckCircle2, Clock, AlertCircle, X, ArrowRight } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import { useTasks } from '@/hooks/useTasks';
import { taskCompletionStorage } from '@/lib/services/storageService';

interface LeavingHomeItem {
  id: string;
  name: string;
  category: string;
  completed: boolean;
  requiresPhoto: boolean;
  requiresVoice: boolean;
}

interface LeavingHomeModeProps {
  isActive: boolean;
  onDeactivate: () => void;
}

const DEFAULT_ITEMS: LeavingHomeItem[] = [
  { id: '1', name: 'Locked front door', category: 'Security', completed: false, requiresPhoto: true, requiresVoice: true },
  { id: '2', name: 'Locked back door', category: 'Security', completed: false, requiresPhoto: true, requiresVoice: false },
  { id: '3', name: 'Turned off stove', category: 'Safety', completed: false, requiresPhoto: true, requiresVoice: true },
  { id: '4', name: 'Turned off oven', category: 'Safety', completed: false, requiresPhoto: true, requiresVoice: false },
  { id: '5', name: 'Windows closed', category: 'Security', completed: false, requiresPhoto: false, requiresVoice: false },
  { id: '6', name: 'Lights turned off', category: 'Energy', completed: false, requiresPhoto: false, requiresVoice: false },
  { id: '7', name: 'Car locked', category: 'Security', completed: false, requiresPhoto: true, requiresVoice: false },
];

export default function LeavingHomeMode({ isActive, onDeactivate }: LeavingHomeModeProps) {
  const { getActiveTasks } = useTasks();
  const activeTasks = getActiveTasks();
  const [items, setItems] = useState<LeavingHomeItem[]>(DEFAULT_ITEMS);

  const [selectedItem, setSelectedItem] = useState<LeavingHomeItem | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    setItems((prevItems) => {
      const completedById = new Map(prevItems.map((item) => [item.id, item.completed]));
      const baseItems = DEFAULT_ITEMS.map((item) => ({
        ...item,
        completed: completedById.get(item.id) ?? false,
      }));
      const taskItems: LeavingHomeItem[] = activeTasks.map((task) => {
        const taskId = `task:${task.id}`;
        const completion = taskCompletionStorage.getCompletion(task.id);
        return {
          id: taskId,
          name: task.title,
          category: task.category || 'General',
          completed: completion?.completed ?? completedById.get(taskId) ?? false,
          requiresPhoto: task.requiresPhoto,
          requiresVoice: false,
        };
      });
      return [...baseItems, ...taskItems];
    });
  }, [activeTasks]);

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const completionPercentage = (completedCount / totalCount) * 100;

  const toggleItem = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item && (item.requiresPhoto || item.requiresVoice)) {
      setSelectedItem(item);
      setShowConfirmModal(true);
    } else {
      completeItem(id);
    }
  };

  const completeItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: true } : item
    ));
    if (id.startsWith('task:')) {
      const taskId = id.replace('task:', '');
      taskCompletionStorage.setCompletion(taskId, true);
    }
  };

  const handleConfirm = () => {
    if (selectedItem) {
      completeItem(selectedItem.id);
      setSelectedItem(null);
    }
  };

  const categoryGroups = Array.from(new Set(items.map(i => i.category))).map(cat => ({
    name: cat,
    items: items.filter(i => i.category === cat)
  }));

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 flex items-start justify-center p-4 pt-44 sm:pt-36"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card rounded-2xl shadow-2xl max-w-lg w-full border border-border overflow-hidden max-h-[68vh] sm:max-h-[75vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-3 sm:p-5 text-primary-foreground">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="p-3 bg-primary-foreground/20 rounded-lg"
                  >
                    <Home className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold">Leaving Home Checklist</h2>
                    <p className="text-sm opacity-90">Complete each check before you go</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onDeactivate}
                  className="p-2 hover:bg-primary-foreground/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{completedCount}/{totalCount} completed</span>
                  <span className="font-semibold">{Math.round(completionPercentage)}%</span>
                </div>
                <div className="w-full bg-primary-foreground/20 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary-foreground"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 p-3 sm:p-5 space-y-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {completionPercentage === 100 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-accent/10 border border-accent/30 rounded-lg p-4 flex items-start gap-3 mb-4"
                >
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-accent">All Done!</p>
                    <p className="text-sm text-foreground">You've confirmed everything. Have a great day out!</p>
                  </div>
                </motion.div>
              )}

              {categoryGroups.map((group, groupIndex) => (
                <div key={group.name}>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {group.name}
                  </h3>
                  <div className="space-y-2 mb-4">
                    {group.items.map((item, itemIndex) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (groupIndex * 2 + itemIndex) * 0.05 }}
                        onClick={() => toggleItem(item.id)}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                          item.completed
                            ? 'bg-accent/10 border-accent/30'
                            : 'bg-secondary/50 border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <motion.div
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              item.completed
                                ? 'bg-accent border-accent'
                                : 'border-primary hover:border-accent'
                            }`}>
                              {item.completed && <CheckCircle2 className="w-5 h-5 text-white" />}
                            </div>
                          </motion.div>

                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              {item.requiresPhoto && (
                                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Photo</span>
                              )}
                              {item.requiresVoice && (
                                <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">Voice</span>
                              )}
                            </div>
                          </div>

                          {item.completed && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-accent"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            {completionPercentage === 100 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-accent text-accent-foreground p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Ready to leave home safely</span>
                </div>
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            )}
          </motion.div>

          <ConfirmationModal
            itemId={selectedItem?.id}
            itemName={selectedItem?.name || ''}
            isOpen={showConfirmModal}
            onClose={() => {
              setShowConfirmModal(false);
              setSelectedItem(null);
            }}
            onConfirm={handleConfirm}
            requirePhoto={selectedItem?.requiresPhoto}
            requireVoice={selectedItem?.requiresVoice}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
