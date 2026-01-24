'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Volume2, Eye } from 'lucide-react';

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  motionReduced: boolean;
  photoQuality: 'low' | 'medium' | 'high';
  reminderFrequency: 'daily' | 'weekly' | 'never';
}

export default function PreferencePanel() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    soundEnabled: true,
    motionReduced: false,
    photoQuality: 'high',
    reminderFrequency: 'daily',
  });

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Appearance</h3>
        </div>
        <div className="space-y-3">
          <label className="block">
            <p className="text-sm font-medium text-foreground mb-2">Theme</p>
            <select
              value={preferences.theme}
              onChange={(e) => updatePreference('theme', e.target.value as any)}
              className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.motionReduced}
              onChange={(e) => updatePreference('motionReduced', e.target.checked)}
              className="w-4 h-4 rounded border-border accent-primary"
            />
            <span className="text-sm text-foreground">Reduce motion & animations</span>
          </label>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Volume2 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Audio</h3>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.soundEnabled}
              onChange={(e) => updatePreference('soundEnabled', e.target.checked)}
              className="w-4 h-4 rounded border-border accent-primary"
            />
            <span className="text-sm text-foreground">Enable notification sounds</span>
          </label>
          <p className="text-xs text-muted-foreground">Subtle sounds when confirming actions</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Photo Settings</h3>
        </div>
        <div className="space-y-3">
          <label className="block">
            <p className="text-sm font-medium text-foreground mb-2">Photo Quality</p>
            <select
              value={preferences.photoQuality}
              onChange={(e) => updatePreference('photoQuality', e.target.value as any)}
              className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            >
              <option value="low">Low (save data)</option>
              <option value="medium">Medium (balanced)</option>
              <option value="high">High (best quality)</option>
            </select>
          </label>
          <p className="text-xs text-muted-foreground">Higher quality uses more storage but provides better proof</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Reminders</h3>
        <div className="space-y-3">
          <label className="block">
            <p className="text-sm font-medium text-foreground mb-2">Reminder Frequency</p>
            <select
              value={preferences.reminderFrequency}
              onChange={(e) => updatePreference('reminderFrequency', e.target.value as any)}
              className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            >
              <option value="daily">Daily reminders</option>
              <option value="weekly">Weekly reminders</option>
              <option value="never">No reminders</option>
            </select>
          </label>
        </div>
      </motion.div>

      {/* Saved Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-muted-foreground"
      >
        Preferences saved automatically
      </motion.div>
    </motion.div>
  );
}
