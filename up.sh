#!/bin/bash

echo "🚀 Iniciando os containers com Docker Compose..."
docker compose up -d

echo "⏳ Aguardando o banco de dados ficar pronto..."
# Aguarda até que o container do banco esteja saudável (healthcheck definido no docker-compose)
# Importante: Espaços são obrigatórios ao redor do == no bash
until [ "$(docker inspect -f '{{.State.Health.Status}}' challenge-db)" == "healthy" ]; do
    printf "."
    sleep 2
done

echo -e "\n✅ Banco de dados está pronto!"

echo "🔄 Aplicando migrações do Prisma para criar a estrutura das tabelas..."
# Executa a migração sem interatividade
npx prisma migrate dev --name init --skip-generate --skip-seed

echo "🏗️ Re-building API para aplicar as mudanças de código..."
docker compose build api
docker compose up -d api

echo "🔍 Verificando logs da API..."
echo "💡 Dica: Pressione Ctrl+C para sair dos logs, a API continuará rodando."
docker logs -f challenge-api
