'use client';

import { motion } from 'framer-motion';
import { Home, Briefcase, Lock, Zap, Plus } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  icon: any;
  color: string;
  items: string[];
}

interface ChecklistTemplatesProps {
  onSelectTemplate: (items: string[]) => void;
}

export default function ChecklistTemplates({ onSelectTemplate }: ChecklistTemplatesProps) {
  const templates: Template[] = [
    {
      id: 'leaving-home',
      name: 'Leaving Home',
      icon: Home,
      color: 'from-blue-500 to-cyan-500',
      items: [
        'Locked front door',
        'Turned off lights',
        'Locked back door',
        'Turned off stove',
        'Windows closed',
        'Car locked',
      ]
    },
    {
      id: 'office-leaving',
      name: 'Leaving Office',
      icon: Briefcase,
      color: 'from-purple-500 to-pink-500',
      items: [
        'Computer turned off',
        'Desk locked',
        'Sensitive documents secured',
        'Lights turned off',
        'Door locked',
      ]
    },
    {
      id: 'security-check',
      name: 'Security Check',
      icon: Lock,
      color: 'from-red-500 to-orange-500',
      items: [
        'All doors locked',
        'Windows closed',
        'Alarm activated',
        'Lights off',
        'Valuables secured',
      ]
    },
    {
      id: 'utilities',
      name: 'Utilities',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      items: [
        'Stove turned off',
        'Oven turned off',
        'Lights turned off',
        'Appliances unplugged',
        'Water faucets closed',
      ]
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Templates</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <motion.button
              key={template.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectTemplate(template.items)}
              className="relative overflow-hidden rounded-xl p-4 border border-border bg-card hover:border-primary/50 transition-all group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="relative z-10">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-foreground text-left mb-2">{template.name}</h4>
                <p className="text-xs text-muted-foreground text-left">
                  {template.items.length} items
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
