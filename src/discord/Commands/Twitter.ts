import { db } from "../../db";
import { Group, Module, Option, SubCommand, SubGroup } from "../decorator";
import { AutocompleteInteraction, ChannelType, GuildBasedChannel, hyperlink, inlineCode, Role, TextChannel } from 'discord.js';
import { Api } from "../../Chatapi";

@Group({ local: "AI聊天", permission: "Administrator" })
export class AIChat extends Module {

    static notify = SubGroup({ name: "notify", local: "通知" });

    @SubCommand({ local: "新聊天室", desc: "若無符合的帳號請自行輸入 通知身分組請直接加入通知訊息中" })
    async NewChat(@Option({ local: "輸入文字", required: false }) text: string) {
        var chat = await Api.start(this.i.channelId, text)
        chat.guild = AIChat.GetGuild(this.i.guildId, this.i.guild.name)
        chat.save()
        this.SuccessEmbed(`新聊天室建立成功，請使用${inlineCode('/AI聊天 發送訊息')}`)
    }
    @SubCommand({ local: "發送訊息", desc: "若無符合的帳號請自行輸入 通知身分組請直接加入通知訊息中" })
    async Chat(@Option({ local: "輸入文字" }) text: string) {
        var chat = await Api.start(this.i.channelId, text)
        chat.guild = AIChat.GetGuild(this.i.guildId, this.i.guild.name)
        chat.save()
    }
    static GetGuild(id: string, name: string) { return db.DiscordGuild.FindUpsert({ id, name }, { id }) }
}
