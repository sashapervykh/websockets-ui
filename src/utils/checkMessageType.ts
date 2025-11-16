export function checkMessageType(message: unknown) {
  if (!message) throw new Error("Received message is not an object!");
  if (typeof message !== "object")
    throw new Error("Received message is not an object!");
  if (!("type" in message)) {
    throw new Error("Message does not have type property");
  }
  if (typeof message["type"] !== "string") {
    throw new Error("Property message has wrong type");
  }

  return { ...message, type: message.type };
}
