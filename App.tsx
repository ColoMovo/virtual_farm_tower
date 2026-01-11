
import React, { useState, Suspense, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Lightformer } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Minus, 
  Droplets, 
  Activity, 
  Leaf, 
  Box,
  CloudRain,
  Sun,
  Cloud,
  Moon,
  Zap,
  Thermometer,
  Wind
} from 'lucide-react';

import { TowerBase } from './components/TowerBase';
import { TowerLayer } from './components/TowerLayer';
import { WaterSystem } from './components/WaterSystem';
import { Balcony } from './components/Balcony';
import { WeatherManager } from './components/WeatherManager';
import { CityBackground } from './components/CityBackground';
import { SolarPanelRing } from './components/SolarPanelRing';

type WeatherCondition = 'clear' | 'cloudy' | 'rainy';
interface DataPoint {
  time: number;
  value: number;
}

const TrendChart: React.FC<{ data: DataPoint[]; color: string; height?: number }> = ({ data, color, height = 40 }) => {
  if (data.length < 2) return <div style={{ height }} />;
  const width = 100;
  const values = data.map(d => d.value);
  const maxVal = Math.max(...values) * 1.05;
  const minVal = Math.min(...values) * 0.95;
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.value - minVal) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const gradId = useMemo(() => `grad-${Math.random().toString(36).substr(2, 9)}`, []);

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M 0 ${height} L ${points} L ${width} ${height} Z`} fill={`url(#${gradId})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const App: React.FC = () => {
  const [layerCount, setLayerCount] = useState(4);
  const [growthScale, setGrowthScale] = useState(0.85);
  const [isWaterRunning, setIsWaterRunning] = useState(true);
  const [weather, setWeather] = useState<WeatherCondition>('clear');
  const [isNight, setIsNight] = useState(false);

  const [tempHistory, setTempHistory] = useState<DataPoint[]>([]);
  const [humidityHistory, setHumidityHistory] = useState<DataPoint[]>([]);
  const [powerHistory, setPowerHistory] = useState<DataPoint[]>([]);

  useEffect(() => {
    const generateInit = (base: number) => Array.from({ length: 20 }, (_, i) => ({ time: i, value: base + (Math.random() - 0.5) * 4 }));
    setTempHistory(generateInit(24));
    setHumidityHistory(generateInit(60));
    setPowerHistory(generateInit(15));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const update = (prev: DataPoint[], base: number, volatility: number) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1].value;
        let next = last + (Math.random() - 0.5) * volatility;
        next += (base - next) * 0.1;
        return [...prev.slice(1), { time: Date.now(), value: next }];
      };
      
      const targetTemp = isNight ? 18 : 26;
      const targetHum = weather === 'rainy' ? 85 : 55;
      
      setTempHistory(p => update(p, targetTemp, 1.2));
      setHumidityHistory(p => update(p, targetHum, 2.0));
      setPowerHistory(p => update(p, 10 + layerCount * 2, 0.8));
    }, 1500);
    return () => clearInterval(interval);
  }, [isNight, weather, layerCount]);

  return (
    <div className={`relative w-full h-screen font-sans overflow-hidden transition-colors duration-1000 ${isNight ? 'bg-[#020617]' : 'bg-[#f0f9ff]'}`}>
      
      {/* 3D Canvas Container */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows gl={{ antialias: true }}>
          <PerspectiveCamera makeDefault position={[10, 8, 15]} fov={35} />
          <OrbitControls 
            enablePan={false} 
            maxPolarAngle={Math.PI / 2.1} 
            minDistance={8}
            maxDistance={30}
            autoRotate={!isNight}
            autoRotateSpeed={0.5}
          />
          
          <WeatherManager condition={weather} isNight={isNight} />
          <ambientLight intensity={isNight ? 0.2 : 0.6} />
          <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={isNight ? 1 : 2} castShadow />

          <Suspense fallback={null}>
            <group position={[0, -1, 0]}>
              <TowerBase />
              {Array.from({ length: layerCount }).map((_, i) => (
                <TowerLayer key={i} position={[0, i * 0.8 + 0.6, 0]} growthScale={growthScale} />
              ))}
              <WaterSystem active={isWaterRunning} height={layerCount * 0.8 + 0.6} />
              <SolarPanelRing />
            </group>
            
            <Balcony />
            <CityBackground isNight={isNight} />
            
            <Environment resolution={256}>
              <group rotation={[-Math.PI / 2, 0, 0]}>
                <Lightformer intensity={isNight ? 0.5 : 2} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
              </group>
            </Environment>
            <ContactShadows position={[0, -1.2, 0]} opacity={0.4} scale={20} blur={2.4} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay - Layered on top of Canvas */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-10">
        
        {/* Top Section */}
        <header className="flex justify-between items-start pointer-events-none">
          <div className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl">
            <h1 className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-3 text-white">
              <div className="p-2 bg-green-500 rounded-lg shadow-lg shadow-green-500/30">
                <Leaf className="text-white" size={20} />
              </div>
              未来垂直农场 <span className="text-green-400">V2.0</span>
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-[10px] text-green-400 font-mono bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20 uppercase tracking-widest animate-pulse">
                <Activity size={10} /> 智能离线模式
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pointer-events-auto">
             <div className="bg-black/60 backdrop-blur-xl p-1.5 rounded-full border border-white/10 flex self-end shadow-xl">
                <button
                  onClick={() => setIsNight(!isNight)}
                  className={`p-3 rounded-full transition-all duration-500 ${isNight ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40' : 'bg-orange-400 text-white shadow-lg shadow-orange-400/40'}`}
                >
                  {isNight ? <Moon size={20} /> : <Sun size={20} />}
                </button>
             </div>
             
             <div className="bg-black/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 flex gap-1 shadow-xl">
                <button onClick={() => setWeather('clear')} className={`p-2.5 rounded-xl transition-all ${weather === 'clear' ? 'bg-white/20 text-yellow-400' : 'text-white/40 hover:text-white'}`}><Sun size={18}/></button>
                <button onClick={() => setWeather('cloudy')} className={`p-2.5 rounded-xl transition-all ${weather === 'cloudy' ? 'bg-white/20 text-slate-300' : 'text-white/40 hover:text-white'}`}><Cloud size={18}/></button>
                <button onClick={() => setWeather('rainy')} className={`p-2.5 rounded-xl transition-all ${weather === 'rainy' ? 'bg-white/20 text-blue-400' : 'text-white/40 hover:text-white'}`}><CloudRain size={18}/></button>
             </div>
          </div>
        </header>

        {/* Bottom Section */}
        <footer className="w-full max-w-7xl mx-auto pointer-events-none">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="pointer-events-auto grid grid-cols-1 lg:grid-cols-12 gap-6 bg-black/80 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] shadow-3xl text-white"
          >
            {/* Monitor Panel */}
            <div className="lg:col-span-5 grid grid-cols-3 gap-4 lg:border-r border-white/10 pr-0 lg:pr-6">
               <div className="flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1"><Thermometer size={10}/> 温度</span>
                    <span className="text-xs font-mono font-bold text-orange-400">{tempHistory[tempHistory.length-1]?.value.toFixed(1)}°</span>
                  </div>
                  <TrendChart data={tempHistory} color="#fb923c" height={35} />
               </div>
               <div className="flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1"><Droplets size={10}/> 湿度</span>
                    <span className="text-xs font-mono font-bold text-blue-400">{humidityHistory[humidityHistory.length-1]?.value.toFixed(0)}%</span>
                  </div>
                  <TrendChart data={humidityHistory} color="#60a5fa" height={35} />
               </div>
               <div className="flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1"><Zap size={10}/> 能耗</span>
                    <span className="text-xs font-mono font-bold text-green-400">{powerHistory[powerHistory.length-1]?.value.toFixed(1)}W</span>
                  </div>
                  <TrendChart data={powerHistory} color="#4ade80" height={35} />
               </div>
            </div>

            {/* Control Panel */}
            <div className="lg:col-span-7 flex flex-wrap items-center justify-between gap-6 pl-0 lg:pl-6">
               
               <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1"><Box size={10}/> 种植塔高度</label>
                  <div className="flex items-center gap-4 bg-white/5 p-1 rounded-xl border border-white/5">
                     <button onClick={() => setLayerCount(l => Math.max(1, l-1))} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center active:scale-90"><Minus size={16}/></button>
                     <span className="text-lg font-black font-mono w-6 text-center">{layerCount}</span>
                     <button onClick={() => setLayerCount(l => Math.min(10, l+1))} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center active:scale-90"><Plus size={16}/></button>
                  </div>
               </div>

               <div className="flex-1 min-w-[150px] flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1"><Wind size={10}/> 生长模拟周期</label>
                  <div className="relative pt-2 px-1">
                    <input 
                      type="range" min="0.1" max="1.5" step="0.01" 
                      value={growthScale} 
                      onChange={(e) => setGrowthScale(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-green-500 cursor-pointer"
                    />
                    <div className="flex justify-between mt-2 text-[8px] font-mono text-white/20 uppercase">
                       <span>苗期</span>
                       <span>采收期</span>
                    </div>
                  </div>
               </div>

               <button 
                 onClick={() => setIsWaterRunning(!isWaterRunning)}
                 className={`group relative h-14 px-6 rounded-xl flex items-center gap-4 transition-all duration-500 border overflow-hidden ${isWaterRunning ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-white/40'}`}
               >
                 <div className={`p-2 rounded-lg ${isWaterRunning ? 'bg-blue-500 text-white animate-pulse' : 'bg-white/10'}`}>
                    <Droplets size={16} />
                 </div>
                 <div className="flex flex-col items-start">
                    <span className="text-[9px] font-bold uppercase tracking-widest leading-none">灌溉系统</span>
                    <span className="text-xs font-black mt-1 uppercase">{isWaterRunning ? '运行中' : '已暂停'}</span>
                 </div>
               </button>

            </div>
          </motion.div>
        </footer>
      </div>
    </div>
  );
};

export default App;
