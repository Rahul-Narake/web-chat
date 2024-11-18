import { WebSocket } from 'ws';
import { User } from './User';
import { SubscriptionManager } from './SubscriptionManager';

export class UserManager {
  private static instance: UserManager;
  private users: Map<string, User> = new Map();

  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new UserManager();
    }
    return this.instance;
  }

  public addUser(ws: WebSocket, userId: string) {
    const user = new User(userId, ws);
    this.users.set(userId, user);
    this.registerOnClose(ws, userId);
    console.log(`New user connected :: ${userId}`);
  }

  public getUser(id: string) {
    return this.users.get(id);
  }

  private registerOnClose(ws: WebSocket, id: string) {
    ws.on('close', () => {
      this.users.delete(id);
      SubscriptionManager.getInstance().userLeft(id);
    });
  }

  private getRandomId() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
