import mojs from '@mojs/core';

export const CreateElements = () => {
  const CIRCLE_RADIUS = 20;
  const RADIUS = 32;
  const circle = new mojs.Shape({
    left: 0,
    top: 0,
    stroke: '#FF9C00',
    strokeWidth: { [2 * CIRCLE_RADIUS]: 0 },
    fill: 'none',
    scale: { 0: 1 },
    radius: CIRCLE_RADIUS,
    duration: 400,
    easing: 'cubic.out',
  });

  const burst = new mojs.Burst({
    left: 0,
    top: 0,
    radius: { 4: RADIUS },
    angle: 45,
    count: 14,
    timeline: { delay: 300 },
    children: {
      radius: 2.5,
      fill: '#FD7932',
      scale: { 1: 0, easing: 'quad.in' },
      pathScale: [0.8, null],
      degreeShift: [13, null],
      duration: [500, 700],
      easing: 'quint.out',
    },
  });
  const heart = new mojs.Shape({
    left: 0,
    top: 2,
    shape: 'heart',
    fill: '#E5214A',
    scale: { 0: 1 },
    opacity: { 0: 1 },
    easing: 'elastic.out',
    delay: 300,
    duration: 300,
    radius: 11,
  }).then({
    opacity: { 1: 0, easing: 'quad.in' },
    duration: 200,
  });

  return [burst, circle, heart];
};
