import { Chat } from "./Chat";
import { Column, IdxEntity, Entity, ManyToOne } from "./Entity";

@Entity()
export class ChatMessage extends IdxEntity {

    @Column({ nullable: false })
    id: number;

    @Column({ nullable: false })
    role: string;

    @Column({ nullable: false })
    content: string;

    @ManyToOne(() => Chat, chat => chat.messages)
    chat: Promise<Chat>;
}