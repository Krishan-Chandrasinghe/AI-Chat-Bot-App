import express from 'express';
import cors from 'cors';
import http from 'http'
import 'dotenv/config';

import { PORT } from "./constants/env.ts";
import { FRONTEND_URL } from "./constants/env.ts";
import socketHandler from './utils/socketHandler.ts';

const app = express();

app.use(cors({
    origin: FRONTEND_URL,
}));
app.use(express.json());

const httpServer = http.createServer(app);
const io = socketHandler(httpServer);

socketHandler(httpServer);

app.get("/", async (req, res, next) => {
    return res.status(200).send("Hello, Welcome to Ollama API Server.");
});


httpServer.listen(PORT, () => {
    console.log(`Server is runnig on http://localhost:${PORT}`);
});