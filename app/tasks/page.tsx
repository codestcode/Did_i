'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import AppShell from '@/components/AppShell';
import TaskManager from '@/components/TaskManager';

export default function TasksPage() {
  return (
    <AppShell>
      <div className="overflow-y-auto h-full p-6">
        <TaskManager />
      </div>
    </AppShell>
  );
}
