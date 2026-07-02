'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Moon, BedDouble, Activity, Brain, Coffee, Volume2, Sun, Thermometer, Dumbbell, Utensils, Pill, Plus, Trash2 } from 'lucide-react';

interface SleepRecord {
  date: string;
  hours: number;
  quality: number;
  factors: string[];
  note: string;
}

const FACTORS = [
  { id: 'stress', label: 'Stress', icon: Brain },
  { id: 'anxiety', label: 'Anxiety', icon: Activity },
  { id: 'caffeine', label: 'Caffeine', icon: Coffee },
  { id: 'noise', label: 'Noise', icon: Volume2 },
  { id: 'light', label: 'Light / Screens', icon: Sun },
  { id: 'temperature', label: 'Temperature', icon: Thermometer },
  { id: 'exercise', label: 'Exercise', icon: Dumbbell },
  { id: 'diet', label: 'Late Meals', icon: Utensils },
  { id: 'medication', label: 'Medication', icon: Pill },
];

const QUALITY_LABELS = ['Terrible', 'Poor', 'Fair', 'Good', 'Excellent'];

export default function SleepQuality({ onBack }: { onBack?: () => void }) {
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [hours, setHours] = useState('7');
  const [quality, setQuality] = useState(3);
  const [factors, setFactors] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('did_i_sleep_records');
    if (raw) {
      try {
        const data: SleepRecord[] = JSON.parse(raw);
        setRecords(data);
        const today = new Date().toISOString().split('T')[0];
        const existing = data.find((r) => r.date === today);
        if (existing) {
          setHours(String(existing.hours));
          setQuality(existing.quality);
          setFactors(existing.factors);
          setNote(existing.note || '');
        }
      } catch { /* ignore */ }
    }
  }, []);

  function save() {
    const h = parseFloat(hours);
    if (isNaN(h) || h < 0 || h > 24) return;
    const today = new Date().toISOString().split('T')[0];
    const entry: SleepRecord = { date: today, hours: h, quality, factors, note: note.trim() };
    const updated = [...records.filter((r) => r.date !== today), entry];
    localStorage.setItem('did_i_sleep_records', JSON.stringify(updated));
    setRecords(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleFactor(id: string) {
    setFactors((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  function deleteRecord(date: string) {
    const updated = records.filter((r) => r.date !== date);
    localStorage.setItem('did_i_sleep_records', JSON.stringify(updated));
    setRecords(updated);
  }

  const avgHours = records.length > 0
    ? Math.round((records.reduce((s, r) => s + r.hours, 0) / records.length) * 10) / 10
    : 0;

  const avgQuality = records.length > 0
    ? Math.round((records.reduce((s, r) => s + r.quality, 0) / records.length) * 10) / 10
    : 0;

  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-y-auto h-full px-4 py-6 space-y-6"
    >
      {/* Decorative sticker */}
      <div className="relative h-0" aria-hidden="true">
        <img
          src="/stickers/wellness.png"
          alt=""
          className="absolute opacity-20 dark:opacity-15 w-[140px] right-0 -top-4 pointer-events-none select-none"
        />
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        )}
        <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-semibold text-foreground">Sleep Quality</h1>
          <p className="text-xs text-muted-foreground">Track your sleep patterns</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass3d rounded-2xl p-4 border border-border">
          <p className="text-xs text-muted-foreground">Avg Hours</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">{avgHours}<span className="text-sm font-normal text-muted-foreground">h</span></p>
        </div>
        <div className="glass3d rounded-2xl p-4 border border-border">
          <p className="text-xs text-muted-foreground">Avg Quality</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">{avgQuality}<span className="text-sm font-normal text-muted-foreground">/5</span></p>
          <p className="text-xs text-muted-foreground mt-0.5">{QUALITY_LABELS[Math.round(avgQuality) - 1] || '--'}</p>
        </div>
      </div>

      {/* Today's Entry */}
      <div className="glass3d rounded-2xl p-5 border border-border space-y-4">
        <div className="flex items-center gap-2">
          <BedDouble className="w-5 h-5 text-purple-500" />
          <h2 className="font-heading text-base font-semibold text-foreground">Log Tonight&apos;s Sleep</h2>
        </div>

        {/* Hours */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Hours slept</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="14"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="flex-1 accent-purple-500"
            />
            <span className="text-lg font-bold text-foreground w-10 text-right">{hours}h</span>
          </div>
        </div>

        {/* Quality */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Quality</label>
          <div className="flex gap-2">
            {QUALITY_LABELS.map((label, i) => (
              <button
                key={label}
                onClick={() => setQuality(i + 1)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-[0.5px] transition-all ${
                  quality === i + 1
                    ? 'bg-purple-500 text-white shadow-md scale-105'
                    : 'bg-muted text-muted-foreground hover:bg-purple-100 dark:hover:bg-purple-900/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Factors */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">What affected your sleep?</label>
          <div className="flex flex-wrap gap-2">
            {FACTORS.map((f) => {
              const Icon = f.icon;
              const active = factors.includes(f.id);
              return (
                <button
                  key={f.id}
                  onClick={() => toggleFactor(f.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50'
                      : 'bg-muted text-muted-foreground border border-transparent hover:border-border'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Notes (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="How are you feeling about your sleep?"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            rows={2}
          />
        </div>

        <motion.button
          onClick={save}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl bg-purple-500 text-white font-semibold text-sm hover:bg-purple-600 transition-colors"
        >
          {saved ? 'Saved!' : 'Log Sleep'}
        </motion.button>
      </div>

      {/* History */}
      {sorted.length > 0 && (
        <div className="space-y-2 pb-4">
          <h2 className="font-heading text-base font-semibold text-foreground px-1">History</h2>
          {sorted.map((record) => {
            const isExpanded = expanded === record.date;
            return (
              <div key={record.date} className="glass3d rounded-2xl border border-border overflow-hidden">
                <button
                  onClick={() => setExpanded(isExpanded ? null : record.date)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{record.date}</p>
                      <p className="text-xs text-muted-foreground">{record.hours}h &middot; {QUALITY_LABELS[record.quality - 1]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">{record.hours}h</span>
                    <svg className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-border space-y-2">
                    {record.factors.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {record.factors.map((f) => {
                          const factor = FACTORS.find((x) => x.id === f);
                          return factor ? (
                            <span key={f} className="text-[10px] px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium">{factor.label}</span>
                          ) : null;
                        })}
                      </div>
                    )}
                    {record.note && (
                      <p className="text-xs text-muted-foreground">{record.note}</p>
                    )}
                    <button
                      onClick={() => deleteRecord(record.date)}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
