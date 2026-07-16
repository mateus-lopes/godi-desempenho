import { defineStore } from "pinia";
import { api } from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    sessionChecked: false,
  }),
  actions: {
    async checkSession() {
      try {
        await api.get("/auth/me");
        this.isAuthenticated = true;
      } catch {
        this.isAuthenticated = false;
      } finally {
        this.sessionChecked = true;
      }
    },
    setAuthenticated() {
      this.isAuthenticated = true;
      this.sessionChecked = true;
    },
    async logout() {
      try { await api.post("/auth/logout"); } catch { /* ignora erro de rede */ }
      this.isAuthenticated = false;
    },
  },
});
