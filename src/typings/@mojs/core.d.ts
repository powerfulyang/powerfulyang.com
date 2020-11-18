// eslint-disable-next-line max-classes-per-file
declare module '@mojs/core' {
  export default mojs;
}

declare namespace mojs {
  function addShape(name: string, shape: any);

  class Module {
    constructor(opts?: any);
  }
  class CustomShape {}

  /** Easing */
  interface LinearEase {
    none();
  }

  interface DefaultEasing {
    in(p: any);
    out(p: any);
    inout(p: any);
  }

  class Tweenable extends Module {
    /**
     *  Starts playback.
     *  @param shift {Number} Start progress shift in milliseconds.
     */
    play(shift?: number);

    /**
     *  Starts playback in backward direction.
     *  @param shift {Number} Start progress shift in milliseconds.
     */
    playBackward(shift?: number);

    /**
     *  Pause
     *  */
    pause();

    /**
     *  Restarts playback.
     *  @param shift {Number} Start progress shift in milliseconds.
     *  */
    replay(shift?: number);

    /**
     *  Restarts playback in backward direction.
     *  @param shift {Number} Start progress shift in milliseconds.
     *  */
    replayBackward(shift?: number);

    /**
     *  Resumes playback in direction it was prior to `pause`.
     *  @param shift {Number} Start progress shift in milliseconds.
     *  */
    resume(shift?: number);

    /**
     *  Sets progress of the tween.
     *  @param progress {Number} Progress to set [ 0..1 ].
     *  */
    setProgress(progress);

    /**
     *  Sets speed of the tween.
     *  @param speed {Number} Progress to set [ 0..∞ ].
     *  */
    setSpeed(speed);

    /**
     *  Stops and resets the tween
     */
    reset();
  }
  class Thenable extends Tweenable {
    /**
     *  Creates next state transition chain.
     */
    then(o: Object): this;
  }
  class Tunable extends Thenable {
    /**
     *  Tunes start state with new options.
     *  @param options {Object} New start properties.
     */
    tune(opts: Object): this;

    /**
     *  Regenerates all randoms in initial properties.
     */
    generate(): this;
  }
  class Shape extends Tunable {
    constructor(opts: ShapeOptions);
  }

  interface ShapeOptions {
    /**
     *  Parent of the module.
     *  {String, Object}
     *  [selector, HTMLElement]
     */
    parent?: string | Object | HTMLElement;

    /**
     * Class Name
     * {string}
     */
    className?: string;

    /**
     *  Name of Shape
     *  {string}
     *  [ 'circle' | 'rect' | 'polygon' | 'line' | 'cross' | 'equal' | 'curve' | 'zigzag' | '*custom defined name*' ]
     */
    shape?: string;

    /**
     * Stroke color.
     * {String}
     * ∆ :: Possible values: [color name, rgb, rgba, hex]
     */
    stroke?: string | any | any;

    /**
     *  Stroke Opacity.
     *  {Number}
     *  ∆ :: Possible values: [ 0..1 ]
     */
    strokeOpacity?: number | any;

    /**
     *  Stroke Line Cap.
     *  {String}
     *  ['butt' | 'round' | 'square']
     */
    strokeLinecap?: string | any;

    /**
     *  Stroke Width.
     *  {Number}
     *  ∆ :: Possible values: [ number ]
     */
    strokeWidth?: number | { [delta: number]: number };

    /**
     *  Stroke Dash Array.
     *  ∆ :: Units :: Possible values: [ number, string ]
     */
    strokeDasharray?: string | number | { [delta: string]: string } | { [delta: string]: string };

    /**
     *  Stroke Dash Offset.
     *  ∆ :: Units :: Possible values: [ number, string ]
     */
    strokeDashoffset?: string | number | { [delta: string]: string } | { [delta: number]: number };

    /**
     *  Fill Color.
     *  {String}
     *  ∆ :: Possible values: [color name, rgb, rgba, hex]
     */
    fill?: string | { [delta: string]: string } | any;

    /**
     *  Fill Opacity.
     *  {Number}
     *  ∆ :: Possible values: [ 0..1 ]
     */
    fillOpacity?: number | { [delta: number]: number };

