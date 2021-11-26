import dynamic from 'next/dynamic';
import ReactDOM from 'react-dom';
import React from 'react';
import type { NotificationProps } from '@/components/Notification/Notification';
import { getNotificationParent } from '@/components/Notification/Notification';

export const Notification = dynamic(import('./Notification'), {
  ssr: false,
});

export type RenderNotificationProps = Omit<NotificationProps, 'onClose'>;

const renderNotification = ({ type, title, content }: RenderNotificationProps) => {
  const parent = getNotificationParent();
  const fragment = document.createDocumentFragment();
  parent.appendChild(fragment);
  const onClose = () => {
    ReactDOM.unmountComponentAtNode(fragment);
  };
  ReactDOM.render(
    React.createElement(Notification, {
      type,
      title,
      content,
      onClose,
    }),
    fragment,
  );
};
export const notification = {
  animating: false,
  success({ title, content }: RenderNotificationProps) {
    this.animating = true;
    renderNotification({ title, content, type: 'success' });
  },
  warn({ title, content }: RenderNotificationProps) {
    this.animating = true;
    renderNotification({ title, content, type: 'warn' });
  },
  error({ title, content }: RenderNotificationProps) {
    this.animating = true;
    renderNotification({ title, content, type: 'error' });
  },
};
