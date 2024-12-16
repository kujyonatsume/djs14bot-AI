const jsonpath = require('jsonpath');
module.exports = (config) => [
    {
        type: 'function',
        function: {
            name: 'weather_forecast',
            description: '取得城市的天氣',
            parameters: {
                type: 'object',
                properties: {
                    city: {
                        type: 'string',
                        description: '城市',
                        enum: [
                            "臺東縣", "澎湖縣", "金門縣", "連江縣", "苗栗縣", "彰化縣", "南投縣", "雲林縣", "屏東縣", "新竹縣", "嘉義縣",
                            "宜蘭縣", "花蓮縣", "臺北市", "新北市", "桃園市", "臺中市", "臺南市", "高雄市", "基隆市", "新竹市", "嘉義市",
                        ]
                    }
                },
                required: ['city'],
            },
        },
        async exec(args) {
            if(!this.function.parameters.properties.city.enum.includes(args.city)) {
                return `臺灣沒有${args.city}`
            }
            const res = await fetch(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-091?elementName=WeatherDescription&locationName=${args.city}&Authorization=${config.CWA}`)
            const json = jsonpath.query(await res.json(), `$..time[1::2]`)
                    .map(item => new Date(item.startTime).toLocaleDateString("zh-TW", { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + item.elementValue[0].value)
            return json[0];
        }
    },
    {
        type: 'function',
        function: {
            name: 'taiwan_city',
            description: '台灣的城市',
            parameters: {
                type: 'object',
                properties: {},
                required: [],
            },
        },
        async exec(args) {
            return [
                "臺東縣", "澎湖縣", "金門縣", "連江縣", "苗栗縣", "彰化縣", "南投縣", "雲林縣", "屏東縣", "新竹縣", "嘉義縣",
                "宜蘭縣", "花蓮縣", "臺北市", "新北市", "桃園市", "臺中市", "臺南市", "高雄市", "基隆市", "新竹市", "嘉義市",
            ].toString()
        }
    },
    {
        type: 'function',
        function: {
            name: 'myowner',
            description: '取得主人 擁有者 或 開發者的名字',
            parameters: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        description: '主人的名字',
                    },
                    role: {
                        type: 'string',
                        description: '主人 擁有者 或 開發者',
                        enum: ['master', 'owner', 'developer', '主人', '擁有者', '開發者']
                    }
                },
                required: ['role', 'name'],
            },
        },
        async exec(args) {
            return `你的${args.role}是夏目`
        }
    },
]

