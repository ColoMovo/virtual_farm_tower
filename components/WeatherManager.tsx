
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface WeatherManagerProps {
  condition: 'clear' | 'cloudy' | 'rainy';
  isNight: boolean;
}

const Rain = () => {
  const count = 1000;
  const rainGeo = useRef<THREE.BufferGeometry>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for(let i=0; i<count; i++) {
      pos[i*3] = (Math.random() - 0.5) * 25; // X spread
      pos[i*3+1] = Math.random() * 20;       // Y height
      pos[i*3+2] = (Math.random() - 0.5) * 25; // Z spread
    }
    return pos;
  }, []);

  useFrame(() => {
    if (!rainGeo.current) return;
    const posAttribute = rainGeo.current.attributes.position;
    const array = posAttribute.array as Float32Array;
    
    for(let i=0; i<count; i++) {
      // Move rain down
      array[i*3+1] -= 0.3; 
      // Reset if below ground
      if (array[i*3+1] < -2) {
        array[i*3+1] = 20;
      }
    }
    posAttribute.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={rainGeo}>
        <bufferAttribute 
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#334155" 
        size={0.1} 
        transparent 
        opacity={0.6} 
        sizeAttenuation 
        depthWrite={false}
      />
    </points>
  );
};

export const WeatherManager: React.FC<WeatherManagerProps> = ({ condition, isNight }) => {
  // Determine Fog Color based on Night/Day and Weather
  const getFogConfig = (): [string, number, number] => {
     if (isNight) {
         if (condition === 'rainy') return ['#0f172a', 2, 25]; // Dark Navy Fog
         if (condition === 'cloudy') return ['#1e1b4b', 5, 40]; // Dark Purple Fog
         return ['#020617', 10, 80]; // Deep Black/Blue Fog
     } else {
         if (condition === 'rainy') return ['#cbd5e1', 2, 30]; // Gray Fog
         if (condition === 'cloudy') return ['#e2e8f0', 5, 40]; // Light Gray Fog
         return ['#f0f9ff', 15, 90]; // Clear Day Fog
     }
  };

  const fogConfig = getFogConfig();

  return (
    <group>
      <fog attach="fog" args={fogConfig} />

      {/* Weather Specifics */}
      {condition === 'clear' && !isNight && (
        <Sparkles count={50} scale={[20, 10, 20]} size={3} speed={0.4} opacity={0.4} color="#ffffff" position={[0, 10, 0]} />
      )}
      
      {condition === 'clear' && isNight && (
         <Sparkles count={50} scale={[20, 10, 20]} size={2} speed={0.2} opacity={0.6} color="#38bdf8" position={[0, 10, 0]} />
      )}

      {condition === 'cloudy' && (
        <group position={[0, 8, -5]}>
           <Cloud opacity={isNight ? 0.3 : 0.6} speed={0.4} width={10} depth={1.5} segments={20} color={isNight ? "#1e293b" : "#ffffff"} />
           <Cloud opacity={isNight ? 0.3 : 0.6} speed={0.3} width={10} depth={1.5} segments={20} color={isNight ? "#334155" : "#f1f5f9"} position={[5, 0, 5]} />
        </group>
      )}

      {condition === 'rainy' && (
        <>
          <Rain />
          <Cloud opacity={0.9} speed={0.8} width={15} depth={2} segments={20} color={isNight ? "#1e293b" : "#64748b"} position={[0, 10, 0]} />
        </>
      )}
    </group>
  );
};
