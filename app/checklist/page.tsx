'use client';

import { motion } from 'framer-motion';
import AppShell from '@/components/AppShell';
import ChecklistView from '@/components/ChecklistView';

export default function ChecklistPage() {
  return (
    <AppShell>
      <ChecklistView />
    </AppShell>
  );
}
