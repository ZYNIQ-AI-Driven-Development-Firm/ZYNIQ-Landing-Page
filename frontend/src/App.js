import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import CoreComponent from './components/3d/CoreComponent';
import ServiceOrb from './components/3d/ServiceOrb';
import ParticleField from './components/3d/ParticleField';
import UIOverlay from './components/ui/UIOverlay';
import { useZyniqStore } from './store/zyniqStore';
import AudioManager from './components/audio/AudioManager';

// Ecosystem Data
const ecosystemOrbs = [
  { 
    id: 'aiStrategy', 
    name: 'AI Strategy & Consulting', 
    description: 'We assess AI readiness, identify high-impact opportunities, and create ethical, results-driven AI strategies that deliver measurable growth.',
    position: [12, 5, 0], 
    dataPoint: 'AI Readiness', 
    choices: ['We\'re just starting to explore AI', 'We have existing AI initiatives'] 
  },
  { 
    id: 'customSolutions', 
    name: 'Custom AI Solutions', 
    description: 'From predictive analytics to personalized recommendation engines, we craft AI models from scratch to solve your most complex challenges.',
    position: [-10, -8, 5], 
    dataPoint: 'Investment Capacity', 
    choices: ['Focused pilot project', 'Large-scale enterprise solution'] 
  },
  { 
    id: 'automation', 
    name: 'Intelligent Automation', 
    description: 'Our AI-powered automation frees your team for strategic work, reducing costs while increasing speed and accuracy.',
    position: [8, -10, -8], 
    dataPoint: 'Primary Goal', 
    choices: ['Optimize existing processes', 'Innovate with new capabilities'] 
  },
  { 
    id: 'dataAnalytics', 
    name: 'Advanced Data Analytics', 
    description: 'We uncover hidden patterns, predict outcomes, and build interactive dashboards for smarter, faster decisions.',
    position: [-15, 2, -10], 
    dataPoint: 'Data Maturity', 
    choices: ['Consolidating data sources', 'Seeking predictive insights'] 
  },
  { 
    id: 'web3', 
    name: 'Web3 & Blockchain', 
    description: 'From dApps to NFT marketplaces, we bring Web3 to life with security, transparency, and creativity.',
    position: [0, 15, -5], 
    dataPoint: 'Web3 Interest', 
    choices: ['Exploring Web3 potential', 'Ready to build a dApp'] 
  },
];

function Scene() {
  const controlsRef = useRef();
  const { isExploring, exploredOrbs } = useZyniqStore();

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#EA2323" />
      
      <CoreComponent />
      
      {ecosystemOrbs.map((orbData) => (
        <ServiceOrb key={orbData.id} orbData={orbData} />
      ))}
      
      <ParticleField />
      
      <OrbitControls
        ref={controlsRef}
        enableDamping
        enablePan={false}
        enableZoom={false}
        minDistance={20}
        maxDistance={50}
        autoRotate={!isExploring}
        autoRotateSpeed={0.2}
      />
      
      <EffectComposer>
        <Bloom intensity={1.0} luminanceThreshold={0.4} luminanceSmoothing={0.85} />
      </EffectComposer>
    </>
  );
}

function Loading() {
  return (
    <Html center>
      <div className="loader">
        <div className="loader-ring"></div>
        <p className="text-white mt-4">Loading ZYNIQ Ecosystem...</p>
      </div>
    </Html>
  );
}

function App() {
  const { initializeAudio } = useZyniqStore();

  useEffect(() => {
    const handleFirstInteraction = () => {
      initializeAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
    
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [initializeAudio]);

  return (
    <div className="w-full h-screen bg-black overflow-hidden cursor-grab active:cursor-grabbing">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full p-4 z-20 glassmorphic">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-8">
            <a href="#" className="nav-link">About</a>
            <a href="#" className="nav-link">Services</a>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2">
            <img 
              src="https://customer-assets.emergentagent.com/job_9c5d2878-077e-44ec-850a-8dde2ab0a203/artifacts/ms6flt2o_ZYNIQ%20LOGO.svg" 
              alt="ZYNIQ" 
              className="h-8 w-auto filter invert" 
            />
          </div>
          <div className="flex space-x-8">
            <a href="#" className="nav-link">Careers</a>
            <a href="#" className="nav-link">Contact</a>
          </div>
        </div>
      </nav>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 35], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 0, 80]} />
        <Suspense fallback={<Loading />}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <UIOverlay ecosystemOrbs={ecosystemOrbs} />
      
      {/* Audio Manager */}
      <AudioManager />
    </div>
  );
}

export default App;