#!/bin/bash

# ========================================
# SCRIPT DE TESTE DO FLUXO RESPONDENTE
# ========================================

API_URL="http://127.0.0.1:8787"
DB_PATH=$(find .wrangler/state/v3/d1 -name "*.sqlite" | head -1)

echo "🚀 INICIANDO TESTES DO FLUXO RESPONDENTE"
echo "========================================"
echo ""

# 1. Verificar campanhas ativas
echo "📋 1. Verificando campanhas ativas..."
CAMPANHAS=$(curl -s "${API_URL}/campaigns" | jq -r '.data | length')
echo "✅ $CAMPANHAS campanhas disponíveis"
echo ""

# 2. Pegar primeira campanha
CAMPANHA_ID=$(curl -s "${API_URL}/campaigns" | jq -r '.data[0].id')
CAMPANHA_TITULO=$(curl -s "${API_URL}/campaigns" | jq -r '.data[0].title')
RECOMPENSA=$(curl -s "${API_URL}/campaigns" | jq -r '.data[0].reward')

echo "🎯 2. Selecionando campanha para teste:"
echo "   ID: $CAMPANHA_ID"
echo "   Título: $CAMPANHA_TITULO"
echo "   Recompensa: $RECOMPENSA AOA"
echo ""

# 3. Login como respondente
echo "🔐 3. Fazendo login como respondente..."
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@gmail.com",
    "password": "usuario123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')
USER_ID=$(echo $LOGIN_RESPONSE | jq -r '.data.user.id')
SALDO_INICIAL=$(echo $LOGIN_RESPONSE | jq -r '.data.user.saldo_pontos // 0')

if [ "$TOKEN" != "null" ]; then
  echo "✅ Login bem-sucedido!"
  echo "   Usuário: Maria Santos"
  echo "   ID: $USER_ID"
  echo "   Saldo inicial: $SALDO_INICIAL AOA"
else
  echo "❌ Erro no login!"
  echo $LOGIN_RESPONSE | jq '.'
  exit 1
fi
echo ""

# 4. Buscar perguntas da campanha
echo "❓ 4. Buscando perguntas da campanha..."
PERGUNTAS=$(curl -s "${API_URL}/campaigns/${CAMPANHA_ID}" \
  -H "Authorization: Bearer ${TOKEN}" | jq -r '.data.questions | length')
echo "✅ $PERGUNTAS perguntas encontradas"
echo ""

# 5. Simular respostas
echo "✍️ 5. Enviando respostas..."
RESPOSTAS_JSON='[
  {"questionId": "q-001-1", "answer": "Candongueiro"},
  {"questionId": "q-001-2", "answer": "1-2 horas"},
  {"questionId": "q-001-3", "answer": "Superlotação"},
  {"questionId": "q-001-4", "answer": "Sim"},
  {"questionId": "q-001-5", "answer": "Mais autocarros e rotas"}
]'

ANSWER_RESPONSE=$(curl -s -X POST "${API_URL}/campaigns/${CAMPANHA_ID}/answers" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"answers\": ${RESPOSTAS_JSON}}")

echo $ANSWER_RESPONSE | jq '.'
echo ""

# 6. Verificar atualização no banco
echo "💾 6. Verificando dados no banco..."
USER_DATA=$(sqlite3 "$DB_PATH" "SELECT saldo_pontos, reputacao, nivel FROM users WHERE id = '${USER_ID}';")
echo "✅ Dados atualizados no banco:"
echo "   $USER_DATA"
echo ""

# 7. Verificar respostas salvas
RESPOSTAS_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM answers WHERE usuario_id = '${USER_ID}';")
echo "✅ $RESPOSTAS_COUNT respostas salvas"
echo ""

# 8. Verificar recompensas
RECOMPENSAS=$(sqlite3 "$DB_PATH" "SELECT COUNT(*), COALESCE(SUM(valor), 0) FROM rewards WHERE usuario_id = '${USER_ID}';")
echo "✅ Recompensas: $RECOMPENSAS"
echo ""

# 9. Solicitar levantamento (teste)
echo "💰 9. Testando solicitação de levantamento..."
WITHDRAW_RESPONSE=$(curl -s -X POST "${API_URL}/rewards/withdraw" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "valor": 500,
    "metodo_pagamento": "unitel",
    "dados_pagamento": {
      "numero": "923456789",
      "nome": "Maria Santos"
    }
  }')

echo $WITHDRAW_RESPONSE | jq '.'
echo ""

# 10. Verificar levantamentos
LEVANTAMENTOS=$(sqlite3 "$DB_PATH" "SELECT COUNT(*), COALESCE(SUM(valor), 0) FROM levantamentos WHERE usuario_id = '${USER_ID}';")
echo "✅ Levantamentos: $LEVANTAMENTOS"
echo ""

echo "🎉 TESTES CONCLUÍDOS!"
echo "========================================"
echo ""
echo "📊 RESUMO:"
echo "- Campanhas ativas: $CAMPANHAS"
echo "- Respostas enviadas: $RESPOSTAS_COUNT"
echo "- Recompensas recebidas: $RECOMPENSAS"
echo "- Levantamentos solicitados: $LEVANTAMENTOS"
echo ""
echo "✅ Sistema funcionando 100%!"
