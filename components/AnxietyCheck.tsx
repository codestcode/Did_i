'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Wind, Heart, TrendingDown, Plus, Trash2, Calendar, TrendingUp, Play, Clock, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AnxietyRecord {
  id: string;
  level: number;
  triggers: string[];
  note: string;
  timestamp: number;
  date: string;
}

export default function AnxietyCheck() {
  const router = useRouter();
  const [anxietyLevel, setAnxietyLevel] = useState(5);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [triggerInput, setTriggerInput] = useState('');
  const [notes, setNotes] = useState('');
  const [records, setRecords] = useState<AnxietyRecord[]>([]);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [showSuccess, setShowSuccess] = useState(false);

  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('anxietyRecords');
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('anxietyRecords', JSON.stringify(records));
  }, [records]);

  const breathingPhaseRef = useRef(breathingPhase);
  breathingPhaseRef.current = breathingPhase;

  useEffect(() => {
    if (!isBreathingActive) return;

    const phases = ['inhale', 'hold', 'exhale'] as const;
    const durations = { inhale: 4, hold: 4, exhale: 4 };

    const interval = setInterval(() => {
      setBreathingPhase((current) => {
        const currentIndex = phases.indexOf(current);
        return phases[(currentIndex + 1) % phases.length];
      });
    }, durations[breathingPhaseRef.current] * 1000);

    return () => clearInterval(interval);
  }, [isBreathingActive]);

  useEffect(() => {
    if (!isBreathingActive) { setTimer(0); return; }
    const t = setInterval(() => setTimer(p => p + 1), 1000);
    return () => clearInterval(t);
  }, [isBreathingActive]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const phaseLabel = breathingPhase === 'inhale' ? 'Breathe In' : breathingPhase === 'hold' ? 'Hold' : 'Breathe Out';

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

  const breathingProgress = breathingPhase === 'inhale' ? 25 : breathingPhase === 'hold' ? 50 : 75;
  const circleCircumference = 2 * Math.PI * 74;

  return (
    <div className="h-full overflow-y-auto bg-[#9BB068] relative">
      {/* Decorative circles */}
      <svg className="pointer-events-none absolute left-[-204px] top-[140px]" width="280" height="272" viewBox="0 0 280 272" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse opacity="0.32" cx="140" cy="136" rx="140" ry="136" fill="#7D944D"/>
      </svg>
      <svg className="pointer-events-none absolute right-0 top-[759px]" width="79" height="79" viewBox="0 0 79 79" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.64" d="M39.4999 79C17.7236 79 0 61.2764 0 39.5C0 17.7236 17.7236 0 39.4999 0C61.2763 0 78.9998 17.7236 78.9998 39.5C79.0603 61.2159 61.2763 79 39.4999 79ZM39.4999 16.2718C26.7365 16.2718 16.3323 26.6761 16.3323 39.4395C16.3323 52.2029 26.7365 62.6072 39.4999 62.6072C52.2633 62.6072 62.6676 52.2029 62.6676 39.4395C62.6676 26.6761 52.2633 16.2718 39.4999 16.2718Z" fill="#7D944D"/>
      </svg>
      <svg className="pointer-events-none absolute left-[-37px] top-[593px]" width="149" height="137" viewBox="0 0 149 137" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.32" d="M41.6174 137C39.928 137 38.282 136.31 37.1124 134.931C35.0332 132.475 35.3364 128.769 37.8488 126.743L129.465 50.2486C133.97 46.4993 136.699 41.2416 137.219 35.4237C137.738 29.6058 135.919 23.9603 132.15 19.4784C128.382 14.9964 123.097 12.2814 117.249 11.7643C111.401 11.2471 105.727 13.0571 101.222 16.8064L9.60597 93.3011C7.13689 95.3697 3.45493 95.068 1.3757 92.5685C-0.703527 90.112 -0.400308 86.4058 2.11209 84.3803L93.728 7.84257C100.615 2.11085 109.322 -0.64726 118.289 0.128461C127.256 0.904181 135.356 5.12754 141.117 11.9366C146.878 18.7888 149.651 27.4511 148.871 36.3718C148.091 45.2926 143.846 53.3515 136.959 59.0832L45.3427 135.621C44.2598 136.569 42.9169 137 41.6174 137Z" fill="#7D944D"/>
      </svg>
      <svg className="pointer-events-none absolute right-[358px] top-[452px]" width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="12" cy="11.5" rx="12" ry="11.5" fill="#B4C48D"/>
      </svg>
      <svg className="pointer-events-none absolute right-[202px] top-[-24px]" width="82" height="82" viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.1003 76.8605C11.2657 63.0259 11.6057 40.1545 25.8801 25.8801C40.1545 11.6057 63.0259 11.2657 76.8605 25.1003C79.1817 27.4215 79.1458 31.1714 76.8495 33.4677C74.5221 35.7951 70.7723 35.769 68.482 33.4787C59.259 24.2557 43.8873 24.5858 34.2676 34.2055C24.6168 43.8563 24.3178 59.1969 33.5408 68.42C35.862 70.7412 35.8261 74.4911 33.5298 76.7874C31.2335 79.0837 27.4215 79.1817 25.1003 76.8605Z" fill="#B4C48D"/>
      </svg>
      <svg className="pointer-events-none absolute left-[282px] top-[122px]" width="154" height="154" viewBox="0 0 154 154" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.64" d="M138.009 63.8035C131.293 70.5192 120.739 72.4537 111.859 67.8735C111.239 67.5484 110.561 67.2823 109.912 67.1047C107.168 66.3055 104.279 66.6561 101.774 68.0393C99.2694 69.4224 97.4732 71.6909 96.68 74.4323L96.4157 75.3461C96.21 76.0241 96.0043 76.7021 95.7397 77.38C93.3875 83.5697 88.7634 88.43 82.7216 91.1656C76.6797 93.8423 69.9274 94.0413 63.762 91.6461L60.6646 90.4337C60.1041 90.2266 59.5437 90.0786 58.9833 89.9306C56.0634 89.3081 53.0858 89.8651 50.6107 91.5137C48.1061 93.1327 46.4281 95.6372 45.8121 98.5558C45.548 99.7644 45.1955 100.944 44.7839 102.064C42.6375 107.634 38.4551 111.994 33.0026 114.376C27.5502 116.759 21.5055 116.899 15.9301 114.741L5.92977 110.867C3.03881 109.743 1.59036 106.469 2.70769 103.58C3.82502 100.692 7.09646 99.2504 9.98741 100.374L19.9878 104.248C22.7312 105.342 25.7388 105.286 28.4208 104.08C31.1323 102.904 33.1941 100.724 34.2821 97.9828C34.4878 97.4228 34.6641 96.8333 34.7814 96.2437C35.9839 90.3771 39.4284 85.3386 44.4376 82.1005C49.4467 78.8035 55.4314 77.7191 61.3006 78.9345C62.4214 79.1716 63.6013 79.5268 64.7222 79.9408L67.8491 81.1237C71.2121 82.4248 74.8683 82.3109 78.1693 80.8402C81.4702 79.3695 83.9736 76.6889 85.2674 73.3288C85.3849 72.9751 85.5319 72.5919 85.6495 72.2382L85.9139 71.3244C87.5295 65.6942 91.2102 61.0098 96.3673 58.1552C101.495 55.3301 107.45 54.629 113.084 56.2569C114.471 56.6418 115.828 57.1741 117.096 57.8537C122.584 60.6904 129.334 58.5453 132.159 53.0638C132.424 52.5039 132.688 51.9439 132.894 51.3249L135.891 41.8924C136.832 38.9447 140.015 37.2969 142.964 38.2438C145.914 39.1906 147.598 42.3475 146.628 45.3247L143.631 54.7572C143.249 55.9657 142.779 57.1447 142.19 58.2646C140.983 60.3568 139.6 62.213 138.009 63.8035Z" fill="#7D944D"/>
      </svg>

      {/* Top Nav */}
      <div className="relative z-10 flex items-center gap-3 px-4 pt-14 pb-2">
        <button onClick={() => router.back()} className="w-12 h-12 rounded-full border border-white/60 flex items-center justify-center flex-shrink-0 hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl font-extrabold text-white tracking-tight">Anxiety Check-In</h1>
      </div>

      {/* Hero: Breathing Exercise */}
      <div className="relative z-10 flex flex-col items-center gap-6 pt-6 pb-4">
        <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white text-center leading-tight tracking-tight px-4">
          Calming Breath Exercise
        </h2>

        {!isBreathingActive ? (
          <>
            {/* Timer circle - idle */}
            <div className="relative w-[180px] h-[180px]">
              <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                <circle cx="90" cy="90" r="74" stroke="#B4C48D" strokeWidth="16"/>
                <path d="M90 16C104.394 16 118.534 19.7889 131 26.9859C143.466 34.1829 153.817 44.5344 161.014 57C168.211 69.4656 172 83.606 172 98" stroke="white" strokeWidth="16" strokeLinecap="round"/>
              </svg>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsBreathingActive(true)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Play className="w-12 h-12 text-white ml-1" />
              </motion.button>
            </div>
            <p className="text-white/80 text-sm font-semibold">Tap to start (4-4-4 breathing)</p>
          </>
        ) : (
          <>
            {/* Timer circle - active */}
            <div className="relative w-[180px] h-[180px]">
              <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                <defs>
                  <clipPath id="circleClip">
                    <circle cx="90" cy="90" r="82"/>
                  </clipPath>
                </defs>
                <circle cx="90" cy="90" r="74" stroke="#B4C48D" strokeWidth="16"/>
                <motion.circle
                  cx="90" cy="90" r="74"
                  stroke="white" strokeWidth="16" strokeLinecap="round"
                  strokeDasharray={circleCircumference}
                  animate={{ strokeDashoffset: circleCircumference * (1 - breathingProgress / 100) }}
                  transition={{ duration: 0.3 }}
                  transform="rotate(-90 90 90)"
                  clipPath="url(#circleClip)"
                />
              </svg>
              <motion.div
                key={breathingPhase}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-1"
              >
                <span className="text-white font-extrabold text-lg tracking-tight">{phaseLabel}</span>
              </motion.div>
            </div>

            <div className="text-[36px] font-extrabold text-white tracking-tight">
              {formatTime(timer)}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsBreathingActive(false)}
              className="px-8 py-3 rounded-full bg-white/20 text-white font-bold text-sm backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              Stop Exercise
            </motion.button>
          </>
        )}
      </div>

      {/* Bottom white card section */}
      <div className="relative z-10 bg-white rounded-t-[32px] min-h-[50vh] pb-8">
        <div className="max-w-4xl mx-auto px-4 pt-6 space-y-5">
          {/* Today's Summary */}
          {avgLevel !== null && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F7F4F2] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-[#FE814B]" />
                  <span className="text-xs font-bold text-[rgba(31,22,15,0.48)] uppercase tracking-wider">Today's Avg</span>
                </div>
                <span className="text-2xl font-extrabold text-[#4B3425]">{avgLevel}/10</span>
                <p className="text-xs text-[rgba(31,22,15,0.48)] font-semibold mt-1">{todayRecords.length} check-in(s)</p>
              </div>

              <div className="bg-[#F7F4F2] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="w-4 h-4 text-[#FE814B]" />
                  <span className="text-xs font-bold text-[rgba(31,22,15,0.48)] uppercase tracking-wider">Trend</span>
                </div>
                <div className="flex items-center gap-2">
                  {todayRecords.length > 1
                    ? todayRecords[0].level > todayRecords[todayRecords.length - 1].level
                      ? <TrendingDown className="w-6 h-6 text-[#9BB068]" />
                      : <TrendingUp className="w-6 h-6 text-[#FE814B]" />
                    : <TrendingUp className="w-6 h-6 text-[rgba(31,22,15,0.32)]" />}
                  <span className="text-sm font-bold text-[#4B3425]">
                    {todayRecords.length > 1
                      ? todayRecords[0].level > todayRecords[todayRecords.length - 1].level ? 'Improving' : 'Increasing'
                      : 'First'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Breathing tip card */}
          <div className="bg-[#F7F4F2] rounded-[32px] p-3 shadow-[0_114px_32px_0_rgba(75,52,37,0.00),0_73px_29px_0_rgba(75,52,37,0.01),0_41px_25px_0_rgba(75,52,37,0.03),0_18px_18px_0_rgba(75,52,37,0.04),0_5px_10px_0_rgba(75,52,37,0.05)]">
            <div className="flex items-center gap-4">
              <div className="w-[72px] h-[72px] rounded-2xl bg-white flex items-center justify-center flex-shrink-0">
                <Wind className="w-7 h-7 text-[#926247]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-extrabold text-[rgba(31,22,15,0.64)] uppercase tracking-[1px]">Breathing Exercise</p>
                <p className="text-lg font-extrabold text-[#4B3425] tracking-tight">4-4-4 Breathing</p>
                <p className="text-sm font-bold text-[rgba(31,22,15,0.48)] mt-1">Inhale 4s &middot; Hold 4s &middot; Exhale 4s</p>
              </div>
            </div>
          </div>

          {/* Anxiety Level Input */}
          <div className="bg-[#F7F4F2] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-[#4B3425]">Current Anxiety Level</h2>
              <span className="text-2xl font-extrabold text-[#9BB068]">{anxietyLevel}/10</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <motion.button
                  key={n}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setAnxietyLevel(n)}
                  className={`h-11 rounded-xl font-extrabold text-sm transition-all ${
                    anxietyLevel === n
                      ? 'bg-[#9BB068] text-white shadow-[0_4px_12px_rgba(155,176,104,0.4)]'
                      : anxietyLevel > n
                        ? 'bg-[#D5C2B9] text-[#4B3425]'
                        : 'bg-white text-[rgba(31,22,15,0.32)]'
                  }`}
                >
                  {n}
                </motion.button>
              ))}
            </div>
            <div className="flex justify-between mt-2 px-1">
              <span className="text-[10px] font-bold text-[rgba(31,22,15,0.48)]">Low</span>
              <span className="text-[10px] font-bold text-[rgba(31,22,15,0.48)]">High</span>
            </div>
          </div>

          {/* Triggers */}
          <div className="bg-[#F7F4F2] rounded-2xl p-4">
            <h2 className="text-base font-extrabold text-[#4B3425] mb-3">What triggered this?</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text" placeholder="e.g., Left the house, Social interaction..."
                value={triggerInput}
                onChange={(e) => setTriggerInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTrigger()}
                className="flex-1 px-4 py-2.5 rounded-full bg-white text-sm text-[#4B3425] placeholder-[rgba(31,22,15,0.32)] font-semibold outline-none"
              />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={addTrigger}
                className="w-10 h-10 rounded-full bg-[#9BB068] flex items-center justify-center flex-shrink-0"
              >
                <Plus className="w-5 h-5 text-white" />
              </motion.button>
            </div>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {triggers.map((trigger, index) => (
                  <motion.div key={index} initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white"
                  >
                    <span className="text-sm font-bold text-[#4B3425]">{trigger}</span>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => removeTrigger(index)}
                      className="text-[rgba(31,22,15,0.32)] hover:text-[#FE814B] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-[#F7F4F2] rounded-2xl p-4">
            <h2 className="text-base font-extrabold text-[#4B3425] mb-3">Notes</h2>
            <textarea placeholder="How are you feeling? What helped?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white text-sm text-[#4B3425] placeholder-[rgba(31,22,15,0.32)] font-semibold outline-none resize-none h-20"
            />
          </div>

          {/* Record Button */}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={recordAnxiety}
            className="w-full py-4 rounded-full bg-[#9BB068] text-white font-extrabold text-lg tracking-tight shadow-[0_16px_32px_rgba(155,176,104,0.5)]"
          >
            Record Check-In
          </motion.button>

          {/* History */}
          <div>
            <h2 className="text-lg font-extrabold text-[#4B3425] mb-3">Check-in History</h2>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {records.length === 0 ? (
                  <div className="text-center py-8 text-[rgba(31,22,15,0.48)] font-semibold text-sm">
                    No check-ins yet.
                  </div>
                ) : (
                  records.map((record) => (
                    <motion.div key={record.id} initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="bg-[#F7F4F2] rounded-2xl p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-[rgba(31,22,15,0.48)]" />
                            <span className="text-xs font-bold text-[rgba(31,22,15,0.48)]">
                              {new Date(record.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <span className="text-2xl font-extrabold text-[#9BB068] mt-1 block">{record.level}/10</span>
                        </div>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => deleteRecord(record.id)}
                          className="p-1.5 rounded-lg hover:bg-[#FE814B]/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-[rgba(31,22,15,0.32)] hover:text-[#FE814B]" />
                        </motion.button>
                      </div>
                      {record.triggers.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {record.triggers.map((trigger, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-full bg-white text-xs font-bold text-[#4B3425]">{trigger}</span>
                          ))}
                        </div>
                      )}
                      {record.note && (
                        <p className="text-sm text-[#4B3425] bg-white rounded-xl p-2.5 font-semibold">{record.note}</p>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-4 right-4 z-50 bg-[#9BB068] text-white px-6 py-4 rounded-2xl font-extrabold text-center shadow-lg"
          >
            ✓ Check-in recorded successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
