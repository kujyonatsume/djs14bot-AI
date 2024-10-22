import { db } from "../../db";
import { Command, Group, Module, Option, SubCommand, SubGroup } from "../decorator";
import { AutocompleteInteraction, ChannelType, GuildBasedChannel, hyperlink, inlineCode, Role, TextChannel } from 'discord.js';
import { Api } from "../../Chatapi";

export class AIChat extends Module {

    @Command({ local: "新聊天室", desc: "若無符合的帳號請自行輸入 通知身分組請直接加入通知訊息中" })
    async newchat(@Option({ local: "輸入文字", required: false }) text: string) {
        await Api.start(this.i.channelId, text)
        await this.SuccessEmbed(`新聊天室建立成功，請使用${inlineCode('/AI聊天 發送訊息')}`)
    }
    @Command({ local: "發送訊息", desc: "若無符合的帳號請自行輸入 通知身分組請直接加入通知訊息中" })
    async chat(@Option({ local: "輸入文字" }) text: string) {
        var chat = await Api.start(this.i.channelId, text)
        chat.guild = AIChat.GetGuild(this.i.guildId, this.i.guild.name)
        await chat.save()
        await this.SuccessEmbed(`${await Api.chat(this.i.channelId, text)}`)
    }
    static GetGuild(id: string, name: string) { return db.DiscordGuild.FindUpsert({ id, name }, { id }) }
}