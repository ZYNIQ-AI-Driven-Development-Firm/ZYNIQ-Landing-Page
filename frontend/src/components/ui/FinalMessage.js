import React from 'react';
import { motion } from 'framer-motion';

const FinalMessage = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-8 pointer-events-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="ui-panel pointer-events-auto text-center"
      >
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase mb-4">
          Transmission Complete
        </h1>
        <p className="text-base md:text-lg text-white/80">
          Your AI Strategy Debrief has been securely sent. Our command team will be in contact shortly. Welcome to the future.
        </p>
      </motion.div>
    </div>
  );
};

export default FinalMessage;