import { Asset } from '@/type/Asset';
import { User } from '@/type/User';

export class Feed {
  id?: number;

  content: string;

  assets: Asset[];

  createBy: User;

  createAt?: Date;

  updateAt?: Date;
}
