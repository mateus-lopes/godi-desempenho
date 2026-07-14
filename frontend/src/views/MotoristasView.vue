<script setup lang="ts">
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import { useLocalStorage } from '../composables/useLocalStorage'
import { mockMotoristas } from '../mocks/data'

interface MotoristaLocal {
  id: number
  nome: string
  percentComissao: number
}

const defaultMotoristas: MotoristaLocal[] = mockMotoristas.map(m => ({
  ...m,
  percentComissao: 0.10,
}))

const motoristas = useLocalStorage<MotoristaLocal[]>('thiago_motoristas', defaultMotoristas)

const showModal = ref(false)
const isEditing = ref(false)
const editId = ref<number | null>(null)
const form = ref({ nome: '', percentComissao: 10 })
const erro = ref('')

const PCT = (v: number) =>
  (v * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%'

const totalComissaoMedia = computed(() => {
  if (!motoristas.value.length) return 0
  return motoristas.value.reduce((s, m) => s + m.percentComissao, 0) / motoristas.value.length
})

function openNew() {
  isEditing.value = false
  editId.value = null
  form.value = { nome: '', percentComissao: 10 }
  erro.value = ''
  showModal.value = true
}

function openEdit(m: MotoristaLocal) {
  isEditing.value = true
  editId.value = m.id
  form.value = { nome: m.nome, percentComissao: m.percentComissao * 100 }
  erro.value = ''
  showModal.value = true
}

function save() {
  if (!form.value.nome.trim()) { erro.value = 'Nome obrigatório'; return }
  if (form.value.percentComissao <= 0) { erro.value = 'Comissão deve ser maior que zero'; return }

  const pct = form.value.percentComissao / 100

  if (isEditing.value && editId.value !== null) {
    const idx = motoristas.value.findIndex(m => m.id === editId.value)
    if (idx !== -1) motoristas.value[idx] = { id: editId.value, nome: form.value.nome.trim().toUpperCase(), percentComissao: pct }
  } else {
    const nextId = motoristas.value.length ? Math.max(...motoristas.value.map(m => m.id)) + 1 : 1
    motoristas.value.push({ id: nextId, nome: form.value.nome.trim().toUpperCase(), percentComissao: pct })
  }
  showModal.value = false
}

function remove(id: number) {
  motoristas.value = motoristas.value.filter(m => m.id !== id)
}
</script>

<template>
  <div class="page">
    <div class="wrap">

      <div class="page-header">
        <div>
          <div class="page-title">Motoristas</div>
          <div class="page-sub">
            {{ motoristas.length }} motorista{{ motoristas.length !== 1 ? 's' : '' }} cadastrado{{ motoristas.length !== 1 ? 's' : '' }}
            · Comissão média: {{ PCT(totalComissaoMedia) }}
          </div>
        </div>
        <Button label="Novo Motorista" icon="pi pi-plus" @click="openNew" />
      </div>

      <div class="card">
        <table class="data-table">
          <thead>
            <tr>
              <th class="col-num">#</th>
              <th>Nome</th>
              <th class="col-right">% Comissão Padrão</th>
              <th class="col-actions">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(m, i) in motoristas" :key="m.id">
              <td class="col-num">{{ i + 1 }}</td>
              <td>
                <div class="motorista-row">
                  <div class="motorista-avatar">{{ m.nome.charAt(0) }}</div>
                  <span class="nome-bold">{{ m.nome }}</span>
                </div>
              </td>
              <td class="col-right">
                <span class="pct-badge">{{ PCT(m.percentComissao) }}</span>
              </td>
              <td class="col-actions">
                <button class="icon-btn edit" @click="openEdit(m)" title="Editar">
                  <i class="pi pi-pencil" />
                </button>
                <button class="icon-btn del" @click="remove(m.id)" title="Excluir">
                  <i class="pi pi-trash" />
                </button>
              </td>
            </tr>
            <tr v-if="!motoristas.length">
              <td colspan="4" class="empty-row">Nenhum motorista cadastrado</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>

  <Dialog
    v-model:visible="showModal"
    :header="isEditing ? 'Editar Motorista' : 'Novo Motorista'"
    modal
    style="width: 400px"
  >
    <div class="modal-body">
      <div class="form-field">
        <label>Nome</label>
        <InputText v-model="form.nome" placeholder="Ex: JOÃO SILVA" fluid />
      </div>
      <div class="form-field" style="margin-top: 14px">
        <label>% Comissão Padrão</label>
        <InputNumber
          v-model="form.percentComissao"
          :min="0"
          :max="100"
          :minFractionDigits="1"
          :maxFractionDigits="1"
          suffix="%"
          fluid
        />
      </div>
      <div v-if="erro" class="modal-erro">{{ erro }}</div>
    </div>
    <template #footer>
      <Button label="Cancelar" severity="secondary" text @click="showModal = false" />
      <Button label="Salvar" icon="pi pi-check" @click="save" />
    </template>
  </Dialog>
</template>

<style scoped>
.wrap { padding: 0 20px; }

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 20px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

.data-table thead th {
  padding: 10px 14px;
  text-align: left;
  font-size: 11.5px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
}

.data-table tbody td {
  padding: 12px 14px;
  color: #1e293b;
  border-bottom: 1px solid #f8fafc;
}

.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover { background: #fafbfc; }

.col-num { width: 48px; color: #94a3b8 !important; font-size: 12px !important; }
.col-right { text-align: right; }
.col-actions { width: 88px; text-align: center; }

.motorista-row { display: flex; align-items: center; gap: 10px; }
.motorista-avatar {
  width: 30px; height: 30px; border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: white; font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.nome-bold { font-weight: 600; color: #0f172a; }

.pct-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 99px;
  background: #f3e8ff;
  color: #7c3aed;
  font-weight: 600;
  font-size: 12.5px;
}

.empty-row {
  text-align: center;
  padding: 32px !important;
  color: #94a3b8;
  font-style: italic;
}

.icon-btn {
  width: 30px; height: 30px;
  border: none; background: none; cursor: pointer;
  border-radius: 6px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 13px;
  transition: background 0.12s, color 0.12s;
}
.icon-btn.edit { color: #64748b; }
.icon-btn.edit:hover { background: #f3e8ff; color: #7c3aed; }
.icon-btn.del { color: #94a3b8; }
.icon-btn.del:hover { background: #fef2f2; color: #ef4444; }

.modal-body { padding: 4px 0 8px; }
.modal-erro { margin-top: 10px; font-size: 12.5px; color: #dc2626; }
</style>
