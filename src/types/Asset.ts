import { Metadata } from 'sharp';
import type { Bucket } from '@/types/Bucket';
import type { Exif } from '@/types/Exif';

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

  exif: Exif;

  metadata: Metadata;

  createAt: Date;

  updateAt: Date;
}
