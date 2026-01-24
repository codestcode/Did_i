'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Trash2, Check } from 'lucide-react';

interface VoiceConfirmationProps {
  itemName: string;
  onVoiceCapture?: (audioData: Blob) => void;
  hasRecording?: boolean;
}

export default function VoiceConfirmation({ itemName, onVoiceCapture, hasRecording = false }: VoiceConfirmationProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasAudio, setHasAudio] = useState(hasRecording);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setHasAudio(true);
        onVoiceCapture?.(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.log('[v0] Microphone error:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    setHasAudio(false);
    setAudioUrl('');
    onVoiceCapture?.(new Blob());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Mic className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Voice Confirmation</h3>
      </div>

      <AnimatePresence mode="wait">
        {!isRecording && !hasAudio && (
          <motion.button
            key="mic-button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRecording}
            className="w-full py-6 rounded-lg border-2 border-dashed border-primary/30 hover:border-primary text-foreground transition-colors bg-primary/5"
          >
            <Mic className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Record Voice Confirmation</p>
            <p className="text-xs text-muted-foreground">Say: "I have {itemName.toLowerCase()}"</p>
          </motion.button>
        )}

        {isRecording && (
          <motion.div
            key="recording"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-4"
          >
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-6 text-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3"
              >
                <Mic className="w-6 h-6 text-accent-foreground" />
              </motion.div>
              <p className="font-semibold text-foreground mb-1">Recording...</p>
              <p className="text-sm text-muted-foreground">Say it clearly and confidently</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopRecording}
              className="w-full py-3 rounded-lg bg-destructive text-white font-semibold hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2"
            >
              <Square className="w-5 h-5" />
              Stop Recording
            </motion.button>
          </motion.div>
        )}

        {hasAudio && !isRecording && (
          <motion.div
            key="playback"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-3"
          >
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
                >
                  <Play className="w-5 h-5" />
                </motion.button>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Your confirmation recorded</p>
                  <p className="text-xs text-muted-foreground">Click play to listen</p>
                </div>
                <Check className="w-5 h-5 text-accent" />
              </div>
              <audio ref={audioRef} src={audioUrl} />
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={deleteRecording}
                className="flex-1 py-3 rounded-lg bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors"
              >
                <Trash2 className="w-5 h-5 inline mr-2" />
                Re-record
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
    </div>
  );
}
