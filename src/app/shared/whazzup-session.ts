import { FlightPlan } from './flight-plan';
import { PositionReport } from './position-report';

export interface WhazzupSession {
  valid: boolean;
  validated: boolean;
  callsign: string;
  vid: string;
  type: string;
  name: string;
  connectionTime: Date;
  lastUpdatedTime: Date;
  softwareName: string;
  softwareVersion: string;
  rating: string;
  flightPlans: FlightPlan[];
  positionReports: PositionReport[];
}

export type FlightPlanWithSessionOrder = FlightPlan & { sessionOrder: number };
export type PositionReportWithSessionOrder = PositionReport & { sessionOrder: number };

export type GroupedWhazzupSession = WhazzupSession & { order: number };
export type CombinedWhazzupSession = WhazzupSession & { flightPlans: FlightPlanWithSessionOrder[]; positionReports: PositionReportWithSessionOrder[] };