    /**
     *  Left position of the module.
     *  ∆ :: Units :: Possible values: [ number, string ]
     */
    left?: string | number | { [delta: string]: string };

    /**
     *  Top position of the module.
     *  ∆ :: Units :: Possible values: [ number, string ]
     */
    top?: string | number | { [delta: string]: string };

    /**
     *  X shift.
     *  ∆ :: Units :: Possible values: [ number, string ]
     */
    x?: number | string | { [delta: string]: number | string };

    /**
     *  Y shift.
     *  ∆ :: Possible values: [ number ]
     */
    y?: number | { [delta: string]: number };

    /**
     *  Angle.
     *  ∆ :: Possible values: [ number ]
     */
    angle?: number | string | { [delta: string]: number };

    /**
     *  Scale of the module.
     *  ∆ :: Possible values: [ number ]
     */
    scale?: number | { [delta: string]: number };

    /**
     *  Explicit scaleX value (fallbacks to `scale`).
     *  ∆ :: Possible values: [ number ].
     */
    scaleX?: number | { [delta: string]: number };

    /**
     *  Explicit scaleX value (fallbacks to `scale`).
     *  ∆ :: Possible values: [ number ].
     */
    scaleY?: number | { [delta: string]: number };

    /**
     *  Origin for `x`, `y`, `scale`, `rotate` properties.
     *  ∆ :: Possible values: [ number, string ]
     */
    origin?: string | { [delta: string]: number | string };

    /**
     *  Opacity.
     *  {Number}
     *  ∆ :: Possible values: [ 0..1 ]
     */
    opacity?: number | { [delta: string]: number };

    /**
     *  X border radius.
     *  ∆ :: Units :: Possible values: [ number, string ]
     */
    rx?: number | string | { [delta: string]: number | string };

    /**
     *  Y border radius.
     *  ∆ :: Units :: Possible values: [ number, string ]
     */
    ry?: number | string | { [delta: string]: number | string };

    /**
     *  Points count ( for polygon, zigzag, equal ).
     *  ∆ :: Possible values: [ number ]
     */
    points?: number | string | { [delta: string]: number };

    /**
     *  Radius of the shape.
     *  ∆ :: Possible values: [ number ]
     */
    radius?: number | string | { [delta: string]: number };

    /**
     *  Radius X of the shape (fallbacks to `radius`).
     *  ∆ :: Possible values: [ number ]
     */
    radiusX?: number | string | { [delta: string]: number };

    /**
     *  Radius Y of the shape (fallbacks to `radius`).
     *  ∆ :: Possible values: [ number ]
     */
    radiusY?: number | string | { [delta: string]: number };

    /**
     *  If should hide module with `transforms` instead of `display`.
     *  {Boolean}
     */
    isSoftHide?: boolean;

    /**
     *  If should trigger composite layer for the module.
     *  {Boolean}
     */
    isForce3d?: boolean;

    /**
     *  If should be shown before animation starts.
     *  {Boolean}
     */
    isShowStart?: boolean;

    /**
     *  If should be shown after animation ends.
     *  {Boolean}
     */
    isShowEnd?: boolean;

    /**
     *  If refresh state on subsequent plays.
     *  {Boolean}
     */
    isRefreshState?: boolean;

    /**
     *  Context callbacks will be called with.
     *  {Object}
     */
    callbacksContext?: Object;

    /**
     *  Duration
     */
    duration?: number;

    /**
     *  Delay
     */
    delay?: number;

    /**
     *  If should repeat after animation finished
     *  {Number} *(1)
     */
    repeat?: number;

    /**
     *  Speed of the tween
     *  {Number}
     *  [0..∞]
     */
    speed?: number | any;

    /**
     *  If the progress should be flipped on repeat animation end
     *  {Boolean}
     */
    yoyo?: boolean;

    /**
     *  Easing function
     *  {String, Function}
     *  [ easing name, path coordinates, bezier string, easing function ]
     */
    easing?: string | Function;

    /**
     *  Easing function for backward direction of the tween animation (fallbacks to `easing`)
     *  {String, Function}
     *  [ easing name, path coordinates, bezier string, easing function ]
     */
    backwardEasing?: string | Function;

