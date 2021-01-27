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
    }, idRunner: number) {
        io.sockets.emit(`trackOrder-${idOrder}`, {position, idRunner});

        /*for (let i = 0; i < 9; i++) {
            setTimeout(() => {
                io.sockets.emit(`trackOrder-${idOrder}`, {
                    position: {
                        latitude: parseFloat(`43.994${i}556348000`),
                        longitude: 12.661198889565375
                    }, idRunner
                });
            }, i*500);
        }*/
    }
}
