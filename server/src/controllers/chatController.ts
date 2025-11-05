import type { Request, Response } from "express"
import { OLLAMA_API } from "../constants/env.ts";

const chatHandler = async (req: Request, res: Response) => {
    interface ChatRequest {
        prompt: string;
    }

    const { prompt } = req.body as ChatRequest;

    if (!prompt) {
        return res.status(400).send({ error: 'Please send a prompt!' });
    }

    try {
        // Set Header Options for streaming message
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked')

        const ollamaStreamResponse = await fetch(
            OLLAMA_API,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gemma:2b',
                    prompt: prompt,
                    stream:true
                })
            }
        );


        if (ollamaStreamResponse.body) {
            const reader = ollamaStreamResponse.body.getReader();
            const decorder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }

                const chunk = decorder.decode(value, { stream: true });

                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.trim() === '') continue;

                    try {
                        const data = JSON.parse(line);
                        const content = data.response || ''; 

                        if (content) {
                            res.write(content); 
                        }

                        if (data.done) {
                            res.end();
                            return;
                        }
                    } catch (e) {
                        console.error("JSON Parsing Error:", e);
                    }
                }
            }
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred.';
        console.error(`Couldn't connect to the Ollama: `, errorMessage);
        res.status(500).json({ error: 'Something went wrong when getting LLM Response.' });
    }
}

export { chatHandler };