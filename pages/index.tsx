import React, { FC, useState } from 'react';
import { Header } from '@/components/Head';
import MapleLeafFalling from '@/components/MapleLeafFalling';
import { isSupportWebGL } from '@powerfulyang/utils';
import { useMount } from '@powerfulyang/hooks';
import classNames from 'classnames';
import styles from './index.scss';

type IndexProps = {};
export const Index: FC<IndexProps> = () => {
  const [supportWebGL, setState] = useState(false);
  useMount(() => {
    setState(isSupportWebGL());
  });
  return (
    <>
      <Header />
      {supportWebGL && <MapleLeafFalling />}
      <div className={classNames({ [styles.bg]: !supportWebGL })}>
        <div className="w-2/3">Hello World!!!</div>
      </div>
    </>
  );
};

export default Index;
