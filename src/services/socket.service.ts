
const io = require('socket.io').listen(4200);

export class SocketService {

    constructor() {
    }

    public initSocket() {
        io.sockets.on("connection", (socket) => {
            console.log("New client connected");
            socket.on("disconnect", () => {
                console.log("Client disconnected");
            });
        });
    }

    public updateLocation(idOrder: number, position: {
        latitude: { type: 'number' },
        longitude: { type: 'number' }
    }) {
        io.sockets.emit(`trackOrder-${idOrder}`, position);
    }
}
