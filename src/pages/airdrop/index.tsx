import { useCallback, useEffect, useRef, useState } from 'react';
import type Peer from 'peerjs';
import { useImmer } from '@powerfulyang/hooks';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import type { GetServerSideProps } from 'next';
import { getCurrentUser } from '@/service/getCurrentUser';
import type { SentMessage } from '@/components/Chat';
import { Chat } from '@/components/Chat';
import classNames from 'classnames';
import type { ChatMessageEntity } from '@/components/Chat/Message';
import styles from './index.module.scss';

const Airdrop: LayoutFC = () => {
  const didImportPeerjsRef = useRef(false);
  const [currentPeerId, setCurrentPeerId] = useState('');
  const [connections, setConnections] = useImmer(() => new Map<string, Peer.DataConnection>());
  const messageIdRef = useRef(0);
  const [messages, setMessages] = useImmer<Map<string, ChatMessageEntity[]>>(() => new Map());
  const [selectPeerId, setSelectPeerId] = useState('');
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

  useEffect(() => {
    const bindNewConnection = (connection: Peer.DataConnection) => {
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
      connection.on('data', ({ content, messageContentType, fileType }: SentMessage) => {
        let d: string | Blob;
        if (messageContentType === 'blob') {
          d = new Blob([content], { type: fileType });
        } else {
          d = content;
        }
        handleMessage({
          from: connection.peer,
          chatFriendId: connection.peer,
          content: d,
          messageContentType,
        });
      });
    };
    // React 18.x StrictMode will call this effect twice. Ensure only import peerjs and init once.
    let peer: Peer;
    if (!didImportPeerjsRef.current) {
      didImportPeerjsRef.current = true;
      import('peerjs').then(({ default: Peer }) => {
        peer = new Peer({
          host: process.env.CLIENT_BASE_HOST || window.location.host,
          path: 'api/peerjs',
        });

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
    }
    return () => {
      // FIXME 这里不太对
      peer?.disconnect();
      peer?.destroy();
    };
  }, [handleMessage, setConnections]);

  return (
    <main className={styles.main}>
      <div className={classNames(styles.chats, 'common-shadow')}>
        <div className={styles.friends}>
          {Array.from(connections.keys())
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
                <img className="rounded-lg" src={`https://i.pravatar.cc/50?u=${peerId}`} alt="" />
                <div className="truncate">{peerId}</div>
              </button>
            ))}
        </div>
        {(selectPeerId && (
          <Chat
            messages={messages.get(selectPeerId) || []}
            onSendMessage={(message) => {
              handleMessage({
                ...message,
                from: currentPeerId,
                chatFriendId: selectPeerId,
              });
              connections.get(selectPeerId)?.send({
                ...message,
              });
            }}
          />
        )) || (
          <div className="flex w-full h-full bg-amber-200 justify-center items-center">
            未选择聊天对象
          </div>
        )}
      </div>
    </main>
  );
};

Airdrop.getLayout = (page) => {
  const { user } = page.props;
  return <UserLayout user={user}>{page}</UserLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getCurrentUser(ctx);
  return {
    props: { user },
  };
};

export default Airdrop;
