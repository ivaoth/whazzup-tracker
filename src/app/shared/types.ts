export type WhazzupData = {
  updatedAt: string;
  servers: IServersItem[];
  voiceServers: IVoiceServersItem[];
  clients: IClients;
  connections: IConnections;
};
export type IServersItem = {
  id: string;
  hostname: string;
  ip: string;
  description: string;
  countryId: string;
  currentConnections: number;
  maximumConnections: number;
};
export type IVoiceServersItem = {
  id: string;
  hostname: string;
  ip: string;
  description: string;
  countryId: string;
  currentConnections: number;
  maximumConnections: number;
};
export type IClients = {
  pilots: IPilotsItem[];
  atcs: IAtcsItem[];
  followMe: IFollowMeItem[];
  observers: IObserversItem[];
};
export type IPilotsItem = {
  time: number;
  id: number;
  userId: number;
  callsign: string;
  serverId: string;
  softwareTypeId: string;
  softwareVersion: string;
  rating: number;
  createdAt: string;
  flightPlan: IFlightPlan;
  pilotSession: IPilotSession;
  lastTrack: IPilotLastTrack;
};

export type PilotSession = Omit<
  Omit<IPilotsItem, 'flightPlan'>,
  'lastTrack'
> & { flightPlans: IFlightPlan[]; tracks: IPilotLastTrack[] };

export type IFlightPlan = {
  revision: number;
  aircraftId: string;
  aircraftNumber: number;
  departureId: string;
  arrivalId: string;
  alternativeId: string | null;
  alternative2Id: null | string;
  route: string;
  remarks: string | null;
  speed: string;
  level: string;
  flightRules: string;
  flightType: string;
  eet: number;
  endurance: number;
  departureTime: number;
  actualDepartureTime: number;
  peopleOnBoard: number;
  createdAt: string;
  updatedAt: string;
  aircraftEquipments: string;
  aircraftTransponderTypes: string;
  aircraft: IAircraft;
};
export type IAircraft = {
  icaoCode: string;
  model: string;
  wakeTurbulence: string;
  isMilitary: boolean | null;
  description: string;
};
export type IPilotSession = {
  simulatorId: string | null;
  textureId?: null;
};
export type IPilotLastTrack = {
  altitude: number;
  altitudeDifference: number;
  arrivalDistance: number;
  departureDistance: number;
  groundSpeed: number;
  heading: number;
  latitude: number;
  longitude: number;
  onGround: boolean;
  state: string;
  time: number;
  timestamp: string;
  transponder: number;
  transponderMode: string;
};
export type IATCLastTrack = {
  latitude: number;
  longitude: number;
  time: number;
  timestamp: string;
  distance: number;
};
export type IAtcsItem = {
  time: number;
  id: number;
  userId: number;
  callsign: string;
  serverId: string;
  softwareTypeId: string;
  softwareVersion: string;
  rating: number;
  createdAt: string;
  atcSession: IAtcSession;
  atis: IAtis;
  lastTrack: IATCLastTrack;
};
export type IAtcSession = {
  frequency: number;
  position: string | null;
};
export type IAtis = {
  lines: string[];
  revision: string;
  timestamp: string;
};
export type IFollowMeItem = {
  time: number;
  id: number;
  userId: number;
  callsign: string;
  serverId: string;
  softwareTypeId: string;
  softwareVersion: string;
  rating: number;
  createdAt: string;
  pilotSession: IPilotSession;
  lastTrack: IPilotLastTrack;
};
export type IObserversItem = {
  time: number;
  id: number;
  userId: number;
  callsign: string;
  serverId: string;
  softwareTypeId: string;
  softwareVersion: string;
  rating: number;
  createdAt: string;
  atcSession: IAtcSession;
  lastTrack: IATCLastTrack;
};
export type IConnections = {
  atc: number;
  followMe: number;
  observers: number;
  pilots: number;
  supervisors: number;
  total: number;
  worldTours: number;
};

export type PilotSessionWithValidation = PilotSession & {
  validated?: boolean;
  valid?: boolean;
};
