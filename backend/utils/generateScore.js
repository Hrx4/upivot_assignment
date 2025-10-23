import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const generateScore = async (answer , question , chunks) => {
  const prompt = `Evaluate response ${answer} for Q ${question} using resume ${chunks}. Give score (1-10) + feedback (100 words max).`;

  const chat = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    json: true,
    model: "gemini-2.5-flash",
  });

  const response = await chat.invoke(prompt);
  console.log("Generated Questions : ", JSON.parse(response.text));
  return JSON.parse(response.text);
};
