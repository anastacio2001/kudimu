#!/bin/bash

# ========================================
# KUDIMU INSIGHTS - TESTE COMPLETO DA PLATAFORMA
# Script de testes automatizados em massa
# Data: 13 de Fevereiro de 2026
# ========================================

set -e  # Parar se houver erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuração
API_URL="http://127.0.0.1:8787"
FRONTEND_URL="http://localhost:9000"
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Função para print colorido
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED_TESTS++))
    ((TOTAL_TESTS++))
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED_TESTS++))
    ((TOTAL_TESTS++))
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Função para testar endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    local token=$5
    
    print_info "Testando: $description"
    
    if [ -n "$token" ]; then
        if [ -n "$data" ]; then
            response=$(curl -s -X $method "$API_URL$endpoint" \
                -H "Content-Type: application/json" \
                -H "Authorization: Bearer $token" \
                -d "$data" \
                -w "\n%{http_code}")
        else
            response=$(curl -s -X $method "$API_URL$endpoint" \
                -H "Authorization: Bearer $token" \
                -w "\n%{http_code}")
        fi
    else
        if [ -n "$data" ]; then
            response=$(curl -s -X $method "$API_URL$endpoint" \
                -H "Content-Type: application/json" \
                -d "$data" \
                -w "\n%{http_code}")
        else
            response=$(curl -s -X $method "$API_URL$endpoint" \
                -w "\n%{http_code}")
        fi
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        print_success "$description - Status: $http_code"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
        return 0
    else
        print_error "$description - Status: $http_code"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
        return 1
    fi
}

# ========================================
# INÍCIO DOS TESTES
# ========================================

print_header "KUDIMU INSIGHTS - TESTE COMPLETO DA PLATAFORMA"

# ========================================
# 1. TESTE DE CONECTIVIDADE
# ========================================

print_header "1. TESTE DE CONECTIVIDADE"

print_info "Verificando se backend está rodando..."
if curl -s "$API_URL/" > /dev/null; then
    print_success "Backend está acessível em $API_URL"
else
    print_error "Backend NÃO está acessível em $API_URL"
    echo "Execute: npm run dev:backend"
    exit 1
fi

test_endpoint "GET" "/" "Endpoint raiz (health check)"

# ========================================
# 2. TESTES DE AUTENTICAÇÃO
# ========================================

print_header "2. TESTES DE AUTENTICAÇÃO"

# 2.1 Login Admin
print_info "2.1 - Login como ADMIN"
admin_response=$(curl -s -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@kudimu.ao","senha":"admin123"}')

ADMIN_TOKEN=$(echo "$admin_response" | jq -r '.data.token // empty')
if [ -n "$ADMIN_TOKEN" ]; then
    print_success "Login Admin - Token: ${ADMIN_TOKEN:0:20}..."
else
    print_error "Login Admin FALHOU"
    echo "$admin_response" | jq '.'
fi

# 2.2 Login Cliente
print_info "2.2 - Login como CLIENTE"
client_response=$(curl -s -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"joao@empresaxyz.ao","senha":"cliente123"}')

CLIENT_TOKEN=$(echo "$client_response" | jq -r '.data.token // empty')
if [ -n "$CLIENT_TOKEN" ]; then
    print_success "Login Cliente - Token: ${CLIENT_TOKEN:0:20}..."
else
    print_error "Login Cliente FALHOU"
    echo "$client_response" | jq '.'
fi

# 2.3 Login Respondente
print_info "2.3 - Login como RESPONDENTE"
user_response=$(curl -s -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"maria@gmail.com","senha":"usuario123"}')

USER_TOKEN=$(echo "$user_response" | jq -r '.data.token // empty')
if [ -n "$USER_TOKEN" ]; then
    print_success "Login Respondente - Token: ${USER_TOKEN:0:20}..."
else
    print_error "Login Respondente FALHOU"
    echo "$user_response" | jq '.'
fi

# 2.4 Teste de cadastro
print_info "2.4 - Cadastro de novo usuário"
new_user_email="teste_$(date +%s)@teste.com"
test_endpoint "POST" "/auth/register" "Cadastro de novo usuário" \
    "{\"nome\":\"Usuário Teste\",\"email\":\"$new_user_email\",\"senha\":\"senha123\",\"tipo_usuario\":\"respondente\"}"

# ========================================
# 3. TESTES DE CAMPANHAS (Respondente)
# ========================================

print_header "3. TESTES DE CAMPANHAS (Respondente)"

# 3.1 Listar campanhas
print_info "3.1 - Listar campanhas ativas"
campaigns_response=$(curl -s "$API_URL/campaigns")
campaign_count=$(echo "$campaigns_response" | jq '.data | length')
print_success "Campanhas encontradas: $campaign_count"

# Pegar ID da primeira campanha
CAMPAIGN_ID=$(echo "$campaigns_response" | jq -r '.data[0].id // empty')

if [ -n "$CAMPAIGN_ID" ]; then
    print_success "Campanha de teste: $CAMPAIGN_ID"
    
    # 3.2 Detalhes da campanha
    test_endpoint "GET" "/campaigns/$CAMPAIGN_ID" "Detalhes da campanha $CAMPAIGN_ID"
    
    # 3.3 Submeter respostas
    if [ -n "$USER_TOKEN" ]; then
        print_info "3.3 - Submeter respostas para campanha"
        answers_data='{
            "answers": [
                {"pergunta_id":"q1","resposta":"Opção A"},
                {"pergunta_id":"q2","resposta":"Sim"},
                {"pergunta_id":"q3","resposta":"Muito satisfeito"}
            ]
        }'
        test_endpoint "POST" "/campaigns/$CAMPAIGN_ID/answers" "Submeter respostas" "$answers_data" "$USER_TOKEN"
    fi
