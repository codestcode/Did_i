'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Heart, Frown, FileText, Clock, BedDouble, BookOpen,
  Activity, Smile, MoreVertical, Settings, ArrowRight, ShieldCheck, ClipboardList, Camera
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { taskStorage, taskCompletionStorage, photoStorage } from '@/lib/services/storageService';

interface AnxietyRecord {
  id: string;
  level: number;
  triggers: string[];
  note: string;
  timestamp: number;
  date: string;
}

interface ConfirmationItem {
  name: string;
  time: string;
  timestamp: number;
}

interface WeeklyDay {
  name: string;
  completed: number;
  total: number;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function computeWeeklyData(): WeeklyDay[] {
  const completions = taskCompletionStorage.getAll();
  const tasks = taskStorage.getTasks().filter(t => !t.isArchived);
  const totalTasks = tasks.length;

  const data: WeeklyDay[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    day.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    const dayName = DAY_NAMES[day.getDay()];
    let completed = 0;

    for (const completion of Object.values(completions)) {
      if (completion.completed && completion.completedAt) {
        if (completion.completedAt >= day.getTime() && completion.completedAt <= dayEnd.getTime()) {
          completed++;
        }
      }
    }

    data.push({ name: dayName, completed, total: totalTasks });
  }

  return data;
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

function loadConfirmations(): ConfirmationItem[] {
  const completions = taskCompletionStorage.getAll();
  const tasks = taskStorage.getTasks();
  const items: ConfirmationItem[] = [];

  for (const [taskId, completion] of Object.entries(completions)) {
    if (completion.completed && completion.completedAt) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        items.push({
          name: task.title,
          time: formatRelativeTime(completion.completedAt),
          timestamp: completion.completedAt,
        });
      }
    }
  }

  items.sort((a, b) => b.timestamp - a.timestamp);
  return items.slice(0, 5);
}

