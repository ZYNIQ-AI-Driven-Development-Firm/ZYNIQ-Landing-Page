import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import './App.css';
import * as THREE from 'three';

// Simple 3D Core Component
function CoreComponent() {
  const coreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.2;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.5, 8]} />
        <meshPhongMaterial
          color="#EA2323"
          emissive="#EA2323"
          emissiveIntensity={0.8}
          wireframe
        />
      </mesh>
      
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.05, 16, 100]} />
        <meshPhongMaterial
          color="#EA2323"
          emissive="#EA2323"
          emissiveIntensity={0.8}
        />
      </mesh>
      
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <torusGeometry args={[3.5, 0.05, 16, 100]} />
        <meshPhongMaterial
          color="#EA2323"
          emissive="#EA2323"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

// Simple Service Orb Component
function ServiceOrb({ position, color = "#EA2323", name }) {
  const orbRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (orbRef.current) {
      orbRef.current.rotation.y += delta * 0.5;
      orbRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2) * 0.3;
    }
  });

  return (
    <group position={position}>
      <mesh 
        ref={orbRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <dodecahedronGeometry args={[1.2, 0]} />
        <meshPhongMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          wireframe={true}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshPhongMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.9}
        />
      </mesh>

      <Html position={[0, 2, 0]} center distanceFactor={15}>
        <div className="text-white text-sm bg-black/60 px-2 py-1 rounded backdrop-blur-sm pointer-events-none whitespace-nowrap">
          {name}
        </div>
      </Html>
    </group>
  );
}

// Particle Field
function ParticleField() {
  const particlesRef = useRef();
  
  const particlePositions = React.useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.005;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={5000}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#333333"
        size={0.1}
        transparent
        opacity={0.6}
      />
    </points>
  );
}

// 3D Scene Component
function Scene() {
  const ecosystemOrbs = [
    { id: 'ai', name: 'AI Strategy', position: [8, 3, 0], color: '#EA2323' },
    { id: 'custom', name: 'Custom Solutions', position: [-6, -4, 3], color: '#00FF88' },
    { id: 'automation', name: 'Automation', position: [4, -6, -4], color: '#FF6B35' },
    { id: 'analytics', name: 'Analytics', position: [-8, 1, -6], color: '#4ECDC4' },
    { id: 'web3', name: 'Web3 & Blockchain', position: [0, 8, -3], color: '#FFE66D' },
  ];

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#EA2323" />
      
      <CoreComponent />
      
      {ecosystemOrbs.map((orb) => (
        <ServiceOrb key={orb.id} {...orb} />
      ))}
      
      <ParticleField />
      
      <OrbitControls
        enableDamping
        enablePan={false}
        enableZoom={false}
        minDistance={15}
        maxDistance={40}
        autoRotate={true}
        autoRotateSpeed={0.3}
      />
    </>
  );
}

// Loading Component
function Loading() {
  return (
    <Html center>
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white">Loading ZYNIQ Ecosystem...</p>
      </div>
    </Html>
  );
}

// Main App Component
function App() {
  return (
    <div className="w-full h-screen bg-black overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full p-4 z-20 bg-black/40 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-8">
            <a href="#" className="text-white/80 hover:text-white transition-colors">About</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">Services</a>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">ZYNIQ</h1>
          </div>
          <div className="flex space-x-8">
            <a href="#" className="text-white/80 hover:text-white transition-colors">Careers</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 25], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 0, 60]} />
        <Suspense fallback={<Loading />}>
          <Scene />
        </Suspense>
        
        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.1} luminanceSmoothing={0.9} />
        </EffectComposer>
      </Canvas>

      {/* UI Overlay */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10 text-center">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-white/20 max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">AI Compatibility Assessment</h2>
          <p className="text-white/80 text-sm mb-4">
            Explore our interactive ecosystem. Click and drag to navigate the 3D space.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50">
            Start Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;