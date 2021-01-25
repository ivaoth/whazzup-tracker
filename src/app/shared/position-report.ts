export interface PositionReport {
  timestamp: Date;
  latitude: number;
  longitude: number;
  altitude: number;
  heading: number;
  onGround: boolean;
  groundSpeed: number;
  squawk: string;
}
