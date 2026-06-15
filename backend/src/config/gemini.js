import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is required');
}


const apiKey = process.env.GEMINI_API_KEY.trim();
const genAI = new GoogleGenerativeAI(apiKey);


const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash-lite",  
});

const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
};

export { model, generationConfig };