export interface Cliente { id: number; nome: string; meta: number }
export interface Motorista { id: number; nome: string }
export interface Carga {
  id: number; data: string; cte: string; origem: string; destino: string
  clienteId: number; motoristaId: number
  valorMotorista: number; valorEmpresa: number; valorNf: number
  seguroPercent: number; icmsPercent: number; coPercent: number; impostoPercent: number
  diasPagamento: number; percentComissao: number
  seguroValor: number; coValor: number; impostoValor: number; boletoPercent: number
  movaValor: number; adqTabValor: number; totalTaxasPercent: number
  valorImpostoTotal: number; comissaoValor: number; boletosValor: number
  lucro: number; percentRentabilidade: number
  status: 'em_andamento' | 'entregue'; canhotoPago: boolean
  tipoEntrega?: string; formaPagamento?: string
}

export const mockClientes: Cliente[] = [
  { id: 1, nome: 'FRIBAL', meta: 120000 },
  { id: 2, nome: 'SPAL', meta: 80000 },
  { id: 3, nome: 'BRUMADO', meta: 50000 },
  { id: 4, nome: 'MARIANA', meta: 40000 },
]

export const mockMotoristas: Motorista[] = [
  { id: 1, nome: 'GHILLIARD GHEEFERSON' },
  { id: 2, nome: 'JOÃO SILVA' },
  { id: 3, nome: 'CARLOS SANTOS' },
  { id: 4, nome: 'PEDRO ALVES' },
]

export interface IndicadorSemanal {
  mes: string
  semana: number
  ligacoes: number
  leadsAdicionados: number
  leadsDeclinados: number
  clientesFechados: number
}

export const mockIndicadores: IndicadorSemanal[] = [
  { mes: '2026-07', semana: 1, ligacoes: 32, leadsAdicionados: 8, leadsDeclinados: 2, clientesFechados: 3 },
  { mes: '2026-07', semana: 2, ligacoes: 28, leadsAdicionados: 6, leadsDeclinados: 1, clientesFechados: 2 },
  { mes: '2026-07', semana: 3, ligacoes: 0,  leadsAdicionados: 0, leadsDeclinados: 0, clientesFechados: 0 },
  { mes: '2026-07', semana: 4, ligacoes: 0,  leadsAdicionados: 0, leadsDeclinados: 0, clientesFechados: 0 },
  { mes: '2026-06', semana: 1, ligacoes: 35, leadsAdicionados: 9, leadsDeclinados: 3, clientesFechados: 4 },
  { mes: '2026-06', semana: 2, ligacoes: 30, leadsAdicionados: 7, leadsDeclinados: 2, clientesFechados: 3 },
  { mes: '2026-06', semana: 3, ligacoes: 28, leadsAdicionados: 6, leadsDeclinados: 2, clientesFechados: 2 },
  { mes: '2026-06', semana: 4, ligacoes: 25, leadsAdicionados: 5, leadsDeclinados: 1, clientesFechados: 2 },
  { mes: '2026-05', semana: 1, ligacoes: 40, leadsAdicionados: 10, leadsDeclinados: 4, clientesFechados: 3 },
  { mes: '2026-05', semana: 2, ligacoes: 33, leadsAdicionados: 8,  leadsDeclinados: 2, clientesFechados: 3 },
  { mes: '2026-05', semana: 3, ligacoes: 31, leadsAdicionados: 7,  leadsDeclinados: 3, clientesFechados: 2 },
  { mes: '2026-05', semana: 4, ligacoes: 29, leadsAdicionados: 6,  leadsDeclinados: 1, clientesFechados: 3 },
]

export interface Cotacao {
  id: number; data: string; clienteId: number
  origem: string; destino: string; km: number | null; tipoVeiculo: string
  valorMotorista: number | null; valorEmpresa: number | null; valorNf: number | null
  icmsPercent: number; coPercent: number; impostoPercent: number
  seguroPercent: number; diasPagamento: number; percentComissao: number
  comissaoValor: number; lucro: number; percentRentabilidade: number
  situacao: 'pendente' | 'batida'
}

