DO $$ BEGIN
 CREATE TYPE "public"."status_carga" AS ENUM('em_andamento', 'entregue');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cargas" (
	"id" serial PRIMARY KEY NOT NULL,
	"data" date NOT NULL,
	"cte" varchar(100),
	"origem" varchar(255),
	"destino" varchar(255),
	"cliente_id" integer NOT NULL,
	"motorista_id" integer NOT NULL,
	"valor_motorista" numeric(14, 4) NOT NULL,
	"valor_empresa" numeric(14, 4) NOT NULL,
	"valor_nf" numeric(14, 4) NOT NULL,
	"seguro_percent" numeric(8, 6) NOT NULL,
	"icms_percent" numeric(8, 6) NOT NULL,
	"co_percent" numeric(8, 6) NOT NULL,
	"imposto_percent" numeric(8, 6) NOT NULL,
	"dias_pagamento" integer NOT NULL,
	"percent_comissao" numeric(8, 6) NOT NULL,
	"seguro_valor" numeric(14, 4) NOT NULL,
	"co_valor" numeric(14, 4) NOT NULL,
	"imposto_valor" numeric(14, 4) NOT NULL,
	"boleto_percent" numeric(8, 6) NOT NULL,
	"mova_valor" numeric(14, 4) NOT NULL,
	"adq_tab_valor" numeric(14, 4) NOT NULL,
	"total_taxas_percent" numeric(8, 6) NOT NULL,
	"valor_imposto_total" numeric(14, 4) NOT NULL,
	"comissao_valor" numeric(14, 4) NOT NULL,
	"boletos_valor" numeric(14, 4) NOT NULL,
	"lucro" numeric(14, 4) NOT NULL,
	"percent_rentabilidade" numeric(10, 8) NOT NULL,
	"status" "status_carga" DEFAULT 'em_andamento' NOT NULL,
	"canhoto_enviado" boolean DEFAULT false NOT NULL,
	"tipo_entrega" varchar(100),
	"forma_pagamento" varchar(100),
	"dia_pagamento" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clientes" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"cnpj" varchar(20),
	"contato" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "motoristas" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"nome_normalizado" varchar(255) NOT NULL,
	"telefone" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "metas_mensais" (
	"id" serial PRIMARY KEY NOT NULL,
	"cliente_id" integer NOT NULL,
	"mes" integer NOT NULL,
	"ano" integer NOT NULL,
	"valor_meta" numeric(14, 4) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cargas" ADD CONSTRAINT "cargas_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cargas" ADD CONSTRAINT "cargas_motorista_id_motoristas_id_fk" FOREIGN KEY ("motorista_id") REFERENCES "public"."motoristas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "metas_mensais" ADD CONSTRAINT "metas_mensais_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "motoristas_telefone_unique_idx" ON "motoristas" USING btree ("telefone") WHERE "motoristas"."telefone" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "motoristas_nome_normalizado_idx" ON "motoristas" USING btree ("nome_normalizado");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "metas_mensais_cliente_mes_ano_idx" ON "metas_mensais" USING btree ("cliente_id","mes","ano");