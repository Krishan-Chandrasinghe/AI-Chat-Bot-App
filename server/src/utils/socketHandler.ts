import { Server } from "socket.io"
import { Server as HttpServer } from 'http'
import { FRONTEND_URL } from "../constants/env.ts"
import type { Message, OllamaMessage } from "../types/types.ts";

const socketHandler = (httpServer: HttpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: FRONTEND_URL,
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket ID: ${socket.id} Establish a new connection with the Server.`);

        socket.on('connection_error', (error) => {
            console.log('Connection error. ', error);
        });

        socket.on('sendMessage', async (data: { history: Message[], messageId: string }) => {
            const { history, messageId } = data;

            const ollamaSendMsg: OllamaMessage[] = history.map(msg => ({
                role: msg.role,
                content: msg.content
            }))

            // Ollama Stream Logic
            try {
                const ollamaStreamResponse = await fetch('http://localhost:11434/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: 'gemma:2b',
                        messages: ollamaSendMsg,
                        stream: true,
                    }),
                });

                if (ollamaStreamResponse.body) {
                    const reader = ollamaStreamResponse.body.getReader();
                    const decoder = new TextDecoder();

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            socket.emit('streamDone', messageId);
                            break;
                        }

                        const chunk = decoder.decode(value, { stream: true });
                        const lines = chunk.split('\n');

                        for (const line of lines) {
                            if (line.trim() === '') continue;

                            try {
                                const data = JSON.parse(line);
                                const content = data.message?.content || '';

                                if (content) {
                                    socket.emit('streamChunk', { content: content, id: messageId });
                                }

                                if (data.done) {
                                    socket.emit('streamDone', messageId);
                                    return;
                                }
                            } catch (e) {
                                throw new Error(`Chunk error occured : ${e}`);
                            }
                        }
                    }
                }

            } catch (error) {
                console.error('Ollama Error:', error);
                socket.emit('chatError', 'Connection error occured with LLM.');
            }
        });

        socket.on('disconnect', () => {
            console.log(`Socket ID: ${socket.id} disconnected.`);
        });
    })
}

export default socketHandler;