'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Archive, Copy, Trash2, RotateCcw, Camera, Zap, ChevronDown } from 'lucide-react';
import { Task } from '@/lib/types';
import { usePhotos } from '@/hooks/usePhotos';
import PhotoGrid from './PhotoGrid';
import PhotoUpload from './PhotoUpload';

interface TaskCardProps {
  task: Task;
  isArchived?: boolean;
  onEdit: () => void;
  onArchive?: () => void;
  onRestore?: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function TaskCard({
  task,
  isArchived = false,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
  onDuplicate,
}: TaskCardProps) {
  const { photos } = usePhotos(task.id);
  const [isPhotoExpanded, setIsPhotoExpanded] = useState(false);

  const urgencyColors = {
    high: 'text-destructive',
    medium: 'text-yellow-500',
    low: 'text-green-600',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-xl border p-4 transition-all ${
        isArchived
          ? 'bg-muted/30 border-muted opacity-60 hover:opacity-100'
          : 'bg-card border-border hover:border-primary/50 hover:shadow-md'
      }`}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-lg ${isArchived ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2 py-1 bg-secondary rounded-full text-foreground">
                {task.category}
              </span>
              <span className={`text-xs font-semibold ${urgencyColors[task.urgency]}`}>
                {task.urgency.toUpperCase()}
              </span>
              {task.requiresPhoto && (
                <div className="flex items-center gap-1 text-xs text-primary">
                  <Camera className="w-3 h-3" />
                  Photo required
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {!isArchived && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onEdit}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onDuplicate}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onArchive}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  title="Archive"
                >
                  <Archive className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </motion.button>
              </>
            )}
            {isArchived && onRestore && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRestore}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                title="Restore"
              >
                <RotateCcw className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDelete}
              className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
            </motion.button>
          </div>
        </div>

        {/* Photo Section */}
        {!isArchived && (
          <motion.div
            initial={false}
            animate={{ height: isPhotoExpanded ? 'auto' : 'auto' }}
            className="space-y-3 border-t border-border pt-3"
          >
            {/* Photo Upload Toggle */}
            <motion.button
              onClick={() => setIsPhotoExpanded(!isPhotoExpanded)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">
                  {photos.length === 0 ? 'Add Photo' : `${photos.length} photo(s) saved`}
                </span>
              </div>
              <motion.div
                animate={{ rotate: isPhotoExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>

            {/* Photo Upload Component */}
            {isPhotoExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <PhotoUpload taskId={task.id} onPhotoAdded={() => setIsPhotoExpanded(false)} />
              </motion.div>
            )}

            {/* Photo Grid */}
            {photos.length > 0 && (
              <PhotoGrid taskId={task.id} photos={photos} />
            )}
          </motion.div>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground pt-2 border-t border-border">
          <div className="flex justify-between">
            <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
            {task.requiresPhoto && photos.length === 0 && (
              <span className="text-destructive font-semibold">Missing photo proof</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
