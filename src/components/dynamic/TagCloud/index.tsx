import WordCloud from 'wordcloud';
import React, { FC, useEffect, useRef } from 'react';

type TagCloudProps = {
  list: any;
};
const TagCloud: FC<TagCloudProps> = ({ list }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    WordCloud(canvas, {
      list,
      weightFactor(size) {
        return size * 20;
      },
      backgroundColor: '#ffe0e0',
    });
  }, [list]);
  return <canvas width={500} height={400} ref={ref} />;
};

export default TagCloud;
