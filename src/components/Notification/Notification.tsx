import type { FC } from 'react';
import React, { useEffect, useRef } from 'react';
import { Icon } from '@powerfulyang/components';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { timer } from 'rxjs';
import styles from './index.module.scss';
import { usePortal } from '@/hooks/usePortal';

export type NotificationProps = {
  title?: string;
  content?: string;
  type?: 'success' | 'warn' | 'error';
  onClose: VoidFunction;
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

const Notification: FC<NotificationProps> = ({ title, content, type = 'success', onClose }) => {
  const dialogNode = useRef(document.createDocumentFragment());
  const { Portal } = usePortal({
    container: dialogNode.current,
  });

  useEffect(() => {
    const dialog = dialogNode.current;
    const parent = getNotificationParent();
    parent.appendChild(dialog);
    const subscribe = timer(1500).subscribe(() => {
      onClose();
    });
    return () => {
      subscribe.unsubscribe();
    };
  }, [onClose]);
  const [visible, setVisible] = React.useState(true);

  const close = () => {
    onClose();
  };

  return (
    <Portal>
      <AnimatePresence>
        {visible && (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            className={styles.notification}
            onAnimationEnd={() => {
              if (!visible) {
                close();
              }
            }}
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
