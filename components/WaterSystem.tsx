
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WaterSystemProps {
  active: boolean;
  height: number;
}

export const WaterSystem: React.FC<WaterSystemProps> = ({ active, height }) => {
  const count = 60;
  const particles = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.12; // narrow stream inside central column
      pos[i * 3 + 1] = Math.random() * height;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
    }
    return pos;
  }, [count, height]);

  useFrame((state) => {
    if (!particles.current || !active) return;
    const positions = particles.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      // Move downward
      positions[i * 3 + 1] -= 0.05;
      // Reset to top
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = height;
      }
    }
    particles.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#3b82f6"
        size={0.04}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};
