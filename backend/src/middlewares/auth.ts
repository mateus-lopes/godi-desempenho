import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthRequest extends Request {
  userId?: number;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  // Lê token do cookie HttpOnly (primário) ou header Authorization (fallback)
  const token: string | undefined =
    req.cookies?.auth_token ??
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : undefined);

  if (!token) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as unknown as { sub: number; email: string };
    req.userId = Number(payload.sub);
    next();
  } catch {
    res.status(401).json({ error: "Sessão expirada" });
  }
}