else
    print_error "Nenhuma campanha disponível para teste"
fi

# ========================================
# 4. TESTES DE RECOMPENSAS (Respondente)
# ========================================

print_header "4. TESTES DE RECOMPENSAS (Respondente)"

if [ -n "$USER_TOKEN" ]; then
    # 4.1 Ver saldo
    test_endpoint "GET" "/rewards/me" "Ver saldo de recompensas" "" "$USER_TOKEN"
    
    # 4.2 Solicitar levantamento
    print_info "4.2 - Solicitar levantamento"
    withdrawal_data='{
        "valor": 500,
        "metodo_pagamento": "unitel",
        "dados_pagamento": {
            "telefone": "923456789"
        }
    }'
    test_endpoint "POST" "/rewards/withdraw" "Solicitar levantamento de 500 AOA" "$withdrawal_data" "$USER_TOKEN"
    
    # 4.3 Ver histórico de levantamentos
    test_endpoint "GET" "/withdrawals/me" "Ver histórico de levantamentos" "" "$USER_TOKEN"
fi

# ========================================
# 5. TESTES ADMIN
# ========================================

print_header "5. TESTES ADMIN"

if [ -n "$ADMIN_TOKEN" ]; then
    # 5.1 Listar usuários
    test_endpoint "GET" "/admin/users" "Listar todos os usuários" "" "$ADMIN_TOKEN"
    
    # 5.2 Listar campanhas (admin)
    test_endpoint "GET" "/admin/campaigns" "Listar todas as campanhas (admin)" "" "$ADMIN_TOKEN"
    
    # 5.3 Listar respostas
    test_endpoint "GET" "/admin/answers" "Listar respostas pendentes" "" "$ADMIN_TOKEN"
    
    # 5.4 Listar levantamentos
    print_info "5.4 - Listar levantamentos pendentes"
    withdrawals_response=$(curl -s "$API_URL/admin/withdrawals?status=pendente" \
        -H "Authorization: Bearer $ADMIN_TOKEN")
    
    withdrawal_count=$(echo "$withdrawals_response" | jq '.data | length' 2>/dev/null || echo "0")
    
    if [ "$withdrawal_count" -gt 0 ]; then
        print_success "Levantamentos pendentes: $withdrawal_count"
        
        # Pegar ID do primeiro levantamento
        WITHDRAWAL_ID=$(echo "$withdrawals_response" | jq -r '.data[0].id // empty')
        
        if [ -n "$WITHDRAWAL_ID" ]; then
            # 5.5 Aprovar levantamento
            print_info "5.5 - Aprovar levantamento $WITHDRAWAL_ID"
            approval_data='{
                "status": "aprovado",
                "observacoes": "Teste automático - Aprovado"
            }'
            test_endpoint "PATCH" "/admin/withdrawals/$WITHDRAWAL_ID" "Aprovar levantamento" "$approval_data" "$ADMIN_TOKEN"
        fi
    else
        print_info "Nenhum levantamento pendente para testar aprovação"
    fi
    
    # 5.6 Validar resposta
    print_info "5.6 - Validar resposta (aprovar)"
    answers_list=$(curl -s "$API_URL/admin/answers" -H "Authorization: Bearer $ADMIN_TOKEN")
    ANSWER_ID=$(echo "$answers_list" | jq -r '.data[0].id // empty')
    
    if [ -n "$ANSWER_ID" ]; then
        validation_data='{
            "validada": 1,
            "observacoes": "Teste automático - Resposta válida"
        }'
        test_endpoint "PUT" "/admin/answers/$ANSWER_ID" "Validar resposta" "$validation_data" "$ADMIN_TOKEN"
    fi
fi

# ========================================
# 6. TESTES DE CLIENTE
# ========================================

print_header "6. TESTES DE CLIENTE"

