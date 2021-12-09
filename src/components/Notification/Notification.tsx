import type { FC } from 'react';
import React, { useEffect, useRef } from 'react';
import { Icon } from '@powerfulyang/components';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { timer } from 'rxjs';
import { usePortal } from '@powerfulyang/hooks';
import styles from './index.module.scss';

export type NotificationProps = {
  title?: string;
  content?: string;
  type?: 'success' | 'warn' | 'error';
  onClose: VoidFunction;
  autoClose?: boolean;
  delay?: number;
};

export const getNotificationParent = () => {
  let parent = document.querySelector('#notification-collection');
  if (!parent) {
    parent = document.createElement('div');
    parent.id = 'notification-collection';
    document.body.appendChild(parent);
  }
  return parent;
};

const Notification: FC<NotificationProps> = ({
  title,
  content,
  type = 'success',
  onClose,
  delay = 1500,
  autoClose = true,
}) => {
  const dialogNode = useRef(document.createElement('section'));
  const { Portal } = usePortal({
    container: dialogNode.current,
  });
  const [visible, setVisible] = React.useState(true);

  useEffect(() => {
    const dialog = dialogNode.current;
    const parent = getNotificationParent();
    parent.appendChild(dialog);
    const subscribe = timer(delay).subscribe(() => {
      autoClose && setVisible(false);
    });
    return () => {
      parent.removeChild(dialog);
      subscribe.unsubscribe();
    };
  }, [autoClose, delay]);

  return (
    <Portal>
      <AnimatePresence
        onExitComplete={() => {
          onClose();
        }}
      >
        {visible && (
          <motion.div
            key="notification"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.4 }}
            className={styles.notification}
          >
            <div className="flex">
              <section className={classNames(styles.status, styles[type])}>
                <Icon type={`icon-${type}`} />
              </section>
              <div className="mx-2">
                <section className={styles.title}>{title}</section>
                <section className={styles.content}>{content}</section>
              </div>
            </div>
            <button type="button" className={styles.close} onClick={() => setVisible(false)}>
              <Icon type="icon-close" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default Notification;
