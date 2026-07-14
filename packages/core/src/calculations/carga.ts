import Decimal from "decimal.js";
import type { CargaInput, CargaCalculada } from "../types/carga";

/** Fator diário do custo financeiro do boleto (coluna Z = dias * fator). */
export const BOLETO_DIARIO_FACTOR = 0.00133;
/** Taxa fixa da adquirente/maquininha (coluna AL), observada constante em 0,85%. */
export const ADQ_TAB_PERCENT = 0.0085;
/** Custo fixo de boleto por carga (coluna AF). */
export const BOLETOS_VALOR_FIXO = 17.5;

function toDecimal(value: number): Decimal {
  return new Decimal(value);
}

/** Coluna R = NF * Seguro% */
export function calcularSeguro(input: CargaInput): Decimal {
  return toDecimal(input.valorNF).times(input.seguroPercent);
}

/** Coluna W = C.O% * valor empresa */
export function calcularCO(input: CargaInput): Decimal {
  return toDecimal(input.coPercent).times(input.valorEmpresa);
}

/** Coluna Y = valor empresa * Imposto% */
export function calcularImposto(input: CargaInput): Decimal {
  return toDecimal(input.impostoPercent).times(input.valorEmpresa);
}

/** Coluna Z = dias para pagamento * fator diário do boleto */
export function calcularBoletoPercent(input: CargaInput): Decimal {
  return toDecimal(input.diasPagamento).times(BOLETO_DIARIO_FACTOR);
}

/** Coluna AJ = "MOVA" = Boleto%(Z) * valor empresa */
export function calcularMova(input: CargaInput, boletoPercent: Decimal): Decimal {
  return boletoPercent.times(input.valorEmpresa);
}

/** Coluna AL = ADQ TAB = taxa fixa da adquirente * valor empresa */
export function calcularAdqTab(input: CargaInput): Decimal {
  return toDecimal(ADQ_TAB_PERCENT).times(input.valorEmpresa);
}

/** Coluna AB = ICMS% + C.O% + Imposto% + Boleto%(Z) */
export function calcularTotalTaxasPercent(input: CargaInput, boletoPercent: Decimal): Decimal {
  return toDecimal(input.icmsPercent)
    .plus(input.coPercent)
    .plus(input.impostoPercent)
    .plus(boletoPercent);
}

/** Coluna AC = valor empresa * Total taxas%(AB) + ADQ TAB(AL) */
export function calcularValorImpostoTotal(
  input: CargaInput,
  totalTaxasPercent: Decimal,
  adqTabValor: Decimal,
): Decimal {
  return toDecimal(input.valorEmpresa).times(totalTaxasPercent).plus(adqTabValor);
}

/** Coluna AE = (valor empresa - valor motorista) * % comissão (AD, input manual) */
export function calcularComissao(input: CargaInput): Decimal {
  return toDecimal(input.valorEmpresa).minus(input.valorMotorista).times(input.percentComissao);
}

/** Coluna AG = valor empresa - valor motorista - Seguro(R) - Valor imposto total(AC) - Comissão(AE) - Boletos(AF) */
export function calcularLucro(
  input: CargaInput,
  seguroValor: Decimal,
  valorImpostoTotal: Decimal,
  comissaoValor: Decimal,
): Decimal {
  return toDecimal(input.valorEmpresa)
    .minus(input.valorMotorista)
    .minus(seguroValor)
    .minus(valorImpostoTotal)
    .minus(comissaoValor)
    .minus(BOLETOS_VALOR_FIXO);
}

/** Coluna AH = Lucro(AG) / valor empresa(O) */
export function calcularRentabilidade(input: CargaInput, lucro: Decimal): Decimal {
  if (input.valorEmpresa === 0) return new Decimal(0);
  return lucro.dividedBy(input.valorEmpresa);
}

export function calcularCarga(input: CargaInput): CargaCalculada {
  const seguroValor = calcularSeguro(input);
  const coValor = calcularCO(input);
  const impostoValor = calcularImposto(input);
  const boletoPercent = calcularBoletoPercent(input);
  const movaValor = calcularMova(input, boletoPercent);
  const adqTabValor = calcularAdqTab(input);
  const totalTaxasPercent = calcularTotalTaxasPercent(input, boletoPercent);
  const valorImpostoTotal = calcularValorImpostoTotal(input, totalTaxasPercent, adqTabValor);
  const comissaoValor = calcularComissao(input);
  const lucro = calcularLucro(input, seguroValor, valorImpostoTotal, comissaoValor);
  const percentRentabilidade = calcularRentabilidade(input, lucro);

  return {
    seguroValor: seguroValor.toNumber(),
    coValor: coValor.toNumber(),
    impostoValor: impostoValor.toNumber(),
    boletoPercent: boletoPercent.toNumber(),
    movaValor: movaValor.toNumber(),
    adqTabValor: adqTabValor.toNumber(),
    totalTaxasPercent: totalTaxasPercent.toNumber(),
    valorImpostoTotal: valorImpostoTotal.toNumber(),
    comissaoValor: comissaoValor.toNumber(),
    boletosValor: BOLETOS_VALOR_FIXO,
    lucro: lucro.toNumber(),
    percentRentabilidade: percentRentabilidade.toNumber(),
  };
}
