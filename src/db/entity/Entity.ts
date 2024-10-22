import { PrimaryGeneratedColumn, BaseEntity, UpdateDateColumn, FindOptionsWhere, DeepPartial } from "typeorm"
export * from "typeorm"

export abstract class IEntity extends BaseEntity {
    static async FindUpsert<T extends IEntity>(this: { new(): T; } & typeof IEntity, create: DeepPartial<T>, whare?: FindOptionsWhere<T>) {
        var result = (await this.findOneBy(whare) ?? this.create(create)) as T
        for (const key in create) result[key] = create[key]
        return await result.save() as T
    }

    static create<T extends BaseEntity>(this: (new () => T) & typeof BaseEntity): T;
    static create<T extends BaseEntity>(this: (new () => T) & typeof BaseEntity, entityLikeArray: DeepPartial<T>[]): T[];
    static create<T extends BaseEntity>(this: (new () => T) & typeof BaseEntity, entityLike: DeepPartial<T>): T;
    static create<T extends BaseEntity>(entityLike?: DeepPartial<T> | DeepPartial<T>[]): T | T[] {
        if (Array.isArray(entityLike)) {
            for (const iterator of entityLike) {
                for (const key in iterator) {
                    if (iterator[key] == null || typeof iterator[key] == "undefined")
                        delete iterator[key]
                }
            }
            return super.create(entityLike) as T[]
        } 
        
        if (entityLike) {
            for (const key in entityLike) {
                if (entityLike[key] == null || typeof entityLike[key] == "undefined")
                    delete entityLike[key]
            }
            return super.create(entityLike) as T
        }

        return super.create() as T
    }
    resolve() { return Promise.resolve(this) }
    
}

export abstract class IdxEntity extends IEntity {
    @PrimaryGeneratedColumn()
    idx: number
}


export abstract class DateEntity extends IEntity {

    @UpdateDateColumn()
    update_at: Date
}