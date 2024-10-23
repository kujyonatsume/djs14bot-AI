import { db } from "../../db";
import { Command, Group, Module, Option, SubCommand, SubGroup } from "../decorator";
import { AutocompleteInteraction, ChannelType, GuildBasedChannel, hyperlink, inlineCode, Message, OmitPartialGroupDMChannel, Role, TextChannel } from 'discord.js';
import { Api } from "../../Chatapi";
var wait = false
export class AIChat extends Module {

    @Command({ local: "新聊天室" })
    async newchat(@Option({ local: "輸入文字", required: false }) text: string) {
        var chat = await Api.start(this.i.channelId, text)
        chat.guild = AIChat.GetGuild(this.i.guildId, this.i.guild.name)
        await chat.save()
        await this.SuccessEmbed(`新聊天室建立成功，請使用${inlineCode('/AI聊天 發送訊息')}`)
    }
    //@Command({ local: "發送訊息" })
    //async chat(@Option({ local: "輸入文字" }) text: string) {
    //
    //}

    static GetGuild(id: string, name: string) { return db.DiscordGuild.FindUpsert({ id, name }, { id }) }
    
    async messageCreate(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        if (wait) return
        wait = true
        var chat = await db.Chat.findOneBy({ id: message.channelId })
        if (!chat) return
        await message.channel.send(`${await Api.chat(chat.id, message.content)}`)
        wait = false
    }
}