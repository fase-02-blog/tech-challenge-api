#!/bin/bash

# Configurações básicas
BASE_URL="http://localhost:3001"
CONTENT_TYPE="Content-Type: application/json"

echo "🧪 Iniciando testes de rotas da API na porta 3001..."

# 1. Health Check
echo -e "\n1. Verificando Health Check..."
curl -s -X GET "$BASE_URL/health" -H "$CONTENT_TYPE" | jq .

# 2. Criar um novo post (e capturar o UUID)
echo -e "\n2. Criando um novo post..."
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/posts" \
  -H "$CONTENT_TYPE" \
  -d '{
    "title": "Post de Teste Automatizado",
    "content": "Este conteúdo deve ter pelo menos dez caracteres.",
    "author": "Bot de Teste"
  }')

echo "$CREATE_RESPONSE" | jq .
UUID=$(echo "$CREATE_RESPONSE" | jq -r '.uuid')

if [ "$UUID" == "null" ] || [ -z "$UUID" ]; then
  echo "❌ Erro ao criar post ou capturar UUID!"
  exit 1
fi

echo "✅ Post criado com UUID: $UUID"

# 3. Listar todos os posts
echo -e "\n3. Listando todos os posts..."
curl -s -X GET "$BASE_URL/posts" -H "$CONTENT_TYPE" | jq .

# 4. Buscar post pelo UUID
echo -e "\n4. Buscando post pelo UUID: $UUID..."
curl -s -X GET "$BASE_URL/posts/$UUID" -H "$CONTENT_TYPE" | jq .

# 5. Pesquisar posts (Search)
echo -e "\n5. Pesquisando por 'Automatizado'..."
curl -s -X GET "$BASE_URL/posts/search?q=Automatizado" -H "$CONTENT_TYPE" | jq .

# 6. Atualizar post
echo -e "\n6. Atualizando o post criado..."
curl -s -X PUT "$BASE_URL/posts/$UUID" \
  -H "$CONTENT_TYPE" \
  -d '{
    "title": "Post Atualizado via Script",
    "content": "Novo conteúdo atualizado com sucesso.",
    "author": "Bot de Teste Modificado"
  }' | jq .

# 7. Testar Erro de Validação (Título curto)
echo -e "\n7. Testando Erro de Validação (Título curto)..."
curl -s -X POST "$BASE_URL/posts" \
  -H "$CONTENT_TYPE" \
  -d '{
    "title": "Oi",
    "content": "Muito curto",
    "author": "Eu"
  }' | jq .

# 8. Deletar post
echo -e "\n8. Deletando o post criado..."
DELETE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE_URL/posts/$UUID")
if [ "$DELETE_STATUS" == "204" ] || [ "$DELETE_STATUS" == "200" ]; then
  echo "✅ Post deletado com sucesso (Status: $DELETE_STATUS)"
else
  echo "❌ Erro ao deletar post (Status: $DELETE_STATUS)"
fi

echo -e "\n🏁 Testes finalizados!"
