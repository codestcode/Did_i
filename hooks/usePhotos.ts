'use client';

import { useState, useCallback, useEffect } from 'react';
import { TaskPhoto } from '@/lib/types';
import { photoStorage, taskStorage } from '@/lib/services/storageService';

export function usePhotos(taskId: string) {
  const [photos, setPhotos] = useState<TaskPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load photos on mount or when taskId changes
  useEffect(() => {
    const loadedPhotos = photoStorage.getTaskPhotos(taskId);
    setPhotos(loadedPhotos);
  }, [taskId]);

  const addPhoto = useCallback(
    async (file: File): Promise<TaskPhoto | null> => {
      setIsLoading(true);
      try {
        // Convert file to base64
        const reader = new FileReader();
        const photoPromise = new Promise<TaskPhoto | null>((resolve) => {
          reader.onload = () => {
            const base64 = reader.result as string;
            const photo: TaskPhoto = {
              id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              taskId,
              url: base64,
              timestamp: Date.now(),
              size: file.size,
            };

            // Add to storage
            photoStorage.addPhoto(photo);

            // Update task with photo ID
            const task = taskStorage.getTask(taskId);
            if (task) {
              taskStorage.updateTask(taskId, {
                photoIds: [...task.photoIds, photo.id],
              });
            }

            // Update local state
            setPhotos((prev) => [...prev, photo]);
            resolve(photo);
          };
          reader.onerror = () => resolve(null);
        });

        reader.readAsDataURL(file);
        return photoPromise;
      } catch (error) {
        console.error('[v0] Failed to add photo:', error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [taskId]
  );

  const deletePhoto = useCallback(
    (photoId: string) => {
      photoStorage.deletePhoto(photoId, taskId);
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    },
    [taskId]
  );

  const captureFromCamera = useCallback(
    async (canvas: HTMLCanvasElement): Promise<TaskPhoto | null> => {
      try {
        return new Promise((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
              addPhoto(file).then(resolve);
            } else {
              resolve(null);
            }
          }, 'image/jpeg', 0.9);
        });
      } catch (error) {
        console.error('[v0] Failed to capture from camera:', error);
        return null;
      }
    },
    [addPhoto]
  );

  return {
    photos,
    isLoading,
    addPhoto,
    deletePhoto,
    captureFromCamera,
  };
}
