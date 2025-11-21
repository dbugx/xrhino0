import { GoogleGenAI, Chat } from "@google/genai";

// Initialize the client. Ensure API_KEY is available in your environment.
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are RhinoBot, the official AI Community Manager for the 'xrhino' ecosystem.
xrhino is the parent community for two distinct applications:
1. xpanda: A sleek, high-performance Frontend framework optimized for React and Tailwind. It focuses on aesthetics, speed, and component reusability.
2. xtiger: A robust, secure Backend engine optimized for high-concurrency and data integrity. It focuses on API stability, database management, and security.

Your primary goal is to provide AI-assisted developer support for xpanda and xtiger.
Prioritize helpful, accurate technical advice above all else.

- If asked about UI, CSS, or React, answer in the context of 'xpanda'.
- If asked about APIs, Databases, or Servers, answer in the context of 'xtiger'.
- Be friendly, technical, and concise.
- If the user greets you, welcome them to the xrhino community.
- If the user asks for location-based information, use the googleMaps tool.
`;

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleMaps: {} }],
      },
    });
  }
  return chatSession;
};

export const sendMessageStream = async (message: string) => {
  const chat = getChatSession();
  return await chat.sendMessageStream({ message });
};

export const generateEditedImage = async (base64Image: string, mimeType: string, prompt: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
  });
  return response;
};