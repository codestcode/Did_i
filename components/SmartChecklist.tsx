'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

interface ChecklistItem {
  id: string;
  name: string;
  category: string;
  completed: boolean;
  urgency: 'high' | 'medium' | 'low';
  estimatedTime?: number;
  tips?: string;
  lastCompleted?: string;
}

interface SmartChecklistProps {
  items: ChecklistItem[];
  onToggleItem: (id: string) => void;
}

export default function SmartChecklist({ items, onToggleItem }: SmartChecklistProps) {
  const [expandedTips, setExpandedTips] = useState<string | null>(null);

  const urgencyConfig = {
    high: { color: 'text-red-600 bg-red-50 border-red-200', label: 'Important' },
    medium: { color: 'text-orange-600 bg-orange-50 border-orange-200', label: 'Moderate' },
    low: { color: 'text-green-600 bg-green-50 border-green-200', label: 'Low' },
  };

  const getSmartTip = (item: ChecklistItem): string => {
    if (item.lastCompleted) {
      return `Last confirmed ${item.lastCompleted}. Re-confirming reduces anxiety.`;
    }
    if (item.urgency === 'high') {
      return `This is a priority check. Take a moment to verify carefully.`;
    }
    return `Photo or voice confirmation recommended for extra peace of mind.`;
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Progress Ring */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/20 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Completion</p>
            <h3 className="text-3xl font-bold text-foreground">
              {completedCount}/{totalCount}
            </h3>
          </div>
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-secondary"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray={`${Math.PI * 2 * 45}`}
                animate={{
                  strokeDashoffset: Math.PI * 2 * 45 * (1 - completionPercentage / 100)
                }}
                transition={{ duration: 0.5 }}
                className="text-primary"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="var(--primary)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                {Math.round(completionPercentage)}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Smart Insights */}
      {completionPercentage < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-accent/10 border border-accent/30 rounded-xl p-4 flex items-start gap-3"
        >
          <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-accent mb-1">Smart Suggestion</p>
            <p className="text-sm text-foreground">
              {completedCount === 0
                ? 'Start with high-priority items first to ease your mind.'
                : `${totalCount - completedCount} items remaining. ${completedCount > 0 ? 'Great progress!' : 'You can do this!'}`}
            </p>
          </div>
        </motion.div>
      )}

      {/* Items List */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-2">
          {items.map((item, index) => {
            const config = urgencyConfig[item.urgency];
            const tip = getSmartTip(item);
            const isExpanded = expandedTips === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                layout
                className={`rounded-lg border transition-all overflow-hidden ${
                  item.completed
                    ? 'bg-accent/10 border-accent/30'
                    : 'glass3d bg-card border-border hover:border-primary/50'
                }`}
              >
                <button
                  onClick={() => onToggleItem(item.id)}
                  className="w-full text-left p-4 flex items-start gap-3 hover:bg-black/2 transition-colors"
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex-shrink-0 mt-1"
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      item.completed
                        ? 'bg-accent border-accent'
                        : 'border-primary hover:border-accent'
                    }`}>
                      {item.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-semibold ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {item.name}
                      </h4>
                      {item.urgency === 'high' && !item.completed && (
                        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-medium px-2 py-1 rounded border ${config.color}`}>
                        {config.label}
                      </span>
                      {item.estimatedTime && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.estimatedTime}m
                        </span>
                      )}
                    </div>
                  </div>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedTips(isExpanded ? null : item.id);
                    }}
                    className="flex-shrink-0 p-2 rounded hover:bg-secondary transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </motion.button>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-border bg-secondary/30 px-4 py-3"
                    >
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">Tip: </span>{tip}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
    </div>
  );
}
