'use client';

import { useState } from 'react';
import { useLeavingHome } from '@/context/LeavingHomeContext';
import { motion } from 'framer-motion';
import { Bell, Lock, Eye, AlertCircle, Settings as SettingsIcon, LogOut, Clock, Trash2, Info } from 'lucide-react';
import RealSettingsPanel from './RealSettingsPanel';
import { useSettingsContext } from '@/context/SettingsContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SettingsView() {
  const { activate: activateLeavingHome } = useLeavingHome();
  const { settings: appSettings, updateSetting: updateAppSetting } = useSettingsContext();
  const [leavingHomeMode, setLeavingHomeMode] = useState(false);

  return (
    <motion.div
      className="overflow-y-auto h-full px-4 py-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Decorative sticker */}
      <div className="relative h-0" aria-hidden="true">
        <img
          src="/stickers/growth.png"
          alt=""
          className="absolute opacity-20 dark:opacity-15 w-[140px] right-0 -top-4 pointer-events-none select-none"
        />
      </div>

      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <SettingsIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-semibold text-foreground">Settings</h1>
          <p className="text-xs text-muted-foreground">Customize your experience</p>
        </div>
      </motion.div>

      {/* Leaving Home Mode */}
      <motion.div variants={itemVariants} className="glass3d rounded-2xl p-5 border border-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <LogOut className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-base font-semibold text-foreground">Leaving Home Mode</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Guided checklist with all confirmations enabled
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setLeavingHomeMode(!leavingHomeMode);
              activateLeavingHome();
            }}
            className={`shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              leavingHomeMode
                ? 'bg-accent text-accent-foreground'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            {leavingHomeMode ? 'Active' : 'Start'}
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Settings */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h2 className="font-heading text-base font-semibold text-foreground px-1">Quick Settings</h2>
        <div className="glass3d rounded-2xl border border-border divide-y divide-border/50">
          <ToggleRow
            icon={Bell}
            label="Notifications"
            desc="Get reminders for daily checks"
            enabled={true}
            onToggle={() => {}}
          />
          <ToggleRow
            icon={Lock}
            label="Privacy Mode"
            desc="Encrypt photos and recordings"
            enabled={true}
            onToggle={() => {}}
          />
          <ToggleRow
            icon={Eye}
            label="Require Photo Proof"
            desc="Photos required for verification"
            enabled={appSettings.photoQuality !== 'low'}
            onToggle={() => updateAppSetting('photoQuality', appSettings.photoQuality === 'low' ? 'medium' : 'low')}
          />
          <ToggleRow
            icon={AlertCircle}
            label="Voice Confirmation"
            desc="Say it aloud to confirm"
            enabled={false}
            onToggle={() => {}}
          />
        </div>
      </motion.div>

      {/* Notification Times */}
      <motion.div variants={itemVariants} className="glass3d rounded-2xl p-5 border border-border space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-base font-semibold text-foreground">Notification Times</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Morning</label>
            <input
              type="time"
              defaultValue="08:00"
              className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Evening</label>
            <input
              type="time"
              defaultValue="18:00"
              className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>
      </motion.div>

      {/* App Settings */}
      <motion.div variants={itemVariants}>
        <RealSettingsPanel />
      </motion.div>

      {/* About */}
      <motion.div variants={itemVariants} className="glass3d rounded-2xl p-5 border border-border space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-base font-semibold text-foreground">About Did I?</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Did I? helps manage anxiety-driven rechecking by documenting daily actions with photo proof, voice confirmation, and detailed logs.
        </p>
        <div className="pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground">Version 1.2.0 &middot; Privacy First</p>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        variants={itemVariants}
        className="glass3d rounded-2xl p-5 border border-destructive/20 bg-destructive/[0.03]"
      >
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="w-5 h-5 text-destructive" />
          <h2 className="font-heading text-base font-semibold text-destructive">Danger Zone</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="w-full py-2.5 rounded-xl bg-destructive/10 text-destructive font-semibold text-sm hover:bg-destructive/20 transition-colors"
        >
          Clear All Data
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  desc,
  enabled,
  onToggle,
}: {
  icon: any;
  label: string;
  desc: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground truncate">{desc}</p>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
          enabled ? 'bg-primary' : 'bg-muted'
        }`}
      >
        <motion.div
          className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
          animate={{ x: enabled ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );
}
