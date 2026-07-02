'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Settings, BarChart3, ListTodo, Brain, LogOut } from 'lucide-react';

interface HeaderProps {
  currentView: 'dashboard' | 'tasks' | 'anxiety' | 'checklist' | 'settings' | 'sleep';
  onViewChange: (view: 'dashboard' | 'tasks' | 'anxiety' | 'checklist' | 'settings' | 'sleep') => void;
  onActivateLeavingHome?: () => void;
}

export default function Header({ currentView, onViewChange, onActivateLeavingHome }: HeaderProps) {
  const navItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'tasks', icon: ListTodo, label: 'Tasks' },
    { id: 'anxiety', icon: Brain, label: 'Anxiety' },
    { id: 'checklist', icon: CheckCircle2, label: 'Checklist' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Top Bar */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center bg-card flex-shrink-0"
            >
              <img
                src="/task.png"
                alt="Did I logo"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Did I?</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Peace of mind at every step</p>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border pb-safe">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onViewChange(item.id as any)}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors min-w-0 flex-1 ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-[11px] font-medium leading-tight">{item.label}</span>
              </motion.button>
            );
          })}
          <motion.button
            onClick={onActivateLeavingHome}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-accent transition-colors min-w-0 flex-1"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-[11px] font-medium leading-tight">Leaving</span>
          </motion.button>
        </div>
      </nav>
    </>
  );
}
