export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
}

export interface OllamaMessage {
  role: Role,
  content: string
}