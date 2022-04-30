import type { ClipboardEvent } from 'react';
import { copyToClipBoard } from '@powerfulyang/utils';
import { notification } from '@powerfulyang/components';
import { requestAtClient } from '@/utils/client';
import type { Asset } from '@/type/Asset';
import type { Bucket } from '@/type/Bucket';
import { AssetBucket } from '@/type/Bucket';

export const handlePasteImageAndReturnFileList = (e: ClipboardEvent) => {
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

export const fileListToFormData = (
  fileList?: FileList,
  filedName: string = 'files',
  formData?: FormData,
) => {
  const v = formData || new FormData();
  if (fileList) {
    for (let i = 0; i < fileList.length; i++) {
      v.append(filedName, fileList[i]);
    }
  }
  return v;
};

export const uploadFileListAndReturnAsset = async (
  files: FileList,
  bucketName: AssetBucket = AssetBucket.upload,
) => {
  const count = files.length;
  if (count) {
    const formData = fileListToFormData(files);
    const res = await requestAtClient<Asset[]>(`/asset/${bucketName}`, {
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
  name: Bucket['name'] = AssetBucket.upload,
): Promise<Asset[] | null> => {
  const files = handlePasteImageAndReturnFileList(e);
  if (files) {
    return uploadFileListAndReturnAsset(files, name);
  }
  return null;
};

export const copyToClipboardAndNotify = async (text: string | Blob) => {
  await copyToClipBoard(text);
  return notification.success({
    message: '复制成功',
  });
};
