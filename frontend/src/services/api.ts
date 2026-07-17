import axios from "axios";

function resolveBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
  // Garante que URLs sem protocolo não virem caminhos relativos
  if (raw && !raw.startsWith("http")) return `https://${raw}`;
  return raw;
}

export const api = axios.create({
  baseURL: resolveBaseUrl(),
  withCredentials: true,
});
