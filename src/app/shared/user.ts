import { GroupedWhazzupSession } from './whazzup-session';

export interface User {
  vid: string;
  sessions: GroupedWhazzupSession[];
}
