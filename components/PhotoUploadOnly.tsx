'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Check, X } from 'lucide-react';
import { usePhotos } from '@/hooks/usePhotos';

interface PhotoUploadOnlyProps {
  taskId: string;
  onPhotoAdded?: () => void;
}

export default function PhotoUploadOnly({ taskId, onPhotoAdded }: PhotoUploadOnlyProps) {
  const { addPhoto } = usePhotos(taskId);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        await addPhoto(file);
        setUploadSuccess(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        setTimeout(() => {
          setUploadSuccess(false);
          onPhotoAdded?.();
        }, 1500);
      } catch (error) {
        console.error('[v0] File upload error:', error);
        alert('Failed to upload photo');
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {uploadSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-2 p-3 rounded-lg bg-accent/20 border border-accent text-accent font-medium"
        >
          <Check className="w-5 h-5" />
          Photo uploaded successfully!
        </motion.div>
      ) : (
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
      )}
    </div>
  );
}
