import dynamic from 'next/dynamic';
import ReactDOM from 'react-dom';
import React from 'react';
import { getNotificationParent, NotificationProps } from '@/components/Notification/Notification';

export const Notification = dynamic(import('./Notification'), {
  ssr: false,
});

const renderNotification = ({ type, title, content }: NotificationProps) => {
  const parent = getNotificationParent();
  const div = document.createElement('div');
  parent.appendChild(div);
  ReactDOM.render(
    React.createElement(Notification, {
      type,
      title,
      content,
    }),
    div,
  );
};
export const notification = {
  success({ title, content }: NotificationProps) {
    return renderNotification({ title, content, type: 'success' });
  },
  warn({ title, content }: NotificationProps) {
    return renderNotification({ title, content, type: 'warn' });
  },
  error({ title, content }: NotificationProps) {
    return renderNotification({ title, content, type: 'error' });
  },
};
