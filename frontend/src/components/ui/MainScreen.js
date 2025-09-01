import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useZyniqStore } from '../../store/zyniqStore';

const MainScreen = () => {
  const { progress, exploredOrbs, setCurrentScreen } = useZyniqStore();
  const MIN_ORBS_FOR_BLUEPRINT = 3;

  useEffect(() => {
    if (exploredOrbs.size >= MIN_ORBS_FOR_BLUEPRINT) {
      setTimeout(() => setCurrentScreen('blueprint'), 1000);
    }
  }, [exploredOrbs.size, setCurrentScreen]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col justify-end p-8"
    >
      {/* Interaction Prompt */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full text-center mb-4"
      >
        <p className="text-white/70 text-lg animate-pulse">
          Click and drag to explore. Select an orb to begin.
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="w-full flex justify-center mb-8"
      >
        <div className="progress-container">
          <div 
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MainScreen;