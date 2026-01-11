
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CityBackgroundProps {
  isNight: boolean;
}

export const CityBackground: React.FC<CityBackgroundProps> = ({ isNight }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = 4096; 
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    const width = canvas.width;
    const height = canvas.height;

    // --- SKY GENERATION ---
    if (isNight) {
        // Night Sky Gradient (Deep Blue/Purple)
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0.0, '#020617'); 
        skyGrad.addColorStop(0.6, '#1e1b4b'); 
        skyGrad.addColorStop(1.0, '#312e81'); 
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Stars
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 2000; i++) {
            const x = Math.random() * width;
            const y = Math.random() * (height * 0.7); // Stars mainly in top part
            const size = Math.random() * 2;
            ctx.globalAlpha = Math.random();
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        // Moon
        const moonX = width * 0.8;
        const moonY = height * 0.15;
        const moonR = 60;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
        ctx.fillStyle = '#f8fafc';
        ctx.shadowBlur = 80;
        ctx.shadowColor = '#e2e8f0';
        ctx.fill();
        ctx.shadowBlur = 0;

    } else {
        // Day Sky Gradient (Solarpunk Blue)
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0.0, '#0ea5e9'); // Zenith
        skyGrad.addColorStop(0.4, '#38bdf8'); 
        skyGrad.addColorStop(0.8, '#bae6fd'); 
        skyGrad.addColorStop(1.0, '#f0f9ff'); // Horizon
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Sun
        const sunX = width * 0.8;
        const sunY = height * 0.15;
        const sunR = 80;
        
        // Sun Glow
        const sunGlow = ctx.createRadialGradient(sunX, sunY, sunR, sunX, sunY, sunR * 12);
        sunGlow.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        sunGlow.addColorStop(0.5, 'rgba(255, 250, 240, 0.1)');
        sunGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = sunGlow;
        ctx.fillRect(0, 0, width, height);

        // Sun Body
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
        ctx.fillStyle = '#fffbeb'; 
        ctx.shadowBlur = 100;
        ctx.shadowColor = '#fcd34d'; 
        ctx.fill();
        ctx.shadowBlur = 0;

        // Clouds (Day only)
        const drawCloud = (x: number, y: number, w: number, h: number, opacity: number) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(1, h/w);
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, w);
            grad.addColorStop(0, `rgba(255, 255, 255, ${opacity})`); 
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, w, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        };

        for(let i=0; i<25; i++) {
            drawCloud(
                Math.random() * width, 
                Math.random() * (height * 0.5), 
                300 + Math.random() * 400, 
                80 + Math.random() * 100, 
                0.3 + Math.random() * 0.3
            );
        }
    }

    // --- BUILDINGS GENERATION ---
    const drawBuildings = (yOffset: number, baseColor: string, windowColor: string, neonColor: string, minH: number, maxH: number, scale: number, density: number) => {
      let currentX = 0;
      while (currentX < width) {
        const bWidth = (40 + Math.random() * 60) * scale;
        
        if (Math.random() > density) {
            currentX += bWidth * 0.5;
            continue;
        }

        const bHeight = (minH + Math.random() * (maxH - minH)) * scale;
        const buildingY = height - yOffset - bHeight;

        // Building Body
        ctx.fillStyle = baseColor;
        ctx.fillRect(currentX, buildingY, bWidth + 2, bHeight + yOffset);
        
        if (isNight) {
            // Night Windows (Random Neon pixels)
            ctx.fillStyle = neonColor;
            for(let wy = buildingY + 10; wy < height - yOffset; wy += 20) {
                if(Math.random() > 0.8) continue;
                for(let wx = currentX + 5; wx < currentX + bWidth - 5; wx += 15) {
                     if(Math.random() > 0.3) {
                         ctx.globalAlpha = 0.8;
                         ctx.fillRect(wx, wy, 8, 12);
                     }
                }
            }
            ctx.globalAlpha = 1.0;
        } else {
            // Day Windows (Vertical glass stripes reflection)
            if (Math.random() > 0.4) {
                 ctx.fillStyle = windowColor;
                 ctx.globalAlpha = 0.3;
                 const glassW = bWidth * 0.8;
                 ctx.fillRect(currentX + (bWidth-glassW)/2, buildingY + 10, glassW, bHeight - 20);
                 ctx.globalAlpha = 1.0;
            }
        }
        currentX += bWidth;
      }
    };

    if (isNight) {
        // Night City Layers
        drawBuildings(150, '#0f172a', '', '#38bdf8', 250, 600, 1.5, 0.95); // Distant (Dark Blue)
        drawBuildings(0, '#020617', '', '#f472b6', 150, 450, 1.8, 0.9);   // Near (Black, Pink neon)
    } else {
        // Day City Layers
        // Haze for distance
        const hazeGrad = ctx.createLinearGradient(0, height-500, 0, height);
        hazeGrad.addColorStop(0, 'rgba(240, 249, 255, 0)');
        hazeGrad.addColorStop(1, 'rgba(240, 249, 255, 0.9)');
        
        drawBuildings(150, '#94a3b8', '#bfdbfe', '', 250, 600, 1.5, 0.95);
        ctx.fillStyle = hazeGrad;
        ctx.fillRect(0, height-600, width, 600);
        drawBuildings(0, '#475569', '#cbd5e1', '', 150, 450, 1.8, 0.9);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.anisotropy = 16;
    tex.needsUpdate = true;
    return tex;
  }, [isNight]); // Re-generate texture when isNight changes

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.008; 
    }
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef} position={[0, -5, 0]}>
      <cylinderGeometry args={[45, 45, 80, 64, 1, true]} />
      <meshBasicMaterial 
        map={texture} 
        side={THREE.BackSide} 
        transparent 
        opacity={1}
        fog={true} 
      />
    </mesh>
  );
};