    /**
     *  Fires on every update of the tween in any period (including delay periods). You probably want to use `onUpdate` method instead.
     *  @param p {Number} Normal (not eased) progress.
     *  @param isForward {Boolean} Direction of the progress.
     *  @param isYoyo {Boolean} If in `yoyo` period.
     */
    onProgress?: (progress: number, isForward?: boolean, isYoyo?: boolean) => any;

    /**
     *  Fires when tween's the progress reaches `0` point in normal or repeat period.
     *  @param isForward {Boolean} If progress moves in forward direction.
     *  @param isYoyo {Boolean} If progress inside `yoyo` flip period.
     */
    onStart?: (isForward: boolean, isYoyo: boolean) => any;

    /**
     *  Fires when tween's the progress reaches `0` point in normal or repeat period.
     *  @param isForward {Boolean} If progress moves in forward direction.
     *  @param isYoyo {Boolean} If progress inside `yoyo` flip period.
     */
    onFirstUpdate?: (isForward, isYoyo) => any;

    /**
     *  Fires on first update of the tween in sufficiently active period (excluding delay periods).
     *  @param ep {Number} Eased progress.
     *  @param p {Number} Normal (not eased) progress
     *  @param isForward {Boolean} Direction of the progress.
     *  @param isYoyo {Boolean} If in `yoyo` period.
     */
    onUpdate?: (ep, p, isForward, isYoyo) => any;

    /**
     *  Fires when tween's the progress reaches `1` point in normal or repeat period.
     *  @param isForward {Boolean} If progress moves in forward direction.
     *  @param isYoyo {Boolean} If progress inside `yoyo` flip period.
     */
    onRepeatComplete?: (isForward, isYoyo) => any;

    /**
     *  Fires when tween's the entire progress reaches `1` point(doesn't fire in repeat periods).
     *  @param isForward {Boolean} If progress moves in forward direction.
     *  @param isYoyo {Boolean} If progress inside `yoyo` flip period.
     */
    onComplete?: (isForward, isYoyo) => any;

    /**
     *  Fires when the `.play` method called and tween isn't in play state yet.
     */
    onPlaybackStart?: () => any;

    /**
     *  Fires when the `.pause` method called and tween isn't in pause state yet.
     */
    onPlaybackPause?: () => any;

    /**
     *  Fires when the `.stop` method called and tween isn't in stop state yet.
     */
    onPlaybackStop?: () => any;

    /**
     *  Fires when the tween end's animation (regardless progress)
     */
    onPlaybackComplete?: () => any;

    width?: any;
    height?: any;
  }

  class easing {
    static bezier(...args);
    static mix(...args);
    static path(path: string);
    static approximate(slowEasing: any);
    static inverse();
    static linear: DefaultEasing;

    static ease: DefaultEasing;

    static sin: DefaultEasing;

    static quad: DefaultEasing;

    static cubic: DefaultEasing;

    static quart: DefaultEasing;

    static quint: DefaultEasing;

    static expo: DefaultEasing;

    static circ: DefaultEasing;

    static back: DefaultEasing;

    static elastic: DefaultEasing;

    static bounce: DefaultEasing;
  }

  interface h {
    NS();
    logBadgeCss();
    force3d(el: any);
  }

  interface HTMLOptions {
    /**
     *  HTMLElement to animate.
     *  {String, Object}
     *  [selector, HTMLElement]
     */
    el?: string | HTMLElement | Object;

    /**
     *  translateX property.
     *  {String, Number, Object}
     *  [value, delta]
     */
    x?: string | number | Object;

    // ∆ ::
    /**
     *  translateY property.
     *  {String, Number, Object}
     *  [value, delta]
     */
    y?: string | number | Object;

    /**
     *  translateZ property.
     *  {String, Number, Object}
     *  [value, delta]
     */
    z?: string | number | Object;

    /**
     *  skewX property.
     *  {String, Number, Object}
     *  [value, delta]
     */
    skewX?: string | number | Object;

    /**
     *  skewY property.
     *  {String, Number, Object}
     *  [value, delta]
     */
    skewY?: string | number | Object;

