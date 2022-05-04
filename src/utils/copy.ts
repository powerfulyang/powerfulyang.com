import type { ClipboardEvent } from 'react';
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

export const convertToPng = (blob: Blob) => {
  return new Promise<Blob>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((res) => {
          if (res) {
            resolve(res);
          } else {
            reject(new Error('convert to png error'));
          }
        }, 'image/png');
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(blob);
  });
};

export const copyToClipBoard = async (content: string | Blob) => {
  if (typeof content === 'string') {
    return navigator.clipboard.writeText(content);
  }
  if (content.type.startsWith('image')) {
    let blob = content;
    if (content.type !== 'image/png') {
      blob = await convertToPng(content);
    }
    return navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);
  }
  throw new Error('unsupported type!');
};

export const copyToClipboardAndNotify = (text: string | Blob) => {
  copyToClipBoard(text)
    .then(() => {
      notification.success({
        message: '复制成功',
      });
    })
    .catch((e) => {
      notification.error({
        message: '复制失败',
        description: e.message,
      });
    });
};
