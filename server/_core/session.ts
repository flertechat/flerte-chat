import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./env";

const SECRET = new TextEncoder().encode(ENV.cookieSecret || "default-secret-do-not-use-in-prod-or-you-will-be-hacked");

export async function generateToken(userId: number) {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { userId: number };
  } catch (e) {
    return null;
  }
}
