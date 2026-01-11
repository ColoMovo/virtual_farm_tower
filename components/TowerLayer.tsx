
import React from 'react';
import { Plant } from './Plant';

interface LayerProps {
  position: [number, number, number];
  growthScale: number;
}

export const TowerLayer: React.FC<LayerProps> = ({ position, growthScale }) => {
  const podAngles = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];

  return (
    <group position={position}>
      {/* Central Module Body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Decorative details on module */}
      <mesh position={[0, 0.38, 0]}>
        <torusGeometry args={[0.21, 0.01, 8, 32]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* Planting Cups (Pods) */}
      {podAngles.map((angle, idx) => (
        <group key={idx} rotation={[0, angle, 0]}>
          <group position={[0.25, -0.1, 0]} rotation={[0, 0, -Math.PI / 6]}>
            {/* Cup Structure */}
            <mesh castShadow>
              <cylinderGeometry args={[0.1, 0.07, 0.2, 12]} />
              <meshStandardMaterial color="#e2e8f0" />
            </mesh>
            {/* Dark soil area */}
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.01, 12]} />
              <meshStandardMaterial color="#2d2d2d" />
            </mesh>
            {/* The Plant */}
            <group position={[0, 0.12, 0]} rotation={[0, 0, Math.PI / 6]}>
              <Plant scale={growthScale} />
            </group>
          </group>
        </group>
      ))}
    </group>
  );
};
