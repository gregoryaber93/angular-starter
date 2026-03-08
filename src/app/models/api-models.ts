export interface Product{
    id: number;
    name: string;
    company: string;
}

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}