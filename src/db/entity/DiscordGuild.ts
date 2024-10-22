import { Column, IdxEntity, Entity, OneToMany } from "./Entity";
import { Chat } from "./Chat";

@Entity()
export class DiscordGuild extends IdxEntity {
    @Column({ nullable: false })
    id: string;

    @Column({ nullable: false })
    name: string;

    @OneToMany(() => Chat, chat => chat.guild, { eager: true })
    chats: Chat[];
}