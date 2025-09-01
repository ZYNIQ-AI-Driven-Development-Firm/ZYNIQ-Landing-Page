import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CoreComponent = () => {
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
      {/* Inner Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.5, 8]} />
        <meshPhongMaterial
          color="#EA2323"
          emissive="#EA2323"
          emissiveIntensity={0.8}
          wireframe
        />
      </mesh>
      
      {/* Ring 1 */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.05, 16, 100]} />
        <meshPhongMaterial
          color="#EA2323"
          emissive="#EA2323"
          emissiveIntensity={0.8}
        />
      </mesh>
      
      {/* Ring 2 */}
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
};

export default CoreComponent;