import { PilotSessionWithValidation } from './types';

export interface User {
  userId: number;
  sessions: PilotSessionWithValidation[];
}
