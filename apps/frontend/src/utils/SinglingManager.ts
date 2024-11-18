import { IMessage } from '../types';

// export const BASE_URL = "wss://ws.backpack.exchange/"
export const BASE_URL = 'ws://localhost:5000';

export class SignalingManager {
  private ws: WebSocket;
  private static instance: SignalingManager;
  private bufferedMessages: any[] = [];
  private callbacks: any = {};
  private id: number;
  private initialized: boolean = false;
  private userId: string;

  private constructor(userId: string) {
    this.bufferedMessages = [];
    this.id = 1;
    this.userId = userId;
    this.ws = new WebSocket(`${BASE_URL}/?userId=${this.userId}`);
    this.init();
  }

  public static getInstance(userId: string) {
    if (!this.instance) {
      this.instance = new SignalingManager(userId);
    }
    return this.instance;
  }

  init() {
    this.ws.onopen = () => {
      this.initialized = true;
      this.bufferedMessages.forEach((message) => {
        this.ws.send(JSON.stringify(message));
      });
      this.bufferedMessages = [];
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const type = message.type;
      if (this.callbacks[type]) {
        this.callbacks[type].forEach(({ callback }: { callback: any }) => {
          if (type === 'newMessage') {
            const newMessage: IMessage = message.data;
            callback(newMessage);
          }
        });
      }
    };
  }

  sendMessage(message: any) {
    const messageToSend = {
      ...message,
      id: this.id++,
    };
    if (!this.initialized) {
      this.bufferedMessages.push(messageToSend);
      return;
    }
    this.ws.send(JSON.stringify(messageToSend));
  }
  async registerCallback(type: string, callback: any, id: string) {
    this.callbacks[type] = this.callbacks[type] || [];
    this.callbacks[type].push({ callback, id });
    // "ticker" => callback
  }

  async deRegisterCallback(type: string, id: string) {
    if (this.callbacks[type]) {
      const index = this.callbacks[type].findIndex(
        (callback: any) => callback.id === id
      );
      if (index !== -1) {
        this.callbacks[type].splice(index, 1);
      }
    }
  }
}
