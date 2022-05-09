import MoJs from '@mojs/core';
import { getRandomPointInElement } from '@/utils/getRandomPointInRectangle';

const DURATION = 200;

// POOF

const circle = new MoJs.Shape({
  left: 0,
  top: 0,
  fill: 'none',
  radius: 50,
  scale: { 0: 1 },
  opacity: { 1: 0 },
  shape: 'circle',
  stroke: '#ff6a6a',
  strokeWidth: 100,
  duration: 1.5 * DURATION,
  isShowEnd: false,
  isForce3d: true,
  isTimelineLess: true,
});

const cloud = new MoJs.Burst({
  left: 0,
  top: 0,
  radius: { 4: 49 },
  angle: 45,
  count: 12,
  children: {
    radius: 10,
    fill: '#ff6a6a',
    scale: { 1: 0, easing: 'sin.in' },
    pathScale: [0.7, null],
    degreeShift: [13, null],
    duration: [500, 700],
    isShowEnd: false,
    isForce3d: true,
  },
});

const poof = new MoJs.Timeline();
poof.add(circle, cloud);

export const poofClickPlay = (e: HTMLElement) => {
  const [x, y] = getRandomPointInElement(e);
  const coords = { x, y };
  circle.tune(coords);
  cloud.tune(coords);
  poof.replay();
};
