import { useCallback, useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

export function useWebSocket<T extends { event: string }>(
  url: string,
  success: (data: string) => void,
  error: (data: string) => void
) {
  const [ws, setWS] = useState<WebSocketSubject<T> | null>(null);
  useEffect(() => {
    console.log('Mounting WS');
    const subject = webSocket<T>({
      url,
      openObserver: {
        next: () => success('Connected'),
      },
      closeObserver: {
        next: () => error('Connection lost'),
      },
    });
    setWS(subject);
    subject.subscribe({
      next: (val) => {
        console.log('Next', val);
      },
      error: (error: unknown) => console.error('Error in websocket', error),
      complete: () => console.info('Conection completed'),
    });
    return () => {
      subject?.complete();
      subject?.unsubscribe();
    };
  }, []);

  const listener = useCallback(
    <K extends { event: string }>(event: string): Observable<K> | undefined =>
      ws?.multiplex(
        () => 'Listenting to ' + event,
        () => 'Not Listening to' + event,
        (message) => message.event === event
      ) as unknown as Observable<K>,
    [ws]
  );
  return { listener, ws };
}
