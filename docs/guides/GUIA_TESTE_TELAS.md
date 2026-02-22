# 🚀 Guia Rápido - Acessar Telas Redesenhadas

## ✅ Status

Webpack está rodando em: **http://localhost:9000**

Todas as telas redesenhadas estão **prontas e funcionando**!

---

## 📍 URLs de Acesso

### 🏠 Landing Page (Nova)
```
http://localhost:9000/
```

**O que ver:**
- Hero section com logo gradient
- Pricing section (4 tabelas)
- Como Funciona (2 timelines)
- API Documentation (7 endpoints)
- Diferenciais, Resultados, Impacto
- Footer completo
- Dark mode toggle (canto superior direito)

**Testar:**
- Scroll suave entre seções
- Toggle dark mode
- Hover nos cards de pricing
- Links de navegação
- Botões CTA
- Responsividade (redimensione o browser)

---

### 🔐 Login (Novo)
```
http://localhost:9000/login
http://localhost:9000/entrar
```

**O que ver:**
- Split-screen design
- Formulário moderno (esquerda)
- Features showcase (direita - só desktop)
- Background decorativo
- Stats (5K+ usuários, 100+ campanhas)

**Testar:**
1. Digite email: `teste@kudimu.com`
2. Digite senha: `senha123`
3. Clique no olho para mostrar/esconder senha
4. Marque "Lembrar de mim"
5. Clique "Entrar"
6. Veja loading spinner
7. Será redirecionado para `/campaigns`

**Erros para testar:**
- Email inválido → veja validação
- Senha errada → veja banner de erro vermelho

---

### 📝 Cadastro (Novo)
```
http://localhost:9000/signup
http://localhost:9000/cadastro
```

**O que ver:**
- Multi-step form (3 etapas)
- Progress indicator com ícones
- Validação em tempo real
- Password strength meter

**Testar Step 1 (Dados Pessoais):**
1. Digite nome: `João Silva`
2. Digite email: `joao@email.com`
3. Veja ícones ✅ aparecerem
4. Clique "Próximo"

**Testar Step 2 (Segurança):**
1. Digite senha fraca: `123` → veja "Muito fraca" (vermelho)
2. Digite senha forte: `Senha123!` → veja "Boa" (azul)
3. Veja checklist:
   - ✅ Mínimo 8 caracteres
   - ✅ Letras maiúsculas e minúsculas
   - ✅ Pelo menos um número
4. Clique no olho para mostrar/esconder
5. Clique "Próximo"

**Testar Step 3 (Localização):**
1. Digite telefone: `944123456`
2. Selecione província: `Luanda` (ou qualquer uma das 18)
3. Marque checkbox "Aceito os termos"
4. Veja nota de segurança (🛡️)
5. Clique "Criar Conta"
6. Veja loading
7. Será redirecionado para `/campaigns`

---

### 📊 Dashboard (Novo)
```
http://localhost:9000/campaigns
```

⚠️ **Requer login primeiro!**

**O que ver:**
- Header com logo, menu, reputation badge
- Saudação personalizada: "Olá, [Nome]"
- 4 stats cards:
  - 🏆 Pontos Totais
  - ✅ Campanhas Respondidas (com trend)
  - 💰 Ganhos Totais (AOA)
  - 🔥 Nível Atual
- 2 progress cards:
  - Progresso para Próximo Nível
  - Meta Mensal de Campanhas
- Search bar + filtros + ordenação
- Grid de campanhas responsivo

**Testar:**
1. Digite algo na busca → veja filtrar em tempo real
2. Selecione um tema no dropdown
3. Mude ordenação (Relevantes/Recentes/Recompensa)
4. Veja cards das campanhas:
   - Badge "Recomendado" nos top 3
   - Cores por tema
   - Progress bar animada
   - Stats (recompensa, duração, participantes)
5. Clique "Participar Agora" → redireciona para questionário

---

