'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardView from '@/components/DashboardView';
import ChecklistView from '@/components/ChecklistView';
import SettingsView from '@/components/SettingsView';
import Header from '@/components/Header';
import LeavingHomeMode from '@/components/LeavingHomeMode';
import TaskManager from '@/components/TaskManager';
import AnxietyCheck from '@/components/AnxietyCheck';

type ViewType = 'dashboard' | 'tasks' | 'anxiety' | 'checklist' | 'settings';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isLeavingHomeActive, setIsLeavingHomeActive] = useState(false);

  const viewVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onActivateLeavingHome={() => setIsLeavingHomeActive(true)}
      />
      
      <main className="flex-1 overflow-hidden">
        <motion.div
          key={currentView}
          variants={viewVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'tasks' && <div className="overflow-y-auto h-full p-6"><TaskManager /></div>}
          {currentView === 'anxiety' && <AnxietyCheck />}
          {currentView === 'checklist' && <ChecklistView />}
          {currentView === 'settings' && <SettingsView onActivateLeavingHome={() => setIsLeavingHomeActive(true)} />}
        </motion.div>
      </main>

      <LeavingHomeMode 
        isActive={isLeavingHomeActive} 
        onDeactivate={() => setIsLeavingHomeActive(false)} 
      />
    </div>
  );
}
