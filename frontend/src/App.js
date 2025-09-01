import React, { useRef, useEffect } from 'react';
import './App.css';
import * as THREE from 'three';

function App() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Hide loading screen after a delay
    setTimeout(() => {
      const loading = document.getElementById('loading');
      if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => {
          loading.style.display = 'none';
        }, 500);
      }
    }, 2000);

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 0, 60);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 25);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xEA2323, 2, 100);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Core Component
    const coreGroup = new THREE.Group();
    
    // Inner core
    const coreGeometry = new THREE.IcosahedronGeometry(1.5, 8);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: 0xEA2323,
      emissive: 0xEA2323,
      emissiveIntensity: 0.8,
      wireframe: true
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    coreGroup.add(core);

    // Ring 1
    const ring1Geometry = new THREE.TorusGeometry(3, 0.05, 16, 100);
    const ring1Material = new THREE.MeshPhongMaterial({
      color: 0xEA2323,
      emissive: 0xEA2323,
      emissiveIntensity: 0.8
    });
    const ring1 = new THREE.Mesh(ring1Geometry, ring1Material);
    ring1.rotation.x = Math.PI / 2;
    coreGroup.add(ring1);

    // Ring 2
    const ring2Geometry = new THREE.TorusGeometry(3.5, 0.05, 16, 100);
    const ring2Material = new THREE.MeshPhongMaterial({
      color: 0xEA2323,
      emissive: 0xEA2323,
      emissiveIntensity: 0.8
    });
    const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2.rotation.x = Math.PI / 2;
    ring2.rotation.y = Math.PI / 4;
    coreGroup.add(ring2);

    scene.add(coreGroup);

    // Service Orbs
    const orbData = [
      { name: 'AI Strategy', position: [8, 3, 0], color: 0xEA2323 },
      { name: 'Custom Solutions', position: [-6, -4, 3], color: 0x00FF88 },
      { name: 'Automation', position: [4, -6, -4], color: 0xFF6B35 },
      { name: 'Analytics', position: [-8, 1, -6], color: 0x4ECDC4 },
      { name: 'Web3 & Blockchain', position: [0, 8, -3], color: 0xFFE66D }
    ];

    const orbs = [];
    orbData.forEach((data, index) => {
      const orbGroup = new THREE.Group();
      orbGroup.position.set(...data.position);
      
      // Shell
      const shellGeometry = new THREE.DodecahedronGeometry(1.2, 0);
      const shellMaterial = new THREE.MeshPhongMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.4,
        wireframe: true,
        transparent: true,
        opacity: 0.8
      });
      const shell = new THREE.Mesh(shellGeometry, shellMaterial);
      orbGroup.add(shell);
      
      // Core
      const orbCoreGeometry = new THREE.SphereGeometry(0.4, 16, 16);
      const orbCoreMaterial = new THREE.MeshPhongMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.9
      });
      const orbCore = new THREE.Mesh(orbCoreGeometry, orbCoreMaterial);
      orbGroup.add(orbCore);
      
      scene.add(orbGroup);
      orbs.push({ group: orbGroup, shell, core: orbCore, originalY: data.position[1] });
    });

    // Particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x333333,
      size: 0.1,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse controls
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    
    const handleMouseMove = (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) / 500;
      mouseY = (event.clientY - window.innerHeight / 2) / 500;
      targetRotationX = mouseY * 0.5;
      targetRotationY = mouseX * 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      
      // Animate core
      core.rotation.y += delta * 0.2;
      ring1.rotation.z += delta * 0.1;
      ring2.rotation.z -= delta * 0.15;
      
      // Animate orbs
      orbs.forEach((orb, index) => {
        orb.shell.rotation.y += delta * 0.5;
        orb.group.position.y = orb.originalY + Math.sin(elapsedTime * 2 + index) * 0.3;
      });
      
      // Animate particles
      particles.rotation.y += delta * 0.005;
      
      // Mouse interaction
      scene.rotation.x += (targetRotationX - scene.rotation.x) * 0.05;
      scene.rotation.y += (targetRotationY - scene.rotation.y) * 0.05;
      
      // Auto rotation when not interacting
      if (Math.abs(mouseX) < 0.01 && Math.abs(mouseY) < 0.01) {
        scene.rotation.y += delta * 0.1;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full p-4 z-20 bg-black bg-opacity-40 backdrop-blur-sm border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-8">
            <a href="#" className="nav-link">About</a>
            <a href="#" className="nav-link">Services</a>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">ZYNIQ</h1>
          </div>
          <div className="flex space-x-8">
            <a href="#" className="nav-link">Careers</a>
            <a href="#" className="nav-link">Contact</a>
          </div>
        </div>
      </nav>

      {/* 3D Canvas Container */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* UI Overlay */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-center">
        <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-20 max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">AI Compatibility Assessment</h2>
          <p className="text-white text-opacity-80 text-sm mb-4">
            Explore our interactive 3D ecosystem. Mouse over to interact with the orbital network.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500 hover:shadow-lg hover:transform hover:-translate-y-1">
            ✨ Start Assessment
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      <div id="loading" className="fixed inset-0 bg-black flex items-center justify-center z-30" style={{transition: 'opacity 0.5s ease'}}>
        <div className="text-center">
          <div className="loader-ring mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading ZYNIQ Ecosystem...</p>
        </div>
      </div>
    </div>
  );
}

export default App;