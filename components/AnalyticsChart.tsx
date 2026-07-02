'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar } from 'lucide-react';

interface ChartData {
  name: string;
  completed: number;
  total: number;
  anxiety?: number;
}

interface AnxietyRecord {
  id: string;
  level: number;
  triggers: string[];
  note: string;
  timestamp: number;
  date: string;
}

const weeklyData: ChartData[] = [
  { name: 'Mon', completed: 8, total: 12, anxiety: 7 },
  { name: 'Tue', completed: 10, total: 12, anxiety: 5 },
  { name: 'Wed', completed: 12, total: 12, anxiety: 3 },
  { name: 'Thu', completed: 11, total: 12, anxiety: 4 },
  { name: 'Fri', completed: 12, total: 12, anxiety: 2 },
  { name: 'Sat', completed: 9, total: 10, anxiety: 6 },
  { name: 'Sun', completed: 10, total: 10, anxiety: 5 },
];

const anxietyTrend: any[] = [
  { name: 'Week 1', score: 8 },
  { name: 'Week 2', score: 7 },
  { name: 'Week 3', score: 5 },
  { name: 'Week 4', score: 4 },
  { name: 'Week 5', score: 3 },
  { name: 'Week 6', score: 2 },
];

export default function AnalyticsChart() {
  const [records, setRecords] = useState<AnxietyRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('anxietyRecords');
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  const recentRecords = useMemo(() => {
    return [...records]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }, [records]);

  const todayCount = useMemo(() => {
    const today = new Date().toLocaleDateString();
    return records.filter((r) => r.date === today).length;
  }, [records]);

  return (
    <div className="space-y-6">
      {/* Completion Rate Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass3d bg-card rounded-xl border border-border p-6"
      >
        <h3 className="text-lg font-bold text-foreground mb-4">Weekly Completion Rate</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'var(--foreground)' }}
            />
            <Legend />
            <Bar dataKey="completed" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="total" fill="var(--accent)" radius={[8, 8, 0, 0]} opacity={0.5} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Anxiety Score Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass3d bg-card rounded-xl border border-border p-6"
      >
        <h3 className="text-lg font-bold text-foreground mb-4">Anxiety Level Improvement</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={anxietyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'var(--foreground)' }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="var(--destructive)"
              dot={{ fill: 'var(--destructive)' }}
              strokeWidth={3}
              name="Anxiety Score"
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground text-center mt-4">
          Lower scores indicate reduced anxiety. Keep using confirmations to build trust!
        </p>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-accent/10 rounded-xl border border-accent/30 p-4">
          <p className="text-sm text-muted-foreground mb-1">Best Day This Week</p>
          <p className="text-2xl font-bold text-accent">Wednesday</p>
          <p className="text-xs text-muted-foreground mt-2">100% completion rate</p>
        </div>
        <div className="bg-primary/10 rounded-xl border border-primary/30 p-4">
          <p className="text-sm text-muted-foreground mb-1">Rechecks Prevented</p>
          <p className="text-2xl font-bold text-primary">42</p>
          <p className="text-xs text-muted-foreground mt-2">This month</p>
        </div>
        <div className="bg-green-500/10 rounded-xl border border-green-500/30 p-4">
          <p className="text-sm text-muted-foreground mb-1">Anxiety Reduction</p>
          <p className="text-2xl font-bold text-green-600">62%</p>
          <p className="text-xs text-muted-foreground mt-2">Since you started</p>
        </div>
      </motion.div>

      {/* Recent Check-ins */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass3d bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Recent Check-ins</h3>
          <span className="text-sm text-muted-foreground">{todayCount} today</span>
        </div>
        {recentRecords.length === 0 ? (
          <p className="text-sm text-muted-foreground">No check-ins yet. Add one to see it here.</p>
        ) : (
          <div className="space-y-3">
            {recentRecords.map((record) => (
              <div key={record.id} className="flex items-start gap-3 rounded-lg border border-border/70 bg-secondary/30 p-3">
                <div className="mt-0.5 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {new Date(record.timestamp).toLocaleString()}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{record.level}/10</span>
                  </div>
                  {record.triggers.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {record.triggers.slice(0, 3).map((trigger, idx) => (
                        <span
                          key={`${record.id}-${idx}`}
                          className="px-2 py-1 rounded text-xs bg-accent/20 border border-accent/30 text-foreground"
                        >
                          {trigger}
                        </span>
                      ))}
                    </div>
                  )}
                  {record.note && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {record.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
