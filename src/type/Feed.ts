import type { Asset } from '@/type/Asset';
import type { User } from '@/type/User';

export class Feed {
  id: number;

  content: string;

  public: boolean;

  assets: Asset[];

  createBy: User;

  createdAt: string;

  updatedAt: string;
}

export interface FeedCreate {
  content: string;

  public: boolean;

  assets: FileList;
}
