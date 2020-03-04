import React from 'react';
import { PhotoSlider } from '@powerfulyang/components';
import fetch from 'node-fetch';
import Header from 'src/components/Header';
import '@powerfulyang/components/index.css';

const Gallery = (prop) => {
  const json = prop.json;
  return (
    <>
      <Header title="gallery" />
      <PhotoSlider
        imgList={json[0].map((item) => ({
          thumbnail: item.path.resize,
          origin: item.path.origin,
          webp: item.path.webp,
        }))}
      />
    </>
  );
};

Gallery.getInitialProps = async () => {
  const res = await fetch('https://api.powerfulyang.com/static');
  const json = await res.json();
  return {
    json,
  };
};

export default Gallery;
