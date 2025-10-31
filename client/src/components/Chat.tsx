// src/components/Chat.tsx

import React, { useState, useEffect, useRef, type FormEvent } from 'react';
import axios from 'axios';
import type { Message } from '../types';


const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL, {
                prompt: userMessage.content
            });

            const llmResponseContent: string = response.data.response;

            const llmMessage: Message = {
                id: Date.now().toString() + '_llm',
                role: 'assistant',
                content: llmResponseContent,
            };

            setMessages((prevMessages) => [...prevMessages, llmMessage]);

        } catch (error) {
            console.error("Chat API Call Failed:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { id: Date.now().toString() + '_err', role: 'assistant', content: `Something went wrong. Ask again...` }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 antialiased">
            <h1 className="text-2xl sm:text-3xl font-bold p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md text-center sticky top-0 z-10">
                🤖 AI Buddy
            </h1>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl w-full mx-auto" ref={messagesEndRef}>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs sm:max-w-md lg:max-w-lg p-3 rounded-lg shadow-md ${message.role === 'user'
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none'
                                }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="max-w-xs sm:max-w-md lg:max-w-lg p-3 rounded-lg shadow-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none animate-pulse">
                            <strong className="font-semibold block mb-1">AI Buddy:</strong> Thinking... 💬
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 z-10">
                <div className="flex max-w-4xl w-full mx-auto space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type Your Message Here..."
                        disabled={loading}
                        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-white transition duration-150 ease-in-out"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                    >
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;