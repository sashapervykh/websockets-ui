import type WebSocket from "ws";

export function sendMessage({
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
