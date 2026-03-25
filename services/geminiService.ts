
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { QuizQuestion, Challenge } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let chat: Chat | null = null;

export interface VerificationResult {
    isValid: boolean;
    imageDescription: string;
    feedback: string;
}

export const getChatbotResponse = async (message: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API key not found.");
    return "Sorry, I can't connect to my brain right now. Please make sure the API key is set up.";
  }

  try {
    if (!chat) {
      chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'You are EcoBot, a friendly and knowledgeable assistant for students learning about environmental science in India. Keep your answers concise, encouraging, and easy to understand for a young audience (ages 10-16). Use emojis where appropriate. Your goal is to make learning about sustainability fun and accessible.',
        },
      });
    }

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    return "Oops! Something went wrong while I was thinking. Please try asking again.";
  }
};

export const generatePersonalizedChallenges = async (interests: string[]): Promise<Omit<Challenge, 'id' | 'icon'>[]> => {
  if (!process.env.API_KEY) {
    console.error("API key not found.");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Based on a student's interest in ${interests.join(", ")}, suggest three unique and engaging real-world eco-challenges suitable for a student in India. Each challenge must be actionable and something they can prove with a photo. Provide a title, a short description (2-3 sentences), the category from the interests provided, and the number of eco-points it should be worth (between 10 and 50).`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        points: { type: Type.NUMBER },
                        category: { type: Type.STRING, enum: interests }
                    },
                    required: ["title", "description", "points", "category"]
                }
            }
        }
    });

    const jsonText = response.text;
    const challenges = JSON.parse(jsonText);
    return challenges;
  } catch (error) {
    console.error("Error generating challenges:", error);
    return [];
  }
};


export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
    if (!process.env.API_KEY) {
      console.error("API key not found.");
      return [];
    }
  
    try {
      const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Generate a 10-question multiple-choice quiz on the topic of "${topic}". Each question must have exactly 4 options and you must identify the correct answer. The questions should be relevant to an Indian context where applicable.`,
          config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                    questions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                question: { type: Type.STRING },
                                options: { type: Type.ARRAY, items: { type: Type.STRING }},
                                correctAnswer: { type: Type.STRING }
                            },
                            required: ["question", "options", "correctAnswer"]
                        }
                    }
                }
              }
          }
      });
  
      const jsonText = response.text;
      const quizData = JSON.parse(jsonText);
      return quizData.questions;
    } catch (error) {
      console.error("Error generating quiz:", error);
      return [];
    }
};

export const verifyChallengeProof = async (
    base64ImageData: string,
    mimeType: string,
    challenge: { title: string; description: string }
): Promise<VerificationResult> => {
    if (!process.env.API_KEY) {
        console.error("API key not found.");
        return {
            isValid: false,
            imageDescription: "N/A",
            feedback: "Could not connect to the verification service. Please try again later.",
        };
    }

    try {
        const imagePart = {
            inlineData: {
                mimeType,
                data: base64ImageData,
            },
        };

        const textPart = {
            text: `You are an AI judge for 'EcoChamps', an environmental challenge app for students. A student has submitted an image as proof for the following challenge:

Challenge Title: "${challenge.title}"
Challenge Description: "${challenge.description}"

Analyze the provided image and determine if it's valid proof. Respond ONLY with a JSON object.
For example, for the challenge 'Plant a Sapling', a picture of a person planting a small tree is valid. A picture of a cat is not. For 'DIY Compost Bin', a picture of a homemade bin with vegetable scraps is valid. A picture of a plastic water bottle is not.
Be encouraging but firm about the rules.`,
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isValid: { type: Type.BOOLEAN },
                        imageDescription: { type: Type.STRING },
                        feedback: { type: Type.STRING },
                    },
                    required: ["isValid", "imageDescription", "feedback"],
                },
            },
        });

        const jsonText = response.text;
        const result = JSON.parse(jsonText) as VerificationResult;
        return result;
    } catch (error) {
        console.error("Error verifying proof:", error);
        return {
            isValid: false,
            imageDescription: "Analysis failed.",
            feedback: "Oops! I had trouble analyzing your photo. Please try again with a clearer picture.",
        };
    }
};

// fix: Add missing identifyImage function for AREcoExplorer.tsx
export const identifyImage = async (base64ImageData: string, mimeType: string): Promise<string> => {
    if (!process.env.API_KEY) {
        console.error("API key not found.");
        return "Could not connect to the analysis service. API key is missing.";
    }

    try {
        const imagePart = {
            inlineData: {
                mimeType,
                data: base64ImageData,
            },
        };

        const textPart = {
            text: `Analyze this image and identify the main object in it. Provide a short, fun, and educational fact about it related to ecology or sustainability. For example, if it's a plastic bottle, mention recycling. If it's a tree, mention its role in producing oxygen. Keep the response to 2-3 sentences.`,
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error identifying image:", error);
        return "Sorry, I had trouble analyzing that image. Please try again with a different one.";
    }
};
