
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlantProps {
  scale: number;
}

// 单个叶片组件
const Leaf = ({ position, rotation, scale, color, timeOffset }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // 生成随机的颤动参数，使每片叶子的运动独立且异步
  const { flutterSpeed, flutterPhase, flutterAmp } = useMemo(() => ({
    flutterSpeed: 2 + Math.random() * 4,    // 随机的高频颤动速度
    flutterPhase: Math.random() * Math.PI * 2, // 随机相位
    flutterAmp: 0.01 + Math.random() * 0.015   // 随机的微小振幅
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime;

      // 1. 基础风力摆动 (较慢，幅度较大)
      const baseSwayX = Math.sin(t * 1.5 + timeOffset) * 0.05;
      const baseSwayZ = Math.cos(t * 1.2 + timeOffset) * 0.05;

      // 2. 细节颤动 (较快，幅度较小，模拟微风拂过叶片)
      const flutter = Math.sin(t * flutterSpeed + flutterPhase) * flutterAmp;

      // 叠加旋转效果
      meshRef.current.rotation.x = rotation[0] + baseSwayX + flutter;
      meshRef.current.rotation.z = rotation[2] + baseSwayZ + flutter * 0.8;
    }
  });

  return (
    <group rotation={[0, rotation[1], 0]}>
      <mesh
        ref={meshRef}
        position={position}
        rotation={[rotation[0], 0, rotation[2]]}
        scale={scale}
        castShadow
        receiveShadow
      >
        {/* 使用球体几何体压扁作为叶片，比简单的多面体更自然 */}
        <sphereGeometry args={[1, 7, 7]} />
        <meshStandardMaterial 
            color={color} 
            roughness={0.6} 
            metalness={0.1}
            flatShading={false} // 平滑着色看起来更有机
        />
      </mesh>
    </group>
  );
};

export const Plant: React.FC<PlantProps> = ({ scale }) => {
  const groupRef = useRef<THREE.Group>(null);

  // 程序化生成叶片数据
  const leaves = useMemo(() => {
    const temp = [];
    
    // 1. 外层 (老叶，深色，较大，摊开)
    const outerCount = 5;
    for (let i = 0; i < outerCount; i++) {
      temp.push({
        layer: 'outer',
        position: [0, 0.05, 0.15] as [number, number, number], // 离中心远一点
        rotation: [-Math.PI / 4, (i / outerCount) * Math.PI * 2, 0] as [number, number, number],
        scale: [0.12, 0.01, 0.18] as [number, number, number],
        color: "#15803d", // 深绿色
        timeOffset: i * 0.5,
      });
    }

    // 2. 中层 (主力叶，鲜绿，向上)
    const midCount = 4;
    for (let i = 0; i < midCount; i++) {
      temp.push({
        layer: 'mid',
        position: [0, 0.1, 0.08] as [number, number, number],
        rotation: [-Math.PI / 6, (i / midCount) * Math.PI * 2 + Math.PI / 4, 0] as [number, number, number],
        scale: [0.1, 0.01, 0.15] as [number, number, number],
        color: "#22c55e", // 鲜绿色
        timeOffset: (i + 10) * 0.5,
      });
    }

    // 3. 内芯 (嫩叶，浅绿，直立，紧凑)
    const innerCount = 3;
    for (let i = 0; i < innerCount; i++) {
      temp.push({
        layer: 'inner',
        position: [0, 0.15, 0.02] as [number, number, number],
        rotation: [0, (i / innerCount) * Math.PI * 2, 0] as [number, number, number],
        scale: [0.06, 0.01, 0.1] as [number, number, number],
        color: "#86efac", // 嫩绿色
        timeOffset: (i + 20) * 0.5,
      });
    }

    return temp;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // 整体植物随风摆动
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.z = Math.sin(t * 0.8) * 0.03;
      groupRef.current.rotation.x = Math.cos(t * 0.6) * 0.03;
    }
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* 植物茎部 (根基) */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.15, 8]} />
        <meshStandardMaterial color="#dcfce7" />
      </mesh>

      {/* 生成所有叶片 */}
      {leaves.map((leaf, index) => (
        <Leaf
          key={index}
          position={leaf.position}
          rotation={leaf.rotation}
          scale={leaf.scale}
          color={leaf.color}
          timeOffset={leaf.timeOffset}
        />
      ))}
    </group>
  );
};
