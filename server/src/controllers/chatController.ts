import axios from "axios";
import type { Request, Response } from "express"
import { OLLAMA_API } from "../constants/env.ts";

const chatHandler = async (req: Request, res: Response) => {
    interface ChatRequest {
        prompt: string;
    }

    const { prompt } = req.body as ChatRequest;

    if (!prompt) {
        return res.status(400).send({ error: 'කරුණාකර prompt එකක් එවන්න.' });
    }

    try {
        const ollamaResponse = await axios.post(
            `${OLLAMA_API}`,
            {
                model: 'gemma:2b',
                prompt: prompt,
                stream: false,
            }
        );

        const responseText: string = ollamaResponse.data.response;
        res.json({ response: responseText });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred.';
        console.error(`Couldn't connect to the Ollama: `, errorMessage);
        res.status(500).json({ error: 'Something went wrong when getting LLM Response.' });
    }
}

export { chatHandler };