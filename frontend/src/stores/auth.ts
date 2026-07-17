import { defineStore } from "pinia";
import { api } from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    sessionChecked: false,
    role: null as string | null,
  }),
  getters: {
    isAdmin: (state) => state.role === 'admin',
  },
  actions: {
    async checkSession() {
      try {
        const { data } = await api.get("/auth/me");
        this.isAuthenticated = true;
        this.role = data.role ?? null;
      } catch {
        this.isAuthenticated = false;
        this.role = null;
      } finally {
        this.sessionChecked = true;
      }
    },
    setAuthenticated(role?: string) {
      this.isAuthenticated = true;
      this.sessionChecked = true;
      this.role = role ?? null;
    },
    async logout() {
      try { await api.post("/auth/logout"); } catch { /* ignora erro de rede */ }
      this.isAuthenticated = false;
      this.role = null;
    },
  },
});
