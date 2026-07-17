<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { api } from '../services/api'
import AppLoader from '../components/AppLoader.vue'
import { useAuthStore } from '../stores/auth'

interface Usuario { id: number; email: string; role: string; createdAt: string }

const auth = useAuthStore()
const usuarios = ref<Usuario[]>([])
const carregando = ref(false)
const showModal = ref(false)
const showSenhaModal = ref(false)
const form = ref({ email: '', senha: '' })
const senhaForm = ref({ id: 0, email: '', senha: '' })
const erro = ref('')
const erroSenha = ref('')
const salvando = ref(false)

async function carregar() {
  carregando.value = true
  try {
    const { data } = await api.get('/users')
    usuarios.value = data
  } finally {
    carregando.value = false
  }
}

onMounted(carregar)

function openNovo() {
  form.value = { email: '', senha: '' }
  erro.value = ''
  showModal.value = true
}

async function salvar() {
  erro.value = ''
  if (!form.value.email || !form.value.senha) {
    erro.value = 'Preencha email e senha.'
    return
  }
  if (form.value.senha.length < 6) {
    erro.value = 'Senha deve ter no mínimo 6 caracteres.'
    return
  }
  salvando.value = true
  try {
    const { data } = await api.post('/users', { email: form.value.email, senha: form.value.senha })
    usuarios.value.push(data)
    showModal.value = false
  } catch (e: any) {
    erro.value = e.response?.data?.error ?? 'Erro ao criar usuário.'
  } finally {
    salvando.value = false
  }
}

async function excluir(u: Usuario) {
  if (!confirm(`Excluir o usuário "${u.email}"?`)) return
  try {
    await api.delete(`/users/${u.id}`)
    usuarios.value = usuarios.value.filter(x => x.id !== u.id)
  } catch (e: any) {
    alert(e.response?.data?.error ?? 'Erro ao excluir usuário.')
  }
}

function openAlterarSenha(u: Usuario) {
  senhaForm.value = { id: u.id, email: u.email, senha: '' }
  erroSenha.value = ''
  showSenhaModal.value = true
}

async function salvarSenha() {
  erroSenha.value = ''
  if (senhaForm.value.senha.length < 6) {
    erroSenha.value = 'Senha deve ter no mínimo 6 caracteres.'
    return
  }
  salvando.value = true
  try {
    await api.put(`/users/${senhaForm.value.id}/senha`, { senha: senhaForm.value.senha })
    showSenhaModal.value = false
  } catch (e: any) {
    erroSenha.value = e.response?.data?.error ?? 'Erro ao alterar senha.'
  } finally {
    salvando.value = false
  }
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR')
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title"><i class="pi pi-shield" /> Gerenciamento de Usuários</h1>
        <p class="page-sub">Apenas o administrador pode acessar esta tela.</p>
      </div>
      <Button label="Novo usuário" icon="pi pi-plus" @click="openNovo" />
    </div>

    <AppLoader v-if="carregando" />

    <div v-else class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Perfil</th>
            <th>Criado em</th>
            <th style="width: 120px" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in usuarios" :key="u.id">
            <td>{{ u.email }}</td>
            <td>
              <span class="badge" :class="u.role === 'admin' ? 'badge-admin' : 'badge-user'">
                {{ u.role === 'admin' ? 'Admin' : 'Usuário' }}
              </span>
            </td>
            <td>{{ formatarData(u.createdAt) }}</td>
            <td class="actions">
              <button class="action-btn" title="Alterar senha" @click="openAlterarSenha(u)">
                <i class="pi pi-key" />
              </button>
              <button
                class="action-btn action-del"
                title="Excluir"
                :disabled="u.id === auth.$state.role ? true : false"
                @click="excluir(u)"
              >
                <i class="pi pi-trash" />
              </button>
            </td>
          </tr>
          <tr v-if="usuarios.length === 0">
            <td colspan="4" class="empty">Nenhum usuário cadastrado.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal: Novo usuário -->
    <Dialog v-model:visible="showModal" modal header="Novo usuário" :style="{ width: '420px' }">
      <div class="modal-form">
        <div class="field">
          <label>Email</label>
          <InputText v-model="form.email" type="email" placeholder="email@exemplo.com.br" class="w-full" />
        </div>
        <div class="field">
          <label>Senha</label>
          <InputText v-model="form.senha" type="password" placeholder="Mínimo 6 caracteres" class="w-full" />
        </div>
        <p v-if="erro" class="form-erro">{{ erro }}</p>
      </div>
      <template #footer>
        <Button label="Cancelar" text @click="showModal = false" />
        <Button label="Criar usuário" icon="pi pi-check" :loading="salvando" @click="salvar" />
      </template>
    </Dialog>

    <!-- Modal: Alterar senha -->
    <Dialog v-model:visible="showSenhaModal" modal :header="`Alterar senha — ${senhaForm.email}`" :style="{ width: '380px' }">
      <div class="modal-form">
        <div class="field">
          <label>Nova senha</label>
          <InputText v-model="senhaForm.senha" type="password" placeholder="Mínimo 6 caracteres" class="w-full" />
        </div>
        <p v-if="erroSenha" class="form-erro">{{ erroSenha }}</p>
      </div>
      <template #footer>
        <Button label="Cancelar" text @click="showSenhaModal = false" />
        <Button label="Salvar senha" icon="pi pi-check" :loading="salvando" @click="salvarSenha" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.page { padding: 28px 32px; max-width: 860px; margin: 0 auto; }

.page-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 24px; gap: 16px;
}
.page-title {
  font-size: 20px; font-weight: 700; color: #1e293b;
  display: flex; align-items: center; gap: 8px; margin: 0 0 4px;
}
.page-title .pi { color: #7c3aed; font-size: 18px; }
.page-sub { font-size: 13px; color: #64748b; margin: 0; }

.table-wrap { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th {
  background: #f8fafc; text-align: left;
  padding: 10px 14px; font-size: 12px; font-weight: 600;
  color: #64748b; text-transform: uppercase; letter-spacing: 0.04em;
  border-bottom: 1px solid #e2e8f0;
}
.data-table td { padding: 12px 14px; font-size: 13.5px; color: #374151; border-bottom: 1px solid #f1f5f9; }
.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover { background: #fafbff; }

.badge {
  display: inline-block; padding: 2px 10px; border-radius: 99px;
  font-size: 11.5px; font-weight: 600;
}
.badge-admin { background: #ede9fe; color: #7c3aed; }
.badge-user  { background: #f0fdf4; color: #15803d; }

.actions { display: flex; gap: 6px; justify-content: flex-end; }
.action-btn {
  width: 32px; height: 32px; border: 1px solid #e2e8f0;
  background: white; border-radius: 8px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #64748b; font-size: 13px; transition: all 0.12s;
}
.action-btn:hover { border-color: #7c3aed; color: #7c3aed; background: #f3e8ff; }
.action-del:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }
.action-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.empty { text-align: center; color: #94a3b8; font-style: italic; padding: 32px !important; }

.modal-form { display: flex; flex-direction: column; gap: 14px; padding: 4px 0 8px; }
.field { display: flex; flex-direction: column; gap: 5px; }
.field label { font-size: 13px; font-weight: 500; color: #374151; }
.form-erro { font-size: 12.5px; color: #ef4444; margin: 0; }
.w-full { width: 100%; }

@media (max-width: 768px) {
  .page { padding: 16px; }
  :deep(.p-dialog) { width: calc(100vw - 32px) !important; max-width: calc(100vw - 32px) !important; }
}
</style>
