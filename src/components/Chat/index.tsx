import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { ChatMessageEntity, Message } from '@/components/Chat/Message';
import { ChatMessage } from '@/components/Chat/Message';
import { handlePasteImageAndReturnFileList } from '@/utils/copy';
import styles from './index.module.scss';

export type SentMessage = Message & { fileType?: string };

type Props = {
  messages: ChatMessageEntity[];
  onSendMessage: (message: SentMessage) => void;
};

export const sendFileMessage = (
  fileList: FileList | null,
  onSendMessage: (message: SentMessage) => void,
) => {
  if (fileList) {
    for (const file of fileList) {
      const reader = new FileReader();
      reader.onload = () => {
        const blob = new Blob([reader.result as ArrayBuffer], {
          type: file.type,
        });
        onSendMessage({
          messageContentType: 'blob',
          content: blob,
          fileType: file.type,
        });
      };
      reader.readAsArrayBuffer(file);
    }
  }
};

export const Chat: FC<Props> = ({ messages, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  const queryClient = useQueryClient();
  const isMutating =
    queryClient.isMutating({
      mutationKey: ['sendToAI'],
    }) > 0;

  useEffect(() => {
    !isMutating && ref.current?.focus();
  }, [isMutating]);

  return (
    <div className={styles.chat}>
      <div className={styles.messages}>
        {messages.map((v) => (
          <ChatMessage key={v.messageId} {...v} />
        ))}
      </div>
      <textarea
        ref={ref}
        disabled={isMutating}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        value={message}
        placeholder={isMutating ? 'AI is thinking...' : '请输入消息...'}
        className={styles.chatInput}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            onSendMessage({ messageContentType: 'text', content: message });
            setMessage('');
          }
        }}
        onPaste={(e) => {
          const fileList = handlePasteImageAndReturnFileList(e);
          sendFileMessage(fileList, onSendMessage);
        }}
      />
    </div>
  );
};
