import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useZyniqStore } from '../../store/zyniqStore';
import MainScreen from './MainScreen';
import OrbScreen from './OrbScreen';
import BlueprintScreen from './BlueprintScreen';
import BlueprintResult from './BlueprintResult';
import FinalMessage from './FinalMessage';

const UIOverlay = ({ ecosystemOrbs }) => {
  const { currentScreen } = useZyniqStore();

  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      <AnimatePresence mode="wait">
        {currentScreen === 'main' && (
          <MainScreen key="main" />
        )}
        {currentScreen === 'orb' && (
          <OrbScreen key="orb" />
        )}
        {currentScreen === 'blueprint' && (
          <BlueprintScreen key="blueprint" />
        )}
        {currentScreen === 'result' && (
          <BlueprintResult key="result" />
        )}
        {currentScreen === 'final' && (
          <FinalMessage key="final" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UIOverlay;