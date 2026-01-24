'use client';

import { motion } from 'framer-motion';
import { X, Upload, Camera } from 'lucide-react';
import { TaskPhoto } from '@/lib/types';
import { usePhotos } from '@/hooks/usePhotos';
import { useState } from 'react';

interface PhotoGridProps {
  taskId: string;
  photos: TaskPhoto[];
}

export default function PhotoGrid({ taskId, photos }: PhotoGridProps) {
  const { deletePhoto } = usePhotos(taskId);
  const [selectedPhoto, setSelectedPhoto] = useState<TaskPhoto | null>(null);

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-foreground uppercase">Photos ({photos.length})</p>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative group"
          >
            <img
              src={photo.url || "/placeholder.svg"}
              alt="Task photo"
              className="w-full h-24 object-cover rounded-lg border border-border cursor-pointer hover:border-primary transition-colors"
              onClick={() => setSelectedPhoto(photo)}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => deletePhoto(photo.id)}
              className="absolute top-1 right-1 p-1 bg-destructive rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete photo"
            >
              <X className="w-3 h-3 text-white" />
            </motion.button>
            <div className="absolute inset-0 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-xs text-white font-medium">
                {new Date(photo.timestamp).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full photo modal */}
      {selectedPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full"
          >
            <img
              src={selectedPhoto.url || "/placeholder.svg"}
              alt="Full size"
              className="w-full rounded-lg"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