    /**
     *  rotateX property.
     *  {String, Number, Object}
     *  [value, delta]
     */
    angleX?: string | number | {};

    /**
     *  rotateY property.
     *  {String, Number, Object}
     *  [value, delta]
     */
    angleY?: string | number | {};

    /**
     *  rotateZ property.
     *  {String, Number, Object}
     *  [value, delta]
     */
    angleZ?: string | number | {};

    /**
     *  scale property.
     *  {String, Number, Object}
     *  [value, delta]
     */
    scale?: string | number | {};

    /**
     *  scaleX property.
     *  {String, Number, Object}
     *  [value, delta]
     */
    scaleX?: string | number | {};

    /**
     *  scaleY property.
     *  {String, Number, Object}
     *  [value, delta]
     */
    scaleY?: string | number | {};

    /**
     *  opacity property.
     *  {String, Number, Object}
     *  [value, delta]
     */
    opacity?: string | number | {};

    /**
     *  Fires on every update of the tween in any period (including delay periods). You probably want to use `onUpdate` method instead.
     *  @param p {Number} Normal (not eased) progress.
     *  @param isForward {Boolean} Direction of the progress.
     *  @param isYoyo {Boolean} If in `yoyo` period.
     */
    onProgress?: (progress: number, isForward?: boolean, isYoyo?: boolean) => any;

    /**
     *  Fires when tween's the progress reaches `0` point in normal or repeat period.
     *  @param isForward {Boolean} If progress moves in forward direction.
     *  @param isYoyo {Boolean} If progress inside `yoyo` flip period.
     */
    onStart?: (isForward: boolean, isYoyo: boolean) => any;
    /**
     *  Fires when tween's the progress reaches `0` point in normal or repeat period.
     *  @param isForward {Boolean} If progress moves in forward direction.
     *  @param isYoyo {Boolean} If progress inside `yoyo` flip period.
     */
    onFirstUpdate?: (isForward, isYoyo) => any;
    /**
     *  Fires on first update of the tween in sufficiently active period (excluding delay periods).
     *  @param ep {Number} Eased progress.
     *  @param p {Number} Normal (not eased) progress
     *  @param isForward {Boolean} Direction of the progress.
     *  @param isYoyo {Boolean} If in `yoyo` period.
     */
    onUpdate?: (ep, p, isForward, isYoyo) => any;

    /**
     *  Fires when tween's the progress reaches `1` point in normal or repeat period.
     *  @param isForward {Boolean} If progress moves in forward direction.
     *  @param isYoyo {Boolean} If progress inside `yoyo` flip period.
     */
    onRepeatComplete?: (isForward, isYoyo) => any;

    /**
     *  Fires when tween's the entire progress reaches `1` point(doesn't fire in repeat periods).
     *  @param isForward {Boolean} If progress moves in forward direction.
     *  @param isYoyo {Boolean} If progress inside `yoyo` flip period.
     */
    onComplete?: (isForward, isYoyo) => any;

    /**
     *  Fires when the `.play` method called and tween isn't in play state yet.
     */
    onPlaybackStart?: () => any;

    /**
     *  Fires when the `.pause` method called and tween isn't in pause state yet.
     */
    onPlaybackPause?: () => any;

    /**
     *  Fires when the `.stop` method called and tween isn't in stop state yet.
     */
    onPlaybackStop?: () => any;

    /**
     *  Fires when the tween end's animation (regardless progress)
     */
    onPlaybackComplete?: () => any;
  }

  class Html extends Thenable {
    constructor(opts: HTMLOptions);
  }

  interface ShapeSwirlOptions extends ShapeOptions {
    /**
     *  Diviation size of sine.
     *  ∆ :: [number > 0] :: Degree size of the sinusoidal path.
     */
    swirlSize?: number | { [delta: string]: string };

    /**
     *  Frequency of sine.
     *  ∆ :: [number > 0] :: Frequency of the sinusoidal path.
     */
    swirlFrequency?: number | { [delta: string]: number };

    /**
     *  Sine length scale.
     *   ∆ :: [number > 0] :: Sinusoidal path length scale.
     *  [ 0..1 ]
     */
    pathScale?: number | { [delta: string]: number };

