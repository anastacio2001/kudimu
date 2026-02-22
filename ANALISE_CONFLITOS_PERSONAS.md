# ⚠️ Análise de Conflitos - Personas do Sistema Kudimu

## 🔍 PROBLEMAS IDENTIFICADOS

### 1. **CONFUSÃO DE NOMENCLATURA** 🚨

#### Problema Principal: Uso Inconsistente de `tipo_conta` vs `tipo_usuario`

**No Backend (`src/index.ts`):**
```typescript
// ❌ PROBLEMA: Usa tipo_conta no banco de dados
tipo_conta: 'admin' | 'cliente' | 'usuario'

// ✅ MAS: Usa tipo_usuario na validação de token
if (user.tipo_usuario !== 'admin') { ... }
```

**Onde acontece:**
- **Login** (linha 743): `const token = jwt-${user.tipo_conta}-${user.id}`
- **Decodificação** (linha 69): `tipo_usuario: tipo_usuario` (extrai do token)
- **Validação** (linha 97, 130): Verifica `user.tipo_usuario`

**Resultado:** 
- Backend retorna `tipo_conta` nos dados do usuário
- Token usa `tipo_conta` 
- Validação espera `tipo_usuario`
- **INCONSISTÊNCIA TOTAL**

---

### 2. **TRÊS PERSONAS MAL DEFINIDAS** 🎭

Atualmente o sistema tem 3 tipos, mas **confusão sobre quem faz o quê**:

#### 🔴 PERSONA 1: Admin
- **tipo_conta**: `'admin'`
- **Função ATUAL**: Gerenciar sistema, usuários, validar respostas
- **Rotas**: `/admin/*`
- **Email teste**: `admin@kudimu.ao` / `admin123`
- **✅ BEM DEFINIDO**

#### 🟡 PERSONA 2: Cliente (Empresário que PAGA)
- **tipo_conta**: `'cliente'`
- **Função PRETENDIDA**: Criar campanhas, pagar, ver analytics
- **Função ATUAL**: ??? (código não deixa claro se pode criar campanhas)
- **Rotas**: `/client/*`
- **Email teste**: `joao@empresaxyz.ao` / `cliente123`
- **⚠️ PARCIALMENTE DEFINIDO**

#### 🔴 PERSONA 3: Usuário (Responde pesquisas)
- **tipo_conta**: `'usuario'`
- **Função PRETENDIDA**: Responder pesquisas e ganhar pontos
- **Função ATUAL**: Pode acessar `/campaigns`, mas...
- **Rotas**: `/campaigns`, `/dashboard`
- **Email teste**: `maria@gmail.com` / `usuario123`
- **❌ CONFUSO - Qual dashboard? Pode criar campanhas?**

---

### 3. **CONFLITO: QUEM CRIA CAMPANHAS?** 💥

#### Problema Atual:
```typescript
// Backend endpoint POST /campaigns
// ❌ PROBLEMA: Valida apenas se usuário está autenticado
const auth = requireAuth(request);
// Não valida se é CLIENTE ou ADMIN!

// Qualquer tipo de usuário pode criar campanha?
// Usuário normal (tipo_conta='usuario') deveria poder criar?
```

**O que DEVERIA ser:**
- ✅ **Cliente** → CRIA campanhas (paga por elas)
- ✅ **Admin** → Gerencia/aprova campanhas
- ❌ **Usuário normal** → APENAS RESPONDE campanhas

**O que ESTÁ:**
- ❓ Qualquer um pode criar? (não há validação específica)

---

### 4. **CONFLITO: SISTEMA DE PONTOS E PAGAMENTOS** 💰

