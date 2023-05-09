import type { ClipboardEvent } from 'react';
import { toast } from 'react-hot-toast';
import { uniqueId } from '@powerfulyang/utils';
import type { Asset, CosBucket } from '@/__generated__/api';
import { clientApi } from '@/request/requestTool';

export const appendToFileList = (source: File[], append: FileList) => {
  return [...source, ...append];
};

export const removeFromFileList = (source: File[], index: number) => {
  return source.filter((_, i) => i !== index);
};

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
export const uploadFileListAndReturnAsset = async (
  files: FileList,
  bucketName: CosBucket['name'] = 'upload',
) => {
  const count = files.length;
  if (count) {
    const assets = Array.from(files);
    return clientApi.saveAssetToBucket(bucketName, { assets });
  }
  return null;
};

export const handlePasteImageAndReturnAsset = async (
  e: ClipboardEvent,
  name: CosBucket['name'] = 'upload',
): Promise<Asset[] | null> => {
  const files = handlePasteImageAndReturnFileList(e);
  if (files) {
    const res = await uploadFileListAndReturnAsset(files, name);
    return res?.data || null;
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
      toast.success('复制成功');
    })
    .catch((e) => {
      toast.success(e.message);
    });
};

export const sourceUrlToFile = (url: string) => {
  return fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const name = uniqueId('timeline-image');
      return new File([blob], name, { type: blob.type });
    });
};
