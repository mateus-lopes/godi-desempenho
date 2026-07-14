<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, BarChart, LineChart, GridComponent, TooltipComponent, LegendComponent])

const BRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const PCT = (v: number) =>
  (v * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%'

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

interface ResumoMes { fat: number; com: number; lucro: number; rent: number; cargas: number; parcial?: boolean }

const dados2025: ResumoMes[] = [
  { fat: 52000,  com: 3900,  lucro: 9100,  rent: 0.175, cargas: 7  },
  { fat: 58000,  com: 4350,  lucro: 10200, rent: 0.176, cargas: 8  },
  { fat: 65000,  com: 4900,  lucro: 11700, rent: 0.180, cargas: 9  },
  { fat: 61000,  com: 4600,  lucro: 10800, rent: 0.177, cargas: 8  },
  { fat: 74000,  com: 5600,  lucro: 13500, rent: 0.182, cargas: 10 },
  { fat: 79000,  com: 6000,  lucro: 14600, rent: 0.185, cargas: 11 },
  { fat: 83000,  com: 6300,  lucro: 15400, rent: 0.186, cargas: 11 },
  { fat: 88000,  com: 6700,  lucro: 16500, rent: 0.188, cargas: 12 },
  { fat: 93000,  com: 7100,  lucro: 17800, rent: 0.191, cargas: 13 },
  { fat: 99000,  com: 7600,  lucro: 19200, rent: 0.194, cargas: 13 },
  { fat: 108000, com: 8300,  lucro: 21100, rent: 0.195, cargas: 14 },
  { fat: 102000, com: 7800,  lucro: 19800, rent: 0.194, cargas: 13 },
]

const dados2026: ResumoMes[] = [
  { fat: 68000,  com: 5100,  lucro: 12800, rent: 0.188, cargas: 9  },
  { fat: 78000,  com: 5900,  lucro: 14900, rent: 0.191, cargas: 11 },
  { fat: 88000,  com: 6700,  lucro: 17000, rent: 0.193, cargas: 12 },
  { fat: 82000,  com: 6200,  lucro: 15700, rent: 0.191, cargas: 11 },
  { fat: 95000,  com: 7200,  lucro: 18500, rent: 0.195, cargas: 13 },
  { fat: 112000, com: 8500,  lucro: 22100, rent: 0.197, cargas: 15 },
  { fat: 129200, com: 6115,  lucro: 35271, rent: 0.273, cargas: 12, parcial: true },
]

const fat2026 = dados2026.reduce((s, d) => s + d.fat, 0)
const fat2025mesmo = dados2025.slice(0, dados2026.length).reduce((s, d) => s + d.fat, 0)
const variacao = (fat2026 - fat2025mesmo) / fat2025mesmo
const com2026 = dados2026.reduce((s, d) => s + d.com, 0)
const lucro2026 = dados2026.reduce((s, d) => s + d.lucro, 0)
const melhorIdx = dados2026.slice(0, -1).reduce((best, d, i) => d.fat > dados2026[best].fat ? i : best, 0)

const NULL_PAD = Array(12 - dados2026.length).fill(null)

const chartFat = computed(() => ({
  grid: { left: 0, right: 10, bottom: 40, top: 10, containLabel: true },
  tooltip: {
    trigger: 'axis',
    formatter: (params: any[]) =>
      `<b>${params[0].name}</b><br/>` +
      params.filter(p => p.value != null).map((p: any) =>
        `<span style="color:${p.color}">●</span> ${p.seriesName}: <b>${BRL(p.value)}</b>`
      ).join('<br/>'),
  },
  legend: { bottom: 0, textStyle: { fontSize: 11, color: '#64748b' } },
  xAxis: {
    type: 'category', data: MESES,
    axisLabel: { fontSize: 10, color: '#94a3b8' },
    axisLine: { lineStyle: { color: '#e2e8f0' } },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    axisLabel: { fontSize: 10, color: '#94a3b8', formatter: (v: number) => `R$${(v / 1000).toFixed(0)}k` },
    splitLine: { lineStyle: { color: '#f1f5f9' } },
  },
  series: [
    {
      name: '2025', type: 'bar',
      data: dados2025.map(d => d.fat),
      itemStyle: { color: '#cbd5e1', borderRadius: [3, 3, 0, 0] },
      barMaxWidth: 24,
    },
    {
      name: '2026', type: 'bar',
      data: [...dados2026.map(d => d.fat), ...NULL_PAD],
      itemStyle: { color: '#7c3aed', borderRadius: [3, 3, 0, 0] },
      barMaxWidth: 24,
    },
  ],
}))

const chartCom = computed(() => ({
  grid: { left: 0, right: 10, bottom: 40, top: 10, containLabel: true },
  tooltip: {
    trigger: 'axis',
    formatter: (params: any[]) =>
      `<b>${params[0].name}</b><br/>` +
      params.filter(p => p.value != null).map((p: any) =>
        `<span style="color:${p.color}">●</span> ${p.seriesName}: <b>${BRL(p.value)}</b>`
      ).join('<br/>'),
  },
  legend: { bottom: 0, textStyle: { fontSize: 11, color: '#64748b' } },
  xAxis: {
    type: 'category', data: MESES,
    axisLabel: { fontSize: 10, color: '#94a3b8' },
    axisLine: { lineStyle: { color: '#e2e8f0' } },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    axisLabel: { fontSize: 10, color: '#94a3b8', formatter: (v: number) => `R$${(v / 1000).toFixed(0)}k` },
    splitLine: { lineStyle: { color: '#f1f5f9' } },
  },
  series: [
    {
      name: '2025', type: 'line',
      data: dados2025.map(d => d.com),
      smooth: true, lineStyle: { color: '#94a3b8', width: 2 },
      itemStyle: { color: '#94a3b8' }, symbol: 'circle', symbolSize: 5,
    },
    {
      name: '2026', type: 'line',
      data: [...dados2026.map(d => d.com), ...NULL_PAD],
      smooth: true, lineStyle: { color: '#16a34a', width: 2.5 },
      itemStyle: { color: '#16a34a' }, symbol: 'circle', symbolSize: 5,
      areaStyle: { color: 'rgba(22,163,74,0.06)' },
    },
  ],
}))

const chartRent = computed(() => ({
  grid: { left: 0, right: 10, bottom: 40, top: 10, containLabel: true },
  tooltip: {
    trigger: 'axis',
    formatter: (params: any[]) =>
      `<b>${params[0].name}</b><br/>` +
      params.filter(p => p.value != null).map((p: any) =>
        `<span style="color:${p.color}">●</span> ${p.seriesName}: <b>${p.value.toFixed(1)}%</b>`
      ).join('<br/>'),
  },
  legend: { bottom: 0, textStyle: { fontSize: 11, color: '#64748b' } },
  xAxis: {
    type: 'category', data: MESES,
    axisLabel: { fontSize: 10, color: '#94a3b8' },
    axisLine: { lineStyle: { color: '#e2e8f0' } },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    axisLabel: { fontSize: 10, color: '#94a3b8', formatter: (v: number) => v.toFixed(0) + '%' },
    splitLine: { lineStyle: { color: '#f1f5f9' } },
  },
  series: [
    {
      name: '2025', type: 'line',
      data: dados2025.map(d => +(d.rent * 100).toFixed(1)),
      smooth: true, lineStyle: { color: '#cbd5e1', width: 2 },
      itemStyle: { color: '#94a3b8' }, symbol: 'circle', symbolSize: 5,
    },
    {
      name: '2026', type: 'line',
      data: [...dados2026.map(d => +(d.rent * 100).toFixed(1)), ...NULL_PAD],
      smooth: true, lineStyle: { color: '#d97706', width: 2.5 },
      itemStyle: { color: '#d97706' }, symbol: 'circle', symbolSize: 5,
      areaStyle: { color: 'rgba(217,119,6,0.06)' },
    },
  ],
}))
</script>

<template>
  <div class="page">
    <div class="wrap">

      <div class="page-header">
        <div>
          <div class="page-title">Dashboard Anual</div>
          <div class="page-sub">Comparativo 2025 vs 2026 · Julho/2026 parcial (13/31 dias)</div>
        </div>
      </div>

      <!-- KPIs -->
      <div class="kpi-grid" style="margin-bottom:20px">
        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-label">Faturamento 2026</div>
            <div class="kpi-icon purple"><i class="pi pi-money-bill" /></div>
          </div>
          <div class="kpi-value">{{ BRL(fat2026) }}</div>
          <div class="kpi-sub">acumulado Jan–Jul (Jul parcial)</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-label">vs 2025 (Jan–Jul)</div>
            <div class="kpi-icon" :class="variacao >= 0 ? 'green' : 'red'">
              <i :class="`pi ${variacao >= 0 ? 'pi-arrow-up' : 'pi-arrow-down'}`" />
            </div>
          </div>
          <div class="kpi-value" :style="{ color: variacao >= 0 ? '#16a34a' : '#dc2626' }">
            {{ variacao >= 0 ? '+' : '' }}{{ PCT(variacao) }}
          </div>
          <div class="kpi-sub">{{ BRL(fat2025mesmo) }} no mesmo período de 2025</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-label">Comissão 2026</div>
            <div class="kpi-icon green"><i class="pi pi-wallet" /></div>
          </div>
          <div class="kpi-value" style="color:#16a34a">{{ BRL(com2026) }}</div>
          <div class="kpi-sub">total acumulado Jan–Jul</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <div class="kpi-label">Melhor mês (completo)</div>
            <div class="kpi-icon amber"><i class="pi pi-star" /></div>
          </div>
          <div class="kpi-value" style="color:#d97706">{{ MESES[melhorIdx] }}</div>
          <div class="kpi-sub">{{ BRL(dados2026[melhorIdx].fat) }} faturados</div>
        </div>
      </div>

      <!-- Gráfico faturamento -->
      <div class="card" style="margin-bottom:16px">
        <div class="card-title">Faturamento Mensal — 2025 vs 2026</div>
        <VChart :option="chartFat" style="height:230px" autoresize />
      </div>

      <!-- Comissão + Rentabilidade -->
      <div class="dash-row cols-2" style="margin-bottom:16px">
        <div class="card">
          <div class="card-title">Comissão Mensal — 2025 vs 2026</div>
          <VChart :option="chartCom" style="height:200px" autoresize />
        </div>
        <div class="card">
          <div class="card-title">Rentabilidade Média — 2025 vs 2026</div>
          <VChart :option="chartRent" style="height:200px" autoresize />
        </div>
      </div>

      <!-- Tabela de resumo -->
      <div class="card">
        <div class="card-title">Resumo Mensal 2026</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Mês</th>
              <th class="col-right">Faturamento</th>
              <th class="col-right">Comissão</th>
              <th class="col-right">Lucro</th>
              <th class="col-right">Rentab.</th>
              <th class="col-right">Cargas</th>
              <th class="col-right">vs 2025</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(d, i) in dados2026" :key="i">
              <td>
                {{ MESES[i] }}
                <span v-if="d.parcial" class="tag-parcial">parcial</span>
              </td>
              <td class="col-right font-bold">{{ BRL(d.fat) }}</td>
              <td class="col-right color-green">{{ BRL(d.com) }}</td>
              <td class="col-right color-blue">{{ BRL(d.lucro) }}</td>
              <td class="col-right">
                <span class="rent" :class="d.rent >= 0.25 ? 'green' : d.rent >= 0.18 ? 'amber' : 'red'">
                  {{ PCT(d.rent) }}
                </span>
              </td>
              <td class="col-right color-muted">{{ d.cargas }}</td>
              <td class="col-right">
                <span :class="d.fat >= dados2025[i].fat ? 'color-green' : 'color-red'" style="font-weight:600;font-size:12px">
                  {{ d.fat >= dados2025[i].fat ? '+' : '' }}{{ PCT((d.fat - dados2025[i].fat) / dados2025[i].fat) }}
                </span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td class="foot-label">Total acumulado</td>
              <td class="col-right foot-val">{{ BRL(fat2026) }}</td>
              <td class="col-right foot-com">{{ BRL(com2026) }}</td>
              <td class="col-right foot-lucro">{{ BRL(lucro2026) }}</td>
              <td class="col-right foot-rent">{{ PCT(lucro2026 / fat2026) }}</td>
              <td class="col-right foot-val">{{ dados2026.reduce((s, d) => s + d.cargas, 0) }}</td>
              <td class="col-right">
                <span class="color-green" style="font-weight:700;font-size:12px">
                  +{{ PCT(variacao) }}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  </div>
</template>

<style scoped>
.wrap { padding: 0 20px; }

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}
.data-table thead th {
  padding: 8px 12px;
  text-align: left;
  font-size: 11px; font-weight: 600; color: #64748b;
  text-transform: uppercase; letter-spacing: 0.04em;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
  white-space: nowrap;
}
.data-table tbody td {
  padding: 10px 12px;
  color: #1e293b;
  border-bottom: 1px solid #f8fafc;
}
.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover { background: #fafbfc; }
.data-table tfoot td {
  padding: 10px 12px;
  border-top: 1px solid #e2e8f0;
  background: #fafafa;
}

.col-right { text-align: right; }
.font-bold { font-weight: 600; }
.color-green { color: #16a34a; font-weight: 600; }
.color-blue  { color: #2563eb; font-weight: 600; }
.color-red   { color: #dc2626; }
.color-muted { color: #64748b; }

.foot-label { font-weight: 600; color: #374151; }
.foot-val   { font-weight: 700; color: #0f172a; text-align: right; }
.foot-com   { font-weight: 700; color: #16a34a; text-align: right; }
.foot-lucro { font-weight: 700; color: #2563eb; text-align: right; }
.foot-rent  { font-weight: 700; color: #d97706; text-align: right; }

.tag-parcial {
  display: inline-block;
  font-size: 9.5px; font-weight: 600;
  color: #94a3b8; background: #f1f5f9;
  border-radius: 4px; padding: 1px 5px;
  margin-left: 6px; vertical-align: middle;
  text-transform: uppercase; letter-spacing: 0.04em;
}
</style>
