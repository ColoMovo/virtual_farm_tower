
import React from 'react';

export const TowerBase: React.FC = () => {
  return (
    <group position={[0, -0.6, 0]}>
      {/* Main Tank Body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.7, 1.2, 32]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.2} />
      </mesh>

      {/* Futuristic Glow Ring */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[0.61, 0.03, 16, 64]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          emissive="#3b82f6" 
          emissiveIntensity={2} 
          toneMapped={false}
        />
      </mesh>

      {/* Base Cap */}
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.1, 32]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      {/* Top Inlet */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
    </group>
  );
};