export const mockCotacoes: Cotacao[] = [
  { id: 1, data: '2026-07-14', clienteId: 1, origem: 'São Paulo/SP', destino: 'Salvador/BA', km: 1950, tipoVeiculo: 'CARRETA', valorMotorista: 7200, valorEmpresa: 14500, valorNf: 15000, icmsPercent: 4, coPercent: 3.5, impostoPercent: 6.5, seguroPercent: 0.03, diasPagamento: 15, percentComissao: 13, comissaoValor: 949, lucro: 3104, percentRentabilidade: 0.2141, situacao: 'pendente' },
  { id: 2, data: '2026-07-14', clienteId: 2, origem: 'Campinas/SP', destino: 'Recife/PE', km: 2400, tipoVeiculo: 'TRUCK', valorMotorista: 9100, valorEmpresa: 13900, valorNf: 50000, icmsPercent: 12, coPercent: 0, impostoPercent: 6.5, seguroPercent: 0.03, diasPagamento: 15, percentComissao: 10, comissaoValor: 480, lucro: 2198, percentRentabilidade: 0.1582, situacao: 'pendente' },
  { id: 3, data: '2026-07-13', clienteId: 1, origem: 'Guarulhos/SP', destino: 'Franca/SP', km: 412, tipoVeiculo: 'TRUCK', valorMotorista: 3050, valorEmpresa: 5900, valorNf: 100000, icmsPercent: 12, coPercent: 0, impostoPercent: 6.5, seguroPercent: 0.03, diasPagamento: 15, percentComissao: 13, comissaoValor: 369, lucro: 1148, percentRentabilidade: 0.1947, situacao: 'pendente' },
  { id: 4, data: '2026-07-12', clienteId: 3, origem: 'Betim/MG', destino: 'Goiânia/GO', km: 890, tipoVeiculo: 'BITRUCK', valorMotorista: 9860, valorEmpresa: 15950, valorNf: 150000, icmsPercent: 5.6, coPercent: 3.5, impostoPercent: 6.5, seguroPercent: 0.03, diasPagamento: 15, percentComissao: 10, comissaoValor: 609, lucro: 2476, percentRentabilidade: 0.1552, situacao: 'pendente' },
  { id: 5, data: '2026-07-11', clienteId: 4, origem: 'Porto Alegre/RS', destino: 'Curitiba/PR', km: 698, tipoVeiculo: 'CARRETA', valorMotorista: 4500, valorEmpresa: 6600, valorNf: 80000, icmsPercent: 12, coPercent: 0, impostoPercent: 6.5, seguroPercent: 0.03, diasPagamento: 15, percentComissao: 3, comissaoValor: 63, lucro: 586, percentRentabilidade: 0.0889, situacao: 'batida' },
  { id: 6, data: '2026-07-10', clienteId: 2, origem: 'Viana/ES', destino: 'Cajuru/SP', km: 963, tipoVeiculo: 'CARRETA', valorMotorista: 8200, valorEmpresa: 13300, valorNf: 350000, icmsPercent: 12, coPercent: 0, impostoPercent: 6.5, seguroPercent: 0.03, diasPagamento: 15, percentComissao: 7, comissaoValor: 357, lucro: 1781, percentRentabilidade: 0.1340, situacao: 'batida' },
]

