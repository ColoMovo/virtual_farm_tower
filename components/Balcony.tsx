
import React from 'react';
import { Grid } from '@react-three/drei';

export const Balcony: React.FC = () => {
  const radius = 5;
  const postCount = 16;
  const railHeight = 1.1;

  // Configuration for the solar floor pattern
  const solarRings = [1.5, 2.3, 3.1, 3.9, 4.7];
  const solarSlices = 16;

  return (
    <group position={[0, -1.2, 0]}>
      {/* --- Floor Structure --- */}
      
      {/* Main Concrete Slab Base */}
      <mesh receiveShadow position={[0, -0.15, 0]}>
        <cylinderGeometry args={[radius, radius - 0.2, 0.3, 64]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* --- Solar Floor Surface --- */}
      {/* The main photovoltaic surface: Dark blue, high reflective, glass-like */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[radius - 0.05, radius - 0.05, 0.05, 64]} />
        <meshPhysicalMaterial 
            color="#002147" // Deep solar blue
            emissive="#001530"
            emissiveIntensity={0.2}
            roughness={0.1} 
            metalness={0.8}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Solar Panel Grid Lines (Silver Conductors) */}
      <group position={[0, 0.026, 0]}>
         {/* Concentric Rings */}
         {solarRings.map((r, i) => (
             <mesh key={`ring-${i}`} rotation={[-Math.PI/2, 0, 0]}>
                 <ringGeometry args={[r, r + 0.02, 64]} />
                 <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
             </mesh>
         ))}
         {/* Radial Lines */}
         {Array.from({ length: solarSlices }).map((_, i) => (
             <mesh 
                key={`slice-${i}`} 
                rotation={[0, (i / solarSlices) * Math.PI * 2, 0]} 
                position={[0, 0, 0]}
            >
                <boxGeometry args={[radius * 2 - 0.2, 0.001, 0.02]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
             </mesh>
         ))}
      </group>

      {/* Decorative Outer Rim */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.3, radius - 0.05, 64]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Emissive Floor Rings (Retained for cool effect) */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.6, radius - 0.58, 64]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1} toneMapped={false} />
      </mesh>

      {/* Holographic Tech Grid Overlay - kept but made more subtle */}
      <Grid
        position={[0, 0.05, 0]}
        args={[10.5, 10.5]}
        cellColor="#60a5fa"
        sectionColor="#3b82f6"
        sectionSize={1.5}
        cellSize={0.5}
        fadeDistance={8}
        fadeStrength={1}
        infiniteGrid
        position-y={0.1} 
      />

      {/* --- Railing System --- */}

      {/* Top Handrail */}
      <mesh position={[0, railHeight, 0]} rotation={[Math.PI / 2, 0, 0]}>
         <torusGeometry args={[radius - 0.2, 0.06, 16, 128]} />
         <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Bottom Rail Support */}
      <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
         <torusGeometry args={[radius - 0.2, 0.04, 16, 128]} />
         <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Posts & Panels Loop */}
      {Array.from({ length: postCount }).map((_, i) => {
        const angle = (i / postCount) * Math.PI * 2;
        const r = radius - 0.2;
        const x = r * Math.cos(angle);
        const z = r * Math.sin(angle);
        
        // Calculate panel position (midpoint between this post and next)
        const nextAngle = ((i + 1) / postCount) * Math.PI * 2;
        const midAngle = (angle + nextAngle) / 2;
        const chordLength = 2 * r * Math.sin(Math.PI / postCount);
        const panelWidth = chordLength - 0.15; // subtract post width
        const panelX = r * Math.cos(midAngle);
        const panelZ = r * Math.sin(midAngle);

        return (
            <React.Fragment key={i}>
                {/* Post Group */}
                <group position={[x, 0, z]} rotation={[0, -angle, 0]}>
                    {/* Main Post Pillar */}
                    <mesh position={[0, railHeight / 2, 0]}>
                        <boxGeometry args={[0.1, railHeight, 0.1]} />
                        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
                    </mesh>
                    
                    {/* Post Base Detail */}
                    <mesh position={[0, 0.05, 0]}>
                         <cylinderGeometry args={[0.08, 0.1, 0.1, 4]} />
                         <meshStandardMaterial color="#475569" />
                    </mesh>

                    {/* Tech Light Strip on Post */}
                    <mesh position={[0.055, railHeight - 0.2, 0]}>
                        <boxGeometry args={[0.01, 0.2, 0.04]} />
                        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={2} toneMapped={false} />
                    </mesh>
                </group>

                {/* Glass Panel */}
                <mesh 
                    position={[panelX, railHeight / 2 + 0.05, panelZ]} 
                    rotation={[0, -midAngle, 0]}
                >
                    <boxGeometry args={[0.02, railHeight - 0.2, panelWidth]} />
                    <meshPhysicalMaterial 
                        color="#60a5fa"
                        metalness={0.1}
                        roughness={0.1}
                        transmission={0.4}
                        thickness={0.05}
                        transparent
                        opacity={0.3}
                    />
                </mesh>
            </React.Fragment>
        );
      })}
    </group>
  );
};
