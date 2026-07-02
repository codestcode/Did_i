'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle2, Settings, BarChart3, ListTodo, LogOut, Activity, BedDouble } from 'lucide-react';

interface HeaderProps {
  onActivateLeavingHome?: () => void;
}


export default function Header({ onActivateLeavingHome }: HeaderProps) {
  const pathname = usePathname();

  const navItems = [
    { id: 'dashboard', href: '/', icon: BarChart3, label: 'Dashboard' },
    { id: 'tasks', href: '/tasks', icon: ListTodo, label: 'Tasks' },
    { id: 'checklist', href: '/checklist', icon: CheckCircle2, label: 'Checklist' },
    { id: 'sleep', href: '/sleep', icon: BedDouble, label: 'Sleep' },
    { id: 'anxiety', href: '/anxiety', icon: Activity, label: 'Anxiety' },
    { id: 'settings', href: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Top Bar - Pill Shape */}
      <header className="sticky top-4 z-50 flex justify-center px-4">
        <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-white/80 dark:bg-card/80 backdrop-blur-xl shadow-[0_-16px_32px_rgba(75,52,37,0.05)] dark:shadow-[0_-16px_32px_rgba(0,0,0,0.3)] max-w-[400px] w-full">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0"
          >
            <img
              src="/task.png"
              alt="Did I logo"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h1 className="text-base font-bold text-foreground">Did I?</h1>
            <p className="text-[10px] text-muted-foreground hidden sm:block truncate">Peace of mind at every step</p>
          </div>
        </div>
      </header>

      {/* Bottom Navigation - Figma Tab Bar */}
      <nav className="fixed bottom-4 left-0 right-0 sm:left-4 sm:right-4 z-50 flex justify-center px-2 sm:px-0">
        <div
          className="relative flex items-center justify-center gap-1 sm:gap-3 px-2 sm:px-5 h-20 rounded-[1234px] bg-white shadow-[0_-16px_32px_rgba(75,52,37,0.05)]"
          style={{ width: '100%', maxWidth: '500px' }}
        >
          {/* Nav items left of center */}
          <div className="flex items-center justify-end gap-1 sm:gap-3 flex-1">
            {navItems.slice(0, 3).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.id} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-colors ${
                      active ? 'bg-[#F7F4F2]' : ''
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 sm:w-6 sm:h-6 ${
                        active ? 'text-[#4B3425]' : 'text-[#D5C2B9]'
                      }`}
                    />
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Center - Leaving Home (raised) - Figma style */}
          <div className="relative -mt-7 sm:-mt-8 flex-shrink-0">
            <motion.button
              onClick={onActivateLeavingHome}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#9BB068] shadow-[0_16px_32px_rgba(155,176,104,0.50)]"
            >
              <LogOut className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.button>
          </div>

          {/* Nav items right of center */}
          <div className="flex items-center justify-start gap-1 sm:gap-3 flex-1">
            {navItems.slice(3).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.id} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-colors ${
                      active ? 'bg-[#F7F4F2]' : ''
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 sm:w-6 sm:h-6 ${
                        active ? 'text-[#4B3425]' : 'text-[#D5C2B9]'
                      }`}
                    />
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
