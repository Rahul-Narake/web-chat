export interface ICurrentUser {
  id: number;
  name: string;
  username: string;
  profile?: string;
  friends: User[];
  friendRequestsSent: RequestSent[];
  friendRequestsReceived: RequestReceived[];
  messages: IMessage[];
}

export interface User {
  id: number;
  name: string;
  profile?: string;
  username?: string;
}

export interface IConversation {
  id: number;
  name?: 'Friends forever';
  pic?: string;
  isGroupChat: boolean;
  createdAt: Date;
  updatedAt: Date;
  users: User[];
  admins: User[];
  messages: IMessage[];
}

export interface IMessage {
  id: number;
  body: string;
  senderId: number;
  conversationId: number;
  createdAt: Date;
  Sender?: User;
}

export type RequestSent = {
  id: number;
  receiverId: number;
  receiver: User;
};
export type RequestReceived = {
  id: number;
  senderId: number;
  sender: User;
};

export type IncommingMessage = {};
