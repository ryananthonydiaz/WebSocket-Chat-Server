const WebSocket = require('ws');
const { WebSocketServer } = require('ws');

const port = 3000;
const wss = new WebSocketServer({ port });

wss.on('connection', function (ws) {
    ws.on('connection', function () {
        wss.clients.forEach(function forEachClientOnConnectionCb(client) {
            console.log(wss.clients.length);
        })
    })
    ws.on('message', function messageIncoming(data) {
        console.log('MESSAGE RECEIVED!!!!');

        // All the users that hit our page will have a separate session...
        wss.clients.forEach(function forEachClientOnMsgCb(client) {
            let direction = 'IN_BOUND';
            if (client.readyState === WebSocket.OPEN) {
                if (ws === client) {
                    direction = 'OUT_BOUND';
                }
                const newData = {
                    ...JSON.parse(data.toString()),
                    direction,
                }
                
                client.send(JSON.stringify(newData))
            }
        })
    })
})