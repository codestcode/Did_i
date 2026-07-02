'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Moon, BedDouble, Activity, Brain, Coffee, Volume2, Sun, Thermometer, Dumbbell, Utensils, Pill, Trash2, Info } from 'lucide-react';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SleepQuality({ onBack }: { onBack?: () => void }) {
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [hours, setHours] = useState('7');
  const [quality, setQuality] = useState(3);
  const [factors, setFactors] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [heatMetric, setHeatMetric] = useState<'quality' | 'hours'>('quality');
  const [tappedCell, setTappedCell] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

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

  useEffect(() => {
    if (!tappedCell) return;
    const handler = () => setTappedCell(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [tappedCell]);

  function save() {
    const h = parseFloat(hours);
    if (isNaN(h) || h < 0 || h > 24) return;
    const today = new Date().toISOString().split('T')[0];
    const entry: SleepRecord = { date: today, hours: h, quality, factors, note: note.trim() };
    const updated = [...records.filter((r) => r.date !== today), entry];
    localStorage.setItem('did_i_sleep_records', JSON.stringify(updated));
    setRecords(updated);
    setSaved(true);
    window.dispatchEvent(new CustomEvent('sleep-data-changed'));
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

  const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const heatMapWeeks = useMemo(() => {
    const today = new Date();
    const days: { date: string; record?: SleepRecord }[] = [];
    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const record = records.find((r) => r.date === dateStr);
      days.push({ date: dateStr, record });
    }
    const weeks: { date: string; record?: SleepRecord }[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  }, [records]);

  function heatColor(record?: SleepRecord): string {
    if (!record) return 'bg-gray-100 dark:bg-gray-800/30';
    const val = heatMetric === 'quality' ? record.quality : record.hours;
    if (heatMetric === 'quality') {
      if (val >= 5) return 'bg-emerald-400 dark:bg-emerald-500';
      if (val >= 4) return 'bg-green-300 dark:bg-green-400';
      if (val >= 3) return 'bg-yellow-300 dark:bg-yellow-400';
      if (val >= 2) return 'bg-orange-300 dark:bg-orange-400';
      return 'bg-red-300 dark:bg-red-400';
    }
    if (val >= 9) return 'bg-emerald-400 dark:bg-emerald-500';
    if (val >= 7) return 'bg-green-300 dark:bg-green-400';
    if (val >= 6) return 'bg-yellow-300 dark:bg-yellow-400';
    if (val >= 4) return 'bg-orange-300 dark:bg-orange-400';
    return 'bg-red-300 dark:bg-red-400';
  }

  function heatTooltip(record?: SleepRecord): string {
    if (!record) return 'No data';
    const q = record.quality;
    const h = record.hours;
    return `${record.date}: ${h}h, ${QUALITY_LABELS[q - 1] || q}/5`;
  }

  const monthLabels = useMemo(() => {
    const labels: { label: string; col: number }[] = [];
    for (let w = 0; w < heatMapWeeks.length; w++) {
      const firstDay = new Date(heatMapWeeks[w][0].date);
      if (firstDay.getDate() <= 7) {
        labels.push({
          label: firstDay.toLocaleString('default', { month: 'short' }),
          col: w,
        });
      }
    }
    return labels;
  }, [heatMapWeeks]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
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
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        {onBack && (
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
        )}
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Moon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-semibold text-foreground">Sleep Quality</h1>
          <p className="text-xs text-muted-foreground">Track your sleep patterns</p>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
        <div className="glass3d rounded-2xl p-4 border border-border">
          <p className="text-xs text-muted-foreground">Avg Hours</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">{avgHours}<span className="text-sm font-normal text-muted-foreground">h</span></p>
        </div>
        <div className="glass3d rounded-2xl p-4 border border-border">
          <p className="text-xs text-muted-foreground">Avg Quality</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">{avgQuality}<span className="text-sm font-normal text-muted-foreground">/5</span></p>
          <p className="text-xs text-muted-foreground mt-0.5">{QUALITY_LABELS[Math.round(avgQuality) - 1] || '--'}</p>
        </div>
      </motion.div>

      {/* Heat Map */}
      <motion.div variants={itemVariants} className="glass3d rounded-2xl p-5 border border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-base font-semibold text-foreground">Sleep Heat Map</h2>
          </div>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setHeatMetric('quality')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                heatMetric === 'quality'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Quality
            </button>
            <button
              onClick={() => setHeatMetric('hours')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                heatMetric === 'hours'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Hours
            </button>
          </div>
        </div>

        {/* Month labels */}
        <div className="flex gap-[4px] text-[10px] text-muted-foreground overflow-hidden" style={{ paddingLeft: '30px' }}>
          <div className="flex flex-1 min-w-0 gap-[4px]">
            {(() => {
              const cols: (string | null)[] = heatMapWeeks.map(() => null);
              monthLabels.forEach((m) => { cols[m.col] = m.label; });
              return cols.map((label, i) => (
                <div key={i} className="flex-1 min-w-0 truncate">
                  {label || ''}
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Grid */}
        <div className="flex gap-[4px] overflow-x-auto pb-2 -mx-1 px-1">
          <div className="flex flex-col gap-[4px] pt-0 shrink-0">
            {DAY_LABELS.map((d, i) => (
              <div key={d} className="text-[10px] text-muted-foreground h-full flex items-end pb-[2px] w-7 text-right pr-1.5">
                {i % 2 === 0 ? d : ''}
              </div>
            ))}
          </div>
          <div className="flex gap-[4px] flex-1 min-w-0">
            {heatMapWeeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[4px] flex-1 min-w-0">
                {week.map((day) => {
                  const showTooltip = tappedCell === day.date || hoveredCell === day.date;
                  return (
                    <div
                      key={day.date}
                      className="relative flex-1 min-h-0 aspect-square"
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); setTappedCell(tappedCell === day.date ? null : day.date); }}
                        onMouseEnter={() => setHoveredCell(day.date)}
                        onMouseLeave={() => setHoveredCell(null)}
                        onBlur={() => { if (tappedCell === day.date) setTappedCell(null); }}
                        className={`w-full h-full rounded-[3px] ${heatColor(day.record)} cursor-pointer transition-transform active:scale-90`}
                      >
                        <span className="sr-only">{heatTooltip(day.record)}</span>
                      </button>
                      {showTooltip && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-10 pointer-events-none">
                          <div className="bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded-md shadow-lg border border-border whitespace-nowrap">
                            {heatTooltip(day.record)}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground pt-1">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800/30" />
          <div className="w-3 h-3 rounded-sm bg-red-300 dark:bg-red-400" />
          <div className="w-3 h-3 rounded-sm bg-orange-300 dark:bg-orange-400" />
          <div className="w-3 h-3 rounded-sm bg-yellow-300 dark:bg-yellow-400" />
          <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-400" />
          <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-500" />
          <span>More</span>
          <div className="flex items-center gap-1 ml-auto text-[10px] text-muted-foreground">
            <Info className="w-3 h-3" />
            <span>12 weeks</span>
          </div>
        </div>
      </motion.div>

      {/* Today's Entry */}
      <motion.div variants={itemVariants} className="glass3d rounded-2xl border border-border overflow-hidden">
        <div className="p-5 pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <BedDouble className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-heading text-base font-semibold text-foreground">Log Tonight&apos;s Sleep</h2>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Hours + Quality row */}
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3 space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Hours</label>
              <div className="flex items-center gap-2 h-10">
                <input
                  type="range"
                  min="0"
                  max="14"
                  step="0.5"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="flex-1 accent-primary"
                />
                <span className="text-xl font-bold text-foreground w-10 text-right tabular-nums">{hours}</span>
              </div>
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Rating</label>
              <div className="flex items-center gap-1 h-10">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    onClick={() => setQuality(i)}
                    className={`flex-1 h-full rounded-lg text-xs font-bold transition-all ${
                      quality >= i
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted text-muted-foreground hover:bg-primary/10'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/40" />

          {/* Factors */}
          <div className="space-y-2">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">What affected your sleep?</label>
            <div className="grid grid-cols-3 gap-1.5">
              {FACTORS.map((f) => {
                const Icon = f.icon;
                const active = factors.includes(f.id);
                return (
                  <button
                    key={f.id}
                    onClick={() => toggleFactor(f.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-medium transition-all ${
                      active
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'bg-muted/50 text-muted-foreground border border-transparent hover:border-border'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/40" />

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Notes</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How are you feeling about your sleep?"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              rows={2}
            />
          </div>

          <motion.button
            onClick={save}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            {saved ? 'Saved!' : 'Log Sleep'}
          </motion.button>
        </div>
      </motion.div>

      {/* Log Cards */}
      <AnimatePresence>
        {sorted.length > 0 && (
          <motion.div variants={itemVariants} className="space-y-3 pb-4">
            <h2 className="font-heading text-base font-semibold text-foreground px-1">Your Sleep Logs</h2>
            {sorted.map((record) => {
              const isExpanded = expanded === record.date;
              return (
                <motion.div
                  key={record.date}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="glass3d rounded-2xl border border-border overflow-hidden"
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between p-4 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Moon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{record.date}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-bold text-foreground">{record.hours}h</span>
                          <span className="text-[10px] text-muted-foreground">&middot;</span>
                          <span className="text-[11px] font-medium text-muted-foreground">{QUALITY_LABELS[record.quality - 1]}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i <= record.quality ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      ))}
                      <button
                        onClick={() => deleteRecord(record.date)}
                        className="ml-2 p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expandable body */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : record.date)}
                    className="w-full px-4 pb-3 flex items-center justify-between text-left"
                  >
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      {isExpanded ? 'Tap to hide details' : 'Tap for details'}
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-border space-y-3">
                      {record.factors.length > 0 && (
                        <div className="pt-3">
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Factors</p>
                          <div className="flex flex-wrap gap-1.5">
                            {record.factors.map((f) => {
                              const factor = FACTORS.find((x) => x.id === f);
                              return factor ? (
                                <span key={f} className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                                  <factor.icon className="w-3 h-3" />
                                  {factor.label}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                      {record.note && (
                        <div>
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Note</p>
                          <p className="text-xs text-foreground/80 bg-muted/30 rounded-xl px-3 py-2">{record.note}</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
