'use client';

import { motion } from 'framer-motion';
import AppShell from '@/components/AppShell';
import AnxietyCheck from '@/components/AnxietyCheck';

export default function AnxietyPage() {
  return (
    <AppShell>
      <AnxietyCheck />
    </AppShell>
  );
}
