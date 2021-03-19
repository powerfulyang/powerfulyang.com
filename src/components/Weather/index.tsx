import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

const SunShower = () => {
  return (
    <div className={classNames(styles.icon)}>
      <div className={styles.cloud} />
      <div className={styles.sun}>
        <div className={styles.rays} />
      </div>
      <div className={styles.rain} />
    </div>
  );
};

const ThunderStorm = () => {
  return (
    <div className="icon thunder-storm">
      <div className="cloud" />
      <div className="lightning">
        <div className="bolt" />
        <div className="bolt" />
      </div>
    </div>
  );
};

const Cloudy = () => {
  return (
    <div className="icon cloudy">
      <div className="cloud" />
      <div className="cloud" />
    </div>
  );
};

const Flurries = () => {
  return (
    <div className="icon flurries">
      <div className="cloud" />
      <div className="snow">
        <div className="flake" />
        <div className="flake" />
      </div>
    </div>
  );
};

const Sunny = () => {
  return (
    <div className="icon sunny">
      <div className="sun">
        <div className="rays" />
      </div>
    </div>
  );
};

const Rainy = () => {
  return (
    <div className="icon rainy">
      <div className="cloud" />
      <div className="rain" />
    </div>
  );
};

export const Weather = {
  Sunny,
  SunShower,
  Rainy,
  Flurries,
  ThunderStorm,
  Cloudy,
};
