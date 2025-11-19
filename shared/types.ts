/**
 * Unified type exports
 * Import shared types from this single entry point.
 */
/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

// Análise de Intenção - Consultor de Amor
export interface MessageAnalysis {
    score: number; // 0-100: Nível de interesse/atração
    sentiment: "disinterested" | "neutral" | "friendly" | "interested" | "flirty" | "love"; // Ex: "Interessado", "Neutro", "Flertando"
    risk: "low" | "medium" | "high"; // "Baixo", "Médio", "Alto"
    advice: string; // Dica estratégica do coach
    mood: string; // Humor detectado
    strategy: string; // Estratégia sugerida
}

export interface RoleplayResponse {
    message: string; // A resposta do "crush"
    feedback: {
        score: number; // 0-100 quão boa foi sua cantada
        comment: string; // Dica do coach sobre sua mensagem
    };
}

export type PersonaType = "hard_to_get" | "shy" | "funny" | "romantic" | "direct";
