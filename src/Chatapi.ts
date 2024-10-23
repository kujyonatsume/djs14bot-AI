import { Ollama } from 'ollama';
import { db } from './db';

var model = 'kenneth85/llama-3-taiwan' // 'kenneth85/llama-3-taiwan'
export const ollama = new Ollama({ host: "https://api.natsumoe.com" })
export enum modelType {
    abliterated31 = "mannix/llama3.1-8b-abliterated",
    chinese3 = "jack/llama3-8b-chinese",
    llama31 = "shareai/llama3.1-dpo-zh",
    llama32 = "llama3.2",
    abliteratedmeta = "dagbs/meta-llama-3.1-8b-instruct-abliterated",
    abliteratedtaiwan = "kenneth85/llama-3-taiwan",
    
}
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
        var msg = await db.ChatMessage.save({ role: 'system', content: `${text}`.trim(), id: chat.messages?.length ?? 0 })
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