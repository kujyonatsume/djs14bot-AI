import { Column, IdxEntity, Entity, OneToMany, ManyToOne } from "./Entity";
import { ChatMessage } from "./ChatMessage";
import { DiscordGuild } from "./DiscordGuild";

@Entity()
export class Chat extends IdxEntity {
    @Column({ nullable: false })
    id: string;

    @Column({ nullable: false })
    model: string;

    @OneToMany(() => ChatMessage, message => message.chat, { eager: true })
    messages: ChatMessage[];

    @ManyToOne(() => DiscordGuild, guild => guild.chats)
    guild: Promise<DiscordGuild>;
}