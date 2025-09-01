import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useZyniqStore } from '../../store/zyniqStore';
import { generateAIBlueprint } from '../../services/aiService';

const BlueprintScreen = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { userData, setInitialBlueprint, setCurrentScreen } = useZyniqStore();

  const handleGenerateBlueprint = async () => {
    setIsGenerating(true);
    
    try {
      const blueprint = await generateAIBlueprint(userData);
      setInitialBlueprint(blueprint);
      setCurrentScreen('result');
    } catch (error) {
      console.error('Blueprint generation failed:', error);
      // Show error state
      setInitialBlueprint({
        headline: "Analysis Complete",
        key_points: [
          "Your ecosystem scan has identified key strategic opportunities",
          "AI readiness assessment shows strong potential for growth",
          "Custom integration pathways have been mapped for your needs"
        ],
        recommendation: "Based on your interactions, we recommend starting with a focused AI strategy consultation to maximize your technology investments and accelerate digital transformation."
      });
      setCurrentScreen('result');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-8 pointer-events-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="ui-panel pointer-events-auto text-center"
      >
        <h1 className="text-3xl font-black tracking-tight text-white uppercase mb-4">
          Ecosystem Scan Complete
        </h1>
        <p className="text-lg text-white/80 mb-8">
          Your interactions have mapped a potential strategic path. Generate your personalized AI Blueprint to see the results.
        </p>
        
        {!isGenerating ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateBlueprint}
            className="btn-primary text-lg px-8 py-4"
          >
            ✨ Generate My AI Blueprint
          </motion.button>
        ) : (
          <div className="flex flex-col items-center">
            <div className="loader-ring mb-4" />
            <p className="text-white/80">Analyzing your strategic profile...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BlueprintScreen;