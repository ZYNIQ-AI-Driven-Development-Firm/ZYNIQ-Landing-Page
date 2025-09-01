import React from 'react';
import { motion } from 'framer-motion';
import { useZyniqStore } from '../../store/zyniqStore';

const OrbScreen = () => {
  const { 
    selectedOrb, 
    addUserData, 
    addExploredOrb, 
    setCurrentScreen,
    setIsExploring,
    playSound 
  } = useZyniqStore();

  const handleChoice = (choice) => {
    if (!selectedOrb) return;
    
    addUserData(selectedOrb.dataPoint, choice);
    addExploredOrb(selectedOrb.id);
    playSound('connect');
    
    setIsExploring(false);
    setCurrentScreen('main');
  };

  if (!selectedOrb) return null;

  return (
    <div className="w-full h-full flex items-center justify-center p-8 pointer-events-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="ui-panel pointer-events-auto max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          {selectedOrb.name}
        </h2>
        <p className="text-white/80 text-center mb-6">
          {selectedOrb.description}
        </p>
        
        <div className="space-y-3">
          {selectedOrb.choices.map((choice, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChoice(choice)}
              className="orb-choice"
            >
              {choice}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default OrbScreen;