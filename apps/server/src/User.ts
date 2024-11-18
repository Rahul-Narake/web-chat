import { WebSocket } from 'ws';
import {
  IncomingMessage,
  SENDMESSAGE,
  SUBSCRIBE,
  UNSUBSCRIBE,
} from './types/in';
import { SubscriptionManager } from './SubscriptionManager';
import { NewMessage } from './types/out';

export class User {
  private id: string;
  private ws: WebSocket;

  private subscriptions: string[] = [];

  constructor(id: string, ws: WebSocket) {
    this.id = id;
    this.ws = ws;
    this.addListeners();
  }

  public subscribe(subscription: string) {
    this.subscriptions.push(subscription);
  }

  public unsubscribe(subscription: string) {
    this.subscriptions = this.subscriptions.filter(
      (sub) => sub !== subscription
    );
  }

  emit(message: NewMessage) {
    console.log(`emmiting new message ${message}`);
    this.ws.send(JSON.stringify(message));
  }

  private addListeners() {
    this.ws.on('message', (message: string) => {
      const parsedMessage: IncomingMessage = JSON.parse(message);
      console.log(parsedMessage);
      if (parsedMessage.method === SUBSCRIBE) {
        parsedMessage?.params?.forEach((s) => {
          SubscriptionManager.getInstance().subscribe(this.id, s);
        });
      }

      if (parsedMessage.method === UNSUBSCRIBE) {
        parsedMessage.params.forEach((s) => {
          SubscriptionManager.getInstance().unsubscribe(this.id, s);
        });
      }

      if (parsedMessage.method === SENDMESSAGE) {
        const message = parsedMessage.message;
        parsedMessage.params.forEach((s) =>
          SubscriptionManager.getInstance().subscribe(this.id, s)
        );
        SubscriptionManager.getInstance().sendMessage(
          parsedMessage.params[0]!,
          message
        );
      }
    });
  }
}
