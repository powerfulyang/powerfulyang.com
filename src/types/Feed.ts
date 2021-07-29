import { Asset } from '@/types/Asset';
import { User } from '@/types/User';

export class Feed {
  id?: number;

  content: string;

  assets?: Asset[];

  createBy: User;

  createAt?: Date;

  updateAt?: Date;
}
