export interface PositionReport {
  id: number;
  time: Date;
  latitude: number;
  longtitude: number;
  altitude: number;
  heading: number;
  onGround: number;
  groundSpeed: number;
  squawk: string;
  clientId: number;
}
