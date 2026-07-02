'use client';

import { motion } from 'framer-motion';
import AppShell from '@/components/AppShell';
import DashboardView from '@/components/DashboardView';

const viewVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

export default function Home() {
  return (
    <AppShell>
      <motion.div
        variants={viewVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <DashboardView />
      </motion.div>
    </AppShell>
  );
}
