import { Chat } from "../service/ChatAI";
import config from "../config";
import { Group, Module, Option, SubCommand } from "../decorator";
import { Message, OmitPartialGroupDMChannel } from "discord.js";

@Group({ name: 'ai-chat', local: "聊天", permission: 'Administrator' })
export class AIChat extends Module {
    async init() {
        Chat.ReloadTools()
    }
    @SubCommand({ local: "新聊天室" })
    async cteate(@Option({ local: "提示詞", required: false }) prompt: string) {
        if (Chat.Create(this.i.channelId, prompt))
            return await this.SuccessEmbed(`聊天室建立成功，在此頻道發言即可對話`)
        await this.ErrorEmbed(`不能重複建立聊天室`)
    }
    @SubCommand({ local: "刪除聊天室" })
    async remove() {
        if (Chat.Delete(this.i.channelId))
            return await this.SuccessEmbed(`聊天室已刪除`)
        await this.ErrorEmbed(`聊天室不存在`)
    }
    @SubCommand({ local: "設定聊天室" })
    async enable(@Option({ local: "設定狀態", choices: [{ name: "啟用", value: 1 }, { name: "停用", value: 0 }] }) status: number) {
        if (Chat.SetEnable(this.i.channelId, Boolean(status)))
            return await this.SuccessEmbed(`聊天室已${Boolean(status) ? "啟" : "停"}用`)
        await this.ErrorEmbed(`聊天室不存在`)
    }
    async messageCreate(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        if (!message.content.startsWith(message.client.user.toString())) return
        var chat = Chat.Get(message.channelId)
        if (chat?.enable != true) return
        chat.enable = false
        var content = message.content.replace(message.client.user.toString(), "").trim()
        console.log(message.author.id === config.ownerId);

        if (message.author.id === config.ownerId) {
            if (content == "重載") {
                Chat.ReloadTools()
                message.channel.sendTyping()
                message.channel.send({ embeds: [this.Embed.setColor('Green').setDescription("重新載入")] })
                return
            }
        }
        console.log(message.author.displayName + ' : ' + content)
        message.channel.sendTyping()
        var result = await Chat.Send(message.channelId, content)
        chat.enable = true
        if (!result) return
        console.log(result)
        await message.channel.send(result)
    }
}