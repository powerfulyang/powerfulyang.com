import { User } from '@/types/User';

export interface Post {
  id: number;
  title: string;
  content: string;
  user: User;
  tags: string[];
  createAt: Date;
  updateAt: Date;
}