#### No mock-data.ts:
```typescript
// Cliente TEM pontos?
'joao@empresaxyz.ao': {
  tipo_conta: 'cliente',
  saldo_pontos: 2000,  // ❓ POR QUE CLIENTE TEM PONTOS?
  reputacao: 500       // ❓ CLIENTE PRECISA DE REPUTAÇÃO?
}

// Usuário normal TEM pontos
'maria@gmail.com': {
  tipo_conta: 'usuario',
  saldo_pontos: 750,   // ✅ FAZ SENTIDO (ganha respondendo)
  reputacao: 150       // ✅ FAZ SENTIDO (sistema de ranking)
}
```

**Pergunta Crítica:**
- Cliente PAGA em dinheiro real → Não deveria ter "pontos"
- Cliente RECEBE dados → Não deveria ter "reputação" de respondente
- **CONFUSÃO CONCEITUAL**

---

### 5. **ROTAS E NAVEGAÇÃO CONFUSAS** 🗺️

#### LoginScreen.js (linhas 68-74):
```javascript
if (userData.data.tipo_usuario === 'admin') {
  navigate('/admin');
} else if (userData.data.tipo_usuario === 'cliente') {
  navigate('/client/dashboard');
} else {
  // Usuários normais sempre vão para campanhas (tela única)
  navigate('/campaigns');
}
```

**Problemas:**
1. Usa `tipo_usuario` (mas backend retorna `tipo_conta`)
2. Usuário normal vai para `/campaigns` 
3. Cliente tem `/client/dashboard` + `/client/campaigns`
4. **CONFUSÃO**: Cliente pode ver `/campaigns` também?

---

## 🎯 PROPOSTA DE CORREÇÃO

### Solução 1: Padronizar Nomenclatura

**Escolher UMA nomenclatura e usar em TUDO:**

```typescript
// OPÇÃO A: Usar tipo_usuario em tudo
tipo_usuario: 'admin' | 'cliente' | 'respondente'

// OPÇÃO B: Usar tipo_conta em tudo (atual)
tipo_conta: 'admin' | 'cliente' | 'usuario'
```

**Recomendação:** Usar `tipo_usuario` (mais semântico)

---

### Solução 2: Definir Claramente as Personas

#### 👨‍💼 ADMIN (Administrador da Plataforma)
```typescript
{
  tipo_usuario: 'admin',
  permissoes: [
    'gerenciar_usuarios',
    'validar_respostas',
    'ver_analytics_global',
    'aprovar_campanhas',
    'configurar_sistema'
  ],
  rotas: ['/admin/*'],
  pode_criar_campanha: true,  // Para testes
  paga_campanhas: false
}
```

#### 💼 CLIENTE (Empresário/Organização)
```typescript
{
  tipo_usuario: 'cliente',
  permissoes: [
    'criar_campanha',
    'pagar_campanha',
    'ver_resultados_proprias_campanhas',
    'exportar_dados',
    'gerenciar_orcamento'
  ],
  rotas: ['/client/*'],
  pode_criar_campanha: true,
  paga_campanhas: true,
  // ❌ NÃO TEM: saldo_pontos, reputacao (não responde pesquisas)
  tem_creditos_pagos: true,
  saldo_creditos: 5000  // Em Kwanzas, não pontos
}
```

#### 👤 RESPONDENTE (Usuário Normal)
```typescript
{
  tipo_usuario: 'respondente',  // Mudança: de 'usuario' para 'respondente'
  permissoes: [
    'responder_campanhas',
    'ver_ranking',
    'trocar_pontos_premios',
    'ver_historico_respostas'
  ],
  rotas: ['/campaigns', '/my-rewards', '/ranking'],
  pode_criar_campanha: false,  // ❌ NÃO PODE
  paga_campanhas: false,
  saldo_pontos: 750,
  reputacao: 150,
  nivel: 'Bronze'
}
```

---

### Solução 3: Corrigir Validações de Endpoints

