const WebSocket = require('ws');
const { WebSocketServer } = require('ws');

const port = 3000;
const wss = new WebSocketServer({ port });

const onlineUsers = []

wss.on('connection', function (ws) {
    ws.on('message', function messageIncoming(data) {
        const parsedData = JSON.parse(data.toString());
        if (parsedData.type === 'SET_USER_AS_ONLINE') {
            onlineUsers.push(parsedData.userName);
            const onlineUsersSet = new Set(onlineUsers);
            wss.clients.forEach(function forEachClientOnMsgCb(client) {
                if (client.readyState === WebSocket.OPEN) {
                    console.log(Array.from(onlineUsersSet))
                    client.send(JSON.stringify({onlineUsers: Array.from(onlineUsersSet)}));
                }
            });
            return;
        }

        // All the users that hit our page will have a separate session...
        wss.clients.forEach(function forEachClientOnMsgCb(client) {
            let direction = 'IN_BOUND';
            if (client.readyState === WebSocket.OPEN) {
                if (ws === client) {
                    direction = 'OUT_BOUND';
                }
                const newData = {
                    ...parsedData,
                    direction,
                }
                
                client.send(JSON.stringify(newData))
            }
        });
    })
})