import ollama from 'ollama';
import { db } from './db';

var model = 'kenneth85/llama-3-taiwan'

export class Api {
    static async chat(text: string, id: string) {
        var chat = await this.start(text, id)
        chat.messages.push(await db.ChatMessage.save({ role: 'user', content: `${text}`.trim(), id: chat.messages.length }))
        const result = (await ollama.chat(chat)).message
        chat.messages.push(await db.ChatMessage.save({ ...result, id: chat.messages.length }))
        await chat.save()
        return result.content
    }
    static async start(text: string, id: string) {
        var chat = await db.Chat.FindUpsert({ id, model }, { id })
        if(chat.messages.length == 0) {
            var msg = await db.ChatMessage.save({ role: 'system', content: `${text}`.trim(), id: chat.messages.length ?? 0 })
            msg.chat = chat.resolve()
            await msg.save()
        }
        return chat
    }
    static async Func(text: string, id: string) {
        var chat = await db.Chat.FindUpsert({ id })
        chat.messages.push(await db.ChatMessage.save({ role: 'user', content: `${text}`.trim(), id: chat.messages.length }))
        const result = (await ollama.chat({
            ...chat, tools: [{
                type: "function",
                function: {
                    name: "which_is_bigger",
                    description: "string",
                    parameters: {
                        type: 'object',
                        properties: {
                            n: {
                                type: "float",
                                description: "string"
                            },
                            m: {
                                type: "float",
                                description: "string"
                            },
                        },
                        required: ['n', 'm'],
                    },
                },
            }]
        }))
    }
}