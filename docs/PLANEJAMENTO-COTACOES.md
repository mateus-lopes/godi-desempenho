# Planejamento — Módulo de Cotações

Adição ao sistema de desempenho para registrar cotações de frete **antes** de virar carga. O objetivo é o Thiago simular a rentabilidade de um frete na hora de negociar com o cliente, sem precisar abrir o Excel de cotações.

---

## Fluxo completo

```
[Thiago preenche cotação]
        ↓
[Sistema calcula rentabilidade/comissão automaticamente]
        ↓
  ┌─────────────────────────────┐
  │                             │
[BATIDA]                  [VIROU CARGA]
  │                             │
  │                  [Thiago preenche: CTE,
  │                   motorista, tipo entrega,
  │                   forma/dia de pagamento]
  │                             │
  │                     [Carga criada]
  │                     [Cotação deletada]
  │
  └── cotação permanece visível
      com status "batida"
```

- **Pendente**: cotação criada, aguardando resposta do cliente.
- **Batida**: cliente não aceitou. Permanece visível para acompanhamento de negócios perdidos.
- **Virou carga**: ao confirmar, abre formulário complementar → cria `carga` → deleta a cotação. A cotação deixa de existir; a carga é o registro definitivo.

Não há migração de cotações históricas — só o histórico de cargas (já previsto no planejamento principal) será migrado.

---

## O que é exclusivo da cotação (não vai para a carga)

| Campo | Por quê só na cotação |
|---|---|
| `km` | Dado de planejamento de rota, não operacional |
| `tipoVeiculo` | Idem — na cotação serve para calcular custo, na carga o motorista já é conhecido |
| `kmRodado` | Campo calculado derivado de km |

---

## O que é preenchido ao converter para carga

Ao marcar "virou carga", o formulário complementar pede:

| Campo | Obrigatório? |
|---|---|
| CTE | Não (pode não existir ainda) |
| Motorista | Sim |
| Tipo de entrega | Não |
| Forma de pagamento | Não |
| Dia de pagamento | Não |

O status da carga criada começa como `em_andamento`. Os campos de valor e todos os calculados são herdados diretamente da cotação.

---

## Schema — tabela `cotacoes`

Campos de input (preenchidos pelo Thiago):

```ts
cotacoes: pgTable("cotacoes", {
  id:               serial().primaryKey(),
  data:             date().notNull(),
  clienteId:        integer().notNull().references(() => clientes.id),
  origem:           varchar({ length: 255 }),
  destino:          varchar({ length: 255 }),
  km:               numeric({ precision: 10, scale: 2 }),        // opcional (pode estar em branco)
  tipoVeiculo:      varchar({ length: 100 }),
  valorMotorista:   numeric({ precision: 14, scale: 4 }).notNull(),
  valorEmpresa:     numeric({ precision: 14, scale: 4 }).notNull(),
  valorNF:          numeric({ precision: 14, scale: 4 }).notNull(),
  icmsPercent:      numeric({ precision: 8, scale: 6 }).notNull(),
  coPercent:        numeric({ precision: 8, scale: 6 }).notNull(),
  impostoPercent:   numeric({ precision: 8, scale: 6 }).notNull(),
  diasPagamento:    integer().notNull(),
  percentComissao:  numeric({ precision: 8, scale: 6 }).notNull(),
  situacao:         situacaoCotacaoEnum().notNull().default("pendente"),

  // Campos calculados por @thiago/core (mesmas fórmulas de cargas)
  kmRodado:             numeric({ precision: 10, scale: 4 }),     // null se km não informado
  seguroValor:          numeric({ precision: 14, scale: 4 }).notNull(),
  coValor:              numeric({ precision: 14, scale: 4 }).notNull(),
  impostoValor:         numeric({ precision: 14, scale: 4 }).notNull(),
  boletoPercent:        numeric({ precision: 8, scale: 6 }).notNull(),
  movaValor:            numeric({ precision: 14, scale: 4 }).notNull(),
  adqTabValor:          numeric({ precision: 14, scale: 4 }).notNull(),
  totalTaxasPercent:    numeric({ precision: 8, scale: 6 }).notNull(),
  valorImpostoTotal:    numeric({ precision: 14, scale: 4 }).notNull(),
  comissaoValor:        numeric({ precision: 14, scale: 4 }).notNull(),
  boletosValor:         numeric({ precision: 14, scale: 4 }).notNull(),
  lucro:                numeric({ precision: 14, scale: 4 }).notNull(),
  percentRentabilidade: numeric({ precision: 10, scale: 8 }).notNull(),

  createdAt: timestamp().defaultNow().notNull(),
})

// Enum
situacaoCotacaoEnum = pgEnum("situacao_cotacao", ["pendente", "batida"])
```

Observação: `impostoPercent` está presente porque na planilha de cotações o Thiago também informa o % de imposto (assim como em cargas).

---

## Backend — rotas

```
POST   /api/cotacoes          → cria cotação (calcula campos via @thiago/core)
GET    /api/cotacoes          → lista (filtros: situacao, cliente, período)
GET    /api/cotacoes/:id      → detalhe
PATCH  /api/cotacoes/:id      → editar cotação pendente
PATCH  /api/cotacoes/:id/bater      → muda status para "batida"
POST   /api/cotacoes/:id/converter  → converte para carga
  body: { cte?, motoristaId, tipoEntrega?, formaPagamento?, diaPagamento? }
  → cria carga em `cargas`, deleta cotação, retorna { cargaId }
DELETE /api/cotacoes/:id      → deleta cotação pendente ou batida
```

A rota `/converter` concentra toda a lógica de transição: valida, cria a carga com os dados herdados + complementares, e deleta o registro de cotação atomicamente (numa transação).

---

## Frontend — telas

1. **Lista de cotações** (`/cotacoes`)
   - Tabela com colunas: data, cliente, origem → destino, R$ empresa, % rentabilidade, situação
   - Filtros: status, cliente, período
   - Botões por linha: Editar | Bater | Converter para carga | Excluir

2. **Formulário de cotação** (`/cotacoes/nova`, `/cotacoes/:id/editar`)
   - Campos de input + preview dos calculados em tempo real (rentabilidade, comissão, lucro)
   - Mesmo padrão visual do formulário de carga

3. **Modal "Converter para carga"**
   - Abre ao clicar em "Converter para carga"
   - Campos: CTE, Motorista (Select com busca), Tipo entrega, Forma pagamento, Dia pagamento
   - Ao confirmar: redireciona para a carga criada

---

## Reúso de código

A cadeia de cálculo (`packages/core`) já existe e é a mesma para cotações e cargas — nenhuma fórmula nova. A única diferença é `kmRodado = valorMotorista / km` (novo cálculo, simples, pode ficar no core também).

O formulário de cotação é ~80% igual ao de carga. Vale criar um componente compartilhado `CamposFreteBase.vue` com os campos em comum (valores, percentuais, prazos) e usá-lo nos dois formulários.
