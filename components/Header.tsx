'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Settings, BarChart3, ListTodo, Brain, LogOut } from 'lucide-react';

interface HeaderProps {
  currentView: 'dashboard' | 'tasks' | 'anxiety' | 'checklist' | 'settings';
  onViewChange: (view: 'dashboard' | 'tasks' | 'anxiety' | 'checklist' | 'settings') => void;
  onActivateLeavingHome?: () => void;
}

export default function Header({ currentView, onViewChange, onActivateLeavingHome }: HeaderProps) {
  const navItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard', title: 'Overview' },
    { id: 'tasks', icon: ListTodo, label: 'Tasks', title: 'Manage Tasks' },
    { id: 'anxiety', icon: Brain, label: 'Anxiety', title: 'Anxiety Check' },
    { id: 'checklist', icon: CheckCircle2, label: 'Checklist', title: 'Smart Checklists' },
    { id: 'settings', icon: Settings, label: 'Settings', title: 'Preferences' },
  ];

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-card"
            >
              <img
                src="/task.png"
                alt="Did I logo"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Did I?</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Peace of mind at every step</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex gap-1.5 flex-wrap sm:flex-nowrap">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onViewChange(item.id as any)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 sm:gap-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  {item.label}
                </motion.button>
              );
            })}
          </nav>

          <motion.button
            onClick={onActivateLeavingHome}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-semibold bg-accent text-accent-foreground hover:shadow-lg transition-all w-full sm:w-auto"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            Leaving Home
          </motion.button>
        </div>
      </div>
    </header>
  );
}
