export const SUBSCRIBE = 'SUBSCRIBE';
export const UNSUBSCRIBE = 'UNSUBSCRIBE';
export const SENDMESSAGE = 'SENDMESSAGE';

export type SubscribeMessage = {
  method: typeof SUBSCRIBE;
  params: string[];
};

export type UnsubscribeMessage = {
  method: typeof UNSUBSCRIBE;
  params: string[];
};

export type SendMessage = {
  method: typeof SENDMESSAGE;
  params: string[];
  message: string;
};

export type IncomingMessage =
  | SubscribeMessage
  | UnsubscribeMessage
  | SendMessage;
