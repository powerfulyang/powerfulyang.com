import { User } from '@/types/User';

export class Todo {
  id: number;

  info: string;

  desc: string;

  createBy: User;

  updateBy: User;

  createAt: Date;

  deadline: Date;

  updateAt: Date;
}
