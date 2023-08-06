import { BoredElement, WSData } from '@org/models';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { useWebSocket } from './hooks/useWebSocket';
import styles from './app.module.css';
export function App() {
  const [resp, setResp] = useState<BoredElement[]>([]);
  const { listener, ws } = useWebSocket<WSData<BoredElement>>(
    'ws://localhost:3000',
    toast.success,
    toast.error
  );
  useEffect(() => {
    const subs = listener<WSData<BoredElement>>('polling_completed')?.subscribe(
      ({ data }) => {
        console.log('Polling Completed', data);
        toast.dismiss();
        toast.success(
          'Polling completed after ' + data?.attempts + ' attemtps'
        );
        if (!data) {
          return;
        }
        setResp((arr: BoredElement[]) => {
          return [...arr, data];
        });
      }
    );
    const sub2 = listener<WSData<string>>('polling')?.subscribe((resp) => {
      console.log(`It's polling`, resp);
      const promise = () =>
        new Promise((resolve) => setTimeout(resolve, 1000000));

      toast.promise(promise, {
        loading: resp.data,
        success: () => 'Polling completed',
        error: 'Polling failed',
      });
    });

    return () => {
      subs?.unsubscribe();
      sub2?.unsubscribe();
    };
  }, [listener]);

  const sendEvent = () => {
    console.log('calling websocket polling');
    ws?.next({ event: 'polling', data: 0.5 as unknown as BoredElement });
    toast('Polling started', { duration: Infinity });
  };

  return (
    <>
      <div className="container">
        <h1 className={styles.title}>Web Socket Polling</h1>
        <p>
          <button type="button" onClick={sendEvent} className={styles.button}>
            Start Polling
          </button>
        </p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Participants</th>
              <th>Accesibility</th>
              <th>Attempts</th>
            </tr>
          </thead>
          <tbody>
            {resp.map((data, i: number) => (
              <tr key={i}>
                <td>{data.activity}</td>
                <td>{data.type}</td>
                <td>{data.participants}</td>
                <td>{data.accessibility}</td>
                <td>{data.attempts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Toaster richColors expand position={'top-right'}></Toaster>
    </>
  );
}

export default App;
