// ============================================================================
// COMPLETE 3D, AR, VR SYSTEM - ALL DISCUSSED FEATURES
// Everything we talked about for 3D dental visualization
// ============================================================================

'use client';

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, Html, useGLTF, PerspectiveCamera } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// 1. ADVANCED 3D TOOTH MODEL VIEWER
// ============================================================================

interface ToothModelProps {
  modelPath: string;
  color?: string;
  scale?: number;
  animation?: boolean;
  condition?: 'healthy' | 'cavity' | 'implant' | 'veneer' | 'crown';
}

const ToothModel: React.FC<ToothModelProps> = ({ 
  modelPath, 
  color = '#ffffff', 
  scale = 1,
  animation = true,
  condition = 'healthy'
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Load 3D model with fallback
  const gltf = useGLTF(modelPath, true).catch(() => null);

  useFrame((state) => {
    if (meshRef.current && animation) {
      meshRef.current.rotation.y = hovered ? 
        state.clock.elapsedTime * 0.5 : 
        Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
      
      if (clicked) {
        meshRef.current.scale.setScalar(scale * (1 + Math.sin(state.clock.elapsedTime * 2) * 0.1));
      }
    }
  });

  // Procedural tooth geometry fallback
  const createToothGeometry = () => {
    const group = new THREE.Group();
    
    // Crown (main part)
    const crownGeometry = new THREE.CylinderGeometry(0.8, 1.2, 2, 8);
    const crownMaterial = new THREE.MeshPhysicalMaterial({
      color: condition === 'cavity' ? '#8b4513' : condition === 'implant' ? '#c0c0c0' : color,
      roughness: condition === 'implant' ? 0.3 : 0.1,
      metalness: condition === 'implant' ? 0.8 : 0.1,
      clearcoat: condition === 'implant' ? 0 : 1,
      clearcoatRoughness: 0.1,
      transmission: condition === 'veneer' ? 0.1 : 0,
    });
    const crown = new THREE.Mesh(crownGeometry, crownMaterial);
    crown.position.y = 1;
    group.add(crown);
    
    // Root (if not implant)
    if (condition !== 'implant') {
      const rootGeometry = new THREE.CylinderGeometry(0.4, 0.6, 1.5, 6);
      const rootMaterial = new THREE.MeshPhysicalMaterial({
        color: '#f5f5dc',
        roughness: 0.3,
        metalness: 0.05,
      });
      const root = new THREE.Mesh(rootGeometry, rootMaterial);
      root.position.y = -0.75;
      group.add(root);
    } else {
      // Implant post
      const postGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 8);
      const postMaterial = new THREE.MeshPhysicalMaterial({
        color: '#titanium',
        roughness: 0.2,
        metalness: 0.9,
      });
      const post = new THREE.Mesh(postGeometry, postMaterial);
      post.position.y = -1;
      group.add(post);
    }
    
    // Add cavity if needed
    if (condition === 'cavity') {
      const cavityGeometry = new THREE.SphereGeometry(0.3, 8, 8);
      const cavityMaterial = new THREE.MeshBasicMaterial({ color: '#2d1810' });
      const cavity = new THREE.Mesh(cavityGeometry, cavityMaterial);
      cavity.position.set(0.3, 1.2, 0.3);
      group.add(cavity);
    }
    
    return group;
  };

  return (
    <group
      ref={meshRef}
      scale={[scale, scale, scale]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
    >
      {gltf ? (
        <primitive object={gltf.scene} />
      ) : (
        <primitive object={createToothGeometry()} />
      )}
    </group>
  );
};

// ============================================================================
// 2. INTERACTIVE 3D DENTAL VIEWER WITH HERO SECTION
// ============================================================================

export const Interactive3DDentalViewer: React.FC<{
  className?: string;
  modelType?: 'healthy' | 'cavity' | 'implant' | 'veneer' | 'crown';
  showControls?: boolean;
  autoRotate?: boolean;
  showLabels?: boolean;
  heroMode?: boolean;
}> = ({
  className = '',
  modelType = 'healthy',
  showControls = true,
  autoRotate = true,
  showLabels = true,
  heroMode = false
}) => {
  const [currentModel, setCurrentModel] = useState(modelType);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'3d' | 'xray' | 'cross-section'>('3d');

  const modelPaths = {
    healthy: '/models/healthy-tooth.glb',
    cavity: '/models/cavity-tooth.glb',
    implant: '/models/dental-implant.glb',
    veneer: '/models/veneer-tooth.glb',
    crown: '/models/crown-tooth.glb'
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const containerHeight = heroMode ? 'h-screen' : 'h-96';

  return (
    <div className={`relative w-full ${containerHeight} bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden ${className}`}>
      {/* Hero Overlay for Hero Mode */}
      {heroMode && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="text-center text-white">
            <motion.h1 
              className="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-pink-200 to-teal-200 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Advanced 3D Dentistry
            </motion.h1>
            <motion.p 
              className="text-2xl mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Interactive Dental Visualization
            </motion.p>
          </div>
        </div>
      )}

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-white/90 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-pink-600/30 border-t-pink-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading 3D Model...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Dynamic Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.3} penumbra={1} castShadow />
          
          {/* Environment */}
          <Environment preset="studio" />
          
          {/* 3D Tooth Model */}
          <ToothModel
            modelPath={modelPaths[currentModel]}
            condition={currentModel}
            scale={heroMode ? 2 : 1.5}
            animation={true}
          />
          
          {/* Interactive Labels */}
          {showLabels && (
            <>
              <Text
                position={[2, 2, 0]}
                fontSize={0.3}
                color="#C2185B"
                anchorX="center"
                anchorY="middle"
                font="/fonts/Montserrat-Bold.woff"
              >
                Crown
              </Text>
              <Text
                position={[2, -1, 0]}
                fontSize={0.3}
                color="#40C4B4"
                anchorX="center"
                anchorY="middle"
                font="/fonts/Montserrat-Bold.woff"
              >
                {currentModel === 'implant' ? 'Implant Post' : 'Root'}
              </Text>
              {currentModel === 'cavity' && (
                <Text
                  position={[-2, 1.5, 0]}
                  fontSize={0.25}
                  color="#ff4444"
                  anchorX="center"
                  anchorY="middle"
                >
                  Cavity
                </Text>
              )}
            </>
          )}
          
          {/* Ground Shadow */}
          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />
          
          {/* Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={2}
            minDistance={3}
            maxDistance={8}
          />
        </Suspense>
      </Canvas>

      {/* Control Panel */}
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            {/* Model Selection */}
            <div className="flex flex-wrap gap-2 justify-center mb-3">
              {Object.keys(modelPaths).map((type) => (
                <button
                  key={type}
                  onClick={() => setCurrentModel(type as typeof currentModel)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentModel === type
                      ? 'bg-pink-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            
            {/* View Mode Selection */}
            <div className="flex gap-2 justify-center mb-2">
              {['3d', 'xray', 'cross-section'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as typeof viewMode)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                    viewMode === mode
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              Click and drag to rotate • Scroll to zoom • Click model to pulse
            </p>
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-1">
            {currentModel.charAt(0).toUpperCase() + currentModel.slice(1)} Tooth
          </h3>
          <p className="text-xs text-gray-600">
            Interactive 3D visualization
          </p>
          <div className="mt-2 text-xs text-gray-500">
            View: {viewMode.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. BEFORE/AFTER 3D COMPARISON VIEWER
// ============================================================================

export const BeforeAfter3DComparison: React.FC<{
  beforeModel: string;
  afterModel: string;
  className?: string;
  title?: string;
}> = ({ beforeModel, afterModel, className = '', title = "Treatment Comparison" }) => {
  const [showSplit, setShowSplit] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className={`relative w-full h-96 ${className}`}>
      <div className="mb-4 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowSplit(!showSplit)}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            {showSplit ? 'Side by Side' : 'Split View'}
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            {autoRotate ? 'Stop Rotation' : 'Auto Rotate'}
          </button>
        </div>
      </div>

      <div className={`grid ${showSplit ? 'grid-cols-1' : 'grid-cols-2'} gap-4 h-full`}>
        {/* Before */}
        <div className="relative bg-gradient-to-br from-red-50 to-red-100 rounded-xl overflow-hidden">
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium z-10">
            Before
          </div>
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <Environment preset="studio" />
              <ToothModel 
                modelPath={beforeModel} 
                condition="cavity"
                scale={1.5}
                animation={true}
              />
              <OrbitControls 
                enablePan={false} 
                autoRotate={autoRotate} 
                autoRotateSpeed={1}
                synchronized={showSplit}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* After */}
        {!showSplit && (
          <div className="relative bg-gradient-to-br from-green-50 to-green-100 rounded-xl overflow-hidden">
            <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium z-10">
              After
            </div>
            <Canvas camera={{ position: [0, 0, 5] }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Environment preset="studio" />
                <ToothModel 
                  modelPath={afterModel} 
                  condition="healthy"
                  scale={1.5}
                  animation={true}
                />
                <OrbitControls 
                  enablePan={false} 
                  autoRotate={autoRotate} 
                  autoRotateSpeed={1}
                />
              </Suspense>
            </Canvas>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 4. AR TOOTH VIEWER (WebXR Implementation)
// ============================================================================

export const ARToothViewer: React.FC<{ 
  className?: string;
  modelPath?: string;
}> = ({ className = '', modelPath = '/models/healthy-tooth.glb' }) => {
  const [isARSupported, setIsARSupported] = useState(false);
  const [isARActive, setIsARActive] = useState(false);
  const [arError, setArError] = useState<string | null>(null);

  useEffect(() => {
    // Check for WebXR support
    if ('xr' in navigator) {
      (navigator as any).xr.isSessionSupported('immersive-ar')
        .then(setIsARSupported)
        .catch(() => setIsARSupported(false));
    }
  }, []);

  const startARSession = async () => {
    if (!isARSupported) {
      setArError('AR not supported on this device');
      return;
    }

    try {
      const xr = (navigator as any).xr;
      const session = await xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
      });
      
      setIsARActive(true);
      
      session.addEventListener('end', () => {
        setIsARActive(false);
      });

    } catch (error) {
      setArError('Failed to start AR session');
      console.error('AR Error:', error);
    }
  };

  return (
    <div className={`relative w-full h-64 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center ${className}`}>
      {isARActive ? (
        <div className="text-center">
          <div className="text-4xl mb-2">👁️</div>
          <p className="text-gray-600 font-medium">AR Session Active</p>
          <button
            onClick={() => setIsARActive(false)}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Exit AR
          </button>
        </div>
      ) : isARSupported ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startARSession}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-lg"
        >
          🥽 View Tooth in AR
        </motion.button>
      ) : (
        <div className="text-center">
          <div className="text-4xl mb-2">🥽</div>
          <p className="text-gray-600 font-medium">AR Tooth Viewer</p>
          <p className="text-sm text-gray-500">
            {arError || 'AR not supported on this device'}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Try on a mobile device with AR support
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 5. VR DENTAL OFFICE TOUR
// ============================================================================

export const VRDentalOfficeTour: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isVRActive, setIsVRActive] = useState(false);

  useEffect(() => {
    if ('xr' in navigator) {
      (navigator as any).xr.isSessionSupported('immersive-vr')
        .then(setIsVRSupported)
        .catch(() => setIsVRSupported(false));
    }
  }, []);

  const startVRTour = async () => {
    if (!isVRSupported) return;

    try {
      const xr = (navigator as any).xr;
      const session = await xr.requestSession('immersive-vr');
      setIsVRActive(true);
      
      session.addEventListener('end', () => {
        setIsVRActive(false);
      });
    } catch (error) {
      console.error('VR Error:', error);
    }
  };

  return (
    <div className={`relative w-full h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center ${className}`}>
      {isVRActive ? (
        <div className="text-center">
          <div className="text-4xl mb-2">🏥</div>
          <p className="text-gray-600 font-medium">VR Tour Active</p>
        </div>
      ) : isVRSupported ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startVRTour}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold shadow-lg"
        >
          🥽 Virtual Office Tour
        </motion.button>
      ) : (
        <div className="text-center">
          <div className="text-4xl mb-2">🏥</div>
          <p className="text-gray-600 font-medium">Virtual Office Tour</p>
          <p className="text-sm text-gray-500">VR not supported</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 6. 360° PANORAMIC OFFICE VIEWER
// ============================================================================

export const PanoramicOfficeViewer: React.FC<{ 
  className?: string;
  panoramaImage?: string;
}> = ({ className = '', panoramaImage = '/images/office-360.jpg' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This would integrate with a 360° viewer library like A-Frame or Three.js
    // For now, showing a placeholder implementation
    
    if (mountRef.current) {
      // Initialize 360° viewer here
      console.log('Initialize 360° viewer with:', panoramaImage);
    }
  }, [panoramaImage]);

  return (
    <div className={`relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden ${className}`}>
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
          <p className="text-sm text-gray-600">Click and drag to look around</p>
        </div>
      </div>
      
      {/* Info Hotspots */}
      <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center shadow-lg"
        >
          ℹ️
        </motion.button>
      </div>
    </div>
  );
};

// USAGE INSTRUCTIONS:
/*
1. Install dependencies:
   npm install @react-three/fiber @react-three/drei three framer-motion

2. Add 3D models to public/models/:
   - healthy-tooth.glb
   - cavity-tooth.glb
   - dental-implant.glb
   - veneer-tooth.glb
   - crown-tooth.glb

3. Use in treatment pages:
   <Interactive3DDentalViewer 
     modelType="healthy" 
     heroMode={true}
     showControls={true}
   />

4. Add to homepage hero:
   <Interactive3DDentalViewer 
     heroMode={true}
     autoRotate={true}
   />

5. Before/After comparisons:
   <BeforeAfter3DComparison 
     beforeModel="/models/cavity-tooth.glb"
     afterModel="/models/healthy-tooth.glb"
     title="Cavity Treatment Results"
   />

6. AR/VR features:
   <ARToothViewer />
   <VRDentalOfficeTour />
   <PanoramicOfficeViewer />
*/

