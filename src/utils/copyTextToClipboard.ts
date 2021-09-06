export const copyTextToClipboard = (text: string) => {
  return navigator.clipboard.writeText(text);
};
