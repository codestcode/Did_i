'use client';

import { motion } from 'framer-motion';
import { Moon, Zap, Settings, Bell, ImageIcon as ImageIconIcon, Volume2 } from 'lucide-react';
import { useSettingsContext } from '@/context/SettingsContext';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function RealSettingsPanel() {
  const { settings, updateSetting, isLoaded } = useSettingsContext();

  if (!isLoaded) {
    return <div className="text-center text-muted-foreground">Loading settings...</div>;
  }

  const settingsGroups = [
    {
      title: 'Display & Theme',
      icon: Moon,
      items: [
        {
          id: 'darkMode',
          label: 'Dark Mode',
          description: 'Use dark theme for the app',
          type: 'toggle' as const,
          value: settings.darkMode,
        },
        {
          id: 'calmMode',
          label: 'Calm Mode',
          description: 'Reduce animations and transitions',
          type: 'toggle' as const,
          value: settings.calmMode,
        },
      ],
    },
    {
      title: 'Notifications & Sound',
      icon: Bell,
      items: [
        {
          id: 'notificationFrequency',
          label: 'Notification Frequency',
          description: 'How often to receive notifications',
          type: 'select' as const,
          value: settings.notificationFrequency,
          options: ['always', 'once', 'never'],
        },
        {
          id: 'soundEnabled',
          label: 'Sound Effects',
          description: 'Play sounds for confirmations',
          type: 'toggle' as const,
          value: settings.soundEnabled,
        },
      ],
    },
    {
      title: 'Photos',
      icon: ImageIconIcon,
      items: [
        {
          id: 'photoQuality',
          label: 'Photo Quality',
          description: 'Balance between quality and file size',
          type: 'select' as const,
          value: settings.photoQuality,
          options: ['low', 'medium', 'high'],
        },
        {
          id: 'photoRetentionDays',
          label: 'Photo Retention (days)',
          description: 'Automatically delete photos after this many days',
          type: 'number' as const,
          value: settings.photoRetentionDays,
          min: 1,
          max: 365,
        },
      ],
    },
    {
      title: 'Behavior',
      icon: Zap,
      items: [
        {
          id: 'autoSaveConfirmations',
          label: 'Auto-Save Confirmations',
          description: 'Automatically save task confirmations',
          type: 'toggle' as const,
          value: settings.autoSaveConfirmations,
        },
        {
          id: 'animationsEnabled',
          label: 'Animations',
          description: 'Enable smooth page transitions',
          type: 'toggle' as const,
          value: settings.animationsEnabled,
        },
      ],
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {settingsGroups.map((group) => {
        const Icon = group.icon;
        return (
          <motion.div key={group.title} variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">{group.title}</h3>
            </div>

            <div className="space-y-3 bg-card rounded-xl border border-border p-4">
              {group.items.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>

                  {item.type === 'toggle' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateSetting(item.id, !item.value)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        item.value ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <motion.div
                        className="absolute top-1 w-4 h-4 bg-white rounded-full"
                        animate={{ x: item.value ? 24 : 4 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  )}

                  {item.type === 'select' && (
                    <select
                      value={item.value}
                      onChange={(e) => updateSetting(item.id, e.target.value)}
                      className="px-3 py-1 rounded-lg bg-secondary border border-border text-foreground text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                      {item.options.map((opt: string) => (
                        <option key={opt} value={opt}>
                          {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </option>
                      ))}
                    </select>
                  )}

                  {item.type === 'number' && (
                    <input
                      type="number"
                      value={item.value}
                      onChange={(e) => updateSetting(item.id, parseInt(e.target.value))}
                      min={item.min}
                      max={item.max}
                      className="w-20 px-2 py-1 rounded-lg bg-secondary border border-border text-foreground text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Info */}
      <motion.div
        variants={itemVariants}
        className="bg-primary/10 border border-primary/20 rounded-xl p-4"
      >
        <p className="text-sm text-foreground">
          <span className="font-semibold">Tip:</span> All settings are saved automatically and apply immediately.
        </p>
      </motion.div>
    </motion.div>
  );
}
