import { useState, useCallback } from 'react';

interface QueuedError {
  id: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
}

/**
 * Hook to manage a priority queue of errors
 */
export function useErrorQueue(maxSize: number = 10) {
  const [queue, setQueue] = useState<QueuedError[]>([]);

  const enqueue = useCallback((
    message: string,
    priority: QueuedError['priority'] = 'medium'
  ) => {
    const error: QueuedError = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      timestamp: new Date(),
      priority,
    };

    setQueue(prev => {
      const updated = [...prev, error];
      // Sort by priority (high to low) and timestamp
      updated.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const diff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (diff !== 0) return diff;
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
      return updated.slice(0, maxSize);
    });

    return error.id;
  }, [maxSize]);

  const dequeue = useCallback(() => {
    setQueue(prev => prev.slice(1));
  }, []);

  const remove = useCallback((id: string) => {
    setQueue(prev => prev.filter(err => err.id !== id));
  }, []);

  const clear = useCallback(() => {
    setQueue([]);
  }, []);

  return {
    queue,
    enqueue,
    dequeue,
    remove,
    clear,
    isEmpty: queue.length === 0,
    size: queue.length,
  };
}

