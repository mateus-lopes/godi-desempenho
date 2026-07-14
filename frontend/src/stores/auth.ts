import { defineStore } from "pinia";

const TOKEN_STORAGE_KEY = "thiago_auth_token";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem(TOKEN_STORAGE_KEY) as string | null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    },
    logout() {
      this.token = null;
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    },
  },
});
