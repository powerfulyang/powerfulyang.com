import type { Asset } from '@/type/Asset';
import type { User } from '@/type/User';

export class Feed {
  id?: number;

  content: string;

  assets: Asset[];

  createBy: User;

  createAt?: Date;

  updateAt?: Date;
}
