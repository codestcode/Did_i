'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AppShell from '@/components/AppShell';
import SleepQuality from '@/components/SleepQuality';

export default function SleepPage() {
  const router = useRouter();
  return (
    <AppShell>
      <SleepQuality onBack={() => router.push('/')} />
    </AppShell>
  );
}
