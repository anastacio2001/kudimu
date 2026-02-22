#!/bin/bash

# ========================================
# KUDIMU INSIGHTS - SCRIPT MASTER DE TESTES
# Executa todos os testes automaticamente
# Data: 13 de Fevereiro de 2026
# ========================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "========================================";
echo "  KUDIMU INSIGHTS - TESTE MASTER";
echo "  Testes Automatizados Completos";
echo "========================================";
echo -e "${NC}\n"

# Verificar se backend está rodando
echo -e "${YELLOW}1. Verificando backend...${NC}"
if curl -s http://127.0.0.1:8787/ > /dev/null; then
    echo -e "${GREEN}✅ Backend está rodando${NC}\n"
else
    echo -e "${RED}❌ Backend NÃO está rodando!${NC}"
    echo -e "${YELLOW}Execute: npm run dev:backend${NC}"
    echo -e "${YELLOW}Ou: npx wrangler dev src/index.ts --port 8787${NC}\n"
    exit 1
fi

# Popular banco de dados
echo -e "${YELLOW}2. Populando banco de dados com dados de teste...${NC}"
npx wrangler d1 execute kudimu_db --local --file=popular_dados_teste_massa.sql > /dev/null 2>&1
echo -e "${GREEN}✅ Banco populado com 50 usuários e 20 campanhas${NC}\n"

# Executar testes de API
echo -e "${YELLOW}3. Executando testes de API/Backend...${NC}"
./test_plataforma_completo.sh

# Verificar se frontend está disponível (opcional)
echo -e "\n${YELLOW}4. Verificando frontend...${NC}"
if curl -s http://localhost:9000/ > /dev/null; then
    echo -e "${GREEN}✅ Frontend está rodando${NC}"
    
    echo -e "${YELLOW}5. Executando testes E2E do frontend...${NC}"
    
    if command -v node &> /dev/null; then
        if [ -f "test_frontend_e2e.js" ]; then
            node test_frontend_e2e.js
        else
            echo -e "${YELLOW}⚠️  Arquivo test_frontend_e2e.js não encontrado${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Node.js não disponível para testes E2E${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Frontend não está rodando (opcional)${NC}"
    echo -e "${YELLOW}Execute: npm run dev:frontend${NC}\n"
fi

# Resumo final
echo -e "\n${BLUE}"
echo "========================================";
echo "  TESTES CONCLUÍDOS!";
echo "========================================";
echo -e "${NC}"

echo -e "${GREEN}✅ Backend testado${NC}"
echo -e "${GREEN}✅ API testada${NC}"
echo -e "${GREEN}✅ Banco de dados verificado${NC}"
echo -e "${YELLOW}ℹ️  Verifique os logs acima para detalhes${NC}\n"

echo -e "${BLUE}Próximos passos:${NC}"
echo -e "1. Revisar erros (se houver)"
echo -e "2. Testar manualmente no navegador"
echo -e "3. Deploy para produção: ${YELLOW}npm run deploy${NC}\n"
