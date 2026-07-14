export interface CargaInput {
  valorMotorista: number;
  valorEmpresa: number;
  valorNF: number;
  seguroPercent: number;
  icmsPercent: number;
  coPercent: number;
  impostoPercent: number;
  diasPagamento: number;
  percentComissao: number;
}

export interface CargaCalculada {
  seguroValor: number;
  coValor: number;
  impostoValor: number;
  boletoPercent: number;
  movaValor: number;
  adqTabValor: number;
  totalTaxasPercent: number;
  valorImpostoTotal: number;
  comissaoValor: number;
  boletosValor: number;
  lucro: number;
  percentRentabilidade: number;
}
