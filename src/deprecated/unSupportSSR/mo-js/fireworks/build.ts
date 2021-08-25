import mojs from '@mojs/core';

// Create the bursts
const B_CHILD = {
  fill: { '#ffffff': '#ef1cec' },
  delay: 'rand(300, 359)',
  duration: 700,
  pathScale: 'rand(0.8, 1)',
  isSwirl: true,
  swirlSize: 'stagger(-2,2)',
  swirlFrequency: 1,
};
const B_OPTS = {
  count: 'rand(15,20)',
  top: '100%',
  children: {
    ...B_CHILD,
  },
};
const burst1 = new mojs.Burst({
  ...B_OPTS,
  radius: { 0: 'rand(150,170)' },
  x: -45,
  y: -335,
});

const burst1_2 = new mojs.Burst({
  ...B_OPTS,
  radius: { 0: 'rand(150,170)' },
  x: -45,
  y: -335,
  children: {
    ...B_CHILD,
    delay: 'rand(260, 350)',
    pathScale: 'rand(0.7, 0.8)',
    degreeShift: 20,
  },
});

const burst2 = new mojs.Burst({
  ...B_OPTS,
  radius: { 0: 'rand(100,150)' },
  x: 140,
  y: -315,
  children: {
    ...B_CHILD,
    fill: { '#ffffff': '#d8ff00' },
  },
});

const burst2_2 = new mojs.Burst({
  ...B_OPTS,
  radius: { 0: 'rand(100,150)' },
  x: 140,
  y: -315,
  children: {
    ...B_CHILD,
    fill: { '#ffffff': '#d8ff00' },
    delay: 'rand(260, 350)',
    pathScale: 'rand(0.7, 0.8)',
    degreeShift: 20,
  },
});

// Create interactive burst
const burst_tune = new mojs.Burst({
  ...B_OPTS,
  radius: { 0: 'rand(100,150)' },
  left: 0,
  top: 0,
  x: 0,
  y: 0,
  children: {
    ...B_CHILD,
    delay: 'rand(0, 50)',
    fill: { '#ffffff': '#d8ff00' },
  },
});
const burst_tune_2 = new mojs.Burst({
  ...B_OPTS,
  radius: { 0: 'rand(100,150)' },
  left: 0,
  top: 0,
  children: {
    ...B_CHILD,
    fill: { '#ffffff': '#d8ff00' },
    delay: 'rand(10, 150)',
    pathScale: 'rand(0.7, 0.8)',
    degreeShift: 20,
  },
});
document.addEventListener('click', (e) => {
  burst_tune.generate().tune({ x: e.pageX, y: e.pageY }).replay();
  burst_tune_2.generate().tune({ x: e.pageX, y: e.pageY }).replay();
});

// Create the firework lines
const FW_OPTS = {
  shape: 'curve',
  fill: 'none',
  isShowStart: false,
  strokeWidth: { 3: 0 },
  stroke: '#ffffff',
  strokeDasharray: '100%',
  strokeDashoffset: { '-100%': '100%' },
  duration: 1000,
};
const fw1 = new mojs.Shape({
  ...FW_OPTS,
  radius: 170,
  radiusY: 20,
  top: '100%',
  y: -165,
  angle: 75,
  onStart() {
    burst1.replay(0);
    burst1_2.replay(0);
  },
});

const fw2 = new mojs.Shape({
  ...FW_OPTS,
  radius: 180,
  radiusY: 50,
  top: '100%',
  x: 50,
  y: -155,
  strokeDashoffset: { '100%': '-100%' },
  angle: -60,
  delay: 200,
  onStart() {
    burst2.replay(0);
    burst2_2.replay(0);
  },
});

// Underline under title
const underline = new mojs.Shape({
  parent: document.getElementById('title'),
  shape: 'curve',
  strokeLinecap: 'round',
  fill: 'none',
  isShowStart: false,
  strokeWidth: { '1em': '5em' },
  stroke: '#ffffff',
  strokeDasharray: '200%',
  strokeDashoffset: { '200%': '100%' },
  radius: 150,
  radiusY: 10,
  y: '1.1em',
  angle: -10,
  duration: 2000,
  delay: 1000,
}).then({
  strokeWidth: { '5em': '1em' },
  strokeDashoffset: { '100%': '-200%' },
  duration: 2000,
  delay: 10000,
});
new mojs.Timeline({
  repeat: 2018,
})
  .add(underline)
  .play();

// Fire off the explosions
new mojs.Timeline({
  repeat: 2018,
})
  .add([fw1, fw2])
  .play();

// Create sounds
// var explosion = new Audio("https://www.freesound.org/data/previews/21/21410_21830-lq.mp3"); // buffers automatically when created
// explosion.play();
