import type { Asset } from '@/type/Asset';
import type { User } from '@/type/User';

export class Feed {
  id: number;

  content: string;

  assets: Asset[];

  createBy: User;

  createAt: string;

  updateAt: string;
}

export interface FeedCreate {
  content: string;

  public: boolean;

  assets: FileList;
}
