export interface MessageWithCheckedType {
  type: string;
  [key: string]: unknown;
}

export interface IncRegMessage {
  type: "reg";
  data: { name: string; password: string };
  id: number;
}
