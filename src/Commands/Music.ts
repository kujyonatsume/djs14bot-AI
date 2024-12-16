import { client } from "../discord";
import { Button, Group, Module, Option, SubCommand, SubGroup } from "../decorator";
import { AutocompleteInteraction, GuildMember } from "discord.js";
import { RepeatMode, Song } from "distube";
import { SearchResultType } from "@distube/youtube";
import { SearchType } from "@distube/soundcloud";
import { db } from "../db";

@Group({ name: 'music', local: "音樂" })
export class Music extends Module {

    static Search = SubGroup({ name: "search", local: "搜尋" })

    static async YouTube(mod: Module, i: AutocompleteInteraction, current: string) {
        return (current == "") ? [] : (await client.player.getPlugin("YouTube").search(current, { type: SearchResultType.VIDEO, limit: 5 })).map(x => ({ name: x.name, value: x.url }))
    }
    static async SoundCloud(mod: Module, i: AutocompleteInteraction, current: string) {
        return (current == "") ? [] : (await client.player.getPlugin("SoundCloud").search(current, SearchType.Track, 5)).map(x => ({ name: x.name, value: x.url }))
    }
    async Check() {
        if ((<GuildMember>this.i.member).voice?.channel) return true
        await this.ErrorEmbed("請先加入語音頻道", true)
    }
    @Music.Search({ desc: "搜尋歌曲" })
    async youtube(@Option({ local: "查詢", exec: Music.YouTube }) query: string) {
        await this.play(query)
    }
    @Music.Search({ desc: "搜尋歌曲" })
    async soundcloud(@Option({ local: "查詢", exec: Music.SoundCloud }) query: string) {
        await this.play(query)
    }
    @Button("Primary", x => x.setEmoji("⏯"))
    @SubCommand({ local: "播放", desc: "播放一首歌曲" })
    async play(@Option({ local: "搜尋" }) url: string) {
        if (!await this.Check()) return
        const member = <GuildMember>this.i.member
        const vc = member.voice?.channel;
        await this.i.deferReply()
        try {
            client.player.play(vc, url, { textChannel: this.i.channel, member, metadata: { interaction: this.i } })
        } catch (e) {
            console.error(e);
            this.ErrorEmbed(`Error: \`${e.message}\``);
        };
    }
    @Button("Primary", x => x.setEmoji("⬅"))
    @SubCommand({ local: "上一首", desc: "播放上一首" })
    async previous() {
        if (!await this.Check()) return
        await this.i.deferReply()
        try {
            const song = await client.player.previous(this.i)
            this.SuccessEmbed(`previoused to \`${song.name || song.url}\``);
        } catch (e) {
            console.error(e);
            this.ErrorEmbed(`Error: \`${e.message}\``);
        }
    }
    @Button("Primary", x => x.setEmoji("➡"))
    @SubCommand({ local: "下一首", desc: "播放下一首" })
    async skip() {
        if (!await this.Check()) return
        await this.i.deferReply()
        try {
            const song = await client.player.skip(this.i);
            this.SuccessEmbed(`Skipped to \`${song.name || song.url}\``);
        } catch (e) {
            console.error(e);
            this.ErrorEmbed(`Error: \`${e.message}\``);
        }
    }
    @Button("Primary", x => x.setEmoji("⬅"))
    @SubCommand({ local: "暫停", desc: "暫停播放" })
    async pause() {
        if (!await this.Check()) return
        var queue = client.player.getQueue(this.i)
        if (!queue.paused) queue.pause()
        await this.SuccessEmbed("已暫停")
    }
    @Button("Primary", x => x.setEmoji("⬅"))
    @SubCommand({ local: "繼續", desc: "繼續播放" })
    async resume() {
        if (!await this.Check()) return
        var queue = client.player.getQueue(this.i)
        if (queue.paused) queue.resume()
        await this.SuccessEmbed("繼續播放")
    }
    @Button("Primary", x => x.setEmoji("⏹"))
    @SubCommand({ local: "停止", desc: "停止播放" })
    async stop() {
        if (!await this.Check()) return
        try {
            var queue = client.player.getQueue(this.i)
            await queue.stop();
            queue.voice.leave();
            this.SuccessEmbed("停止")
        } catch (e) {
            console.error(e);
            this.ErrorEmbed(`Error: \`${e.message}\``);
        }
    }
    @Button("Primary", x => x.setEmoji("⬅"))
    @SubCommand({ local: "歌單", desc: "查詢歌單" })
    async queue() {
        await this.i.deferReply()
        const queue = client.player.getQueue(this.i)
        if (!queue) return await this.i.deleteReply()
        const song = queue.songs[0];
        await this.SuccessEmbed(x => x
            .setDescription(`**正在播放:** \`${song.name || song.url}\` - \`${queue.formattedCurrentTime}\`/\`${song.formattedDuration ?? (<{ playFromSource: false; song?: Song<unknown> }>song.stream).song?.formattedDuration}\`\n\n**歌單:**\n${queue.songs.slice(1, 10).map((song, i) => `**${i + 1}.** \`${song.name || song.url}\``).join("\n") || "None"}`)
            .addFields(
                { name: "音量", value: `${queue.volume}%`, inline: true, },
                { name: "自動播放", value: queue.autoplay ? "開啟" : "關閉", inline: true, },
                { name: "循環模式", value: RepeatMode[queue.repeatMode].toLowerCase(), inline: true, },
            ),
        );
    }
    @Button("Primary", x => x.setEmoji("⬅"))
    @SubCommand({ local: "自動播放", desc: "自動播放推薦歌曲" })
    async autoplay() {
        if (!await this.Check()) return
        const q = client.player.getQueue(this.i)
        const gq = await db.GuildQueue.findOne({ where: { id: q.id } })
        gq.autoplay = q.toggleAutoplay()
        await gq.save()
        await this.SuccessEmbed(`自動播放 \`已${gq.autoplay ? "開啟" : "關閉"}\`%`)
    }
    @Button("Primary", x => x.setEmoji("⬅"))
    @SubCommand({ local: "調整音量", desc: "調整音量大小" })
    async volume(@Option({ local: "音量", description: "請輸入 0-100" }) volume: number) {
        if (!await this.Check()) return
        const q = client.player.setVolume(this.i, volume);
        const gq = await db.GuildQueue.findOne({ where: { id: q.id } })
        gq.volume = volume
        await gq.save()
        await this.SuccessEmbed(`音量已設為 \`${volume}\`%`)
    }
    @Button("Primary", x => x.setEmoji("⬅"))
    @SubCommand({ local: "重複播放", desc: "設定重播模式" })
    async repeat(@Option({ local: "模式", description: "請輸入 Off One All", choices: [{ name: "關閉", value: 0 }, { name: "單曲", value: 1 }, { name: "全部", value: 2 }], required: false }) mode?: number) {
        if (!await this.Check()) return
        const q = client.player.getQueue(this.i)
        const gq = await db.GuildQueue.findOne({ where: { id: q.id } })
        gq.repeatMode = q.setRepeatMode(mode);
        await gq.save()
        await this.SuccessEmbed(`重播模式已設為: \`${RepeatMode[gq.repeatMode]}\``)
    }
}

