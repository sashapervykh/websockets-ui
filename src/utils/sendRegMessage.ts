import type WebSocket from "ws";

export function sendRegMessage({
  type,
  data,
  ws,
}: {
  type: string;
  data;
  ws: WebSocket;
}) {
  const message = {
    type: type,
    data: JSON.stringify(data),
    id: 0,
  };
  ws.send(JSON.stringify(message));
}
