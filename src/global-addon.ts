import { randomInt } from 'crypto';
import { Client, Emoji, Message, User } from 'discord.js';

declare global {
    interface Array<T> {
        groupBy(callback: (value: T, i: number) => PropertyKey): Partial<Record<PropertyKey, T[]>>
    }
    interface Math {
        randomInt: typeof randomInt
    }
    interface PromiseConstructor {
        delay(ms: number): Promise<void>
    }
}

Math.randomInt = randomInt
Promise.delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))
Array.prototype.groupBy = function <T>(this: T[], fn: (v: T, i: number) => PropertyKey) {
    return Object.groupBy(this, fn)
}

declare module "discord.js" {
    export interface Message {
        emojiParse(): void;
        emojis: Emoji[];
    }
}
Object.defineProperty(Message.prototype, "emojiParse", {
    value(this: Message) {
        this.emojis = [...this.content.matchAll(/<?(a:)?(\w{2,32}):(\d{17,19})>?/)]
            .map(x => new Emoji(this.client, { animated: Boolean(x[1]), name: x[2], id: x[3] }));
    }
})