import { Bucket } from '@/types/Bucket';

export class Asset {
  id: number;

  bucket: Bucket;

  cosUrl: string;

  objectUrl: string;

  originUrl: string;

  sn: string;

  tags: string[] = [];

  comment: string;

  fileSuffix: string;

  sha1: string;

  pHash: string;

  createAt: Date;

  updateAt: Date;
}
