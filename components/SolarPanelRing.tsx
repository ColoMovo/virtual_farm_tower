
import React from 'react';
import * as THREE from 'three';

export const SolarPanelRing: React.FC = () => {
  const count = 12;
  const radius = 5.1; // Just outside the balcony railing

  return (
    <group position={[0, -1.15, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, -angle, 0]}>
             {/* Arm extending out from under the railing */}
             <group position={[radius, 0, 0]}>
                {/* Mounting Arm */}
                <mesh position={[-0.2, 0, 0]} castShadow>
                    <boxGeometry args={[0.5, 0.05, 0.1]} />
                    <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
                </mesh>
                
                {/* Mechanical Hinge */}
                <mesh position={[0.1, 0, 0]}>
                    <cylinderGeometry args={[0.04, 0.04, 0.15, 16]} rotation={[Math.PI/2, 0, 0]} />
                    <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
                </mesh>

                {/* Solar Panel Group (Tilted towards sun) */}
                <group position={[0.15, 0, 0]} rotation={[0, 0, -Math.PI / 5]}> 
                    {/* Panel Frame */}
                    <mesh position={[0.7, 0, 0]} castShadow>
                         <boxGeometry args={[1.4, 0.04, 0.9]} />
                         <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
                    </mesh>
                    
                    {/* Photovoltaic Cells (The shiny part) */}
                    <mesh position={[0.7, 0.025, 0]}>
                        <boxGeometry args={[1.3, 0.01, 0.8]} />
                        <meshPhysicalMaterial 
                            color="#172554" // Deep blue
                            emissive="#1d4ed8"
                            emissiveIntensity={0.1}
                            metalness={1.0}
                            roughness={0.1}
                            clearcoat={1.0}
                            clearcoatRoughness={0.1}
                            reflectivity={1}
                        />
                    </mesh>

                    {/* Tech Detail: Grid lines on panel */}
                    <mesh position={[0.7, 0.031, 0]} rotation={[-Math.PI/2, 0, 0]}>
                         <planeGeometry args={[1.3, 0.8]} />
                         <meshBasicMaterial 
                            color="#3b82f6" 
                            wireframe 
                            transparent 
                            opacity={0.15} 
                         />
                    </mesh>
                    
                    {/* Status Light */}
                    <mesh position={[1.3, 0.03, 0.35]}>
                        <boxGeometry args={[0.05, 0.02, 0.05]} />
                        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={2} toneMapped={false} />
                    </mesh>
                </group>
             </group>
          </group>
        );
      })}
    </group>
  );
};
