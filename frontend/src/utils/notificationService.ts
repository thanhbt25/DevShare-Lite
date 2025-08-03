import {io, Socket} from 'socket.io-client';  // io: hàm tạo socket client, socket: kiểu dữ liệu của biến socket 

let socket: Socket;

export const connectSocket = (token: string) => {
    socket = io('http://localhost:5000', { // kết nối với backend 
        auth: {
            token,
        },
        transports: ["websocket"],  // dùng giao thức websocket 
    });

    return socket;
}

export const getSocket  = () => socket; 