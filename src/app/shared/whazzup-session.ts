import { FlightPlan } from './flight-plan';
import { PositionReport } from './position-report';

interface WhazzupSession {
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

type FlightPlanWithSessionOrder = FlightPlan & { sessionOrder: number };
type PositionReportWithSessionOrder = PositionReport & { sessionOrder: number };

type GroupedWhazzupSession = WhazzupSession & { order: number };
type CombinedWhazzupSession = WhazzupSession & { flightPlans: FlightPlanWithSessionOrder[]; positionReports: PositionReportWithSessionOrder[] };