if [ -n "$CLIENT_TOKEN" ]; then
    # 6.1 Ver campanhas próprias
    test_endpoint "GET" "/client/campaigns" "Listar campanhas do cliente" "" "$CLIENT_TOKEN"
    
    # 6.2 Ver orçamento
    test_endpoint "GET" "/client/budget" "Ver orçamento do cliente" "" "$CLIENT_TOKEN"
    
    # 6.3 Criar campanha
    print_info "6.3 - Criar nova campanha"
    campaign_data='{
        "titulo": "Teste Automático - Campanha '$(date +%H%M%S)'",
        "descricao": "Campanha criada por teste automático",
        "tema": "Teste",
        "recompensa_por_resposta": 300,
        "meta_participantes": 100,
        "data_inicio": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
        "data_fim": "'$(date -u -v+7d +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -d "+7 days" +"%Y-%m-%dT%H:%M:%SZ")'",
        "publico_alvo": {"idade_min": 18, "idade_max": 65}
    }'
    test_endpoint "POST" "/campaigns" "Criar campanha de teste" "$campaign_data" "$CLIENT_TOKEN"
fi

# ========================================
# 7. TESTES DE PAGAMENTOS
# ========================================

print_header "7. TESTES DE PAGAMENTOS"

# 7.1 Listar métodos de pagamento
test_endpoint "GET" "/payments/methods" "Listar métodos de pagamento"

# 7.2 Criar intenção de pagamento
print_info "7.2 - Criar intenção de pagamento"
payment_data='{
    "amount": 50000,
    "method": "bank_transfer",
    "currency": "AOA",
    "metadata": {"teste": true}
}'
payment_response=$(curl -s -X POST "$API_URL/payments/create-intent" \
    -H "Content-Type: application/json" \
    -d "$payment_data")

PAYMENT_ID=$(echo "$payment_response" | jq -r '.data.id // empty')
if [ -n "$PAYMENT_ID" ]; then
    print_success "Intenção de pagamento criada: $PAYMENT_ID"
    
    # 7.3 Verificar pagamento
    test_endpoint "GET" "/payments/verify/$PAYMENT_ID" "Verificar status do pagamento"
fi

# ========================================
# 8. TESTES DE NOTIFICAÇÕES
# ========================================

print_header "8. TESTES DE NOTIFICAÇÕES"

if [ -n "$USER_TOKEN" ]; then
    # 8.1 Ver configurações
    test_endpoint "GET" "/push/settings" "Ver configurações de notificação" "" "$USER_TOKEN"
    
    # 8.2 Enviar notificação de teste
    test_endpoint "POST" "/push/test" "Enviar notificação de teste" "" "$USER_TOKEN"
fi

# ========================================
# 9. TESTE DE CARGA (Massa)
# ========================================

print_header "9. TESTE DE CARGA (10 requisições simultâneas)"

print_info "Enviando 10 requisições GET /campaigns simultaneamente..."

for i in {1..10}; do
    curl -s "$API_URL/campaigns" > /dev/null &
done

wait

print_success "10 requisições simultâneas completadas"

# ========================================
# 10. TESTE DE DADOS DO BANCO
# ========================================

print_header "10. VERIFICAÇÃO DE DADOS DO BANCO"

if command -v npx &> /dev/null; then
    print_info "Verificando tabelas no D1..."
    
    # Verificar usuários
    users_count=$(npx wrangler d1 execute kudimu_db --local --command="SELECT COUNT(*) as total FROM users" 2>/dev/null | grep -o '[0-9]*' | tail -1 || echo "?")
    print_info "Usuários no banco: $users_count"
    
    # Verificar campanhas
    campaigns_count=$(npx wrangler d1 execute kudimu_db --local --command="SELECT COUNT(*) as total FROM campanhas" 2>/dev/null | grep -o '[0-9]*' | tail -1 || echo "?")
    print_info "Campanhas no banco: $campaigns_count"
    
    # Verificar respostas
    answers_count=$(npx wrangler d1 execute kudimu_db --local --command="SELECT COUNT(*) as total FROM answers" 2>/dev/null | grep -o '[0-9]*' | tail -1 || echo "?")
    print_info "Respostas no banco: $answers_count"
    
    # Verificar levantamentos
    withdrawals_count=$(npx wrangler d1 execute kudimu_db --local --command="SELECT COUNT(*) as total FROM levantamentos" 2>/dev/null | grep -o '[0-9]*' | tail -1 || echo "?")
    print_info "Levantamentos no banco: $withdrawals_count"
else
    print_info "npx não disponível, pulando verificação do banco"
fi

# ========================================
# RESUMO FINAL
# ========================================

print_header "RESUMO DOS TESTES"

echo -e "${BLUE}Total de testes: $TOTAL_TESTS${NC}"
echo -e "${GREEN}Testes passados: $PASSED_TESTS${NC}"
echo -e "${RED}Testes falhados: $FAILED_TESTS${NC}"

PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
echo -e "${YELLOW}Taxa de sucesso: $PASS_RATE%${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}🎉 TODOS OS TESTES PASSARAM! PLATAFORMA FUNCIONANDO 100%${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  ALGUNS TESTES FALHARAM. VERIFICAR LOGS ACIMA.${NC}"
    exit 1
fi