```typescript
// ❌ ANTES (qualquer um pode criar):
if (path === '/campaigns' && request.method === 'POST') {
  const auth = requireAuth(request);
  // ...
}

// ✅ DEPOIS (apenas cliente e admin):
if (path === '/campaigns' && request.method === 'POST') {
  const auth = requireClientOrAdmin(request);
  if (!auth.authorized) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Apenas clientes e administradores podem criar campanhas' 
    }), { status: 403 });
  }
  // ...
}
```

---

### Solução 4: Separar Sistemas de Pontos vs Créditos

#### Para CLIENTES (Empresários):
```typescript
{
  tipo_usuario: 'cliente',
  sistema_pagamento: {
    tipo: 'creditos_pagos',
    saldo_creditos: 5000,      // Em Kwanzas
    metodo_pagamento: 'express',
    historico_pagamentos: [...]
  },
  // ❌ SEM pontos ou reputação
}
```

#### Para RESPONDENTES (Usuários):
```typescript
{
  tipo_usuario: 'respondente',
  sistema_recompensas: {
    tipo: 'pontos_ganhos',
    saldo_pontos: 750,
    reputacao: 150,
    nivel: 'Bronze',
    badges: [...]
  },
  // ❌ SEM créditos pagos
}
```

---

## 📋 CHECKLIST DE CORREÇÕES NECESSÁRIAS

### Backend (src/index.ts):
- [ ] Padronizar: `tipo_conta` → `tipo_usuario` em TODOS os lugares
- [ ] Atualizar schema do banco: `tipo_conta` → `tipo_usuario`
- [ ] Renomear `'usuario'` → `'respondente'`
- [ ] Adicionar validação `requireClientOrAdmin()` em POST `/campaigns`
- [ ] Separar campos: Clientes sem `saldo_pontos`, Respondentes sem `saldo_creditos`
- [ ] Atualizar MOCK_USERS com novos campos

### Frontend:
- [ ] Atualizar LoginScreen.js: usar `tipo_usuario` consistentemente
- [ ] Renomear rotas de usuário: `/campaigns` → `/respond` (mais claro)
- [ ] Criar layout separado para Respondentes (UserLayout)
- [ ] Remover acesso de respondentes a criação de campanhas
- [ ] Criar tela de "Meus Créditos" para clientes (não pontos)

### Documentação:
- [ ] Atualizar ESTRUTURA_PROJETO.md com definições claras
- [ ] Criar diagrama de permissões por persona
- [ ] Documentar fluxo de criação de campanha (apenas cliente/admin)
- [ ] Documentar sistema duplo: Créditos (cliente) vs Pontos (respondente)

---

## 🔥 IMPACTO DOS PROBLEMAS ATUAIS

### Cenário Real Problemático:

1. **Usuário normal** (maria@gmail.com) faz login
2. Sistema redireciona para `/campaigns`
3. Ela vê botão "Criar Campanha" (não deveria)
4. Ela clica e tenta criar
5. Backend aceita (não valida tipo de usuário) ❌
6. **Ela criou uma campanha mas não pagou!** 💥

### Outro Cenário Problemático:

1. **Cliente** (joao@empresaxyz.ao) paga R$ 5000 por campanha
2. Sistema dá "2000 pontos" para ele
3. Ele não pode usar esses pontos para nada
4. **Confusão total sobre o que são esses pontos** 🤔

---

## ✅ PRÓXIMOS PASSOS RECOMENDADOS

1. **URGENTE**: Adicionar validação `requireClientOrAdmin` no POST `/campaigns`
2. **URGENTE**: Corrigir LoginScreen para usar campo correto (`tipo_conta` ou padronizar)
3. **ALTA**: Renomear `usuario` → `respondente` em todo código
4. **ALTA**: Separar sistema de pontos (respondentes) de créditos (clientes)
5. **MÉDIA**: Atualizar toda documentação com definições claras
6. **MÉDIA**: Criar testes para validar permissões de cada persona

---

**Data de Análise**: 7 de fevereiro de 2026  
**Autor**: GitHub Copilot  
**Status**: 🔴 CRÍTICO - Requer ação imediata
