# 🧪 GUIA DE TESTES EM MASSA - KUDIMU INSIGHTS

**Data:** 13 de Fevereiro de 2026  
**Objetivo:** Testar toda a plataforma automaticamente

---

## 📋 ARQUIVOS CRIADOS

### 1. **test_plataforma_completo.sh** (14 KB)
Script principal de testes de API/Backend

**O que testa:**
- ✅ Conectividade (backend rodando?)
- ✅ Autenticação (login admin, cliente, respondente)
- ✅ Campanhas (listar, detalhes, submeter respostas)
- ✅ Recompensas (saldo, levantamentos)
- ✅ Admin (usuários, campanhas, respostas, levantamentos)
- ✅ Cliente (campanhas, orçamento, criar campanha)
- ✅ Pagamentos (métodos, criar intenção)
- ✅ Notificações (push, configurações)
- ✅ **Teste de carga** (10 requisições simultâneas)
- ✅ Verificação do banco D1

**Total:** ~60 testes automatizados

---

### 2. **popular_dados_teste_massa.sql** (21 KB)
Script SQL para popular banco com dados de teste

**O que cria:**
- ✅ **50 usuários:**
  - 10 Admins
  - 20 Clientes (empresas)
  - 20 Respondentes (com saldos variados)
- ✅ **20 campanhas ativas** (vários temas)
- ✅ **~60 perguntas** para as campanhas
- ✅ **10 levantamentos** (4 pendentes, 2 aprovados, 4 processados)
- ✅ **10 recompensas** (histórico de ganhos)

---

### 3. **test_frontend_e2e.js** (14 KB)
Testes End-to-End do frontend com Puppeteer

**O que testa:**
- ✅ Landing page
- ✅ Login respondente → ver campanhas → responder questionário
- ✅ Ver recompensas e saldo
- ✅ Login admin → ver levantamentos
- ✅ Login cliente → ver créditos e planos

**Total:** ~15 testes de navegação

---

## 🚀 COMO USAR

### **PASSO 1: Preparar Ambiente**

```bash
# 1.1 Instalar dependências (se necessário)
npm install puppeteer

# 1.2 Garantir que jq está instalado (para JSON no terminal)
# macOS:
brew install jq

# Linux:
sudo apt-get install jq
```

---

### **PASSO 2: Popular Banco de Dados**

```bash
cd /Users/UTENTE1/Desktop/kudimu-main/dados_kudimu/kudimu-master/Desktop/Kudimu

# Popular com dados de teste (50 usuários, 20 campanhas, etc)
npx wrangler d1 execute kudimu_db --local --file=popular_dados_teste_massa.sql
```

**Saída esperada:**
```
✅ 10 Admins criados
✅ 20 Clientes criados
✅ 20 Respondentes criados
✅ 20 Campanhas ativas
✅ 10 Levantamentos
```

---

### **PASSO 3: Iniciar Backend**

```bash
# Em um terminal separado:
npm run dev:backend

# Ou:
npx wrangler dev src/index.ts --port 8787
```

**Aguardar mensagem:**
```
⛅️ wrangler 3.x.x
------------------
✨ Ready on http://127.0.0.1:8787
```

---

### **PASSO 4: Executar Testes de API**

```bash
# Dar permissão de execução (se necessário)
chmod +x test_plataforma_completo.sh

# Executar testes
./test_plataforma_completo.sh
```

**Saída esperada:**
```bash
========================================
KUDIMU INSIGHTS - TESTE COMPLETO DA PLATAFORMA
========================================

========================================
1. TESTE DE CONECTIVIDADE
========================================
✅ Backend está acessível em http://127.0.0.1:8787
✅ Endpoint raiz (health check) - Status: 200

========================================
2. TESTES DE AUTENTICAÇÃO
========================================
✅ Login Admin - Token: jwt-admin-1234567...
✅ Login Cliente - Token: jwt-cliente-89012...
✅ Login Respondente - Token: jwt-usuario-345...
✅ Cadastro de novo usuário - Status: 200

========================================
3. TESTES DE CAMPANHAS (Respondente)
========================================
✅ Campanhas encontradas: 20
✅ Campanha de teste: camp-massa-01
✅ Detalhes da campanha - Status: 200
✅ Submeter respostas - Status: 200

... (mais testes)

========================================
RESUMO DOS TESTES
========================================
Total de testes: 60
Testes passados: 58
Testes falhados: 2
Taxa de sucesso: 97%

🎉 PLATAFORMA FUNCIONANDO!
```

