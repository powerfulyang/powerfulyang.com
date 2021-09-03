import { ClipboardEvent } from 'react';
import { clientRequest } from '@/utils/request';
import { Asset } from '@/types/Asset';
import { AssetBucket, Bucket } from '@/types/Bucket';

export const handlePasteImageAndReturnFileList = async (e: ClipboardEvent) => {
  const { types } = e.clipboardData;

  if (types.every((x) => x.startsWith('text'))) {
    return null;
  }
  const count = e.clipboardData.files.length;
  if (count) {
    e.preventDefault();
    return e.clipboardData.files;
  }
  return null;
};

export const uploadFileListAndReturnAsset = async (
  files: FileList,
  bucketName: AssetBucket = AssetBucket.upload,
) => {
  const count = files.length;
  if (count) {
    const formData = new FormData();
    for (let i = 0; i < count; i++) {
      formData.append(`files`, files.item(i)!);
    }
    const res = await clientRequest(`/asset/${bucketName}`, {
      method: 'POST',
      body: formData,
    });
    const { data } = res;
    return data;
  }
  return null;
};

export const handlePasteImageAndReturnAsset = async (
  e: ClipboardEvent,
  bucketName: Bucket['bucketName'] = AssetBucket.upload,
): Promise<Asset[] | null> => {
  const files = await handlePasteImageAndReturnFileList(e);
  if (files) {
    return uploadFileListAndReturnAsset(files, bucketName);
  }
  return null;
};
