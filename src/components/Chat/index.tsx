import type { ChatMessageEntity, Message } from '@/components/Chat/Message';
import { ChatMessage } from '@/components/Chat/Message';
import type { FC } from 'react';
import { useState } from 'react';
import { handlePasteImageAndReturnFileList } from '@/utils/copy';
import styles from './index.module.scss';

export type SentMessage = Message & { fileType?: string };

type Props = {
  messages: ChatMessageEntity[];
  onSendMessage: (message: SentMessage) => void;
};

export const Chat: FC<Props> = ({ messages, onSendMessage }) => {
  const [message, setMessage] = useState('');
  return (
    <div className={styles.chat}>
      <div className={styles.messages}>
        {messages.map((v) => (
          <ChatMessage key={v.messageId} {...v} />
        ))}
      </div>
      <textarea
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        value={message}
        placeholder="请输入消息..."
        className={styles.chatInput}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            setMessage(`${message}\n`);
          }
          if (e.key === 'Enter' && !(e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            onSendMessage({ messageContentType: 'text', content: message });
            setMessage('');
          }
        }}
        onPaste={(e) => {
          const fileList = handlePasteImageAndReturnFileList(e);
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
        }}
      />
    </div>
  );
};
