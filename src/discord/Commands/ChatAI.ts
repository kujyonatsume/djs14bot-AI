import { db } from "../../db";
import { Command, Group, Module, Option, SubCommand } from "../decorator";
import { inlineCode, Message, OmitPartialGroupDMChannel } from 'discord.js';
import { Api } from "../../Chatapi";
var wait = false, group = { name: 'ai-chat', local: "聊天" }
@Group({ ...group, permission: 'Administrator' })
export class AIChat extends Module {

    @SubCommand({ local: "新聊天室" })
    async new(@Option({ local: "提示詞", required: false }) prompt: string) {
        await AIChat.clear(this.i.channelId)
        var chat = await Api.start(this.i.channelId, prompt)
        chat.guild = AIChat.GetGuild(this.i.guildId, this.i.guild.name)
        await chat.save()
        await this.SuccessEmbed(`新聊天室建立成功，在此頻道發言即可對話`)
    }

    static enable = [{ name: "啟用", value: 'true' }, { name: "停用", value: 'false' }]

    @SubCommand({ local: "啟用" })
    async usage(@Option({ local: "啟用或停用", choices: AIChat.enable }) enable: string) {
        var chat = await AIChat.Get(this.i.channelId)
        chat.enable = Boolean(enable)
        await chat.save()
        await this.SuccessEmbed(`聊天室已${AIChat.enable.find(x => x.value == enable).name}`)
    }

    @SubCommand({ local: "刪除聊天室" })
    async remove() {
        await AIChat.clear(this.i.channelId)
        await this.SuccessEmbed(`聊天室已重置`)
    }

    static async clear(id: string) {
        var chat = await AIChat.Get(id)
        if (!chat) return
        await db.ChatMessage.remove(chat.messages)
    }
    static GetGuild = (id: string, name: string) => db.DiscordGuild.FindUpsert({ id, name }, { id })
    static Get = (id: string) => db.Chat.findOneBy({ id })
    async messageCreate(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        if (wait) return
        wait = true
        var chat = await AIChat.Get(message.channelId)
        if (!chat) return
        await message.channel.send(`${await Api.chat(chat.id, message.content)}`)
        wait = false
    }
}