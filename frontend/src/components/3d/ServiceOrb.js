import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useZyniqStore } from '../../store/zyniqStore';

const ServiceOrb = ({ orbData }) => {
  const orbRef = useRef();
  const shellRef = useRef();
  const coreRef = useRef();
  const satellitesRef = useRef([]);
  const [hovered, setHovered] = useState(false);
  
  const { camera } = useThree();
  const { 
    exploredOrbs, 
    hoveredOrb, 
    setHoveredOrb, 
    setSelectedOrb, 
    setCurrentScreen,
    setIsExploring,
    playSound 
  } = useZyniqStore();
  
  const isExplored = exploredOrbs.has(orbData.id);
  const isHovered = hoveredOrb?.id === orbData.id;
  const bobOffset = useRef(Math.random() * Math.PI * 2);
  const satelliteAngles = useRef([0, Math.PI * 2/3, Math.PI * 4/3]);

  useFrame((state, delta) => {
    if (!orbRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Bobbing animation
    orbRef.current.position.y = orbData.position[1] + Math.sin(time + bobOffset.current) * 0.5;
    
    // Shell rotation
    if (shellRef.current) {
      shellRef.current.rotation.y += delta * 0.1;
    }
    
    // Core rotation
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.2;
    }
    
    // Satellite rotation
    const hoverSpeedMultiplier = isHovered ? 3 : 1;
    satelliteAngles.current.forEach((angle, index) => {
      satelliteAngles.current[index] += delta * 0.5 * hoverSpeedMultiplier;
      if (satellitesRef.current[index]) {
        const radius = 2.2;
        satellitesRef.current[index].position.x = Math.cos(satelliteAngles.current[index]) * radius;
        satellitesRef.current[index].position.z = Math.sin(satelliteAngles.current[index]) * radius;
      }
    });
  });

  const handlePointerEnter = (e) => {
    e.stopPropagation();
    if (!isExplored) {
      setHovered(true);
      setHoveredOrb(orbData);
      document.body.style.cursor = 'pointer';
      playSound('hover');
    }
  };

  const handlePointerLeave = (e) => {
    e.stopPropagation();
    setHovered(false);
    setHoveredOrb(null);
    document.body.style.cursor = 'grab';
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isExplored) {
      setSelectedOrb(orbData);
      setCurrentScreen('orb');
      setIsExploring(true);
      
      // Camera transition to orb
      const targetPosition = new THREE.Vector3(...orbData.position).add(new THREE.Vector3(0, 0, 7));
      // Note: Camera transitions would be handled by the parent component
    }
  };

  const orbColor = isExplored ? '#00ff00' : '#EA2323';
  const emissiveIntensity = isExplored ? 0.5 : 0.7;

  return (
    <group ref={orbRef} position={orbData.position}>
      {/* Crystalline Shell */}
      <mesh 
        ref={shellRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <dodecahedronGeometry args={[1.8, 0]} />
        <meshPhongMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.2}
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* Energy Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhongMaterial
          color={orbColor}
          emissive={orbColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      
      {/* Satellite Particles */}
      {[0, 1, 2].map((index) => {
        const angle = (index / 3) * Math.PI * 2;
        const radius = 2.2;
        return (
          <mesh
            key={index}
            ref={(el) => satellitesRef.current[index] = el}
            position={[
              Math.cos(angle) * radius,
              Math.sin(Math.random() - 0.5) * 0.5,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshPhongMaterial
              color={orbColor}
              emissive={orbColor}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        );
      })}
      
      {/* Label */}
      {!isExplored && (
        <Html
          position={[0, 2.8, 0]}
          center
          distanceFactor={15}
          occlude
        >
          <div className="text-white text-sm bg-black/60 px-2 py-1 rounded backdrop-blur-sm pointer-events-none whitespace-nowrap">
            {orbData.name}
          </div>
        </Html>
      )}
    </group>
  );
};

export default ServiceOrb;