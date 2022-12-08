import { useEffect, useRef } from 'react';
import type { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { useMutation } from '@tanstack/react-query';
import { requestAtClient } from '@/utils/client';

const Logs = () => {
  const container = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal>();
  const currentCommand = useRef('');

  const showLogsContainers = useMutation({
    mutationFn: () => {
      return requestAtClient<string[]>('https://qa.powerfulyang.com/api/logs-viewer/containers');
    },
    onSuccess: (data) => {
      data.forEach((containerName) => {
        currentCommand.current = '';
        termRef.current?.writeln(containerName);
      });
    },
  });

  const viewContainerLogs = useMutation({
    mutationFn: (containerName: string) => {
      return requestAtClient<string[]>(
        `https://qa.powerfulyang.com/api/logs-viewer/${containerName}`,
      );
    },
    onSuccess: (data) => {
      currentCommand.current = '';
      termRef.current?.writeln(data.join(''));
    },
  });

  useEffect(() => {
    import('xterm').then(({ Terminal }) => {
      if (container.current) {
        termRef.current = new Terminal();
        termRef.current.open(container.current);
        termRef.current.onData((data) => {
          termRef.current?.write(data);
          currentCommand.current += data;
        });
        termRef.current?.onKey((key) => {
          if (key.domEvent.key === 'Enter') {
            if (currentCommand.current === 'ls') {
              showLogsContainers.mutate();
            }
            if (currentCommand.current.startsWith('view')) {
              const containerName = currentCommand.current.split(' ')[1];
              viewContainerLogs.mutate(containerName);
            }
          }
        });
      }
    });

    return () => {
      termRef.current?.dispose();
    };
  }, [showLogsContainers, viewContainerLogs]);

  return <div ref={container} />;
};

export default Logs;