## 🔄 Telas Antigas (Backup)

Se quiser comparar com as versões antigas:

```
Landing antiga:   http://localhost:9000/old-landing
Login antigo:     http://localhost:9000/old-login
Dashboard antigo: http://localhost:9000/old-campaigns
```

---

## 🌓 Testar Dark Mode

### Método 1: Toggle na Interface
1. Acesse qualquer tela
2. Procure o ícone ☀️/🌙 no header
3. Clique para alternar

### Método 2: DevTools (Chrome)
1. F12 para abrir DevTools
2. Cmd/Ctrl + Shift + P
3. Digite: "Rendering"
4. Procure: "Emulate CSS media feature prefers-color-scheme"
5. Selecione: `dark`

**Verificar:**
- ✅ Cores invertem (branco → preto, preto → branco)
- ✅ Gradients mantêm qualidade
- ✅ Borders ficam visíveis
- ✅ Ícones permanecem nítidos
- ✅ Hover states funcionam

---

## 📱 Testar Responsividade

### Chrome DevTools
1. F12 para abrir DevTools
2. Ctrl/Cmd + Shift + M (Toggle device toolbar)
3. Selecione dispositivo ou custom

### Dispositivos para Testar

**Mobile:**
- iPhone SE: 375px
- iPhone 12 Pro: 390px
- iPhone 12 Pro Max: 428px

**Tablet:**
- iPad Mini: 768px
- iPad Pro: 1024px

**Desktop:**
- MacBook Air: 1280px
- Full HD: 1920px

**Verificar em cada:**
- ✅ Layout adapta (sem scroll horizontal)
- ✅ Textos legíveis
- ✅ Botões clicáveis (não muito pequenos)
- ✅ Imagens/cards não quebram
- ✅ Menu responsivo
- ✅ Forms usáveis

---

## 🧪 Cenários de Teste

### 1. Jornada Completa do Usuário

**Novo usuário:**
1. Acessa Landing Page (`/`)
2. Vê preços e serviços
3. Clica "Criar Conta"
4. Completa 3 steps do cadastro
5. É redirecionado para Dashboard
6. Vê suas campanhas disponíveis
7. Participa de uma campanha

**Usuário existente:**
1. Acessa Login (`/login`)
2. Digita credenciais
3. Faz login
4. Vê Dashboard
5. Busca por campanha específica
6. Filtra por tema
7. Ordena por recompensa
8. Participa

### 2. Testar Validações

**Login:**
- Email vazio → erro
- Email inválido → erro
- Senha errada → banner vermelho

**Signup:**
- Nome < 3 chars → ❌ vermelho
- Email inválido → ❌ vermelho
- Senha < 8 chars → botão disabled
- Senha fraca → pode avançar mas veja warning
- Telefone vazio → não pode avançar
- Província não selecionada → não pode avançar
- Termos não aceitos → botão "Criar Conta" disabled

### 3. Testar Animações

**Verificar:**
- ✅ Fade in ao carregar página
- ✅ Hover lift nos cards (y: -4px)
- ✅ Button scale ao clicar (0.98)
- ✅ Progress bars animam (0% → X%)
- ✅ Transições entre steps no signup
- ✅ Loading spinners rodam suavemente
- ✅ Smooth scroll na landing page

**Performance:**
- Todas as animações devem rodar a **60fps**
- Sem lag ou travamento
- Transições suaves

### 4. Testar Estados

**Loading:**
- Login → veja spinner no botão
- Signup → veja spinner
- Dashboard → veja cards carregando

**Error:**
- Login com credenciais erradas → banner vermelho
- Signup com dados duplicados → mensagem de erro
- Dashboard sem conexão → mensagem de erro

**Empty:**
- Dashboard sem campanhas → "Nenhuma campanha disponível"
- Search sem resultados → mensagem

**Success:**
- Login bem-sucedido → redirect imediato
- Signup completo → animação + redirect

