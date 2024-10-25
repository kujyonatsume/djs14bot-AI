import { existsSync, readFileSync, rmSync, writeFileSync } from "fs"
import { Ollama, ChatRequest, Tool } from 'ollama';
export const ollama = new Ollama({ host: "http://127.0.0.1:11434" })

export enum modelType {
    llama32 = "llama3.2",
    abliterate = "dagbs/meta-llama-3.1-8b-instruct-abliterated",
    taiwan = "kenneth85/llama-3-taiwan",
    tool = "wangshenzhi/llama3.1_8b_chinese_chat"
}
type ChatData = ChatRequest & { enable: boolean }
export const model = modelType.tool
export class Chat {
    static Get(id: string) { if (Chat.hasId(id)) return JSON.parse(readFileSync(`chat/${id}.json`, 'utf8')) as ChatData }
    static hasId(id: string) { return existsSync(`chat/${id}.json`) }
    static Save(id: string, data: ChatData) { writeFileSync(`chat/${id}.json`, JSON.stringify(data, null, 4)) }
    static Create(id: string, text?: string) {
        if (Chat.hasId(id)) return false
        Chat.Save(id, { enable: true, model, messages: [{ role: 'system', content: text ?? "你是AI助手並且用繁體中文回復所有問題" }] })
        return true
    }
    static Delete(id: string) {
        if (!Chat.hasId(id)) return false
        rmSync(`chat/${id}.json`)
        return true
    }

    static SetEnable(id: string, enable: boolean) {
        var data = Chat.Get(id)
        if (!data) return false
        data.enable = enable
        return true
    }
    static async Send(id: string, content: string) {
        var data = Chat.Get(id)
        if (!data) return
        var tools = eval(readFileSync('./Tools.js', 'utf8')) as Array<Tool & { exec(args: Record<string, any>): string }>
        data.messages.push({ role: 'user', content });
        var msg = (await ollama.chat({ ...data, model, tools, stream: false })).message
        data.messages.push(msg);

        if (msg.tool_calls?.at(0)) {
            for (const call of msg.tool_calls) {
                const tool = tools.find(x => x.function.name === call.function.name);
                if (!tool) continue
                var text = tool.exec(call.function.arguments)
                data.messages.push({ role: 'tool', content: text });
            }

            msg = (await ollama.chat({ ...data, model, stream: false })).message;
            data.messages.push(msg);
        }

        Chat.Save(id, data)
        return msg.content
    };
}