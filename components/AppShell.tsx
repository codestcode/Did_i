'use client';

import { LeavingHomeProvider, useLeavingHome } from '@/context/LeavingHomeContext';
import Header from './Header';
import LeavingHomeMode from './LeavingHomeMode';

function AppShellInner({ children }: { children: React.ReactNode }) {
  const { isActive, activate, deactivate } = useLeavingHome();

  return (
    <div className="min-h-screen w-full bg-white relative">
      <div className="absolute inset-0 z-0 page-bg" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onActivateLeavingHome={activate} />
        <main className="flex-1 overflow-hidden pb-20">
          {children}
        </main>
        <LeavingHomeMode
          isActive={isActive}
          onDeactivate={deactivate}
        />
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LeavingHomeProvider>
      <AppShellInner>{children}</AppShellInner>
    </LeavingHomeProvider>
  );
}
