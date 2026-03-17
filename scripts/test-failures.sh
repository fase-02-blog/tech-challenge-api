#!/bin/bash

# Configurações básicas
BASE_URL="http://localhost:3001"
CONTENT_TYPE="Content-Type: application/json"

echo "🧪 Iniciando testes de CENÁRIOS DE FALHA na porta 3001..."

# 1. Validação: Título muito curto
echo -e "\n1. Testando Título muito curto (Mínimo 3)..."
curl -s -X POST "$BASE_URL/posts" -H "$CONTENT_TYPE" \
  -d '{"title": "Oi", "content": "Conteúdo com mais de dez caracteres", "author": "Autor"}' | jq .

# 2. Validação: Conteúdo muito curto
echo -e "\n2. Testando Conteúdo muito curto (Mínimo 10)..."
curl -s -X POST "$BASE_URL/posts" -H "$CONTENT_TYPE" \
  -d '{"title": "Título Válido", "content": "Curto", "author": "Autor"}' | jq .

# 3. Validação: Autor muito curto
echo -e "\n3. Testando Autor muito curto (Mínimo 2)..."
curl -s -X POST "$BASE_URL/posts" -H "$CONTENT_TYPE" \
  -d '{"title": "Título Válido", "content": "Conteúdo com mais de dez caracteres", "author": "A"}' | jq .

# 4. Validação: Campos Faltantes
echo -e "\n4. Testando Campos Faltantes..."
curl -s -X POST "$BASE_URL/posts" -H "$CONTENT_TYPE" \
  -d '{"title": "Título Válido"}' | jq .

# 5. Validação: Atualização sem campos (Objeto vazio)
echo -e "\n5. Testando Atualização sem nenhum campo..."
UUID_FAKE="00000000-0000-0000-0000-000000000000"
curl -s -X PUT "$BASE_URL/posts/$UUID_FAKE" -H "$CONTENT_TYPE" -d '{}' | jq .

# 6. Erro 404: Buscar post que não existe
echo -e "\n6. Testando Buscar post inexistente (404)..."
curl -s -i -X GET "$BASE_URL/posts/$UUID_FAKE" -H "$CONTENT_TYPE" | grep "HTTP/"

# 7. Erro 404: Atualizar post que não existe
echo -e "\n7. Testando Atualizar post inexistente (404)..."
curl -s -i -X PUT "$BASE_URL/posts/$UUID_FAKE" -H "$CONTENT_TYPE" \
  -d '{"title": "Novo Título"}' | grep "HTTP/"

# 8. Erro 404: Deletar post que não existe
echo -e "\n8. Testando Deletar post inexistente (404)..."
curl -s -i -X DELETE "$BASE_URL/posts/$UUID_FAKE" -H "$CONTENT_TYPE" | grep "HTTP/"

# 9. Erro 400: JSON Malformado
echo -e "\n9. Testando JSON Malformado (Bad Request)..."
curl -s -i -X POST "$BASE_URL/posts" -H "$CONTENT_TYPE" -d '{"title": "Título", "content": "Conteúdo..."' | grep "HTTP/"

echo -e "\n🏁 Testes de falha finalizados!"
