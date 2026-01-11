
export interface FarmState {
  layerCount: number;
  growthScale: number;
  isWaterRunning: boolean;
}

export interface LayerProps {
  position: [number, number, number];
  growthScale: number;
  isWaterRunning: boolean;
}
