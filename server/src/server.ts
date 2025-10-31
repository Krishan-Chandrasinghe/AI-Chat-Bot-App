import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import chatRoutes from './routes/chatRoutes.ts'

import { PORT } from "./constants/env.ts";
import { FRONTEND_URL } from "./constants/env.ts";

const app = express();

app.use(cors({
    origin: FRONTEND_URL,
}));
app.use(express.json());

app.use('/api/chat', chatRoutes);

app.get("/", async (req, res, next) => {
    return res.status(200).send("Hello, Welcome to Ollama API Server.");
});


app.listen(PORT, () => {
    console.log(`Server is runnig on http://localhost:${PORT}`);
});