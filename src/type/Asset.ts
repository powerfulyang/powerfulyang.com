import type { Metadata } from 'sharp';
import type { Bucket } from '@/type/Bucket';
import type { Exif } from '@/type/Exif';

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

  size: { width: number; height: number };
}
