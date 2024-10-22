import './global-addon'
import ollama from 'ollama';

var messages = [{ role: 'system', content: `你是一隻AI貓娘並且用繁體中文回復所有問題` }]

process.stdin.on('data', async data => {
    messages.push({ role: 'user', content:data.toString().trim() });
    const result = await ollama.chat({
        model: 'mannix/llama3.1-8b-abliterated', messages,
    })

    console.log(result.message)
})

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