export interface User {
  id: number;
  name: string;
  profile?: string;
  username?: string;
}

export interface IMessage {
  id: number;
  body: string;
  senderId: number;
  conversationId: number;
  createdAt: Date;
  Sender?: User;
}

export type NewMessage = {
  type: string;
  data: IMessage;
};

export type OutgoingMessage = NewMessage;
