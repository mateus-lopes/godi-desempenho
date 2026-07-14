import { sql } from "drizzle-orm";
import { pgTable, serial, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const motoristas = pgTable(
  "motoristas",
  {
    id: serial("id").primaryKey(),
    nome: varchar("nome", { length: 255 }).notNull(),
    nomeNormalizado: varchar("nome_normalizado", { length: 255 }).notNull(),
    telefone: varchar("telefone", { length: 20 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    // Único apenas quando preenchido — motoristas migrados do Excel ficam sem telefone.
    telefoneUnicoParcial: uniqueIndex("motoristas_telefone_unique_idx")
      .on(table.telefone)
      .where(sql`${table.telefone} IS NOT NULL`),
    nomeNormalizadoIdx: uniqueIndex("motoristas_nome_normalizado_idx").on(table.nomeNormalizado),
  }),
);
