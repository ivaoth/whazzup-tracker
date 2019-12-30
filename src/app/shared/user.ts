import { WhazzupSession } from './whazzup-session';

export interface User {
  vid: string;
  sessions: WhazzupSession[];
}
