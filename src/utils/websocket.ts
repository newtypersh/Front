export interface WebSocketHandlers {
  onTimer?: (timer: string) => void;
  onStatus?: (status: string) => void;
  onError?: (e: Event) => void;
}

export function createStatusWebSocket(
  url: string,
  handlers: WebSocketHandlers,
  reconnectInterval = 3000
): { ws: WebSocket | null; close: () => void } {
  let ws: WebSocket | null = null;
  let reconnectTimeout: NodeJS.Timeout | null = null;

  function connect() {
    ws = new WebSocket(url);

    ws.onopen = () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.timer && handlers.onTimer) handlers.onTimer(data.timer);
        if (data.status && handlers.onStatus) handlers.onStatus(data.status);
      } catch (e) {
        // ignore parse error
      }
    };

    ws.onerror = (e) => {
      if (handlers.onError) handlers.onError(e);
      ws && ws.close();
    };

    ws.onclose = () => {
      if (!reconnectTimeout) {
        reconnectTimeout = setTimeout(connect, reconnectInterval);
      }
    };
  }

  connect();

  return {
    ws,
    close: () => {
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    },
  };
}
