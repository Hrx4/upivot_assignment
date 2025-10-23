
import {ChatGoogleGenerativeAI} from '@langchain/google-genai'

export const generateQuestions = async(text)=>{
    const prompt = `Generate 3 interview Qs with question key in JSON format from this JD: ${text}`;

    const chat = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      json: true,
      model: "gemini-2.5-flash",
    });

    const response =await  chat.invoke(prompt)
    return JSON.parse(response.text);

}