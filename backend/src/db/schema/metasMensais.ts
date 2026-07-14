import { integer, numeric, pgTable, serial, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { clientes } from "./clientes";

export const metasMensais = pgTable(
  "metas_mensais",
  {
    id: serial("id").primaryKey(),
    clienteId: integer("cliente_id")
      .notNull()
      .references(() => clientes.id),
    mes: integer("mes").notNull(),
    ano: integer("ano").notNull(),
    valorMeta: numeric("valor_meta", { precision: 14, scale: 4 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    clienteMesAnoUnico: uniqueIndex("metas_mensais_cliente_mes_ano_idx").on(
      table.clienteId,
      table.mes,
      table.ano,
    ),
  }),
);