export const mockCargas: Carga[] = [
  { id: 1, data: '2026-07-01', cte: '10001', origem: 'São Paulo/SP', destino: 'Salvador/BA', clienteId: 1, motoristaId: 1, valorMotorista: 6800, valorEmpresa: 14000, valorNf: 14500, seguroPercent: 0.003, icmsPercent: 0.04, coPercent: 0.035, impostoPercent: 0.04, diasPagamento: 30, percentComissao: 0.10, seguroValor: 43.5, coValor: 490, impostoValor: 560, boletoPercent: 0.0399, movaValor: 558.6, adqTabValor: 119, totalTaxasPercent: 0.1549, valorImpostoTotal: 2288, comissaoValor: 720, boletosValor: 17.5, lucro: 3131, percentRentabilidade: 0.2237, status: 'entregue', canhotoPago: true, tipoEntrega: 'CIF', formaPagamento: 'Boleto' },
  { id: 2, data: '2026-07-03', cte: '10002', origem: 'Campinas/SP', destino: 'Recife/PE', clienteId: 2, motoristaId: 2, valorMotorista: 4200, valorEmpresa: 8400, valorNf: 8700, seguroPercent: 0.003, icmsPercent: 0.04, coPercent: 0.035, impostoPercent: 0.04, diasPagamento: 28, percentComissao: 0.08, seguroValor: 26.1, coValor: 294, impostoValor: 336, boletoPercent: 0.03724, movaValor: 312.8, adqTabValor: 71.4, totalTaxasPercent: 0.15224, valorImpostoTotal: 1350, comissaoValor: 336, boletosValor: 17.5, lucro: 2470, percentRentabilidade: 0.294, status: 'entregue', canhotoPago: true, tipoEntrega: 'FOB', formaPagamento: 'Boleto' },
  { id: 3, data: '2026-07-03', cte: '10003', origem: 'Santos/SP', destino: 'Fortaleza/CE', clienteId: 1, motoristaId: 3, valorMotorista: 9200, valorEmpresa: 16800, valorNf: 17500, seguroPercent: 0.003, icmsPercent: 0.04, coPercent: 0, impostoPercent: 0.04, diasPagamento: 35, percentComissao: 0.13, seguroValor: 52.5, coValor: 0, impostoValor: 672, boletoPercent: 0.04655, movaValor: 781.9, adqTabValor: 142.8, totalTaxasPercent: 0.12655, valorImpostoTotal: 2267, comissaoValor: 988, boletosValor: 17.5, lucro: 4275, percentRentabilidade: 0.2545, status: 'entregue', canhotoPago: false, tipoEntrega: 'CIF', formaPagamento: 'PIX' },
  { id: 4, data: '2026-07-04', cte: '10004', origem: 'Curitiba/PR', destino: 'Belo Horizonte/MG', clienteId: 3, motoristaId: 4, valorMotorista: 3800, valorEmpresa: 7200, valorNf: 7500, seguroPercent: 0.003, icmsPercent: 0.04, coPercent: 0.035, impostoPercent: 0.04, diasPagamento: 30, percentComissao: 0.10, seguroValor: 22.5, coValor: 252, impostoValor: 288, boletoPercent: 0.0399, movaValor: 287.3, adqTabValor: 61.2, totalTaxasPercent: 0.1549, valorImpostoTotal: 1177, comissaoValor: 340, boletosValor: 17.5, lucro: 1843, percentRentabilidade: 0.256, status: 'entregue', canhotoPago: true, tipoEntrega: 'FOB', formaPagamento: 'Boleto' },
  { id: 5, data: '2026-07-06', cte: '10005', origem: 'São Paulo/SP', destino: 'Manaus/AM', clienteId: 2, motoristaId: 1, valorMotorista: 5600, valorEmpresa: 12000, valorNf: 12500, seguroPercent: 0.003, icmsPercent: 0.04, coPercent: 0.035, impostoPercent: 0.04, diasPagamento: 30, percentComissao: 0.08, seguroValor: 37.5, coValor: 420, impostoValor: 480, boletoPercent: 0.0399, movaValor: 478.8, adqTabValor: 102, totalTaxasPercent: 0.1549, valorImpostoTotal: 1961, comissaoValor: 512, boletosValor: 17.5, lucro: 3872, percentRentabilidade: 0.3227, status: 'entregue', canhotoPago: true, tipoEntrega: 'CIF', formaPagamento: 'Boleto' },
  { id: 6, data: '2026-07-06', cte: '10006', origem: 'Guarulhos/SP', destino: 'Natal/RN', clienteId: 1, motoristaId: 2, valorMotorista: 7200, valorEmpresa: 13200, valorNf: 13800, seguroPercent: 0.003, icmsPercent: 0.04, coPercent: 0.035, impostoPercent: 0.04, diasPagamento: 28, percentComissao: 0.10, seguroValor: 41.4, coValor: 462, impostoValor: 528, boletoPercent: 0.03724, movaValor: 491.6, adqTabValor: 112.2, totalTaxasPercent: 0.15224, valorImpostoTotal: 2122, comissaoValor: 600, boletosValor: 17.5, lucro: 3219, percentRentabilidade: 0.2439, status: 'entregue', canhotoPago: true, tipoEntrega: 'CIF', formaPagamento: 'Boleto' },
  { id: 7, data: '2026-07-08', cte: '10007', origem: 'Porto Alegre/RS', destino: 'São Luís/MA', clienteId: 4, motoristaId: 3, valorMotorista: 5100, valorEmpresa: 9600, valorNf: 10000, seguroPercent: 0.003, icmsPercent: 0.04, coPercent: 0.035, impostoPercent: 0.04, diasPagamento: 30, percentComissao: 0.07, seguroValor: 30, coValor: 336, impostoValor: 384, boletoPercent: 0.0399, movaValor: 383, adqTabValor: 81.6, totalTaxasPercent: 0.1549, valorImpostoTotal: 1569, comissaoValor: 315, boletosValor: 17.5, lucro: 2569, percentRentabilidade: 0.2676, status: 'entregue', canhotoPago: true, tipoEntrega: 'FOB', formaPagamento: 'PIX' },
  { id: 8, data: '2026-07-09', cte: '10008', origem: 'Belo Horizonte/MG', destino: 'Belém/PA', clienteId: 2, motoristaId: 4, valorMotorista: 3600, valorEmpresa: 7800, valorNf: 8100, seguroPercent: 0.003, icmsPercent: 0.04, coPercent: 0.035, impostoPercent: 0.04, diasPagamento: 35, percentComissao: 0.08, seguroValor: 24.3, coValor: 273, impostoValor: 312, boletoPercent: 0.04655, movaValor: 363.1, adqTabValor: 66.3, totalTaxasPercent: 0.16155, valorImpostoTotal: 1326, comissaoValor: 336, boletosValor: 17.5, lucro: 2496, percentRentabilidade: 0.32, status: 'em_andamento', canhotoPago: false, tipoEntrega: 'CIF', formaPagamento: 'Boleto' },
  { id: 9, data: '2026-07-10', cte: '10009', origem: 'São Paulo/SP', destino: 'Goiânia/GO', clienteId: 3, motoristaId: 1, valorMotorista: 7800, valorEmpresa: 14600, valorNf: 15200, seguroPercent: 0.003, icmsPercent: 0.04, coPercent: 0, impostoPercent: 0.04, diasPagamento: 30, percentComissao: 0.13, seguroValor: 45.6, coValor: 0, impostoValor: 584, boletoPercent: 0.0399, movaValor: 582.5, adqTabValor: 124.1, totalTaxasPercent: 0.1199, valorImpostoTotal: 1875, comissaoValor: 884, boletosValor: 17.5, lucro: 3978, percentRentabilidade: 0.2725, status: 'em_andamento', canhotoPago: false, tipoEntrega: 'CIF', formaPagamento: 'Boleto' },
  { id: 10, data: '2026-07-10', cte: '10010', origem: 'Ribeirão Preto/SP', destino: 'Maceió/AL', clienteId: 4, motoristaId: 2, valorMotorista: 2800, valorEmpresa: 6600, valorNf: 6900, seguroPercent: 0.003, icmsPercent: 0.04, coPercent: 0.035, impostoPercent: 0.04, diasPagamento: 28, percentComissao: 0.07, seguroValor: 20.7, coValor: 231, impostoValor: 264, boletoPercent: 0.03724, movaValor: 245.8, adqTabValor: 56.1, totalTaxasPercent: 0.15224, valorImpostoTotal: 1061, comissaoValor: 266, boletosValor: 17.5, lucro: 2435, percentRentabilidade: 0.369, status: 'em_andamento', canhotoPago: false, tipoEntrega: 'FOB', formaPagamento: 'PIX' },
  { id: 11, data: '2026-07-12', cte: '10011', origem: 'São Paulo/SP', destino: 'Salvador/BA', clienteId: 1, motoristaId: 3, valorMotorista: 5900, valorEmpresa: 10800, valorNf: 11200, seguroPercent: 0.003, icmsPercent: 0.04, coPercent: 0.035, impostoPercent: 0.04, diasPagamento: 30, percentComissao: 0.10, seguroValor: 33.6, coValor: 378, impostoValor: 432, boletoPercent: 0.0399, movaValor: 430.9, adqTabValor: 91.8, totalTaxasPercent: 0.1549, valorImpostoTotal: 1765, comissaoValor: 490, boletosValor: 17.5, lucro: 2594, percentRentabilidade: 0.2402, status: 'em_andamento', canhotoPago: false, tipoEntrega: 'CIF', formaPagamento: 'Boleto' },
  { id: 12, data: '2026-07-13', cte: '10012', origem: 'Osasco/SP', destino: 'Aracaju/SE', clienteId: 2, motoristaId: 4, valorMotorista: 4100, valorEmpresa: 8200, valorNf: 8500, seguroPercent: 0.003, icmsPercent: 0.04, coPercent: 0.035, impostoPercent: 0.04, diasPagamento: 30, percentComissao: 0.08, seguroValor: 25.5, coValor: 287, impostoValor: 328, boletoPercent: 0.0399, movaValor: 327.2, adqTabValor: 69.7, totalTaxasPercent: 0.1549, valorImpostoTotal: 1340, comissaoValor: 328, boletosValor: 17.5, lucro: 2389, percentRentabilidade: 0.2913, status: 'em_andamento', canhotoPago: false, tipoEntrega: 'CIF', formaPagamento: 'Boleto' },
]
