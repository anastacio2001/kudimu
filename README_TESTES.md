# 🧪 SISTEMA DE TESTES AUTOMATIZADOS - KUDIMU INSIGHTS

## 🎯 RESUMO RÁPIDO

Criado sistema completo de testes em massa para validar toda a plataforma automaticamente.

---

## 📦 ARQUIVOS CRIADOS

| Arquivo | Tamanho | Descrição |
|---------|---------|-----------|
| **run_all_tests.sh** | 2.6 KB | 🚀 **SCRIPT MASTER** - Executa tudo |
| **test_plataforma_completo.sh** | 14 KB | Testes de API (60 testes) |
| **test_frontend_e2e.js** | 14 KB | Testes E2E Frontend (15 testes) |
| **popular_dados_teste_massa.sql** | 21 KB | Popula banco com 50 usuários, 20 campanhas |
| **GUIA_TESTES_MASSA.md** | 10 KB | Documentação completa |

---

## 🚀 USO RÁPIDO (3 PASSOS)

### **1. Iniciar Backend**
```bash
cd /Users/UTENTE1/Desktop/kudimu-main/dados_kudimu/kudimu-master/Desktop/Kudimu

# Em um terminal:
npm run dev:backend
```

### **2. Executar Todos os Testes**
```bash
# Em outro terminal:
./run_all_tests.sh
```

### **3. Ver Resultados**
```
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

## 📊 O QUE É TESTADO

### **Backend (60 testes):**
- ✅ Conectividade
- ✅ Autenticação (admin, cliente, respondente)
- ✅ Campanhas (CRUD, submissão)
- ✅ Recompensas (saldo, histórico)
- ✅ Levantamentos (criar, aprovar)
- ✅ Admin (usuários, validação)
- ✅ Cliente (créditos, campanhas)
- ✅ Pagamentos (5 métodos)
- ✅ Notificações Push
- ✅ Teste de carga (10 req simultâneas)

### **Frontend (15 testes E2E):**
- ✅ Landing page
- ✅ Login (3 tipos)
- ✅ Navegação completa
- ✅ Formulários
- ✅ Fluxos completos

### **Dados de Teste:**
- ✅ **50 usuários:** 10 admins, 20 clientes, 20 respondentes
- ✅ **20 campanhas ativas** (vários temas)
- ✅ **~60 perguntas**
- ✅ **10 levantamentos** (pendentes/aprovados)
- ✅ **10 recompensas** (histórico)

---

## 🔧 TESTES INDIVIDUAIS

### **Apenas API:**
```bash
./test_plataforma_completo.sh
```

### **Apenas Frontend E2E:**
```bash
# Iniciar frontend em outro terminal:
npm run dev:frontend

# Executar testes:
node test_frontend_e2e.js
```

### **Apenas Popular Dados:**
```bash
npx wrangler d1 execute kudimu_db --local --file=popular_dados_teste_massa.sql
```

---

## 📋 CHECKLIST PRÉ-TESTE

- [ ] Backend rodando (`npm run dev:backend`)
- [ ] Porta 8787 livre
- [ ] jq instalado (`brew install jq`)
- [ ] D1 database configurado

---

## 🎯 CENÁRIOS TESTADOS

### **Respondente:**
1. Login
2. Ver 20 campanhas
3. Responder questionário
4. Receber recompensa AUTOMÁTICA
5. Solicitar levantamento
6. Ver histórico

### **Admin:**
1. Login
2. Ver levantamentos pendentes
3. Aprovar levantamento
4. Ver usuários
5. Validar respostas

### **Cliente:**
1. Login
2. Ver planos (6 opções)
3. Criar campanha
4. Ver analytics

---

## 📈 RESULTADOS ESPERADOS

| Teste | Taxa de Sucesso | Tempo |
|-------|----------------|-------|
| API | 95%+ | ~30s |
| E2E | 90%+ | ~45s |
| Carga | 100% | ~5s |

---

## 🐛 TROUBLESHOOTING

### **Backend não roda:**
```bash
lsof -ti:8787 | xargs kill -9
npm run dev:backend
```

### **Tabela levantamentos não existe:**
```bash
npx wrangler d1 execute kudimu_db --local --file=criar_tabela_levantamentos.sql
```

### **jq não instalado:**
```bash
brew install jq  # macOS
```

---

## 📝 LOGS

Todos os testes geram logs coloridos:
- 🟢 **Verde:** Passou ✅
- 🔴 **Vermelho:** Falhou ❌
- 🟡 **Amarelo:** Info ℹ️

---

## 🎉 SUCESSO TOTAL

Se tudo passar:

```
🎉 TODOS OS TESTES PASSARAM! PLATAFORMA FUNCIONANDO 100%
```

**A plataforma está pronta para lançamento! 🇦🇴**

---

## 📖 DOCUMENTAÇÃO COMPLETA

Ver: `GUIA_TESTES_MASSA.md` (10 KB)

---

**Criado em:** 13 de Fevereiro de 2026  
**Versão:** 1.0
