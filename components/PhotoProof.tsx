'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Trash2, Check, X } from 'lucide-react';

interface PhotoProofProps {
  onPhotoCapture?: (photoData: string) => void;
  initialPhoto?: string;
}

export default function PhotoProof({ onPhotoCapture, initialPhoto }: PhotoProofProps) {
  const [photo, setPhoto] = useState<string | null>(initialPhoto || null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.log('[v0] Camera error:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const photoData = canvasRef.current.toDataURL('image/jpeg');
        setPhoto(photoData);
        onPhotoCapture?.(photoData);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const clearPhoto = () => {
    setPhoto(null);
    onPhotoCapture?.('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Camera className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Photo Proof</h3>
      </div>

      <AnimatePresence mode="wait">
        {!photo && !isCameraActive && (
          <motion.button
            key="camera-button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startCamera}
            className="w-full py-6 rounded-lg border-2 border-dashed border-primary/30 hover:border-primary text-foreground transition-colors bg-primary/5"
          >
            <Camera className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Take a Photo</p>
            <p className="text-xs text-muted-foreground">Click to open camera</p>
          </motion.button>
        )}

        {isCameraActive && (
          <motion.div
            key="camera-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-4 border-primary/30 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera className="w-12 h-12 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Frame your check</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stopCamera}
                className="flex-1 py-3 rounded-lg bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors"
              >
                <X className="w-5 h-5 inline mr-2" />
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={capturePhoto}
                className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                <Camera className="w-5 h-5 inline mr-2" />
                Capture
              </motion.button>
            </div>
          </motion.div>
        )}

        {photo && !isCameraActive && (
          <motion.div
            key="photo-preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-3"
          >
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <img src={photo || "/placeholder.svg"} alt="Captured proof" className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" />
                Captured
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearPhoto}
                className="flex-1 py-3 rounded-lg bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors"
              >
                <Trash2 className="w-5 h-5 inline mr-2" />
                Retake
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors"
              >
                <Check className="w-5 h-5 inline mr-2" />
                Confirm
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
