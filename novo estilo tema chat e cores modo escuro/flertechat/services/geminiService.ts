import { GoogleGenAI, Type } from "@google/genai";
import { Tone } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize client only when needed to ensure key presence or handle missing key in UI
const getAiClient = () => {
  if (!apiKey) {
    console.warn("API Key is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateFlirtyResponses = async (
  receivedMessage: string,
  tone: Tone
): Promise<string[]> => {
  const ai = getAiClient();
  
  // Fallback for demo purposes if no API key is present (so the UI still 'works' for review)
  if (!ai) {
    await new Promise(r => setTimeout(r, 1500));
    return [
      `[DEMO] Resposta ${tone} 1 para: "${receivedMessage}"`,
      `[DEMO] Resposta ${tone} 2 (mais ousada)`,
      `[DEMO] Resposta ${tone} 3 (curta e grossa)`
    ];
  }

  const prompt = `
    Você é um assistente especialista em flerte e comunicação social para aplicativos de namoro.
    O usuário recebeu a seguinte mensagem: "${receivedMessage}".
    
    Gere 3 sugestões de respostas curtas e criativas em Português do Brasil seguindo o tom: ${tone.toUpperCase()}.
    
    Diretrizes de Tom:
    - NORMAL: Amigável, interessado, educado, mas com intenção de continuar a conversa.
    - SAFADO: Picante, sugestivo, flerte intenso, insinuante, mas NÃO explícito/pornográfico (NSFW). Mantenha a classe e o mistério.
    - ENGRAÇADO: Espirituoso, faz piada com a situação, quebra-gelo, charmoso.

    As respostas devem parecer naturais, como alguém digitando no WhatsApp/Tinder.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        systemInstruction: "Você é o FlerteChat, um wingman virtual brasileiro.",
      },
    });

    const jsonStr = response.text;
    if (!jsonStr) return [];
    
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];

  } catch (error) {
    console.error("Erro ao gerar flerte:", error);
    throw error;
  }
};
