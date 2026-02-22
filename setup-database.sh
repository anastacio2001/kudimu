#!/bin/bash

echo "🗄️  KUDIMU - Configuração do Banco de Dados D1"
echo "=============================================="
echo ""

# 1. Criar banco D1 (se não existir)
echo "📦 Verificando banco de dados..."
npx wrangler d1 list | grep -q "kudimu-db" || {
    echo "🆕 Criando banco kudimu-db..."
    npx wrangler d1 create kudimu-db
}

# 2. Aplicar schema
echo ""
echo "📋 Aplicando schema do banco..."
npx wrangler d1 execute kudimu-db --local --file=./schema.sql

# 3. Inicializar dados
echo ""
echo "🌱 Populando banco com dados iniciais..."
npx wrangler d1 execute kudimu-db --local --file=./init-database.sql

# 4. Verificar dados
echo ""
echo "✅ Verificando dados inseridos..."
npx wrangler d1 execute kudimu-db --local --command="SELECT COUNT(*) as total_users FROM users"
npx wrangler d1 execute kudimu-db --local --command="SELECT COUNT(*) as total_campaigns FROM campanhas"
npx wrangler d1 execute kudimu-db --local --command="SELECT COUNT(*) as total_clients FROM clientes"

echo ""
echo "✅ Banco de dados configurado com sucesso!"
echo ""
echo "🚀 Próximo passo: npm run dev"
