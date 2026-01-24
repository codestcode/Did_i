'use client';

import React from "react"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Task } from '@/lib/types';

interface TaskFormProps {
  task?: Task;
  isEditing?: boolean;
  onSubmit: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function TaskForm({ task, isEditing = false, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [category, setCategory] = useState(task?.category || 'General');
  const [requiresPhoto, setRequiresPhoto] = useState(task?.requiresPhoto || false);
  const [urgency, setUrgency] = useState<'high' | 'medium' | 'low'>(task?.urgency || 'medium');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = ['Security', 'Safety', 'Home', 'Office', 'Travel', 'General'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      requiresPhoto,
      photoIds: task?.photoIds || [],
      isArchived: task?.isArchived || false,
      urgency,
    };

    onSubmit(data);
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </h2>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-secondary rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Task Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Lock Front Door"
            className={`w-full px-4 py-2 rounded-lg bg-secondary/50 border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
              errors.title ? 'border-destructive' : 'border-border'
            }`}
          />
          {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details..."
            className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none h-24"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Urgency Level
          </label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setUrgency(level)}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  urgency === level
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Requires Photo */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
          <input
            type="checkbox"
            id="requiresPhoto"
            checked={requiresPhoto}
            onChange={(e) => setRequiresPhoto(e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
          <label htmlFor="requiresPhoto" className="flex-1 cursor-pointer">
            <p className="font-medium text-foreground">Require photo proof</p>
            <p className="text-xs text-muted-foreground">Task must have a photo before being confirmed</p>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors font-medium"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium hover:shadow-lg transition-shadow"
          >
            {isEditing ? 'Update Task' : 'Create Task'}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
