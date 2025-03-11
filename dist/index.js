"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const allUsers = [];
wss.on('connection', (socket) => {
    socket.on('message', (message) => {
        var _a;
        //@ts-ignore
        const parseMessage = JSON.parse(message);
        if (parseMessage.type == 'join') {
            allUsers.push({
                socket,
                room: parseMessage.payLoad.room
            });
            socket.send(`user has joined the room ${parseMessage.payLoad.room}`);
        }
        if (parseMessage.type == "chat") {
            const currentUserRoom = (_a = allUsers.find(x => x.socket == socket)) === null || _a === void 0 ? void 0 : _a.room;
            if (currentUserRoom) {
                allUsers.forEach(x => {
                    if (x.room == currentUserRoom) {
                        x.socket.send(parseMessage.payLoad.message);
                    }
                });
            }
        }
    });
    socket.send("hi");
});
