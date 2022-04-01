import type { FC } from 'react';
import React from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Redirecting } from '../Redirecting';
import { ProjectName } from '@/constant/Constant';

dayjs.extend(LocalizedFormat);

export interface HeaderProps {
  title?: string;
}

export const Header: FC<HeaderProps> = ({ title }) => (
  <>
    <title>{`${(title && `${title} - `) || ''}${ProjectName}`}</title>
    <Redirecting />
  </>
);
