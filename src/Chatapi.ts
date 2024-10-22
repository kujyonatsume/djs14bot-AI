import { Ollama } from 'ollama';
import { db } from './db';

var model = 'llama3.2' // 'kenneth85/llama-3-taiwan'
export const ollama = new Ollama({ host: "https://api.natsumoe.com" })
export class Api {
    static async chat(id: string, text: string) {
        var chat = await this.start(id)
        chat.messages.push(await db.ChatMessage.save({ role: 'user', content: `${text}`.trim(), id: chat.messages.length }))
        const result = (await ollama.chat(chat)).message
        chat.messages.push(await db.ChatMessage.save({ ...result, id: chat.messages.length }))
        await chat.save()
        return result.content
    }
    static async start(id: string, text = '你是AI助手並且用繁體中文回復所有問題') {
        var chat = await db.Chat.FindUpsert({ id, model }, { id })
        if (chat.messages && chat.messages.length != 0) return chat
        var msg = await db.ChatMessage.save({ role: 'system', content: `${text}`.trim(), id: chat.messages.length ?? 0 })
        chat.messages = [msg]
        return await chat.save()
    }
    static async Func(content: string) {
        const r = (await ollama.chat({
            model, messages: [{ role: 'user', content }], tools: [{
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
        })).message.tool_calls[0].function.arguments
        console.log(r.n, r.m, r.n > r.m)
    }
}