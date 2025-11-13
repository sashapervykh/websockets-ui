import ws, { WebSocketServer } from "ws";

export function startWebSocketServer() {
  const wss = new WebSocketServer({ port: 3000 }, () => {
    console.log("WebSocket Server started on the 3000 port.");
  });

  wss.on("connection", function connection(ws) {
    ws.on("error", console.error);

    ws.on("message", function message(data) {
      //   const message = JSON.parse(data.toString());
      //   console.log(message);
    });

    ws.send("something");
  });
}
