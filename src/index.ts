import './global-addon'
import { ollama, Api } from './Chatapi';
import { DatabaseInit } from './db';
import { DiscordStart } from './discord';
import config from "./config";
var messages = [{ role: 'system', content: `你是AI助手並且用繁體中文回復所有問題` }]

Main()
async function Main() {
    await DatabaseInit()
    await DiscordStart(config.token2)

}

/*
        tools: [{
            type: "function",
            function: {
                name: "which_is_bigger",
                description: "string",
                parameters: {
                    type: 'object',
                    properties: {
                        n: {
                            type: "float",
                            description: "string"
                        },
                        m: {
                            type: "float",
                            description: "string"
                        },
                    },
                    required: ['n', 'm'],
                },
            },
        }]

            var n = result.message.tool_calls[0].function.arguments["n"]
            var m = result.message.tool_calls[0].function.arguments["m"]
*/