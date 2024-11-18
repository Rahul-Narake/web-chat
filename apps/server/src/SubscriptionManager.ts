import { createClient, RedisClientType } from 'redis';
import { UserManager } from './UserManager';
import { IMessage } from './types/out';

export class SubscriptionManager {
  private static instance: SubscriptionManager;
  private subscriptions: Map<string, string[]> = new Map();
  private reverseSubscriptions: Map<string, string[]> = new Map();
  private subscibeRedisClient: RedisClientType;
  private publishRedisClient: RedisClientType;

  private constructor() {
    this.subscibeRedisClient = createClient();
    this.subscibeRedisClient.connect();
    this.publishRedisClient = createClient();
    this.publishRedisClient.connect();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new SubscriptionManager();
    }
    return this.instance;
  }

  public subscribe(userId: string, subscription: string) {
    console.log(`User ${userId} subscribed to ${subscription}`);
    if (this.subscriptions.get(userId)?.includes(subscription)) {
      return;
    }

    this.subscriptions.set(
      userId,
      (this.subscriptions.get(userId) || []).concat(subscription)
    );
    this.reverseSubscriptions.set(
      subscription,
      (this.reverseSubscriptions.get(subscription) || []).concat(userId)
    );

    if (this.reverseSubscriptions.get(subscription)?.length === 1) {
      this.subscibeRedisClient.subscribe(
        subscription,
        this.redisCallbackHandler
      );
      console.log(`User ${userId} first joined the room ${subscription}`);
    }
  }

  public unsubscribe(userId: string, subscription: string) {
    console.log(`User ${userId} Unsubscribed to ${subscription}`);
    const subscriptions = this.subscriptions.get(userId);
    if (subscriptions) {
      this.subscriptions.set(
        userId,
        subscriptions.filter((sub) => sub !== subscription)
      );
    }

    const reverseSubscriptions = this.reverseSubscriptions.get(subscription);
    if (reverseSubscriptions) {
      this.reverseSubscriptions.set(
        subscription,
        reverseSubscriptions.filter((user) => user !== userId)
      );
    }

    if (this.reverseSubscriptions.get(subscription)?.length === 0) {
      this.reverseSubscriptions.delete(subscription);
      this.subscibeRedisClient.unsubscribe(subscription);
    }
  }

  public sendMessage(subscription: string, message: string) {
    if (this.reverseSubscriptions.get(subscription)?.length === 0) {
      return;
    }
    this.publishRedisClient.publish(subscription, message);
    console.log(`Publishing message over room ${subscription}`);
  }

  public userLeft(userId: string) {
    console.log('user left ' + userId);
    this.subscriptions.get(userId)?.forEach((s) => this.unsubscribe(userId, s));
  }

  public getSubscriptions(userId: string) {
    return this.subscriptions.get(userId) || [];
  }

  private redisCallbackHandler = (message: string, channel: string) => {
    console.log('new message received');
    const newMessage = {
      type: 'newMessage',
      data: JSON.parse(message) as IMessage,
    };
    this.reverseSubscriptions
      .get(channel)
      ?.forEach((u) => UserManager.getInstance().getUser(u)?.emit(newMessage));
  };
}
