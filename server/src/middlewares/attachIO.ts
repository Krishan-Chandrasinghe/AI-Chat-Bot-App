import type { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";

interface CustomRequest extends Request {
    io: Server;
}

const attachIO = (io: Server) => {
    return (req: Request, res: Response, next: NextFunction) => {
        (req as CustomRequest).io = io;
        next();
    }
}

export default attachIO;