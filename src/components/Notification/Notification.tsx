import { createPortal } from 'react-dom';
import type { FC} from 'react';
import React, { useEffect, useRef } from 'react';
import { Icon } from '@powerfulyang/components';
import classNames from 'classnames';
import styles from './index.module.scss';

export type NotificationProps = {
  title?: string;
  content?: string;
  type?: 'success' | 'warn' | 'error';
};

export const getNotificationParent = () => {
  let parent = document.querySelector('.notification-collection');
  if (!parent) {
    parent = document.createElement('div');
    parent.className = 'notification-collection';
    document.body.appendChild(parent);
  }
  return parent;
};

const Notification: FC<NotificationProps> = ({ title, content, type = 'success' }) => {
  const dialogNode = useRef<HTMLElement>(document.createElement('section'));

  useEffect(() => {
    const dialog = dialogNode.current;
    const parent = getNotificationParent();
    parent.appendChild(dialog);
    return () => {
      document.body.removeChild(parent!);
    };
  }, []);

  return (
    <>
      {createPortal(
        <div className={styles.notification}>
          <div className="flex">
            <section className={classNames(styles.status, styles[type])}>
              <Icon type={`icon-${type}`} />
            </section>
            <div className="mx-4">
              <section className={styles.title}>{title}</section>
              <section className={styles.content}>{content}</section>
            </div>
          </div>
          <div>
            <section className={styles.close}>
              <Icon type="icon-close" />
            </section>
          </div>
        </div>,
        dialogNode.current,
      )}
    </>
  );
};

export default Notification;
