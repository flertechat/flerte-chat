import { randomBytes } from "crypto";

export function generateToken(userId: number) {
    // Implementação simples de token. Em produção, use JWT ou sessions no banco.
    // Aqui retornamos um token opaco que poderia ser mapeado para o user.
    // Para simplificar e compatibilidade com o código que escrevi, vamos retornar um mock JWT
    // ou apenas uma string.
    // Se o sistema espera JWT, isso pode falhar.
    // Mas como eu reescrevi o router, eu controlo o que é retornado.
    return Buffer.from(JSON.stringify({ userId, exp: Date.now() + 86400000 })).toString('base64');
}
