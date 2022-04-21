import { useEffect, useRef } from 'react';
import type Peer from 'peerjs';
import { useImmer } from '@powerfulyang/hooks';
import styles from './index.module.scss';

const Airdrop = () => {
  const didImportPeerjsRef = useRef(false);
  const [currentPeerId, setCurrentPeerId] = useImmer('');
  const [connections, setConnections] = useImmer(() => new Map<string, Peer.DataConnection>());
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
      connection.on('data', (data) => {
        console.log(data);
      });
    };
    // React 18.x StrictMode will call this effect twice. Ensure only import peerjs and init once.
    if (!didImportPeerjsRef.current) {
      didImportPeerjsRef.current = true;
      import('peerjs').then(({ default: Peer }) => {
        const peer: Peer = new Peer({
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
  }, [connections, currentPeerId, setConnections, setCurrentPeerId]);
  return (
    <main className={styles.main}>
      friends:
      {Array.from(connections.keys())
        .filter((x) => x !== currentPeerId)
        .map((peerId) => (
          <div key={peerId}>
            {peerId}
            <button
              type="button"
              onClick={() => {
                connections.get(peerId)?.send('hello');
              }}
            >
              send
            </button>
          </div>
        ))}
    </main>
  );
};

export default Airdrop;
