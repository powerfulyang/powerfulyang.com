import React, { useEffect, useState } from 'react';
import './index.scss';
import Header from '../src/components/Header';
import FlashButton from '../src/components/FlashButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BackGround from '../src/components/BackGround';
import { avatarList } from '../assets/avatar/avatar';
import Loading from '../src/components/Loading';
import { copyright, ICP_NO, links } from '../src/Config/config';
import { contentLoaded } from '@powerfulyang/utils';

export default function IndexPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    contentLoaded(() => {
      setLoading(false);
    });
  }, []);
  return (
    <>
      <Header />
      {loading && <Loading />}
      {!loading && <BackGround />}
      <div id="wrapper" style={loading ? { display: 'none' } : {}}>
        <section id="main" className={loading ? 'loadings' : 'displays'}>
          <header>
            <img id="avatar" src={avatarList.Neptunite} alt="" />
            <p>猜卟透の兲氣，卟知菏時熋兲ㄖ青</p>
          </header>
          <footer>
            <ul className="icons">
              {links.map(link => {
                return (
                  <li key={link.icon}>
                    <a href={link.url}>
                      <FontAwesomeIcon
                        className={'icon'}
                        icon={['fab', link.icon]}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
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
            <li>
              Powered: <a href="http://html5up.net">HTML5 UP</a>
            </li>
          </ul>
        </footer>
      </div>
    </>
  );
}
