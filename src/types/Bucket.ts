import { Asset } from '@/types/Asset';

export class Bucket {
  id!: number;

  assets!: Asset[];

  bucketName!: string;

  bucketRegion!: string;

  acl: string;

  createAt: Date;

  updateAt: Date;
}
