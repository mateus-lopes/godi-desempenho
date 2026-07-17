import cors from "cors";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { authRouter } from "./modules/auth/auth.routes";
import { healthRouter } from "./modules/health/health.routes";
import { clientesRouter } from "./modules/clientes/clientes.routes";
import { motoristasRouter } from "./modules/motoristas/motoristas.routes";
import { cargasRouter } from "./modules/cargas/cargas.routes";
import { metasRouter } from "./modules/metas/metas.routes";
import { indicadoresRouter } from "./modules/indicadores/indicadores.routes";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes";
import { cotacoesRouter } from "./modules/cotacoes/cotacoes.routes";
import { notificacoesRouter } from "./modules/notificacoes/notificacoes.routes";
import { usersRouter } from "./modules/users/users.routes";

export const app = express();

const allowedOrigins = env.CORS_ORIGIN.split(',').map(o => o.trim());

// Segurança: headers HTTP, CORS restrito, cookie parser, body limit
app.use(helmet());
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));

// Rotas públicas
app.use("/api", healthRouter);
app.use("/api/auth", authRouter);

// Rotas protegidas
app.use("/api/clientes", clientesRouter);
app.use("/api/motoristas", motoristasRouter);
app.use("/api/cargas", cargasRouter);
app.use("/api/metas", metasRouter);
app.use("/api/indicadores", indicadoresRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/cotacoes", cotacoesRouter);
app.use("/api/notificacoes", notificacoesRouter);
app.use("/api/users", usersRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (env.NODE_ENV !== 'production') console.error(err);
  res.status(500).json({ error: "Erro interno" });
});
