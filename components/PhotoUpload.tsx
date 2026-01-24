'use client';

import React from "react"
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Check, X } from 'lucide-react';
import { usePhotos } from '@/hooks/usePhotos';

interface PhotoUploadProps {
  taskId: string;
  onPhotoAdded?: () => void;
}

export default function PhotoUpload({ taskId, onPhotoAdded }: PhotoUploadProps) {
  const { photos, addPhoto, deletePhoto } = usePhotos(taskId);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);



  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        await addPhoto(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsUploading(false);
        onPhotoAdded?.();
      } catch (error) {
        console.error('[v0] File upload error:', error);
        alert('Failed to upload photo');
        setIsUploading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* File Upload Button */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-primary bg-primary/5 text-primary font-semibold hover:bg-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Upload className="w-5 h-5" />
        {isUploading ? 'Uploading...' : 'Upload Photo'}
      </motion.button>

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <p className="text-xs font-medium text-muted-foreground">{photos.length} photo(s) saved</p>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative aspect-square rounded-lg overflow-hidden border border-border group"
                >
                  <img
                    src={photo.url || "/placeholder.svg"}
                    alt="Task proof"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deletePhoto(photo.id)}
                      className="p-2 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <div className="absolute bottom-1 right-1">
                    <Check className="w-4 h-4 text-accent" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
