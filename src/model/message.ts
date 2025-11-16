export interface MessageWithCheckedType {
  type: string;
  [key: string]: unknown;
}

export interface IncRegMessage {
  type: "reg";
  data: { name: string; password: string };
  id: number;
}

export interface ShipMessage {
  position: { x: number; y: number };
  direction: boolean;
  type: string;
  length: number;
}

export interface ShipStored {
  cells: Map<number, number[]>;
  length: number;
  shot: number;
  killed: boolean;
  surrounding: { x: number; y: number }[];
}
