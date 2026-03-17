#!/bin/bash

echo "🚀 Iniciando os containers com Docker Compose..."
docker compose up -d

echo "⏳ Aguardando o banco de dados ficar pronto..."
# Aguarda até que o container do banco esteja saudável (healthcheck definido no docker-compose)
until [ "`docker inspect -f {{.State.Health.Status}} challenge-db`"=="healthy" ]; do
    printf "."
    sleep 2
done

echo -e "\n✅ Banco de dados está pronto!"

echo "🔄 Aplicando migrações do Prisma para criar a estrutura das tabelas..."
# Executa a migração dentro do container da API para garantir que ele alcance o banco
docker exec challenge-api npx prisma migrate deploy

echo "🔍 Verificando logs da API..."
echo "💡 Dica: Pressione Ctrl+C para sair dos logs, a API continuará rodando."
docker logs -f challenge-api
