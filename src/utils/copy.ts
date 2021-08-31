import { ClipboardEvent } from 'react';

export const handlePaste = async (e: ClipboardEvent) => {
  const result: {
    files: File[];
  } = {
    files: [],
  };
  const { types } = e.clipboardData;

  if (types.every((x) => x.startsWith('text'))) {
    return result;
  }
  const count = e.clipboardData.files.length;
  if (count) {
    e.preventDefault();
    for (let i = 0; i < count; i++) {
      const file = e.clipboardData.files.item(i);
      if (file) {
        result.files.push(file);
      }
    }
  }
  return result;
};

export const handlePasteImage = async (e: ClipboardEvent) => {
  const result = await handlePaste(e);
  const { files } = result;
  const count = files.length;
  const formData = new FormData();
  if (count) {
    for (let i = 0; i < count; i++) {
      formData.append(`files`, files[i]);
    }
    return formData;
  }
  return null;
};