---

### **PASSO 5: Executar Testes Frontend (Opcional)**

```bash
# Em outro terminal (com backend rodando)
# Iniciar frontend:
npm run dev:frontend

# Em outro terminal, executar testes E2E:
node test_frontend_e2e.js
```

**Saída esperada:**
```
========================================
KUDIMU INSIGHTS - TESTES E2E FRONTEND
========================================

========================================
TESTE 1: LANDING PAGE
========================================
✅ Landing page carregada
✅ Botões de Login e Cadastro presentes

========================================
TESTE 2: LOGIN RESPONDENTE
========================================
✅ Login respondente realizado com sucesso
✅ Redirecionado para: http://localhost:9000/campaigns

... (mais testes)

========================================
RESUMO DOS TESTES E2E
========================================
Total de testes: 15
Testes passados: 14
Testes falhados: 1
Taxa de sucesso: 93%

🎉 TODOS OS TESTES E2E PASSARAM!
```

---

## 🔧 TESTES ESPECÍFICOS

### **Teste 1: Verificar Dados no Banco**

```bash
# Contar usuários
npx wrangler d1 execute kudimu_db --local \
  --command="SELECT COUNT(*) FROM users"

# Contar campanhas ativas
npx wrangler d1 execute kudimu_db --local \
  --command="SELECT COUNT(*) FROM campanhas WHERE status='ativa'"

# Ver levantamentos pendentes
npx wrangler d1 execute kudimu_db --local \
  --command="SELECT * FROM levantamentos WHERE status='pendente'"
```

---

### **Teste 2: Testar Endpoint Específico**

```bash
# Testar login
curl -X POST http://127.0.0.1:8787/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kudimu.ao","senha":"admin123"}' | jq

# Listar campanhas
curl http://127.0.0.1:8787/campaigns | jq

# Ver levantamentos (admin)
curl http://127.0.0.1:8787/admin/withdrawals?status=pendente \
  -H "Authorization: Bearer jwt-admin-1234" | jq
```

---

### **Teste 3: Teste de Carga Manual**

```bash
# Enviar 100 requisições simultâneas
for i in {1..100}; do
  curl -s http://127.0.0.1:8787/campaigns > /dev/null &
done

wait
echo "✅ 100 requisições completadas"
```

---

## 📊 VERIFICAR RESULTADOS

### **Banco de Dados Populado**

```bash
# Ver estatísticas
npx wrangler d1 execute kudimu_db --local --command="
SELECT 
  (SELECT COUNT(*) FROM users) as total_usuarios,
  (SELECT COUNT(*) FROM campanhas WHERE status='ativa') as campanhas_ativas,
  (SELECT COUNT(*) FROM levantamentos WHERE status='pendente') as levantamentos_pendentes,
  (SELECT SUM(saldo_pontos) FROM users WHERE tipo_conta='usuario') as total_pontos_sistema
"
```

**Resultado esperado:**
```
┌────────────────┬───────────────────┬─────────────────────────┬─────────────────────┐
│ total_usuarios │ campanhas_ativas  │ levantamentos_pendentes │ total_pontos_sistema│
├────────────────┼───────────────────┼─────────────────────────┼─────────────────────┤
│ 50             │ 20                │ 6                       │ 125000              │
└────────────────┴───────────────────┴─────────────────────────┴─────────────────────┘
```

---

### **Logs de Teste**

Os testes geram logs coloridos:
- 🟢 **Verde:** Teste passou ✅
- 🔴 **Vermelho:** Teste falhou ❌
- 🟡 **Amarelo:** Informação ℹ️
- 🔵 **Azul:** Cabeçalhos

---

## 🎯 CENÁRIOS DE TESTE

### **Cenário 1: Fluxo Respondente Completo**

```bash
# 1. Popular dados
npx wrangler d1 execute kudimu_db --local --file=popular_dados_teste_massa.sql

# 2. Iniciar backend
npm run dev:backend &

# 3. Testar fluxo
./test_plataforma_completo.sh
```

