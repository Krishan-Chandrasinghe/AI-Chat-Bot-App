import express from 'express';
import cors from 'cors';
import http from 'http'
import 'dotenv/config';

import chatRoutes from './routes/chatRoutes.ts'
import { PORT } from "./constants/env.ts";
import { FRONTEND_URL } from "./constants/env.ts";
import socketHandler from './utils/socketHandler.ts';
import attachIO from './middlewares/attachIO.ts';

const app = express();

app.use(cors({
    origin: FRONTEND_URL,
}));
app.use(express.json());

const httpServer = http.createServer(app);
const io = socketHandler(httpServer);


app.use('/api/chat', attachIO(io), chatRoutes);

app.get("/", async (req, res, next) => {
    return res.status(200).send("Hello, Welcome to Ollama API Server.");
});


app.listen(PORT, () => {
    console.log(`Server is runnig on http://localhost:${PORT}`);
});