'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiAlertFill } from 'react-icons/ri';

interface ProactiveAlertProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export const ProactiveAlert: React.FC<ProactiveAlertProps> = ({ show, message, onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          className="fixed bottom-32 right-10 z-50 w-80 glass-card p-6 bg-red-500/10 border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)]"
        >
          <div className="flex items-start gap-4">
            <div className="bg-red-500 p-2 rounded-lg">
              <RiAlertFill className="text-white text-xl" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">
                Proactive Warning
              </div>
              <p className="text-sm text-white leading-relaxed font-medium">
                {message}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all"
          >
            Acknowledge & Dismiss
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
