import { Asset } from '@/types/Asset';

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
  id!: number;

  assets!: Asset[];

  bucketName!: AssetBucket;

  bucketRegion!: string;

  acl: string;

  createAt: Date;

  updateAt: Date;
}
