import type { FC } from 'react';
import { useEffect, useId, useMemo } from 'react';
import classNames from 'classnames';
import { copyToClipboardAndNotify } from '@/utils/copy';
import { isBlob, isString, scrollIntoView } from '@powerfulyang/utils';
import styles from './index.module.scss';

type TextMessage = {
  messageContentType: 'text';
  content: string;
};

type BlobMessage = {
  messageContentType: 'blob';
  content: Blob;
};

export type Message = TextMessage | BlobMessage;

export type ChatMessageEntity = {
  from: string;
  messageId: number;
  chatFriendId: string;
} & Message;

export const getMessageBottomRef = (messageId?: string) =>
  messageId && document.getElementById(`message-${messageId}`);

export const ChatMessage: FC<ChatMessageEntity> = ({ from, content, messageId, chatFriendId }) => {
  const id = useId();
  const sendType = useMemo(() => {
    if (chatFriendId !== from) {
      return 'sent';
    }
    return 'received';
  }, [chatFriendId, from]);
  useEffect(() => {
    const ref = getMessageBottomRef(id);
    if (ref) {
      setTimeout(() => {
        scrollIntoView(ref, {
          behavior: 'smooth',
        });
      }, 100);
    }
  }, [id]);
  return (
    <div
      className={classNames('w-full flex items-start space-x-3 relative', {
        'flex-row-reverse space-x-reverse': sendType === 'sent',
      })}
      title={`${messageId}`}
    >
      <img className="rounded-lg" src={`https://i.pravatar.cc/50?u=${from}`} alt="" />
      {isString(content) && (
        <button
          type="button"
          onClick={() => {
            return copyToClipboardAndNotify(content);
          }}
          className={classNames(styles.message, {
            [styles.sent]: sendType === 'sent',
          })}
        >
          {content}
        </button>
      )}
      {isBlob(content) && content.type.startsWith('image') && (
        <button
          className="max-w-[70%] pointer"
          type="button"
          onClick={() => {
            return copyToClipboardAndNotify(content);
          }}
        >
          <img className="rounded-lg" src={URL.createObjectURL(content)} alt="" />
        </button>
      )}
      <div className="absolute -bottom-8" id={`message-${id}`} />
    </div>
  );
};
