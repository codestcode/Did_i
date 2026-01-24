'use client';

import { useState, useCallback, useEffect } from 'react';
import { Settings } from '@/lib/types';
import { settingsStorage } from '@/lib/services/storageService';

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from storage on mount
  useEffect(() => {
    const loadedSettings = settingsStorage.getSettings();
    setSettings(loadedSettings);
    setIsLoaded(true);
  }, []);

  const updateSetting = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      const updated = { ...settings, [key]: value } as Settings;
      setSettings(updated);
      settingsStorage.saveSettings(updated);
    },
    [settings]
  );

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    const updated = { ...settings, ...updates } as Settings;
    setSettings(updated);
    settingsStorage.saveSettings(updated);
  }, [settings]);

  return {
    settings,
    isLoaded,
    updateSetting,
    updateSettings,
  };
}
