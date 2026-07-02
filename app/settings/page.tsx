'use client';

import { motion } from 'framer-motion';
import AppShell from '@/components/AppShell';
import SettingsView from '@/components/SettingsView';

export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsView />
    </AppShell>
  );
}
