import React, { useEffect, useState } from 'react';
import './index.scss';
import FlashButton from '../src/components/FlashButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { avatarList } from '../assets/avatar/avatar';
import Loading from '../src/components/Loading';
import { copyright, ICP_NO, links } from '../src/Config/config';
import { DomUtils } from '@powerfulyang/utils';
import IconHead from '../src/components/Header/IconHead';
import BackGround from '../src/components/BackGround';
import BgBackGround from '../src/components/BackGround/BgBackGround';

export default function IndexPage() {
  const [loading, setLoading] = useState(true);
  const [isSupportWebGL, set] = useState(false);
  useEffect(() => {
    (async () => {
      DomUtils.contentLoaded(() => {
        DomUtils.isSupportWebGL() && set(true);
        setLoading(false);
      });
    })();
  }, []);
  return (
    <>
      <IconHead />
      {loading && <Loading />}
      {isSupportWebGL && <BackGround />}
      {!loading && !isSupportWebGL && <BgBackGround />}
      <div
        id="wrapper"
        className={isSupportWebGL ? '' : 'bg-css'}
        style={loading ? { display: 'none' } : {}}
      >
        <section id="main" className="animate">
          <header>
            <img id="avatar" src={avatarList.Neptunite} alt="" />
            <p>猜不透的天气, 不知何时能天晴</p>
          </header>
          <footer>
            <div className="icons">
              {links.map((link) => {
                return (
                  <div key={link.icon}>
                    <a href={link.url}>
                      <FontAwesomeIcon className={'icon'} icon={['fab', link.icon]} />
                    </a>
                  </div>
                );
              })}
            </div>
            <FlashButton>Approach</FlashButton>
          </footer>
        </section>
        <footer id="footer">
          &copy; {copyright}
          <ul className="copyright">
            <li>
              网站已备案哦:
              <a href="http://beian.miit.gov.cn/">{ICP_NO}</a>
            </li>
            <li className="Satisfy">
              Gallery: <a href="//gallery.powerfulyang.com">Anime Waifu</a>
            </li>
          </ul>
        </footer>
      </div>
    </>
  );
}
