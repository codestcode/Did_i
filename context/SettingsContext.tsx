'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { Settings, DEFAULT_SETTINGS } from '@/lib/types';
import { settingsStorage } from '@/lib/services/storageService';

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  updateSettings: (updates: Partial<Settings>) => void;
  isLoaded: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize settings from storage
  useEffect(() => {
    const loadedSettings = settingsStorage.getSettings();
    setSettings(loadedSettings);
    setIsLoaded(true);

    // Apply theme on load
    applyTheme(loadedSettings.darkMode);
  }, []);

  const applyTheme = (darkMode: boolean) => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    settingsStorage.saveSettings(updated);

    // Apply theme change immediately
    if (key === 'darkMode') {
      applyTheme(value as boolean);
    }
  };

  const updateSettings = (updates: Partial<Settings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    settingsStorage.saveSettings(updated);

    // Apply theme change if darkMode is updated
    if (updates.darkMode !== undefined) {
      applyTheme(updates.darkMode);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, updateSettings, isLoaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within SettingsProvider');
  }
  return context;
}