    /**
     *  Degree shift for sine path.
     *  ∆ :: [number] :: Degree shift for the sinusoidal path
     */
    degreeShift?: number | { [delta: string]: number };

    /**
     *  Radius of the shape
     *  ∆ :: [number] :: Radius of the shape.
     */

    radius?: number | { [delta: string]: number };

    /**
     *   ∆ :: Units :: Possible values: [ number, string ]
     */
    x?: number | string | { [delta: string]: number | string };

    /**
     *  ∆ :: Units :: Possible values: [ number, string ]
     */
    y?: number | { [delta: string]: number };

    /**
     *  ∆ :: Units :: Possible values: [ number ]
     */
    scale?: number | { [delta: number]: number };

    /**
     *   Directon of sine.
     *  {Number}
     *  [ -1, 1 ]
     */
    direction?: number;

    /**
     *  If shape should follow sinusoidal path.
     *  {Boolean}
     */
    isSwirl?: boolean;

    isTimelineLess?: boolean;
  }

  class ShapeSwirl extends Shape {
    constructor(opts: ShapeSwirlOptions);
  }

  interface BurstOptions {
    /**
     *  Parent of the module.
     *  {String, Object}
     *  [selector, HTMLElement]
     */
    parent?: string | Object | HTMLElement;

    /**
     * Class Name
     * {string}
     */
    className?: string;

    /**
     *  Left position of the module.
     *  {Number, String}
     */
    left?: string | number;

    /**
     *  Top position of the module.
     *  {Number, String}
     */
    top?: string | number;

    /**
     *  X shift.
     *  {Number, String}
     */
    x?: number | string;

    /**
     *  Y shift.
     *  {Number, String}
     */
    y?: number | string;

    /**
     *  Angle.
     *  {Number, String}
     */
    angle?: number | string;

    /**
     *  Scale of the module.
     *  {Number}
     */
    scale?: number;

    /**
     *  Explicit scaleX value (fallbacks to `scale`).
     *  {Number}
     */
    scaleX?: number;

    /**
     *  Explicit scaleX value (fallbacks to `scale`).
     *  {Number}
     */
    scaleY?: number;

    /**
     *  Origin for `x`, `y`, `scale`, `rotate` properties.
     *  {String}
     */
    origin?: string;

    /**
     *  Opacity.
     *  {Number}
     *  [ 0..1 ]
     */
    opacity?: number;

    /**
     *  Quantity of Burst particles.
     *  {Number}
     *  [ > 0 ]
     */
    count: number;

    /**
     *  Degree of circlular shape that the particles form.
     *  {Number}
     *  [ > 0 ]
     */
    degree?: number;

    /**
     *  Radius of the Burst.
     *  {Number}
     */
    radius: number | { [data: number]: number };

    /**
     *  Radius X of the Burst.
     *  {Number}
     */
    radiusX?: number;

    /**
     *  Radius Y of the Burst.
     *  {Number}
     */
    radiusY?: number;

    /**
     *  If should hide module with `transforms` instead of `display`.
     *  {Boolean}
     */
    isSoftHide?: boolean;

    /**
     *  If should trigger composite layer for the module.
     *  {Boolean}
     */
    isForce3d?: boolean;

    /**
     *  If should be shown before animation starts.
     *  {Boolean}
     */
    isShowStart?: boolean;

    /**
     *  If should be shown after animation ends.
     *  {Boolean}
     */
    isShowEnd?: boolean;

    /**
     *  If refresh state on subsequent plays.
     *  {Boolean}
     */
    isRefreshState?: boolean;

    /*
      Options for each children ShapeSwirl element. {Object}
      Supports `Stagger` strings for numeric values and `Property Maps` overall.
      see `Stagger Strings` and `Property Maps` section for more info.
    */
    children: {
      /* (+) SHAPE SWIRL PROPERTIES AND CALLBACKS (excluding `x` and `y`) - see ShapeSwirl API */
    };

    // Options for timeline that controls all child and main Shape Swirls. {Object}
    timeline: {
      /* (+) TIMELINE PROPERTIES AND CALLBACKS - see Tween API */
    };
  }

  class Burst extends Tunable {
    constructor(opts: BurstOptions);
  }

