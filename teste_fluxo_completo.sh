#!/bin/bash
echo "=== TESTE FLUXO COMPLETO: Responder → Ganhar Pontos → Solicitar Levantamento ==="
echo ""

# 1. Login do respondente
echo "1️⃣  LOGIN..."
TOKEN=$(curl -s -X POST http://localhost:8787/auth/login \
  -H "Content-Type: application/json" \
  --data '{"email":"joao.manuel@gmail.com","password":"usuario123"}' \
  | jq -r '.data.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ ERRO: Login falhou"
  exit 1
fi
echo "✅ Token obtido: ${TOKEN:0:30}..."
echo ""

# 2. Ver saldo inicial
echo "2️⃣  SALDO INICIAL..."
SALDO_INICIAL=$(curl -s http://localhost:8787/auth/me \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.data.saldo_pontos')
echo "�� Saldo: $SALDO_INICIAL AOA"
echo ""

# 3. Listar campanhas disponíveis
echo "3️⃣  CAMPANHAS DISPONÍVEIS..."
CAMPANHA_ID=$(curl -s http://localhost:8787/campaigns \
  | jq -r '.data[0].id')
RECOMPENSA=$(curl -s http://localhost:8787/campaigns \
  | jq -r '.data[0].reward')
echo "📋 Campanha: $CAMPANHA_ID"
echo "💵 Recompensa: $RECOMPENSA AOA"
echo ""

# 4. Responder questionário
echo "4️⃣  RESPONDENDO QUESTIONÁRIO..."
curl -s -X POST "http://localhost:8787/campaigns/$CAMPANHA_ID/answers" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "answers": [
      {"questionId": "q1", "answer": "Sim"},
      {"questionId": "q2", "answer": "Muito bom"},
      {"questionId": "q3", "answer": "5"}
    ]
  }' | jq '.success, .data.recompensa'
echo ""

# 5. Ver saldo após responder
echo "5️⃣  SALDO APÓS RESPONDER..."
sleep 1
SALDO_FINAL=$(curl -s http://localhost:8787/auth/me \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.data.saldo_pontos')
echo "💰 Saldo: $SALDO_FINAL AOA"
GANHO=$((SALDO_FINAL - SALDO_INICIAL))
echo "📈 Ganhou: +$GANHO AOA"
echo ""

# 6. Ver histórico de recompensas
echo "6️⃣  HISTÓRICO DE RECOMPENSAS..."
curl -s http://localhost:8787/rewards/me \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data | length'
echo ""

# 7. Solicitar levantamento
echo "7️⃣  SOLICITANDO LEVANTAMENTO..."
VALOR_LEVANTAMENTO=1000
curl -s -X POST http://localhost:8787/withdrawals \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data "{
    \"valor\": $VALOR_LEVANTAMENTO,
    \"metodo_pagamento\": \"multicaixa\",
    \"dados_pagamento\": {
      \"iban\": \"AO06.0000.0000.0000.0000.0001.2345\",
      \"nome\": \"João Pedro Manuel\"
    }
  }" | jq '.success, .data.status'
echo ""

# 8. Ver levantamentos
echo "8️⃣  MEUS LEVANTAMENTOS..."
curl -s http://localhost:8787/withdrawals/me \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data | length'
echo ""

echo "✅ TESTE COMPLETO!"
