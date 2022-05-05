import { memo, useEffect, useId } from 'react';
import classNames from 'classnames';
import { copyToClipboardAndNotify } from '@/utils/copy';
import { isBlob, isString, scrollIntoView } from '@powerfulyang/utils';
import { LazyImage } from '@/components/LazyImage';
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

export enum MessageSendType {
  send = 'send',
  receive = 'receive',
}

export type ChatMessageEntity = {
  from: string;
  messageId: number;
  chatFriendId: string;
  sendType: MessageSendType;
} & Message;

export const ChatMessage = memo<ChatMessageEntity>(({ from, content, sendType }) => {
  const id = useId();
  useEffect(() => {
    const ref = document.getElementById(id);
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
      className={classNames('relative flex w-full items-start space-x-3', {
        'flex-row-reverse space-x-reverse': sendType === MessageSendType.send,
      })}
    >
      <LazyImage
        lazy={false}
        containerClassName="rounded-lg w-[55px] aspect-square"
        src={`https://i.pravatar.cc/55?u=${from}`}
        alt=""
      />
      {isString(content) && (
        <button
          type="button"
          onClick={() => {
            return copyToClipboardAndNotify(content);
          }}
          className={classNames(styles.message, {
            [styles.sent]: sendType === MessageSendType.send,
          })}
        >
          {content}
        </button>
      )}
      {isBlob(content) && content.type.startsWith('image') && (
        <button
          className="pointer max-w-[70%]"
          type="button"
          onClick={() => {
            return copyToClipboardAndNotify(content);
          }}
        >
          <img className="rounded-lg" src={URL.createObjectURL(content)} alt="" />
        </button>
      )}
      <div className="absolute -bottom-8" id={id} />
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';
