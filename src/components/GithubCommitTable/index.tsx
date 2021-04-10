import { interpolateRgb, rgb } from 'd3';
import React, { FC, useMemo } from 'react';
import { pluck } from 'ramda';
import { Tooltip } from '@powerfulyang/components';

type GithubCommitTableProp = {
  data: {
    date: string;
    count: number;
  }[];
};

export const GithubCommitTable: FC<GithubCommitTableProp> = ({ data }) => {
  const colorMap = interpolateRgb(rgb('#d6e685'), rgb('#1e6823'));
  const max = useMemo(() => {
    const arr = pluck('count')(data);
    return Math.max(...arr);
  }, [data]);
  const getColor = (point: number = 0) => {
    return colorMap(point / max);
  };
  return (
    <div className="w-3/4 m-auto my-4 flex flex-wrap flex-col h-32">
      {data.map((val) => (
        <Tooltip key={val.date} title={val.date}>
          <div
            className="m-1"
            style={{ backgroundColor: getColor(val.count), width: '10px', height: '10px' }}
          />
        </Tooltip>
      ))}
    </div>
  );
};
