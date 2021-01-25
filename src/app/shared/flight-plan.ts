export interface FlightPlan {
  sequence: number;
  fullAircraft: string;
  aircraft: string;
  wakeTurbulance: string;
  cruisingSpeed: string;
  cruisingLevel: string;
  departure: string;
  destination: string;
  flightRules: string;
  departureTime: string;
  enrouteTime: number;
  endurance: number;
  alternate: string;
  alternate2: string;
  remarks: string;
  route: string;
  typeOfFlight: string;
  pob: number;
  timestamp: Date;
}
