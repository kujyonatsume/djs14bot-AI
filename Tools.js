[
    {
        type: 'function',
        function: {
            name: 'get_flight_times',
            description: '取得兩個城市之間的航班​​時間',
            parameters: {
                type: 'object',
                properties: {
                    departure: {
                        type: 'string',
                        description: '出發城市（機場代碼）',
                    },
                    arrival: {
                        type: 'string',
                        description: '到達城市（機場代碼）',
                    },
                },
                required: ['departure', 'arrival'],
            },
        },
        exec(args) {
            // this is where you would validate the arguments you received
            const departure = args.departure;
            const arrival = args.arrival;
            const flights = {
                "NYC-LAX": { departure: "08:00 AM", arrival: "11:30 AM", duration: "5h 30m" },
                "LAX-NYC": { departure: "02:00 PM", arrival: "10:30 PM", duration: "5h 30m" },
                "LHR-JFK": { departure: "10:00 AM", arrival: "01:00 PM", duration: "8h 00m" },
                "JFK-LHR": { departure: "09:00 PM", arrival: "09:00 AM", duration: "7h 00m" },
                "CDG-DXB": { departure: "11:00 AM", arrival: "08:00 PM", duration: "6h 00m" },
                "DXB-CDG": { departure: "03:00 AM", arrival: "07:30 AM", duration: "7h 30m" }
            };
            const key = `${departure}-${arrival}`.toUpperCase();
            return JSON.stringify(flights[key] || { error: "Flight not found" });
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_max_number',
            description: '取得最大的數字',
            parameters: {
                type: 'object',
                properties: {
                    x: {
                        type: 'number',
                        description: '第一個數字',
                    },
                    y: {
                        type: 'number',
                        description: '第二個數字',
                    },
                },
                required: ['x', 'y'],
            },
        },
        exec(args) {
            return `${Math.max(...Object.values(args))}比較大`
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
                required: ['role','name'],
            },
        },
        exec(args) {
            return `你的${args.role}是夏目`
        }
    },
]

