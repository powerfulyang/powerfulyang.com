import { useCallback, useEffect, useRef, useState } from 'react';
import type { DataConnection, Peer } from 'peerjs';
import { useImmer } from '@powerfulyang/hooks';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import type { SentMessage } from '@/components/Chat';
import { Chat, sendFileMessage } from '@/components/Chat';
import classNames from 'classnames';
import type { ChatMessageEntity } from '@/components/Chat/Message';
import { MessageSendType } from '@/components/Chat/Message';
import { LazyImage } from '@/components/LazyImage';
import { useDocumentVisible } from '@/hooks/useDocumentVisible';
import { randomAvatar } from '@/utils/lib';
import styles from './index.module.scss';

const group = 'LAN';

const Airdrop: LayoutFC = () => {
  const [currentPeerId, setCurrentPeerId] = useState('');
  const [connections, setConnections] = useImmer(() => new Map<string, DataConnection>());
  const messageIdRef = useRef(0);
  const [messages, setMessages] = useImmer<Map<string, ChatMessageEntity[]>>(
    () => new Map([[group, []]]),
  );
  const [selectPeerId, setSelectPeerId] = useState<string>(() => group);
  const peerRef = useRef<Peer>();

  const handleMessage = useCallback(
    (params: Omit<ChatMessageEntity, 'messageId'>) => {
      setMessages((draft) => {
        messageIdRef.current += 1;
        const messageChannel = draft.get(params.chatFriendId);
        const newMessage = {
          ...params,
          messageId: messageIdRef.current,
        } as ChatMessageEntity;
        if (!messageChannel) {
          draft.set(params.chatFriendId, [newMessage]);
        } else {
          messageChannel?.push(newMessage);
        }
      });
    },
    [setMessages],
  );

  const receiveMessage = useCallback(
    (from: string, { content, messageContentType, fileType }: SentMessage) => {
      let d: string | Blob;
      if (messageContentType === 'blob') {
        d = new Blob([content], { type: fileType });
      } else {
        d = content;
      }
      handleMessage({
        from,
        chatFriendId: from,
        content: d,
        messageContentType,
        sendType: MessageSendType.receive,
      });
      handleMessage({
        from,
        chatFriendId: group,
        content: d,
        messageContentType,
        sendType: MessageSendType.receive,
      });
    },
    [handleMessage],
  );

  const sendMessage = useCallback(
    (message: SentMessage) => {
      handleMessage({
        ...message,
        from: currentPeerId,
        chatFriendId: selectPeerId,
        sendType: MessageSendType.send,
      });
      if (selectPeerId !== group) {
        connections.get(selectPeerId)?.send({
          ...message,
        });
      } else {
        connections.forEach((connection) => {
          connection.send({
            ...message,
          });
          handleMessage({
            ...message,
            from: currentPeerId,
            chatFriendId: connection.peer,
            sendType: MessageSendType.send,
          });
        });
      }
    },
    [handleMessage, selectPeerId, connections, currentPeerId],
  );

  useEffect(() => {
    const bindNewConnection = (connection: DataConnection) => {
      connection.on('open', () => {
        setConnections((d) => {
          d.set(connection.peer, connection);
        });
      });
      connection.on('close', () => {
        setConnections((d) => {
          d.delete(connection.peer);
        });
      });
      connection.on('data', (data) => {
        receiveMessage(connection.peer, data as SentMessage);
      });
    };
    import('peerjs').then(({ default: Peer }) => {
      const peer = new Peer({
        host: process.env.CLIENT_BASE_HOST || window.location.host,
        path: 'peer',
      });
      peerRef.current = peer;

      peer.on('open', (id) => {
        setCurrentPeerId(id);
        peer.listAllPeers((peers) => {
          peers.forEach((peerId) => {
            const connection = peer.connect(peerId);
            bindNewConnection(connection);
          });
        });
      });

      peer.on('connection', (connection) => {
        bindNewConnection(connection);
      });
    });

    return () => {
      peerRef.current?.destroy();
    };
  }, [handleMessage, receiveMessage, setConnections]);

  const documentVisible = useDocumentVisible();
  useEffect(() => {
    if (documentVisible && !peerRef.current?.destroyed && peerRef.current?.disconnected) {
      peerRef.current?.reconnect();
    }
  }, [documentVisible]);

  return (
    <main className={styles.main}>
      <div className={classNames(styles.desktopChats, 'common-shadow')}>
        <div className={styles.friends}>
          {[group, ...connections.keys()]
            .filter((x) => x !== currentPeerId)
            .map((peerId) => (
              <button
                type="button"
                className={classNames(styles.friend, {
                  [styles.selected]: peerId === selectPeerId,
                })}
                key={peerId}
                onClick={() => {
                  setSelectPeerId(peerId);
                }}
              >
                <LazyImage
                  containerClassName="rounded-lg w-[55px] aspect-square"
                  src={randomAvatar(peerId)}
                  alt=""
                />
                <div className="flex-1 truncate text-left">{peerId}</div>
              </button>
            ))}
        </div>
        {(selectPeerId && (
          <Chat messages={messages.get(selectPeerId) || []} onSendMessage={sendMessage} />
        )) || (
          <div className="flex h-full w-full items-center justify-center bg-amber-200">
            未选择聊天对象
          </div>
        )}
      </div>
      <div className={classNames('m-8 grid w-full grid-cols-3 grid-rows-[33vw] gap-4 sm:hidden')}>
        {[group, ...connections.keys()].map((peerId) => {
          return (
            <div key={peerId} className="text-center">
              <label htmlFor={peerId}>
                <LazyImage
                  containerClassName="aspect-square rounded-full"
                  src={randomAvatar(peerId)}
                  alt=""
                />
                <div className="truncate">{peerId}</div>
                <input
                  onChange={(e) => {
                    const { files } = e.target;
                    sendFileMessage(files, sendMessage);
                  }}
                  hidden
                  type="file"
                  id={peerId}
                />
              </label>
            </div>
          );
        })}
      </div>
    </main>
  );
};

Airdrop.getLayout = (page) => {
  return <UserLayout>{page}</UserLayout>;
};

export const getServerSideProps = () => {
  return {
    props: {
      title: 'Airdrop',
    },
  };
};

export default Airdrop;
