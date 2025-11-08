import { Server } from "socket.io"
import { Server as HttpServer } from 'http'
import { FRONTEND_URL } from "../constants/env.ts"

const socketHandler = (httpServer: HttpServer): Server => {
    const io = new Server(httpServer, {
        cors: {
            origin: FRONTEND_URL,
            methods: ['GET', 'POST']
        }
    });

    io.on('connection',(socket)=>{
        console.log('Establish a new connection with the Server.');

        socket.on('connection_error',(error)=>{
            console.log('Connection error. ', error);
        });

        socket.on('disconnect',()=>{
            console.log('A device has left.')
        })
    })

    return io;
}

export default socketHandler;