'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Heart, TrendingDown, Plus, Trash2, Calendar, Brain, TrendingUp } from 'lucide-react';

interface AnxietyRecord {
  id: string;
  level: number;
  triggers: string[];
  note: string;
  timestamp: number;
  date: string;
}

export default function AnxietyCheck() {
  const [anxietyLevel, setAnxietyLevel] = useState(5);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [triggerInput, setTriggerInput] = useState('');
  const [notes, setNotes] = useState('');
  const [records, setRecords] = useState<AnxietyRecord[]>([]);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [showSuccess, setShowSuccess] = useState(false);

  // Load records from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('anxietyRecords');
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  // Save records to localStorage
  useEffect(() => {
    localStorage.setItem('anxietyRecords', JSON.stringify(records));
  }, [records]);

  // Breathing exercise timer
  const breathingPhaseRef = useRef(breathingPhase);
  breathingPhaseRef.current = breathingPhase;

  useEffect(() => {
    if (!isBreathingActive) return;

    const phases = ['inhale', 'hold', 'exhale'] as const;
    const durations = { inhale: 4, hold: 4, exhale: 4 }; // seconds

    const interval = setInterval(() => {
      setBreathingPhase((current) => {
        const currentIndex = phases.indexOf(current);
        return phases[(currentIndex + 1) % phases.length];
      });
    }, durations[breathingPhaseRef.current] * 1000);

    return () => clearInterval(interval);
  }, [isBreathingActive]);

  const addTrigger = () => {
    if (triggerInput.trim()) {
      setTriggers([...triggers, triggerInput.trim()]);
      setTriggerInput('');
    }
  };

  const removeTrigger = (index: number) => {
    setTriggers(triggers.filter((_, i) => i !== index));
  };

  const recordAnxiety = () => {
    const today = new Date().toLocaleDateString();
    const newRecord: AnxietyRecord = {
      id: Date.now().toString(),
      level: anxietyLevel,
      triggers,
      note: notes,
      timestamp: Date.now(),
      date: today,
    };

    setRecords([newRecord, ...records]);
    setAnxietyLevel(5);
    setTriggers([]);
    setNotes('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const deleteRecord = (id: string) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  const todayRecords = records.filter((r) => r.date === new Date().toLocaleDateString());
  const avgLevel = todayRecords.length > 0
    ? Math.round(todayRecords.reduce((sum, r) => sum + r.level, 0) / todayRecords.length)
    : null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="overflow-y-auto h-full p-6 bg-background relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Decorative sticker */}
      <div className="relative h-0" aria-hidden="true">
        <img
          src="/stickers/self-love.png"
          alt=""
          className="absolute opacity-20 dark:opacity-15 w-[120px] right-2 -top-2 pointer-events-none select-none"
        />
      </div>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-foreground mb-2">Anxiety Check-In</h1>
          <p className="text-muted-foreground">Track your anxiety, identify triggers, and use breathing exercises to calm your mind</p>
        </motion.div>

        {/* Breathing Exercise */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Wind className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Calming Breath Exercise</h2>
          </div>

          {!isBreathingActive ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsBreathingActive(true)}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-lg hover:shadow-lg transition-shadow"
            >
              Start Breathing Exercise (4-4-4)
            </motion.button>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20 border-4 border-primary"
                  animate={
                    breathingPhase === 'inhale'
                      ? { scale: 1.3 }
                      : breathingPhase === 'hold'
                        ? { scale: 1.3 }
                        : { scale: 0.8 }
                  }
                  transition={{ duration: breathingPhase === 'hold' ? 0.1 : 4, ease: 'easeInOut' }}
                />
                <div className="relative z-10 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {breathingPhase === 'inhale' && 'Breathe In'}
                    {breathingPhase === 'hold' && 'Hold'}
                    {breathingPhase === 'exhale' && 'Breathe Out'}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsBreathingActive(false)}
                className="px-6 py-2 rounded-lg bg-secondary text-foreground font-semibold hover:bg-secondary/80 transition-colors"
              >
                Stop Exercise
              </motion.button>

              <p className="text-sm text-muted-foreground text-center">
                Take 5-10 cycles for best results. Repeat as needed throughout the day.
              </p>
            </div>
          )}
        </motion.div>

        {/* Today's Summary */}
        {avgLevel !== null && (
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-4">
            <div className="glass3d bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">Today's Average</h3>
              </div>
              <div className="text-4xl font-bold text-primary">{avgLevel}/10</div>
              <p className="text-sm text-muted-foreground mt-2">{todayRecords.length} check-in(s) today</p>
            </div>

            <div className="glass3d bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">Trend</h3>
              </div>
              <div className="text-4xl font-bold text-primary flex items-center justify-center">
                {todayRecords.length > 1
                  ? todayRecords[0].level > todayRecords[todayRecords.length - 1].level
                    ? <TrendingDown className="w-10 h-10 text-accent" />
                    : <TrendingUp className="w-10 h-10 text-destructive" />
                  : <TrendingUp className="w-10 h-10 text-muted-foreground" />}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {todayRecords.length > 1
                  ? todayRecords[0].level > todayRecords[todayRecords.length - 1].level
                    ? 'Improving'
                    : 'Increasing'
                  : 'First check-in'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Anxiety Level Input */}
        <motion.div variants={itemVariants} className="glass3d bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Current Anxiety Level</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Low</span>
              <span className="text-3xl font-bold text-primary">{anxietyLevel}</span>
              <span className="text-muted-foreground">High</span>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              value={anxietyLevel}
              onChange={(e) => setAnxietyLevel(Number(e.target.value))}
              className="w-full h-3 rounded-lg bg-secondary appearance-none cursor-pointer accent-primary"
            />

            <div className="grid grid-cols-5 gap-2 text-xs text-muted-foreground text-center">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <div key={num}>{num}</div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Triggers */}
        <motion.div variants={itemVariants} className="glass3d bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">What triggered this anxiety?</h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="e.g., Left the house, Social interaction, Work stress..."
              value={triggerInput}
              onChange={(e) => setTriggerInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTrigger()}
              className="flex-1 px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addTrigger}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:shadow-lg transition-shadow"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {triggers.map((trigger, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/20 border border-accent/30"
                >
                  <span className="text-foreground text-sm">{trigger}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeTrigger(index)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Additional Notes */}
        <motion.div variants={itemVariants} className="glass3d bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Additional Notes</h2>
          <textarea
            placeholder="How are you feeling? What helped? Any coping strategies you used?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none h-24"
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={recordAnxiety}
          className="w-full py-4 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-lg hover:shadow-lg transition-shadow"
        >
          Record Check-In
        </motion.button>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 bg-accent text-accent-foreground px-6 py-3 rounded-lg shadow-lg font-semibold"
            >
              ✓ Check-in recorded successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-foreground mb-4">Check-in History</h2>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {records.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No check-ins yet. Start tracking your anxiety to see history.
                </div>
              ) : (
                records.map((record) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass3d bg-card rounded-xl border border-border p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(record.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className="text-3xl font-bold text-primary">{record.level}</span>
                          <span className="text-muted-foreground ml-2">/10</span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteRecord(record.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-muted-foreground hover:text-destructive" />
                      </motion.button>
                    </div>

                    {record.triggers.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm font-semibold text-foreground mb-1">Triggers:</p>
                        <div className="flex flex-wrap gap-2">
                          {record.triggers.map((trigger, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 rounded text-xs bg-accent/20 border border-accent/30 text-foreground"
                            >
                              {trigger}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {record.note && (
                      <p className="text-sm text-foreground bg-secondary/30 rounded p-2 mt-2">
                        {record.note}
                      </p>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