  interface StaggerOptions {
    /**
     *  quantifier defines number of modules to create
     */
    quantifier: 5;
    /**
     *  options for timeline that controls all modules
     */
    timeline: {};
  }

  interface TweenOptions {
    /**
     *  Duration
     */
    duration?: number;

    /**
     *  Delay
     */
    delay?: number;

    /**
     *  If should repeat after animation finished
     *  {Number} *(1)
     */
    repeat?: number;

    /**
     *  Speed of the tween
     *  {Number}
     *  [0..∞]
     */
    speed?: number;

    /**
     *  If the progress should be flipped on repeat animation end
     *  {Boolean}
     */
    yoyo?: boolean;

    /**
     *  Easing function
     *  {String, Function}
     *  [ easing name, path coordinates, bezier string, easing function ]
     */
    easing?: string | Function;

    /**
     *  Easing function for backward direction of the tween animation (fallbacks to `easing`)
     *  {String, Function}
     *  [ easing name, path coordinates, bezier string, easing function ]
     */
    backwardEasing?: string | Function;

    /**
     *  Fires on every when progress needs an update. For instance when tween was finished an remains in
     *  `1` progress state, and you will play it again - it will stay in the `1` state until first sufficient
     *  update after delay. So the `onRefresh` callback serves you to `refresh` the `1` state with `0` update.
     *  @param isBefore {Boolean} If `true` - the refresh is before start time.
     */
    onRefresh?: (isBefore) => any;

    /**
     *  Fires on every update of the tween in any period (including delay periods). You probably want to use `onUpdate` method instead.
     *  @param p {Number} Normal (not eased) progress.
     *  @param isForward {Boolean} Direction of the progress.
     *  @param isYoyo {Boolean} If in `yoyo` period.
     */
    onProgress?: (progress: number, isForward?: boolean, isYoyo?: boolean) => any;

    /**
     *  Fires when tween's the progress reaches `0` point in normal or repeat period.
     *  @param isForward {Boolean} If progress moves in forward direction.
     *  @param isYoyo {Boolean} If progress inside `yoyo` flip period.
     */
    onStart?: (isForward: boolean, isYoyo: boolean) => any;
    /**
     *  Fires when tween's the progress reaches `0` point in normal or repeat period.
     *  @param isForward {Boolean} If progress moves in forward direction.
     *  @param isYoyo {Boolean} If progress inside `yoyo` flip period.
     */
    onFirstUpdate?: (isForward, isYoyo) => any;
    /**
     *  Fires on first update of the tween in sufficiently active period (excluding delay periods).
     *  @param ep {Number} Eased progress.
     *  @param p {Number} Normal (not eased) progress
     *  @param isForward {Boolean} Direction of the progress.
     *  @param isYoyo {Boolean} If in `yoyo` period.
     */
    onUpdate?: (ep, p, isForward, isYoyo) => any;

    /**
     *  Fires when tween's the progress reaches `1` point in normal or repeat period.
     *  @param isForward {Boolean} If progress moves in forward direction.
     *  @param isYoyo {Boolean} If progress inside `yoyo` flip period.
     */
    onRepeatComplete?: (isForward, isYoyo) => any;

    /**
     *  Fires when tween's the entire progress reaches `1` point(doesn't fire in repeat periods).
     *  @param isForward {Boolean} If progress moves in forward direction.
     *  @param isYoyo {Boolean} If progress inside `yoyo` flip period.
     */
    onComplete?: (isForward, isYoyo) => any;

    /**
     *  Fires when the `.play` method called and tween isn't in play state yet.
     */
    onPlaybackStart?: () => any;

    /**
     *  Fires when the `.pause` method called and tween isn't in pause state yet.
     */
    onPlaybackPause?: () => any;

    /**
     *  Fires when the `.stop` method called and tween isn't in stop state yet.
     */
    onPlaybackStop?: () => any;

    /**
     *  Fires when the tween end's animation (regardless progress)
     */
    onPlaybackComplete?: () => any;
  }

  interface MotionPath {
    constructor(opts: any);
    run(any: any);
    run();
  }