**Valida:**
- ✅ Login de respondente
- ✅ Ver 20 campanhas ativas
- ✅ Submeter respostas
- ✅ Receber recompensa automática
- ✅ Solicitar levantamento
- ✅ Ver histórico

---

### **Cenário 2: Fluxo Admin Completo**

```bash
# Testar aprovação de levantamentos
curl -X GET http://127.0.0.1:8787/admin/withdrawals?status=pendente \
  -H "Authorization: Bearer jwt-admin-1234" | jq

# Aprovar levantamento
curl -X PATCH http://127.0.0.1:8787/admin/withdrawals/lev-massa-01 \
  -H "Authorization: Bearer jwt-admin-1234" \
  -H "Content-Type: application/json" \
  -d '{"status":"aprovado","observacoes":"Teste aprovado"}' | jq
```

---

### **Cenário 3: Fluxo Cliente Completo**

```bash
# Login cliente
TOKEN=$(curl -s -X POST http://127.0.0.1:8787/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@empresaxyz.ao","senha":"cliente123"}' \
  | jq -r '.data.token')

# Ver campanhas próprias
curl http://127.0.0.1:8787/client/campaigns \
  -H "Authorization: Bearer $TOKEN" | jq

# Criar nova campanha
curl -X POST http://127.0.0.1:8787/campaigns \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Teste Automático",
    "descricao": "Campanha de teste",
    "recompensa_por_resposta": 300,
    "meta_participantes": 100
  }' | jq
```

---

## 🐛 TROUBLESHOOTING

### **Problema: Backend não está rodando**

```bash
# Verificar se porta 8787 está em uso
lsof -ti:8787

# Matar processo
lsof -ti:8787 | xargs kill -9

# Reiniciar backend
npm run dev:backend
```

---

### **Problema: Tabela levantamentos não existe**

```bash
# Criar tabela
npx wrangler d1 execute kudimu_db --local \
  --file=criar_tabela_levantamentos.sql

# Verificar
npx wrangler d1 execute kudimu_db --local \
  --command="SELECT name FROM sqlite_master WHERE type='table'"
```

---

### **Problema: jq não instalado**

```bash
# macOS
brew install jq

# Linux (Ubuntu/Debian)
sudo apt-get install jq

# Linux (CentOS/RHEL)
sudo yum install jq

# Ou executar testes sem jq (sem formatação JSON)
./test_plataforma_completo.sh | grep -v jq
```

---

## 📈 MÉTRICAS ESPERADAS

### **Performance:**
- ✅ Cada endpoint deve responder em < 500ms
- ✅ Login deve ser < 200ms
- ✅ Listagem de campanhas < 300ms
- ✅ Submissão de respostas < 400ms

### **Taxa de Sucesso:**
- ✅ Testes de API: **95%+**
- ✅ Testes E2E: **90%+**
- ✅ Teste de carga: **100%** (sem erros)

---

## 🎉 RESULTADO ESPERADO

Se tudo estiver funcionando:

```
========================================
RESUMO DOS TESTES
========================================
Total de testes: 60
Testes passados: 60
Testes falhados: 0
Taxa de sucesso: 100%

🎉 TODOS OS TESTES PASSARAM! PLATAFORMA FUNCIONANDO 100%
```

---

## 📝 PRÓXIMOS PASSOS

Após todos os testes passarem:

1. ✅ **Deploy em produção:**
   ```bash
   npm run deploy
   ```

2. ✅ **Configurar D1 em produção:**
   ```bash
   npx wrangler d1 execute kudimu_db --file=schema.sql
   npx wrangler d1 execute kudimu_db --file=criar_tabela_levantamentos.sql
   ```

3. ✅ **Popular dados iniciais:**
   ```bash
   npx wrangler d1 execute kudimu_db --file=dados_teste.sql
   ```

---

## 🆘 SUPORTE

Se algo falhar:

1. Verificar logs: `./test_plataforma_completo.sh 2>&1 | tee test_results.log`
2. Verificar backend: `curl http://127.0.0.1:8787/`
3. Verificar banco: `npx wrangler d1 execute kudimu_db --local --command="SELECT 1"`

---

**Bons testes! 🧪🇦🇴**
