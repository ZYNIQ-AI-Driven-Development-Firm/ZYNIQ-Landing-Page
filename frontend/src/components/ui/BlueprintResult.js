import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useZyniqStore } from '../../store/zyniqStore';
import { refineBlueprint, submitContactForm } from '../../services/apiService';

const BlueprintResult = () => {
  const { initialBlueprint, setCurrentScreen } = useZyniqStore();
  const [refinementQuery, setRefinementQuery] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [refinements, setRefinements] = useState([]);
  const [contactForm, setContactForm] = useState({
    name: '',
    company: '',
    email: ''
  });

  const handleRefinement = async () => {
    if (!refinementQuery.trim()) return;
    
    setIsRefining(true);
    try {
      const refinement = await refineBlueprint(refinementQuery, initialBlueprint);
      setRefinements(prev => [...prev, { question: refinementQuery, answer: refinement.refinement_text }]);
      setRefinementQuery('');
    } catch (error) {
      console.error('Refinement failed:', error);
      setRefinements(prev => [...prev, { 
        question: refinementQuery, 
        answer: "I'm unable to process that refinement right now. Please try a different question." 
      }]);
    } finally {
      setIsRefining(false);
    }
  };

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    try {
      await submitContactForm(contactForm, initialBlueprint);
      setCurrentScreen('final');
    } catch (error) {
      console.error('Contact submission failed:', error);
      setCurrentScreen('final'); // Still proceed to final screen
    }
  };

  if (!initialBlueprint) return null;

  return (
    <div className="w-full h-full flex items-center justify-center p-8 pointer-events-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="ui-panel pointer-events-auto max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        <h1 className="text-2xl font-black tracking-tight text-center text-white uppercase mb-6">
          {initialBlueprint.headline}
        </h1>
        
        <div className="blueprint-content text-left mb-6">
          <ul className="blueprint-points">
            {initialBlueprint.key_points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
          <p className="mt-4 text-white/80">{initialBlueprint.recommendation}</p>
          
          {/* Display refinements */}
          {refinements.map((refinement, index) => (
            <div key={index} className="mt-4 pt-4 border-t border-red-500/30">
              <p className="text-sm text-white/60 mb-2">Q: {refinement.question}</p>
              <p className="text-white/80">{refinement.answer}</p>
            </div>
          ))}
        </div>

        {/* Refinement Section */}
        <div className="mb-6">
          <p className="text-center text-lg text-white/80 mb-2">Want to dive deeper?</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={refinementQuery}
              onChange={(e) => setRefinementQuery(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && handleRefinement()}
              placeholder="Ask a follow-up question..."
              className="form-input flex-1"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRefinement}
              disabled={isRefining}
              className="btn-primary px-6"
            >
              {isRefining ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Refine'}
            </motion.button>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <p className="text-center text-lg text-white/80 mb-4">
            Establish a secure comms link to receive the full debrief.
          </p>
          <form onSubmit={handleSubmitContact} className="space-y-4">
            <input
              type="text"
              placeholder="Commander Identification (Name)"
              value={contactForm.name}
              onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
              required
              className="form-input"
            />
            <input
              type="text"
              placeholder="Organization Registry (Company)"
              value={contactForm.company}
              onChange={(e) => setContactForm(prev => ({ ...prev, company: e.target.value }))}
              required
              className="form-input"
            />
            <input
              type="email"
              placeholder="Secure Communication Channel (Email)"
              value={contactForm.email}
              onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
              required
              className="form-input"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary"
            >
              Transmit Securely
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default BlueprintResult;