  class Tween extends Module {
    constructor(opts: TweenOptions);
    /**
     *  Starts playback.
     *  @param shift {Number} Start progress shift in milliseconds.
     */
    play(shift?: number);

    /**
     *  Starts playback in backward direction.
     *  @param shift {Number} Start progress shift in milliseconds.
     */
    playBackward(shift?: number);

    /**
     *  Pause
     *  */
    pause();

    /**
     *  Restarts playback.
     *  @param shift {Number} Start progress shift in milliseconds.
     *  */
    replay(shift?: number);

    /**
     *  Restarts playback in backward direction.
     *  @param shift {Number} Start progress shift in milliseconds.
     *  */
    replayBackward(shift?: number);

    /**
     *  Resumes playback in direction it was prior to `pause`.
     *  @param shift {Number} Start progress shift in milliseconds.
     *  */
    resume(shift?: number);

    /**
     *  Sets progress of the tween.
     *  @param progress {Number} Progress to set [ 0..1 ].
     *  */
    setProgress(progress);

    /**
     *  Sets speed of the tween.
     *  @param speed {Number} Progress to set [ 0..∞ ].
     *  */
    setSpeed(speed);

    /**
     *  Stops and resets the tween
     */
    reset();
  }

  class Timeline extends Tween {
    constructor(opts?: TweenOptions);
    /**
     *  API method to add child tweens/timelines.
     *  @param {Object, Array} Tween/Timeline or an array of such.
     *  @returns {Object} Self.
     */
    add(tween: Object | any, ...args);

    /**
     *  API method to append the Tween/Timeline to the end of the
     *  timeline. Each argument is treated as a new append.
     *  Array of tweens is treated as a parallel sequence.
     *  @param {Object, Array} Tween/Timeline to append or array of such.
     *  @returns {Object} Self.
     */
    append(tween: Object | any[]);

    /**
     *  API method to stop the Tween.
     *  @param   {Number} Progress [0..1] to set when stopped.
     */
    stop(progress: number);

    /**
     *  Method to reset tween's state and properties.
     *  @overrides @ Tween
     *  @returns this
     */
    reset();
  }

  function stagger(_Shape: any): any;

  interface MojsStatic {
    CustomShape: ObjectConstructor;
    addShape(name: string, shape: any);
    Timeline(): void;
    Shape(shapeOptions: any): void;

    easing: any;
  }
}

declare module 'mojs-curve-editor' {
  class MojsCurveEditor {
    constructor(opts: MojsCurveEditor.Options);
    constructor();

    getEasing();
    getEasing(p: any);
  }

  namespace MojsCurveEditor {
    interface Options {
      name?: string;
      isSaveState?: boolean;
    }
  }

  export = MojsCurveEditor;
}

declare module 'mojs-player' {
  import { Timeline, Shape } from 'mo-js';

  class MojsPlayer {
    constructor(opts: MojsPlayer.Options);
  }

  namespace MojsPlayer {
    interface Options {
      add: Timeline | Shape;

      /**
       *  class name to add to main HTMLElement
       */
      className?: string;

      /**
       *  determines if should preserve state on page reload
       */
      isSaveState?: boolean;

      /**
       *  playback state
       */
      isPlaying?: boolean;

      /**
       *  initial progress
       */
      progress?: number;

      /**
       *  determines if it should repeat after completion
       */
      isRepeat?: boolean;

      /**
       *  determines if it should have bounds
       */
      isBounds?: boolean;

      /**
       *  left bound position  [0...1]
       */
      leftBound?: number;

      /**
       *  right bound position [0...1]
       */
      rightBound?: number;

      /**
       *  determines if speed control should be open
       */
      isSpeed?: boolean;

      /**
       *  speed value
       */
      speed?: number;

      /**
       *  determines if the player should be hidden
       */
      isHidden?: boolean;

      /**
       *  step size for player handle - for instance, after page reload -
       *  player should restore timeline progress - the whole timeline will be updated
       *  incrementally with the `precision` step size until the progress will be met.
       */
      precision?: number;

      /**
       *  name for the player - mainly used for localstorage identifier,
       *  use to distuguish between multiple local players
       */
      name?: string;
    }
  }
  export = MojsPlayer;
}
