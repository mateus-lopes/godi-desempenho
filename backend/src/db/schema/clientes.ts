import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const clientes = pgTable("clientes", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  cnpj: varchar("cnpj", { length: 20 }),
  contato: varchar("contato", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
