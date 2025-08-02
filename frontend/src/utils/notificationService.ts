import {io, Socket} from 'socket.io-client';

let  socket: Socket;

export const connectSocket = (token: string) => {
    socket = io('http://localhost:3000', {
        auth: {
            token,
        },
        transports: ["websocket"],
    });

    return socket;
}

export const getSocket  = () => socket; 