const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;

    if (value === undefined) {
        throw new Error(`Missiing environment variable ${key}.`);
    }

    return value;
}

export const PORT = getEnv('PORT');
export const FRONTEND_URL = getEnv('FRONTEND_URL');
export const OLLAMA_API = getEnv('OLLAMA_API');