import { useSubscription } from '@apollo/client/react';
import { useCallback, useRef, useState } from 'react';
import { graphql, type ResultOf } from '@/lib';

const LogStreamSubscription = graphql(`
  subscription LogStream($history: Boolean!) {
    logStream(history: $history) {
      timestamp
      level
      name
      message
      metadata
    }
  }
`);

export type LogEntry = ResultOf<typeof LogStreamSubscription>['logStream'];
export type LogLevel = LogEntry['level'];

const MAX_LOGS = 1000;

export const useLogStream = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const hasLoadedHistory = useRef(false);

  const shouldLoadHistory = !hasLoadedHistory.current;

  useSubscription(LogStreamSubscription, {
    skip: isPaused,
    variables: { history: shouldLoadHistory },
    onData: ({ data }) => {
      hasLoadedHistory.current = true;
      const entry = data.data?.logStream;
      if (entry) {
        setLogs((prev) => {
          const next = [entry, ...prev];
          return next.length > MAX_LOGS ? next.slice(0, MAX_LOGS) : next;
        });
      }
    },
    onError: (error) => {
      console.error('Log stream subscription error:', error);
    },
  });

  const clear = useCallback(() => {
    setLogs([]);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  return {
    logs,
    isPaused,
    clear,
    togglePause,
  };
};
