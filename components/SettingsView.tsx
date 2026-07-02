'use client';

import { useState } from 'react';
import { useLeavingHome } from '@/context/LeavingHomeContext';
import { motion } from 'framer-motion';
import { Bell, Lock, Eye, AlertCircle, ChevronRight, ToggleLeft as Toggle2 } from 'lucide-react';
import RealSettingsPanel from './RealSettingsPanel';
import { useSettingsContext } from '@/context/SettingsContext';

interface Setting {
  id: string;
  title: string;
  description: string;
  icon: any;
  enabled: boolean;
}

export default function SettingsView() {
  const { activate: activateLeavingHome } = useLeavingHome();
  const { settings: appSettings, updateSetting: updateAppSetting } = useSettingsContext();
  const [settings, setSettings] = useState<Setting[]>([
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Get reminders for daily checks',
      icon: Bell,
      enabled: true
    },
    {
      id: 'photo-required',
      title: 'Require Photo Proof',
      description: 'Photos must be taken for verification',
      icon: Eye,
      enabled: appSettings.photoQuality !== 'low'
    },
    {
      id: 'voice-required',
      title: 'Require Voice Confirmation',
      description: 'Say it aloud to confirm the action',
      icon: AlertCircle,
      enabled: false
    },
    {
      id: 'privacy-mode',
      title: 'Privacy Mode',
      description: 'Encrypt all photos and voice recordings',
      icon: Lock,
      enabled: true
    },
  ]);

  const [leavingHomeMode, setLeavingHomeMode] = useState(false);

  const toggleSetting = (id: string) => {
    setSettings(settings.map(setting =>
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
    if (id === 'notifications') {
      updateAppSetting('notificationFrequency', settings.find(s => s.id === id)?.enabled ? 'never' : 'always');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="overflow-y-auto h-full p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Leaving Home Mode */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2">Leaving Home Mode</h3>
              <p className="text-sm text-foreground">
                Start a guided checklist for leaving home with all confirmation options enabled
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setLeavingHomeMode(!leavingHomeMode);
                activateLeavingHome();
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                leavingHomeMode
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-primary text-primary-foreground hover:shadow-lg'
              }`}
            >
              {leavingHomeMode ? 'Active' : 'Start'}
            </motion.button>
          </div>
        </motion.div>

        {/* Settings Grid */}
        <motion.div
          variants={itemVariants}
          className="space-y-3"
        >
          <h2 className="text-xl font-bold text-foreground">Preferences</h2>
          {settings.map((setting, index) => {
            const Icon = setting.icon;
            return (
              <motion.div
                key={setting.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass3d bg-card rounded-xl border border-border p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 mt-1">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{setting.title}</h4>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSetting(setting.id)}
                    className={`flex-shrink-0 ml-4 p-2 rounded-lg transition-all ${
                      setting.enabled
                        ? 'bg-accent/20 text-accent'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Toggle2 className="w-6 h-6" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          variants={itemVariants}
          className="glass3d bg-card rounded-xl border border-border p-6"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">Notification Times</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Morning Reminder
              </label>
              <input
                type="time"
                defaultValue="08:00"
                className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Evening Reminder
              </label>
              <input
                type="time"
                defaultValue="18:00"
                className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          variants={itemVariants}
          className="glass3d bg-card rounded-xl border border-border p-6"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">About Did I?</h3>
          <div className="space-y-3 text-sm text-foreground leading-relaxed">
            <p>
              Did I? is designed to help manage anxiety-driven rechecking by providing a trusted system to document and confirm daily actions.
            </p>
            <p>
              Features like photo proof, voice confirmation, and detailed logs give your brain the evidence it needs, reducing the urge to recheck.
            </p>
            <div className="pt-3 border-t border-border mt-4">
              <p className="text-xs text-muted-foreground">Version 1.0 • Privacy First</p>
            </div>
          </div>
        </motion.div>

        {/* App Settings */}
        <motion.div
          variants={itemVariants}
          className="pt-4"
        >
          <h2 className="text-xl font-bold text-foreground mb-4">App Settings</h2>
          <RealSettingsPanel />
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          variants={itemVariants}
          className="bg-destructive/10 rounded-xl border border-destructive/20 p-6"
        >
          <h3 className="text-lg font-bold text-destructive mb-4">Danger Zone</h3>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="w-full py-3 rounded-lg bg-destructive/20 text-destructive font-semibold hover:bg-destructive/30 transition-colors"
          >
            Clear All Data
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
