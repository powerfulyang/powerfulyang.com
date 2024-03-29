import { memo, useEffect, useId } from 'react';
import classNames from 'classnames';
import { isBlob, isString, scrollIntoView } from '@powerfulyang/utils';
import { copyToClipboardAndNotify } from '@/utils/copy';
import { LazyImage } from '@/components/LazyImage';
import { randomAvatar } from '@/utils/format';
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
        containerClassName="rounded-lg w-[55px] aspect-square"
        src={randomAvatar(from)}
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
          {content === '_ai_thinking_' ? (
            <span className={styles.loading}>AI 正在思考中</span>
          ) : (
            content
          )}
        </button>
      )}
      {isBlob(content) && content.type.startsWith('image') && (
        <span
          role="presentation"
          className="pointer max-w-[70%]"
          onClick={() => {
            return copyToClipboardAndNotify(content);
          }}
        >
          <img className="rounded-lg" src={URL.createObjectURL(content)} alt="" />
        </span>
      )}
      <div className="absolute -bottom-8" id={id} />
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';
