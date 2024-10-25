import './global-addon'
import { DiscordStart } from './discord';
import config from "./config";

Main()
async function Main() {
    await DiscordStart(config.token)
}