'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface LeavingHomeContextType {
  isActive: boolean;
  activate: () => void;
  deactivate: () => void;
}

const LeavingHomeContext = createContext<LeavingHomeContextType | null>(null);

export function LeavingHomeProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <LeavingHomeContext.Provider
      value={{
        isActive,
        activate: () => setIsActive(true),
        deactivate: () => setIsActive(false),
      }}
    >
      {children}
    </LeavingHomeContext.Provider>
  );
}

export function useLeavingHome() {
  const ctx = useContext(LeavingHomeContext);
  if (!ctx) throw new Error('useLeavingHome must be used within LeavingHomeProvider');
  return ctx;
}
