import { Asset } from './Asset';

export interface User {
  id: number;
  nickname: string;
  avatar: string;
  timelineBackground: Asset;
  bio: string;
}
