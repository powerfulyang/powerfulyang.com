import classNames from 'classnames';

import type { FC } from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  type: string;
}

export const Icon: FC<IconProps> = ({ className, type, ...restProps }) => (
  <svg className={classNames(className, 'py-icon')} {...restProps}>
    <use xlinkHref={`#${type}`} />
  </svg>
);
