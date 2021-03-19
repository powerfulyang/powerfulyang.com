import React from 'react';

export enum ButtonType {
  default,
  primary,
}
export enum ButtonSize {
  small,
  middle,
  large,
}

export enum ButtonShape {
  rectangle,
  circle,
  round,
  square,
}

export enum HtmlType {
  submit = 'submit',
  reset = 'reset',
  button = 'button',
}

export interface BaseButtonProps {
  type?: ButtonType;
  icon?: React.ReactNode;
  shape?: ButtonShape;
  size?: ButtonSize;
  loading?: boolean | { delay?: number };
  className?: string;
  ghost?: boolean;
  danger?: boolean;
  block?: boolean;
  children?: React.ReactNode;
  htmlType?: HtmlType;
}

export type ButtonProps = BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<any>, 'type' | 'onClick'>;
