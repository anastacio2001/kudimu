# 🧪 GUIA DE TESTE - KUDIMU ADMIN & CLIENTE

## ✅ STATUS: PRONTO PARA TESTE

### 🔑 **Credenciais Criadas:**

#### 👨‍💼 **ADMINISTRADOR** 
- **Email:** `admin@kudimu.ao`
- **Senha:** `admin123`
- **Tipo:** Admin completo
- **Acesso:** Todas as funcionalidades administrativas

#### 🏢 **CLIENTE EMPRESA**
- **Email:** `joao@empresaxyz.ao` 
- **Senha:** `cliente123`
- **Tipo:** Cliente empresarial
- **Acesso:** Criar campanhas, relatórios

#### 👤 **USUÁRIO NORMAL**
- **Email:** `maria@gmail.com`
- **Senha:** `usuario123` 
- **Tipo:** Participante
- **Acesso:** Responder questionários

---

## 🚀 **ROTEIRO DE TESTE COMPLETO**

### **PASSO 1: TESTE COMO ADMIN**

1. **Acesse:** `http://localhost:9000/login`
2. **Login:** `admin@kudimu.ao` / `admin123`
3. **Verify redirect:** Deve ir para `/admin/dashboard`

#### 🎯 **Funcionalidades Admin Esperadas:**

**📊 Dashboard Admin:**
- Estatísticas gerais da plataforma
- Gráficos de usuários ativos
- Campanhas em andamento
- Receitas e pagamentos

**👥 Gestão de Usuários (/admin/users):**
- Lista todos os usuários
- Filtros por tipo (admin, cliente, usuario)
- Ações: visualizar, editar, desativar
- Estatísticas de reputação

**📋 Gestão de Campanhas (/admin/campaigns):**
- Lista todas as campanhas
- Status: pendente, ativa, encerrada
- Aprovar/rejeitar campanhas
- Moderar conteúdo

**💬 Análise de Respostas (/admin/answers):**
- Todas as respostas submetidas
- Ferramentas de moderação
- Detecção de spam/qualidade
- Relatórios de sentimento

**🤖 AI Insights (/admin/ai-insights):**
- Análises automatizadas
- Previsões de tendências
- Relatórios de IA
- Insights avançados

**📈 Relatórios (/admin/reports):**
- Relatórios financeiros
- Performance da plataforma
- Métricas de engajamento
- Exportação de dados

---

### **PASSO 2: TESTE COMO CLIENTE**

1. **Logout** do admin
2. **Login:** `joao@empresaxyz.ao` / `cliente123`
3. **Verify redirect:** Deve ir para área de cliente

#### 🎯 **Funcionalidades Cliente Esperadas:**

**🏢 Dashboard Cliente:**
- Minhas campanhas criadas
- Performance das campanhas
- Gastos e orçamentos
- Relatórios específicos

**➕ Criar Campanha:**
- Formulário de nova campanha
- Definir público-alvo
- Configurar recompensas
- Aprovação pendente

**📊 Relatórios:**
- Apenas das suas campanhas
- Dados agregados e anônimos
- Métricas de engajamento
- Download de resultados

---

### **PASSO 3: TESTE COMO USUÁRIO**

1. **Logout** do cliente
2. **Login:** `maria@gmail.com` / `usuario123`
3. **Verify redirect:** Deve ir para `/campaigns`

#### 🎯 **Funcionalidades Usuário Esperadas:**

**📋 Campanhas Disponíveis:**
- Lista de campanhas ativas
- Filtros por tema/localização
- Recompensas disponíveis
- Status de participação

**🏆 Histórico:**
- Campanhas já respondidas
- Pontos/recompensas ganhas
- Status de pagamentos
- Níveis de reputação

**💰 Recompensas:**
- Saldo atual
- Histórico de pagamentos
- Métodos de retirada
- Cashout disponível

---

## 🔍 **PONTOS DE VERIFICAÇÃO**

### ✅ **Sistema de Rotas:**
- [x] Login redireciona corretamente por tipo
- [x] Admin vê menu administrativo
- [x] Cliente vê opções de empresa
- [x] Usuário vê interface simplificada

### ✅ **Autenticação:**
- [x] Tokens JWT funcionando
- [x] Logout limpa sessão
- [x] Rotas protegidas bloqueiam acesso
- [x] Níveis de permissão respeitados

### ✅ **Interface:**
- [x] Design consistente (Tailwind CSS)
- [x] Responsivo em mobile
- [x] Dark mode funcional
- [x] Animações suaves (Framer Motion)

### ✅ **API Integration:**
- [x] Calls para localhost:8787
- [x] Headers de autenticação
- [x] Error handling
- [x] Loading states

---

## 🚨 **PROBLEMAS POSSÍVEIS & SOLUÇÕES**

### **Problema:** Admin não vê menu administrativo
**Solução:** Verificar se `tipo_conta === 'admin'` no localStorage

### **Problema:** 404 em rotas admin
**Solução:** Verificar se AppRouter reconhece `/admin/*`

### **Problema:** Erro de API
**Solução:** Confirmar se backend está rodando em localhost:8787

### **Problema:** Login não funciona
**Solução:** Verificar console do browser e logs do backend

---

## 📱 **URLs DE TESTE**

- **Landing Page:** `http://localhost:9000/`
- **Login:** `http://localhost:9000/login`
- **Admin Dashboard:** `http://localhost:9000/admin/dashboard`
- **Admin Users:** `http://localhost:9000/admin/users`
- **Admin Campaigns:** `http://localhost:9000/admin/campaigns`
- **Campanhas Usuário:** `http://localhost:9000/campaigns`

---

## 🎉 **PRÓXIMOS PASSOS APÓS TESTE**

1. **Validar funcionalidades** ✅
2. **Ajustar UX/UI** se necessário
3. **Adicionar dados de amostra** 
4. **Configurar deploy** para produção
5. **Documentar API** para clientes
6. **Setup monitoring** e analytics

---

**🚀 TUDO PRONTO! Pode começar os testes!**