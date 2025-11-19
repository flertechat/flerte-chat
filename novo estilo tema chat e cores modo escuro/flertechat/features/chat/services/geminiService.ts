
import { GoogleGenAI, Type } from "@google/genai";
import { Tone, Length, Analysis } from "../../../shared/types";

const apiKey = process.env.API_KEY || '';

const getAiClient = () => {
  if (!apiKey) {
    console.warn("API Key is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

interface GenerateResponse {
  suggestions: string[];
  analysis: Analysis;
}

export const generateFlirtyResponses = async (
  receivedMessage: string,
  tone: Tone,
  length: Length
): Promise<GenerateResponse> => {
  const ai = getAiClient();
  
  // --- DEMO / MOCK MODE (No API Key) ---
  if (!ai) {
    await new Promise(r => setTimeout(r, 2000)); // Slightly longer delay for "thinking" effect
    
    const mockAnalysis: Analysis = tone === 'safado' 
      ? { sentiment: 'Quente 🔥', score: 95, advice: 'O jogo está ganho. Não enrole, marque o gol.', risk: 'Baixo' }
      : { sentiment: 'Interessado(a)', score: 75, advice: 'Ela(e) quer atenção. Use humor para quebrar a defesa.', risk: 'Médio' };

    if (tone === 'safado') {
      return {
        analysis: mockAnalysis,
        suggestions: [
          `[DEMO] Se eu te contar o que imaginei a gente fazendo, você vem pra cá agora ou chama a polícia? 🔥`,
          `[DEMO] Esse horário não me responsabilizo pelo que eu posso responder... 😈`,
          `[DEMO] Vem descobrir pessoalmente.`
        ]
      };
    }
    return {
      analysis: mockAnalysis,
      suggestions: [
        `[DEMO] Resposta ${tone} (${length}) 1: "Tô pensando em você... e não é nada santo."`,
        `[DEMO] Resposta ${tone} (${length}) 2: "Bora pular a parte do papo furado?"`,
        `[DEMO] Resposta ${tone} (${length}) 3: "Duvido você aguentar meu ritmo."`
      ]
    };
  }

  // --- REAL AI REQUEST ---
  const prompt = `
    Atue como o "FlerteChat Coach", um especialista em dinâmica social, sedução e psicologia comportamental (focado no Brasil).
    
    INPUT: O usuário recebeu a mensagem: "${receivedMessage}".
    OBJETIVO: Analisar a intenção da outra pessoa e gerar 3 respostas perfeitas.
    
    CONFIGURAÇÃO:
    - Tom da Resposta: ${tone.toUpperCase()}
    - Tamanho: ${length.toUpperCase()}
    
    PASSO 1: ANÁLISE (O Cérebro)
    - Identifique o sentimento real (Interessado, Neutro, Jogando Verde, Frio, Quente).
    - Dê uma nota de atração (0-100) baseada no texto.
    - Dê um conselho estratégico curto (ex: "Não responda na hora", "Seja ousado", "Recue um pouco").
    - Avalie o risco de mandar uma mensagem ousada agora (Baixo, Médio, Alto).

    PASSO 2: GERAÇÃO (A Ação)
    - Gere 3 respostas em Português BR, naturais, usando gírias (vc, tb, ne, kkk, rs).
    - Se o tom for SAFADO e o risco for ALTO, suavize para não parecer assédio.
    - Se o tom for SAFADO e o risco for BAIXO, seja explícito e direto.
    
    Output must be JSON only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            analysis: {
              type: Type.OBJECT,
              properties: {
                sentiment: { type: Type.STRING, enum: ['Interessado(a)', 'Neutro', 'Jogando Verde', 'Frio', 'Quente 🔥'] },
                score: { type: Type.NUMBER, description: "0 to 100 score of attraction" },
                advice: { type: Type.STRING, description: "Short strategic advice" },
                risk: { type: Type.STRING, enum: ['Baixo', 'Médio', 'Alto'] }
              },
              required: ['sentiment', 'score', 'advice', 'risk'],
              propertyOrdering: ['sentiment', 'score', 'advice', 'risk']
            }
          },
          required: ['suggestions', 'analysis'],
        },
      },
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("Empty response");
    
    // Parse and validate basic structure
    const parsed = JSON.parse(jsonStr) as GenerateResponse;
    return parsed;

  } catch (error) {
    console.error("Erro ao gerar flerte:", error);
    // Return a safe fallback error object instead of crashing
    return {
      suggestions: ["Erro na IA. Tente novamente.", "A conexão falhou, mas você não vai falhar.", "Tente de novo."],
      analysis: { sentiment: 'Neutro', score: 50, advice: 'Tente novamente, a IA piscou.', risk: 'Baixo' }
    };
  }
};
