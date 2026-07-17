#!/bin/sh
set -e

if [ -z "$BACKEND_URL" ]; then
  echo "[entrypoint] ERRO: variável BACKEND_URL não definida."
  echo "  Defina BACKEND_URL=https://<seu-backend>.railway.app no serviço do frontend."
  exit 1
fi

# Idempotente: substitui qualquer número após "listen " — evita acúmulo em restarts
sed -i "s/listen [0-9]*/listen ${PORT:-80}/g" /etc/nginx/conf.d/default.conf

# Injeta URL real do backend no bloco proxy_pass
sed -i "s|__BACKEND_URL__|${BACKEND_URL}|g" /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
