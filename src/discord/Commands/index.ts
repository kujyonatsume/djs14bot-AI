export * from "./ChatAI"
/*
import { Command, Group, Module, Option, SubCommand, SubGroup } from "../decorator";

@Group({ permission: "Administrator" })
export class Support extends Module {

    @Command({ local: "邀請連結", name: "invite" })
    async command(@Option() test: string) {
        return await this.SuccessEmbed(test)
    }
    static group = SubGroup({ name: "group" })
    @Support.group()
    async cmd(@Option() test: string) {
        return await this.SuccessEmbed(test)
    }
    @SubCommand({ group: { name: "0" } })
    async subcmd(@Option() test: string) {
        return await this.SuccessEmbed(test)
    }
}
*/