export default function DashboardView() {
  const router = useRouter();
  const [taskCount, setTaskCount] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);
  const [anxietyCount, setAnxietyCount] = useState(0);
  const [avgAnxiety, setAvgAnxiety] = useState(0);
  const [photoCount, setPhotoCount] = useState(0);
  const [latestMood, setLatestMood] = useState<string | null>(null);
  const [moodTrend, setMoodTrend] = useState<{ label: string; color: string }[]>([
    { label: 'Sad', color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
    { label: 'Neutral', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
    { label: 'Happy', color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
  ]);
  const [sleepAvg, setSleepAvg] = useState(0);
  const [sleepLabel, setSleepLabel] = useState('Log your sleep');
  const [notesCount, setNotesCount] = useState(0);
  const [stressLevel, setStressLevel] = useState(3);
  const [latestAnxiety, setLatestAnxiety] = useState<number | null>(null);
  const [recentConfirmations, setRecentConfirmations] = useState<ConfirmationItem[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyDay[]>(computeWeeklyData());
  const [rechecksPrevented, setRechecksPrevented] = useState(0);
  const [anxietyReduced, setAnxietyReduced] = useState(0);

  const loadConfirmationsState = useCallback(() => {
    setRecentConfirmations(loadConfirmations());
  }, []);

  function loadData() {
    loadConfirmationsState();
    setWeeklyData(computeWeeklyData());
    const tasks = taskStorage.getTasks().filter((t) => !t.isArchived);
    setTaskCount(tasks.length);

    const completions = taskCompletionStorage.getAll();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCompletions = Object.values(completions).filter(
      (c) => c.completedAt && c.completedAt >= todayStart.getTime()
    );
    setCompletedToday(todayCompletions.length);

    const anxietyRaw = localStorage.getItem('anxietyRecords');
    let records: AnxietyRecord[] = [];
    if (anxietyRaw) {
      try {
        records = JSON.parse(anxietyRaw);
        setAnxietyCount(records.length);
        const avg = records.reduce((s, r) => s + r.level, 0) / (records.length || 1);
        setAvgAnxiety(Math.round(avg * 10) / 10);

        const sorted = [...records].sort((a, b) => b.timestamp - a.timestamp);
        const latest = sorted[0];
        if (latest) {
          setLatestAnxiety(latest.level);
          if (latest.level <= 3) setLatestMood('Happy');
          else if (latest.level <= 6) setLatestMood('Neutral');
          else setLatestMood('Sad');

          setStressLevel(Math.min(5, Math.max(1, Math.round(latest.level / 2))));
        }

        const withNotes = records.filter((r) => r.note?.trim());
        setNotesCount(withNotes.length);

        const recent = sorted.slice(0, 7);
        const happy = recent.filter((r) => r.level <= 3).length;
        const neutral = recent.filter((r) => r.level > 3 && r.level <= 6).length;
        const sad = recent.filter((r) => r.level > 6).length;
        const trend: { label: string; color: string }[] = [];
        if (sad > 0) trend.push({ label: 'Sad', color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' });
        if (neutral > 0 || (sad === 0 && happy === 0)) trend.push({ label: 'Neutral', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' });
        if (happy > 0) trend.push({ label: 'Happy', color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' });
        if (trend.length > 0) setMoodTrend(trend);
      } catch { /* ignore */ }
    }

    setRechecksPrevented(todayCompletions.length);
    if (records.length >= 2) {
      const sorted = [...records].sort((a, b) => b.timestamp - a.timestamp);
      const diff = sorted[1].level - sorted[0].level;
      setAnxietyReduced(diff > 0 ? diff : 0);
    } else {
      setAnxietyReduced(0);
    }

    const photos = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('did_i_photos') || '[]')
      : [];
    setPhotoCount(Array.isArray(photos) ? photos.length : 0);

    const sleepRaw = localStorage.getItem('did_i_sleep_records');
    if (sleepRaw) {
      try {
        const slp: { date: string; hours: number }[] = JSON.parse(sleepRaw);
        if (slp.length > 0) {
          const avg = slp.reduce((s, r) => s + r.hours, 0) / slp.length;
          setSleepAvg(Math.round(avg * 10) / 10);
          const latestSlp = slp.sort((a, b) => b.date.localeCompare(a.date))[0];
          if (latestSlp) {
            if (latestSlp.hours < 5) setSleepLabel('Insomniac');
            else if (latestSlp.hours < 7) setSleepLabel('Restless');
            else setSleepLabel('Well rested');
          }
        }
      } catch { /* ignore */ }
    }
  }

  useEffect(() => {
    loadData();
    loadConfirmationsState();
  }, [loadConfirmationsState]);

  useEffect(() => {
    const onFocus = () => {
      loadData();
      loadConfirmationsState();
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [loadConfirmationsState]);

  function goToSleep() {
    router.push('/sleep');
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-y-auto h-full px-4 py-6 space-y-8"
    >
      {/* Progress Highlights */}
      <section>
        <div className="glass3d rounded-2xl p-5 border border-border grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-extrabold text-foreground">{rechecksPrevented}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Rechecks Prevented</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-2">
              <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-extrabold text-foreground">{anxietyReduced}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Anxiety Reduced</p>
          </div>
        </div>
      </section>

      {/* Your Reports */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">Your Reports</h2>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Active Tasks */}
          <div className="rounded-2xl p-3 flex flex-col gap-1.5 bg-chart-2 text-white shadow-lg cursor-pointer" onClick={() => router.push('/tasks')}>
            <div className="flex items-center gap-1">
              <ClipboardList className="w-4 h-4" />
              <span className="text-xs font-semibold">Tasks</span>
            </div>
            <span className="text-xl font-extrabold leading-tight">{taskCount}</span>
            <span className="text-[10px] text-white/80">active</span>
            <div className="flex items-end gap-0.5 h-8 mt-1">
              {(() => { const maxVal = Math.max(...weeklyData.map(d => Math.max(d.completed, d.total || 1)), 1); return weeklyData.map((d, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full"
                  style={{
                    height: `${(Math.max(d.completed, d.total) / maxVal) * 100}%`,
                    background: 'rgba(255,255,255,0.6)',
                  }}
                />
              )); })()}
            </div>
          </div>

          {/* Anxiety Check-ins */}
          <div className="rounded-2xl p-3 flex flex-col gap-1.5 bg-chart-5 text-white shadow-lg cursor-pointer" onClick={() => router.push('/anxiety')}>
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              <span className="text-xs font-semibold">Anxiety</span>
            </div>
            <span className="text-xl font-extrabold leading-tight">{anxietyCount}</span>
            <span className="text-[10px] text-white/80">check-ins</span>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-1.5 flex-1 rounded-full"
                  style={{
                    background: i <= Math.round(avgAnxiety / 2)
                      ? 'rgba(255,255,255,0.8)'
                      : 'rgba(255,255,255,0.25)',
                  }}
                />
              ))}
              <span className="text-[9px] text-white/70 ml-1">{avgAnxiety}/10</span>
            </div>
          </div>

          {/* Photos */}
          <div className="rounded-2xl p-3 flex flex-col gap-1.5 bg-chart-4 text-white shadow-lg cursor-pointer" onClick={() => router.push('/tasks')}>
            <div className="flex items-center gap-1">
              <Camera className="w-4 h-4" />
              <span className="text-xs font-semibold">Photos</span>
            </div>
            <span className="text-xl font-extrabold leading-tight">{photoCount}</span>
            <span className="text-[10px] text-white/80">captured</span>
            <div className="grid grid-cols-5 gap-[2px] mt-1">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-sm"
                  style={{
                    background: i < Math.min(photoCount, 15)
                      ? 'rgba(255,255,255,0.85)'
                      : 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Confirmations */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">Recent Confirmations</h2>
        </div>
        <div className="glass3d rounded-2xl p-4 border border-border space-y-2">
          {recentConfirmations.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground">
              No confirmations yet. Complete tasks in Leaving Home.
            </div>
          ) : (
            recentConfirmations.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/20 cursor-pointer" onClick={() => router.push('/checklist')}>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[1px] px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shrink-0">Confirmed</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Mindful Tracker */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">Mindful Tracker</h2>
          <MoreVertical className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="space-y-3">
          {/* Mindful Hours */}
          <div className="glass3d rounded-2xl p-4 border border-border cursor-pointer" onClick={() => router.push('/tasks')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Mindful Hours</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{completedToday}h/{taskCount}h</p>
                </div>
              </div>
              <svg className="w-14 h-14 shrink-0" viewBox="0 0 64 64" fill="none">
                <path d="M0 32h1.14c6.84 0 12.38-5.54 12.38-12.38v-6.3C13.52 9.72 16.24 7 19.59 7s6.07 2.72 6.07 6.07v12.08c0 3.65 2.96 6.6 6.6 6.6s6.6 2.96 6.6 6.6v14.48c0 3.47 2.82 6.29 6.29 6.29s6.29-2.82 6.29-6.29v-8.51C51.43 37.38 57.06 32 64 32" stroke="oklch(0.87 0.01 162.48 / 0.5)" strokeWidth="4" />
                <path d="M0 32h1.14c6.84 0 12.38-5.54 12.38-12.38v-6.3C13.52 9.72 16.24 7 19.59 7s6.07 2.72 6.07 6.07v12.08c0 3.65 2.96 6.6 6.6 6.6" stroke="#9BB068" strokeWidth="4" />
              </svg>
            </div>
          </div>

          {/* Sleep Quality */}
          <div className="glass3d rounded-2xl p-4 border border-border cursor-pointer" onClick={goToSleep}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                  <BedDouble className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Sleep Quality</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{sleepLabel} ({sleepAvg}h Avg)</p>
                </div>
              </div>
              <svg className="w-14 h-14 shrink-0" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="23" stroke="oklch(0.87 0.01 264.38 / 0.3)" strokeWidth="10" />
                <path d="M32 9c5.06 0 9.98 1.67 14 4.75" stroke="#A18FFF" strokeWidth="10" strokeLinecap="round" />
                <text x="26" y="37" fontSize="13" fontWeight="800" fill="currentColor" className="fill-foreground">{sleepAvg}</text>
              </svg>
            </div>
          </div>

          {/* Mindful Journal */}
          <div className="glass3d rounded-2xl p-4 border border-border cursor-pointer" onClick={() => router.push('/anxiety')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Mindful Journal</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{notesCount} Journal Entries</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-[3px] shrink-0">
                {[
                  1, 1, 1, 1,
                  1, 1, 0.5, 0.5,
                  1, 1, 0.5, 0,
                  0, 0, 0, 0
                ].map((v, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      background: i < notesCount % 16 ? '#FE814B' : i < (notesCount % 16) + 4 ? '#FFD2C2' : '#FFF0EB'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Stress Level */}
          <div className="glass3d rounded-2xl p-4 border border-border cursor-pointer" onClick={() => router.push('/anxiety')}>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">Stress Level</p>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-1.5 flex-1 rounded-full"
                      style={{ background: i <= stressLevel ? '#FFBD1A' : '#E8DDD9' }}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Level {stressLevel}
                  {stressLevel <= 2 ? ' (Calm)' : stressLevel <= 3 ? ' (Normal)' : stressLevel <= 4 ? ' (Elevated)' : ' (High)'}
                </p>
              </div>
            </div>
          </div>

          {/* Mood Tracker */}
          <div className="glass3d rounded-2xl p-4 border border-border cursor-pointer" onClick={() => router.push('/anxiety')}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                <Smile className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="font-semibold text-foreground text-sm">Mood Tracker</p>
              {latestMood && (
                <span className="text-xs text-muted-foreground">(Now: {latestMood})</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {moodTrend.map((m, i) => (
                <span key={m.label}>
                  <span className={`text-[10px] font-bold uppercase tracking-[1px] px-2.5 py-1.5 rounded-full ${m.color}`}>{m.label}</span>
                  {i < moodTrend.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 inline ml-1.5" />}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Completion Rate */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">Weekly Completion Rate</h2>
        </div>
        <div className="glass3d rounded-2xl p-4 border border-border">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
              />
              <Bar dataKey="completed" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="total" fill="color-mix(in oklch, var(--chart-2) 30%, transparent)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* AI Therapy Chatbot */}
      <section className="space-y-3 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">AI Therapy Chatbot</h2>
          <Settings className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="glass3d rounded-2xl p-5 border border-border min-h-[180px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-3">
            <Heart className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">Chat with your AI therapist</p>
          <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
        </div>
      </section>
    </motion.div>
  );
}
