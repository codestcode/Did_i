'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ChevronRight } from 'lucide-react';
import PhotoProof from './PhotoProof';
import PhotoUploadOnly from './PhotoUploadOnly';
import VoiceConfirmation from './VoiceConfirmation';

interface ConfirmationModalProps {
  itemId?: string;
  itemName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  requirePhoto?: boolean;
  requireVoice?: boolean;
}

export default function ConfirmationModal({
  itemId,
  itemName,
  isOpen,
  onClose,
  onConfirm,
  requirePhoto = false,
  requireVoice = false,
}: ConfirmationModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [hasVoice, setHasVoice] = useState(false);

  const steps = [
    { label: 'Confirm', required: true },
    ...(requirePhoto ? [{ label: 'Photo', required: true }] : []),
    ...(requireVoice ? [{ label: 'Voice', required: true }] : []),
  ];

  const resolvedPhotoTaskId = itemId?.startsWith('task:')
    ? itemId.replace('task:', '')
    : `leaving-home-${itemId || itemName}`;

  const canProgress = () => {
    if (currentStep === 0) return true; // Confirm step always available
    if (currentStep === 1 && requirePhoto) return hasPhoto;
    if (currentStep === steps.length - 1 && requireVoice) return hasVoice;
    return true;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onConfirm();
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setHasPhoto(false);
    setHasVoice(false);
    onClose();
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClose}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl shadow-2xl max-w-md w-full border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-6 text-primary-foreground">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Confirm Action</h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-primary-foreground/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm font-medium opacity-90">
                Confirming: <span className="font-bold">{itemName}</span>
              </p>
            </div>

            {/* Progress Steps */}
            {steps.length > 1 && (
              <div className="px-6 pt-4 pb-2">
                <div className="flex gap-2">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      className={`flex-1 h-1 rounded-full transition-colors ${
                        index <= currentStep ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6 space-y-6">
              {currentStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-6 text-center">
                    <Check className="w-12 h-12 text-accent mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-foreground mb-2">Ready to Confirm?</h3>
                    <p className="text-sm text-muted-foreground">
                      You're about to confirm: <span className="font-semibold text-foreground">{itemName}</span>
                    </p>
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && requirePhoto && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Upload Photo Proof</h3>
                    <PhotoUploadOnly 
                      taskId={resolvedPhotoTaskId} 
                      onPhotoAdded={() => setHasPhoto(true)}
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && requireVoice && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <VoiceConfirmation
                    itemName={itemName}
                    onVoiceCapture={(data) => setHasVoice(!!data.size)}
                  />
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-secondary/30 border-t border-border px-6 py-4 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="flex-1 py-3 rounded-lg bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                disabled={!canProgress()}
                className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                  canProgress()
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <Check className="w-5 h-5" />
                    Confirm
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
