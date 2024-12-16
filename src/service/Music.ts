import { YouTubePlugin } from "@distube/youtube";
import SoundCloudPlugin from "@distube/soundcloud";
import DeezerPlugin from "@distube/deezer"
import { DirectLinkPlugin } from "@distube/direct-link"
import { FilePlugin } from "@distube/file"
import SpotifyPlugin from "@distube/spotify"
import DisTube from "distube";
import { ButtonBuilder, ButtonStyle, Client } from 'discord.js';

const Plugin = {
    YouTube: new YouTubePlugin(),
    SoundCloud: new SoundCloudPlugin(),
    Spotify: new SpotifyPlugin(),
    Deezer: new DeezerPlugin(),
    DirectLink: new DirectLinkPlugin(),
    File: new FilePlugin()
}

export class Player<T extends Client> extends DisTube {
    plugins = Object.values(Plugin)
    constructor(public client: T) {
        super(client, {
            emitAddListWhenCreatingQueue: true,
            emitAddSongWhenCreatingQueue: true,
        })
    }
    getPlugin<T extends keyof typeof Plugin>(name: T) {
        return this.plugins.find(x => x.constructor.name == name + "Plugin") as (typeof Plugin)[T]
    }
}
/*
["play", "previous", "pause/resume", "skip", "autoplay"].map(x =>
    new ButtonBuilder().setCustomId(x).setStyle(ButtonStyle.Primary)
);
["stop", "volume-",  "queue", "volume+",  "repeat"].map()
*/