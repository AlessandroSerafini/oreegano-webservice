enum ROOMS {
    MISTERY_BOX_TRACKING = "misteryBoxTrackingRoom"
}

export class SocketService {
    private io = require('socket.io').listen(4200);

    constructor() {
    }

    public initSocket() {
        // handle incoming connections from clients
        this.io.sockets.on('connection', function (socket) {
            // once a client has connected, we expect to get a ping from them saying what room they want to join
            socket.on(ROOMS.MISTERY_BOX_TRACKING, (idTracking: number) => {
                socket.join(`${ROOMS.MISTERY_BOX_TRACKING}-${idTracking}`);
            });
        });
    }

    public updateLocation(idTracking: number, lat: string, lon: string) {
        this.io.sockets.in(`${ROOMS.MISTERY_BOX_TRACKING}-${idTracking}`).emit('updateLocation', {lat, lon});
    }
}
