export const getRandomPointInRectangle = (x1: number, x2: number, y1: number, y2: number) => {
  const x = Math.min(x1, x2) + Math.random() * Math.abs(x2 - x1);
  const y = Math.min(y1, y2) + Math.random() * Math.abs(y2 - y1);
  return [x, y];
};

export const getRandomPointInElement = (e: HTMLElement) => {
  const { offsetTop, offsetHeight, offsetWidth, offsetLeft } = e;
  return getRandomPointInRectangle(
    offsetLeft,
    offsetWidth + offsetLeft,
    offsetTop,
    offsetHeight + offsetTop,
  );
};
