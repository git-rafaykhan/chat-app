import { WebSocketServer , WebSocket} from "ws";

const wss = new WebSocketServer({port : 8080});

interface users {
    socket : WebSocket,
    room : string
}
const allUsers: users[] = []

wss.on('connection', (socket)=> {

    socket.on('message', (message)=> {
        //@ts-ignore
        const parseMessage = JSON.parse(message);

        if(parseMessage.type == 'join'){
            allUsers.push({
                socket, 
                room : parseMessage.payLoad.room
            })
            socket.send(`user has joined the room ${parseMessage.payLoad.room}`)
        }
        if (parseMessage.type == "chat") {
            const currentUserRoom = allUsers.find(x => x.socket == socket)?.room;
            
            if (currentUserRoom) {
                allUsers.forEach(x => {
                    if (x.room == currentUserRoom) {
                        x.socket.send(parseMessage.payLoad.message);
                    }
                });
            }
        }
    })
    socket.send("hi");  
})