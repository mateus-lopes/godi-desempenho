<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "../services/api";
import { useAuthStore } from "../stores/auth";

const email = ref("");
const senha = ref("");
const erro = ref("");
const carregando = ref(false);
const mostrarSenha = ref(false);

const auth = useAuthStore();
const router = useRouter();

async function entrar() {
  erro.value = "";
  carregando.value = true;
  try {
    const { data } = await api.post("/auth/login", { email: email.value, senha: senha.value });
    auth.setToken(data.token);
    router.push("/");
  } catch {
    erro.value = "Email ou senha inválidos.";
  } finally {
    carregando.value = false;
  }
}
</script>

<template>
  <div class="login-bg">
    <div class="login-card">

      <!-- Logo -->
      <div class="brand">
        <div class="brand-icon">
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
            <path d="M8 19 C8 11 14 6 21 6 L30 6 L24 13 L18 13 C15 13 13 15.5 13 19 C13 22.5 15 25 18 25 L24 25 L30 32 L21 32 C14 32 8 27 8 19Z" fill="#00c8d7"/>
            <path d="M24 13 L32 13 L32 25 L24 25 L30 19Z" fill="#00c8d7" opacity="0.6"/>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-godi">GODI</span>
          <span class="brand-transportes">TRANSPORTES</span>
        </div>
      </div>

      <div class="brand-divider" />

      <p class="sistema-label">Sistema de Desempenho</p>

      <form @submit.prevent="entrar" class="form">

        <div class="field">
          <label for="email">Email</label>
          <div class="input-wrap">
            <i class="pi pi-envelope input-icon" />
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="seu@email.com"
              autocomplete="email"
              required
            />
          </div>
        </div>

        <div class="field">
          <label for="senha">Senha</label>
          <div class="input-wrap">
            <i class="pi pi-lock input-icon" />
            <input
              id="senha"
              v-model="senha"
              :type="mostrarSenha ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="current-password"
              required
            />
            <button type="button" class="toggle-senha" @click="mostrarSenha = !mostrarSenha" tabindex="-1">
              <i :class="`pi ${mostrarSenha ? 'pi-eye-slash' : 'pi-eye'}`" />
            </button>
          </div>
        </div>

        <p v-if="erro" class="erro">
          <i class="pi pi-exclamation-circle" /> {{ erro }}
        </p>

        <button type="submit" class="btn-entrar" :disabled="carregando">
          <i v-if="carregando" class="pi pi-spin pi-spinner" />
          <span>{{ carregando ? 'Entrando...' : 'Entrar' }}</span>
        </button>

      </form>
    </div>
  </div>
</template>

<style scoped>
/* ── Fundo ── */
.login-bg {
  min-height: 100vh;
  background: #0a0d14;
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(0, 200, 215, 0.06) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(0, 200, 215, 0.04) 0%, transparent 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

/* ── Card ── */
.login-card {
  width: 100%;
  max-width: 380px;
  background: #111827;
  border: 1px solid #1e2d42;
  border-radius: 16px;
  padding: 36px 32px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 200, 215, 0.08);
}

/* ── Brand / Logo ── */
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.brand-icon {
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
  gap: 2px;
}

.brand-godi {
  font-size: 26px;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: 0.04em;
}

.brand-transportes {
  font-size: 9px;
  font-weight: 600;
  color: #00c8d7;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.brand-divider {
  height: 1px;
  background: linear-gradient(90deg, #00c8d7 0%, transparent 100%);
  margin-bottom: 20px;
  opacity: 0.4;
}

/* ── Subtítulo ── */
.sistema-label {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 28px;
}

/* ── Form ── */
.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 13px;
  color: #475569;
  font-size: 13px;
  pointer-events: none;
}

.input-wrap input {
  width: 100%;
  background: #0d1424;
  border: 1px solid #1e3050;
  border-radius: 9px;
  padding: 11px 40px 11px 38px;
  color: #f1f5f9;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.input-wrap input::placeholder {
  color: #334155;
}

.input-wrap input:focus {
  border-color: #00c8d7;
  box-shadow: 0 0 0 3px rgba(0, 200, 215, 0.12);
}

.toggle-senha {
  position: absolute;
  right: 11px;
  background: none;
  border: none;
  cursor: pointer;
  color: #475569;
  font-size: 13px;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.12s;
}
.toggle-senha:hover { color: #00c8d7; }

/* ── Erro ── */
.erro {
  font-size: 12.5px;
  color: #f87171;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
}

/* ── Botão ── */
.btn-entrar {
  width: 100%;
  padding: 12px;
  background: #00c8d7;
  color: #0a0d14;
  border: none;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  letter-spacing: 0.04em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
  transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
  box-shadow: 0 4px 16px rgba(0, 200, 215, 0.25);
}

.btn-entrar:hover:not(:disabled) {
  background: #00daea;
  box-shadow: 0 6px 20px rgba(0, 200, 215, 0.35);
}

.btn-entrar:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-entrar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