---

## 🎯 Checklist de Testes

### Landing Page
- [ ] Hero section carrega
- [ ] Logo tem gradient
- [ ] Menu de navegação funciona
- [ ] Scroll suave entre seções
- [ ] Pricing tables renderizam (4 tabelas)
- [ ] Timelines aparecem (2)
- [ ] API endpoints documentados (7)
- [ ] Footer completo
- [ ] Dark mode funciona
- [ ] Responsivo (mobile/tablet/desktop)

### Login
- [ ] Split-screen aparece (desktop)
- [ ] Features escondidas (mobile)
- [ ] Email field com ícone
- [ ] Password show/hide funciona
- [ ] Remember me checkbox
- [ ] Forgot password link
- [ ] Submit funciona
- [ ] Loading aparece
- [ ] Error handling funciona
- [ ] Redirect após login
- [ ] Dark mode
- [ ] Responsivo

### Signup
- [ ] Progress indicator (3 steps)
- [ ] Step 1: Nome + Email
- [ ] Validação real-time (✅/❌)
- [ ] Botão "Próximo" disabled/enabled correto
- [ ] Step 2: Senha
- [ ] Password strength (5 níveis)
- [ ] Checklist de requisitos
- [ ] Show/hide password
- [ ] Step 3: Telefone + Província
- [ ] Dropdown com 18 províncias
- [ ] Terms checkbox obrigatório
- [ ] Security note aparece
- [ ] Botão "Criar Conta" disabled se inválido
- [ ] Submit funciona
- [ ] Redirect após cadastro
- [ ] Dark mode
- [ ] Responsivo

### Dashboard
- [ ] Header carrega
- [ ] Welcome personalizada
- [ ] 4 stats cards
- [ ] 2 progress cards
- [ ] Reputation badge (nível correto)
- [ ] Search funciona
- [ ] Filtro por tema
- [ ] Ordenação (3 opções)
- [ ] Campaign cards renderizam
- [ ] Top 3 marcados como recomendados
- [ ] Progress bars animam
- [ ] Click "Participar" redireciona
- [ ] Dark mode
- [ ] Responsivo (1/2/3 colunas)

---

## 🐛 O que Reportar se Encontrar Bugs

Ao testar, anote:

1. **URL** - Qual página
2. **Ação** - O que fez
3. **Esperado** - O que deveria acontecer
4. **Aconteceu** - O que realmente aconteceu
5. **Browser** - Chrome/Firefox/Safari
6. **Tamanho** - Desktop/Tablet/Mobile
7. **Dark mode** - Ativo/Inativo
8. **Screenshot** - Se possível

**Exemplo:**
```
URL: /signup
Ação: Digitei senha "abc123"
Esperado: Password strength "Fraca"
Aconteceu: Não aparece nada
Browser: Chrome
Tamanho: Desktop 1920px
Dark mode: Ativo
```

---

## 💡 Dicas

### Desenvolver/Debugar

**Ver estado do React:**
```javascript
// Instale React DevTools
// Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/
```

**Ver logs do webpack:**
```bash
# Terminal está mostrando hot reload
# Veja compilações em tempo real
```

**Limpar cache:**
```bash
# Se algo não atualizar
Ctrl/Cmd + Shift + R (hard refresh)

# Ou limpe localStorage
F12 → Application → Local Storage → Clear All
```

### Performance

**Ver FPS das animações:**
```
F12 → More tools → Rendering → FPS meter
```

**Ver bundle size:**
```bash
# Terminal mostra após compilar
bundle.js: 4.2 MiB
```

---

## 🎉 Pronto!

Todas as telas redesenhadas estão **funcionando** e **prontas para teste**!

**Server:** http://localhost:9000  
**Status:** ✅ Rodando  
**Hot Reload:** ✅ Ativo  

Divirta-se testando! 🚀

---

**Desenvolvido com 💜 em Angola para África**
