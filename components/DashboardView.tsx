'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, TrendingUp, Calendar, Zap } from 'lucide-react';
import AnalyticsChart from './AnalyticsChart';

export default function DashboardView() {
  const stats = [
    { label: 'Total Checks', value: '127', icon: CheckCircle2, color: 'from-primary to-blue-500' },
    { label: 'This Week', value: '24', icon: Calendar, color: 'from-accent to-green-500' },
    { label: 'Anxiety Reduced', value: '89%', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
    { label: 'Rechecks Prevented', value: '45', icon: AlertCircle, color: 'from-orange-500 to-red-500' },
  ];

  const recentChecks = [
    { name: 'Locked Front Door', time: '2 hours ago', confirmed: true },
    { name: 'Turned Off Stove', time: '4 hours ago', confirmed: true },
    { name: 'Windows Closed', time: 'Today 3:45 PM', confirmed: true },
    { name: 'Car Parked', time: 'Yesterday 6:20 PM', confirmed: true },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="overflow-y-auto h-full p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
                  </div>
                  <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Checks */}
        <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Confirmations</h2>
          <div className="space-y-3">
            {recentChecks.map((check, index) => (
              <motion.div
                key={check.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
                  >
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                  </motion.div>
                  <div>
                    <p className="font-medium text-foreground">{check.name}</p>
                    <p className="text-sm text-muted-foreground">{check.time}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/20 text-accent">
                  Confirmed
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Analytics Section */}
        <motion.div variants={itemVariants}>
          <AnalyticsChart />
        </motion.div>

        {/* Tips Section */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Evidence-Based Tips</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <Zap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">Photo Proof:</span> Taking a photo creates a visual memory trace that your brain trusts more than mental recall.
              </p>
            </div>
            <div className="flex gap-3">
              <Zap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">Voice Confirmation:</span> Saying it aloud engages multiple senses and makes the memory stronger.
              </p>
            </div>
            <div className="flex gap-3">
              <Zap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">Consistency:</span> The more consistently you confirm, the more your anxiety naturally decreases over time.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
