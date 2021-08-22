import { User } from '@/types/User';

type PathViewCount = {
  pathViewCount: number;
};

export interface Post extends PathViewCount {
  id: number;
  title: string;
  content: string;
  createBy: User;
  tags: string[];
  createAt: Date;
  updateAt: Date;
}
