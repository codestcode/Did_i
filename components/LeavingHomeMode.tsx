'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
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

export default function LeavingHomeMode({ isActive, onDeactivate }: LeavingHomeModeProps) {
  const { tasks } = useTasks();
  const activeTasks = useMemo(() => tasks.filter((t) => !t.isArchived), [tasks]);
  const [items, setItems] = useState<LeavingHomeItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<LeavingHomeItem | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const taskItems: LeavingHomeItem[] = activeTasks.map((task) => {
      const completion = taskCompletionStorage.getCompletion(task.id);
      return {
        id: `task:${task.id}`,
        name: task.title,
        category: task.category || 'General',
        completed: completion?.completed ?? false,
        requiresPhoto: task.requiresPhoto,
        requiresVoice: task.requiresVoice || false,
      };
    });
    setItems(taskItems);
  }, [activeTasks]);

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const allDone = totalCount > 0 && completedCount === totalCount;

  useEffect(() => {
    if (allDone && totalCount > 0) {
      const timer = setTimeout(() => setShowCelebration(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowCelebration(false);
    }
  }, [allDone, totalCount]);

  const toggleItem = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (item.completed) return;
    if (item.requiresPhoto || item.requiresVoice) {
      setSelectedItem(item);
      setShowConfirmModal(true);
    } else {
      completeItem(id);
    }
  };

  const completeItem = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, completed: true } : item
    ));
    if (id.startsWith('task:')) {
      taskCompletionStorage.setCompletion(id.replace('task:', ''), true);
    }
  };

  const handleRecheck = () => {
    setItems(prev => prev.map(item => ({ ...item, completed: false })));
    items.forEach(item => {
      if (item.id.startsWith('task:')) {
        taskCompletionStorage.setCompletion(item.id.replace('task:', ''), false);
      }
    });
    setShowCelebration(false);
  };

  const handleConfirm = () => {
    if (selectedItem) {
      completeItem(selectedItem.id);
      setSelectedItem(null);
    }
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4"
        >
          <div className="absolute inset-0 bg-black/50" onClick={onDeactivate} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md rounded-[32px] overflow-hidden bg-[#9BB068] shadow-2xl flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Nav */}
            <div className="relative z-10 flex items-center gap-2 px-4 pt-3 pb-0">
              <button
                onClick={onDeactivate}
                className="w-8 h-8 rounded-full border border-white/60 flex items-center justify-center flex-shrink-0 hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <h1 className="flex-1 text-base font-extrabold text-white tracking-tight">
                Leaving Home
              </h1>
              {allDone && (
                <span className="px-2 py-0.5 rounded-full bg-[#CFD9B5] text-[#9BB068] text-[9px] font-extrabold uppercase tracking-wider">
                  All Set
                </span>
              )}
            </div>

            {/* Hero Score */}
            <div className="relative z-10 flex flex-col items-center gap-0 py-2">
              <div className="text-[56px] font-extrabold text-white leading-none tracking-tight">
                {completedCount}
              </div>
              <p className="text-white text-center text-xs sm:text-sm font-semibold px-6 leading-tight">
                {allDone
                  ? 'All checked! Have a great day out.'
                  : totalCount === 0
                  ? 'No tasks to check. Add some in Tasks.'
                  : `${totalCount - completedCount} ${totalCount - completedCount === 1 ? 'thing' : 'things'} left to check`}
              </p>
            </div>

            {/* Cards Section / Celebration */}
            {showCelebration ? (
              <div className="bg-white rounded-t-[32px] flex-1 overflow-y-auto flex flex-col items-center px-6 py-4 gap-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="w-20 h-20 rounded-full bg-[#CFD9B5] flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 160 160" className="w-14 h-14">
                    <path fillRule="evenodd" clipRule="evenodd" d="M105.68 54.8557C108.106 53.8506 110.707 53.3333 113.333 53.3333C115.96 53.3333 118.56 53.8506 120.987 54.8557C123.414 55.8608 125.618 57.334 127.475 59.1912C129.333 61.0483 130.806 63.2531 131.811 65.6796C132.816 68.1062 133.333 70.7069 133.333 73.3333C133.333 77.0152 130.349 80 126.667 80C122.985 80 120 77.0152 120 73.3333C120 72.4578 119.828 71.5909 119.493 70.7821C119.158 69.9733 118.666 69.2383 118.047 68.6193C117.428 68.0002 116.693 67.5091 115.885 67.1741C115.076 66.8391 114.209 66.6666 113.333 66.6666C112.458 66.6666 111.591 66.8391 110.782 67.1741C109.973 67.5091 109.238 68.0002 108.619 68.6193C108 69.2383 107.509 69.9733 107.174 70.7821C106.839 71.5909 106.667 72.4578 106.667 73.3333C106.667 77.0152 103.682 80 100 80C96.3181 80 93.3333 77.0152 93.3333 73.3333C93.3333 70.7069 93.8507 68.1062 94.8558 65.6796C95.8608 63.2531 97.334 61.0484 99.1912 59.1912C101.048 57.334 103.253 55.8608 105.68 54.8557Z" fill="#3D4A26"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M113.923 95.521C117.48 96.4739 119.59 100.13 118.637 103.686C116.358 112.191 111.336 119.707 104.351 125.067C97.3648 130.428 88.8055 133.333 80.0001 133.333C71.1947 133.333 62.6354 130.428 55.6496 125.067C48.6639 119.707 43.6421 112.191 41.3631 103.686C40.4101 100.13 42.5207 96.4739 46.0771 95.521C49.6335 94.568 53.2891 96.6786 54.2421 100.235C55.7614 105.905 59.1093 110.916 63.7665 114.489C68.4236 118.063 74.1299 120 80.0001 120C85.8703 120 91.5766 118.063 96.2337 114.489C100.891 110.916 104.239 105.905 105.758 100.235C106.711 96.6786 110.367 94.568 113.923 95.521Z" fill="#3D4A26"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M39.013 54.8557C41.4395 53.8506 44.0402 53.3333 46.6667 53.3333C49.2931 53.3333 51.8938 53.8506 54.3203 54.8557C56.7468 55.8608 58.9516 57.334 60.8088 59.1912C62.666 61.0483 64.1392 63.2531 65.1442 65.6796C66.1493 68.1062 66.6667 70.7069 66.6667 73.3333C66.6667 77.0152 63.6819 80 60 80C56.3181 80 53.3333 77.0152 53.3333 73.3333C53.3333 72.4578 53.1609 71.5909 52.8259 70.7821C52.4908 69.9733 51.9998 69.2383 51.3807 68.6193C50.7616 68.0002 50.0267 67.5091 49.2179 67.1741C48.409 66.8391 47.5421 66.6666 46.6667 66.6666C45.7912 66.6666 44.9243 66.8391 44.1154 67.1741C43.3066 67.5091 42.5717 68.0002 41.9526 68.6193C41.3336 69.2383 40.8425 69.9733 40.5075 70.7821C40.1724 71.5909 40 72.4578 40 73.3333C40 77.0152 37.0152 80 33.3333 80C29.6514 80 26.6667 77.0152 26.6667 73.3333C26.6667 70.7069 27.184 68.1062 28.1891 65.6796C29.1942 63.2531 30.6673 61.0484 32.5245 59.1912C34.3817 57.334 36.5865 55.8608 39.013 54.8557Z" fill="#3D4A26"/>
                  </svg>
                </div>

                <div className="text-center space-y-0">
                  <h2 className="text-lg font-extrabold text-[#4B3425] tracking-tight">
                    All Checked! ✅
                  </h2>
                  <p className="text-xs font-semibold text-[rgba(31,22,15,0.64)]">
                    You're ready to go outside safely
                  </p>
                </div>

                <button
                  onClick={onDeactivate}
                  className="w-full py-2.5 rounded-full bg-white border-2 border-[#9BB068] text-[#4B3425] font-extrabold text-sm tracking-tight hover:bg-[#F7F4F2] transition-colors"
                >
                  Done
                </button>

                <button
                  onClick={handleRecheck}
                  className="w-full py-2 rounded-full text-[#9BB068] font-bold text-sm hover:text-[#7d9456] transition-colors"
                >
                  Recheck tasks
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-t-[32px] flex-1 overflow-hidden flex flex-col min-h-0">
                <div className="px-4 pt-3 pb-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-extrabold text-[#4B3425] tracking-tight">
                      Tasks to Check
                    </h2>
                    <span className="text-[11px] font-semibold text-[rgba(31,22,15,0.48)]">
                      {completedCount}/{totalCount}
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-3 space-y-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {items.length === 0 && (
                    <div className="text-center py-12 text-[rgba(31,22,15,0.48)] font-semibold">
                      No tasks yet. Create tasks first.
                    </div>
                  )}

                  {items.map((item) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => toggleItem(item.id)}
                      className={`w-full flex items-center gap-2.5 p-2.5 rounded-2xl transition-all text-left ${
                        item.completed
                          ? 'bg-[#F7F4F2] opacity-60'
                          : 'bg-[#F7F4F2] hover:bg-[#efeae7] active:bg-[#e7dfdb]'
                      }`}
                    >
                      <div
                        className={`w-9 h-[38px] rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                          item.completed ? 'bg-[#9BB068]/20' : 'bg-white'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                          item.completed
                            ? 'bg-[#9BB068] border-[#9BB068]'
                            : 'border-[rgba(31,22,15,0.32)]'
                        }`}>
                          {item.completed && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-xs leading-tight ${
                          item.completed ? 'text-[rgba(75,52,37,0.5)] line-through' : 'text-[#4B3425]'
                        }`}>
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          <span className="text-[10px] font-semibold text-[rgba(31,22,15,0.48)] uppercase tracking-wide">
                            {item.category}
                          </span>
                          {item.requiresPhoto && (
                            <span className="text-[9px] font-bold text-[#9BB068] bg-[#CFD9B5]/40 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Photo</span>
                          )}
                          {item.requiresVoice && (
                            <span className="text-[9px] font-bold text-[#4B3425] bg-[#D5C2B9]/40 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Voice</span>
                          )}
                        </div>
                      </div>

                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#9BB068] flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-[rgba(31,22,15,0.16)] flex-shrink-0" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
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
