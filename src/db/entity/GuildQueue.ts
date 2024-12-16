import { Entity, Column, IdxEntity, OneToMany } from "./Entity"


@Entity()
export class GuildQueue extends IdxEntity {

    @Column({ nullable: false })
    id: string

    @Column({ nullable: true, default: 100 })
    volume: number

    @Column({ nullable: true, default: true })
    autoplay: boolean

    @Column({ nullable: true, default: 0 })
    repeatMode: number
}
