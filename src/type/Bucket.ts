import type { Asset } from '@/type/Asset';

export enum AssetBucket {
  instagram = 'instagram',
  pixiv = 'pixiv',
  pinterest = 'pinterest',
  gallery = 'gallery',
  upload = 'upload',
  public = 'pubic',
  timeline = 'timeline',
  post = 'post',
}

export class Bucket {
  id: number;

  assets: Asset[];

  Bucket: string;

  Region: string;

  createdAt: Date;

  updatedAt: Date;

  name: AssetBucket;
}
