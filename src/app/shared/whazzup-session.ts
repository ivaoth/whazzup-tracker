import { FlightPlan } from './flight-plan';
import { PositionReport } from './position-report';

export interface WhazzupSession {
  valid: boolean;
  validated: boolean;
  id: number;
  callsign: string;
  vid: string;
  type: string;
  name: string;
  connectionTime: Date;
  updatedTime: Date;
  softwareName: string;
  softwareVersion: string;
  rating: string;
  flightPlans: FlightPlan[];
  positions: PositionReport[];
}
