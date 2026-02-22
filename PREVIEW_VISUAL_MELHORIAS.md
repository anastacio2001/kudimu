# 🎨 Preview Visual das Melhorias

## 1. BalanceCard - Antes vs Depois

### ❌ ANTES (Design Antigo)
```
┌────────────────────────────────────┐
│  💵 Saldo Total                    │
│                                    │
│  15.700,00 AOA                     │
│                                    │
└────────────────────────────────────┘
```
**Problemas:**
- Não explica diferença entre Total e Disponível
- Não mostra pontos em validação
- Visual genérico (branco/cinza)

---

### ✅ DEPOIS (BalanceCard Educativo)
```
┌─────────────────────────────────────────────────────────┐
│  🟢 GRADIENTE VERDE-ESMERALDA                           │
│                                                         │
│  💵 Saldo Disponível                     ℹ️ [Detalhes] │
│                                                         │
│       13.000,00 Kz                                      │
│       Pronto para resgate                               │
│                                                         │
│  ┌───────────────────┐  ┌──────────────────────┐       │
│  │ ✅ Total Ganho    │  │ ⏰ Em Validação      │       │
│  │ 15.700,00 Kz      │  │ 2.700,00 Kz          │       │
│  └───────────────────┘  └──────────────────────┘       │
│                                                         │
│  [▼ Ver Detalhes]                                       │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 💡 Como Funciona o Saldo                        │   │
│  │                                                 │   │
│  │ ✅ Saldo Total                                  │   │
│  │ "Todos os pontos que já ganhou desde registro" │   │
│  │ ➜ 15.700,00 Kz                                  │   │
│  │                                                 │   │
│  │ 💵 Saldo Disponível                             │   │
│  │ "Pode resgatar agora (validado)"                │   │
│  │ ➜ 13.000,00 Kz                                  │   │
│  │                                                 │   │
│  │ 🔒 Em Validação                                 │   │
│  │ "Campanhas sendo aprovadas (24-48h)"            │   │
│  │ ➜ 2.700,00 Kz                                   │   │
│  │                                                 │   │
│  │ 💡 Fórmula:                                     │   │
│  │ [Total] − [Em Validação] = [Disponível]        │   │
│  │ 15.700 − 2.700 = 13.000 Kz                      │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Melhorias:**
- ✅ 3 estados claramente separados
- ✅ Explicação educativa expandível
- ✅ Fórmula matemática visual
- ✅ Gradiente verde chamativo
- ✅ Mini cards com backdrop blur

---

## 2. CampaignCard - Evolução Visual

### ❌ ANTES (Genérico)
```
┌────────────────────────────────────────────┐
│  Pesquisa sobre Saúde Pública              │
│  Tema: Saúde                               │
│                                            │
│  💵 500 AOA  ⏰ 5 perguntas  👥 50/100     │
│                                            │
│  Progresso: ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░ 50%       │
│                                            │
│  [Participar Agora]                        │
└────────────────────────────────────────────┘
```

---

### ✅ DEPOIS (Gradiente Temático - Saúde)
```
┌──────────────────────────────────────────────────────┐
│  🟢 GRADIENTE VERDE-ESMERALDA (Saúde)                │
│                                                      │
│  ┌────────────────────────────────┐                 │
│  │ ✨ RECOMENDADO 92%             │  🔥 URGENTE     │
│  └────────────────────────────────┘                 │
│                                                      │
│  🏥                  Pesquisa sobre Saúde Pública    │
│  [Saúde]            Ajude a melhorar o sistema...   │
│                                                      │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐            │
│  │ 💰      │  │ ⏰      │  │ 👥       │            │
│  │ Recom.  │  │ Tempo   │  │ Vagas    │            │
│  │ 500 AOA │  │ 5 perg. │  │ 50 rest. │            │
│  └─────────┘  └─────────┘  └──────────┘            │
│                                                      │
│  📊 Progresso da Campanha               50%         │
│  ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░ ✨ shimmer                     │
│  50 respostas                    Meta: 100          │
│                                                      │
│  [✓ Participar Agora →]  (hover: seta desliza)     │
│                                                      │
│  Promovido por: Ministério da Saúde                  │
└──────────────────────────────────────────────────────┘
```

**Melhorias:**
- ✅ Gradiente verde-esmeralda temático
- ✅ Emoji grande (🏥) como ícone
- ✅ Badges de status (URGENTE, RECOMENDADO)
- ✅ Stats em cards com backdrop blur
- ✅ Barra com efeito shimmer animado
- ✅ Hover: lift 8px + scale 1.02

---

## 3. Gradientes por Tema

### 🏥 Saúde (Verde-Esmeralda)
```css
from-green-50 to-emerald-50
border-green-200
bg-gradient-to-r from-green-500 to-emerald-600
```

### 📚 Educação (Azul-Índigo)
```css
from-blue-50 to-indigo-50
border-blue-200
bg-gradient-to-r from-blue-500 to-indigo-600
```

### 💻 Tecnologia (Roxo-Rosa)
```css
from-purple-50 to-pink-50
border-purple-200
bg-gradient-to-r from-purple-500 to-pink-600
```

### 🏛️ Política (Vermelho-Laranja)
```css
from-red-50 to-orange-50
border-red-200
bg-gradient-to-r from-red-500 to-orange-600
```

### 💰 Economia (Amarelo-Âmbar)
```css
from-yellow-50 to-amber-50
border-yellow-200
bg-gradient-to-r from-yellow-500 to-amber-600
```

---

## 4. Badges de Status

### 🔥 URGENTE (Vermelho Pulsante)
```
┌──────────────┐
│ 🔥 URGENTE   │  ← Pulsa continuamente
└──────────────┘
bg-red-500
animate: scale [1, 1.1, 1] infinite 2s
```
**Quando:** `data_fim` < 24 horas

---

### ⚡ ALTO VALOR (Amarelo-Laranja)
```
┌────────────────┐
│ ⚡ ALTO VALOR  │
└────────────────┘
bg-gradient-to-r from-yellow-400 to-orange-500
```
**Quando:** `recompensa` ≥ 500 AOA

---

### ✨ RECOMENDADO (Roxo)
```
┌──────────────────────────┐
│ ✨ RECOMENDADO 87%       │  ← Desliza da esquerda
└──────────────────────────┘
bg-gradient-to-r from-indigo-600 to-purple-600
animate: translateX(-100% → 0)
```
**Quando:** `isRecommended = true`

---

## 5. Animações

### Shimmer (Barra de Progresso)
```
┌──────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░ │
│     ↑                            │
│     └─ Brilho desliza 2s →       │
└──────────────────────────────────┘

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### Card Hover (Lift Effect)
```
Estado Normal:
┌──────────┐
│  Card    │
└──────────┘

Hover:
    ┌──────────┐  ← Sobe 8px + escala 1.02
    │  Card    │
    └──────────┘
    
whileHover={{ y: -8, scale: 1.02 }}
transition={{ type: "spring", stiffness: 300 }}
```

### Badge Urgente (Pulse)
```
🔥 URGENTE
  ↓
  ● (100%)
  ↓
  ⬤ (110%)
  ↓
  ● (100%)
  ↓
  (repete infinito)

animate={{ scale: [1, 1.1, 1] }}
transition={{ repeat: Infinity, duration: 2 }}
```

---

## 6. Hierarquia de Cores (Psicologia)

### Ordem de Atenção Visual:
1. 🔴 **Vermelho** (URGENTE) → Ação imediata
2. 🟡 **Amarelo** (ALTO VALOR) → Oportunidade
3. 🟣 **Roxo** (RECOMENDADO) → Personalização
4. 🟢 **Verde** (Disponível) → Sucesso/Confirmação
5. 🔵 **Azul** (Informativo) → Confiança

### Aplicação:
- Badge URGENTE sempre visível primeiro (vermelho pulsante)
- Saldo Disponível em verde (positivo)
- Saldo Bloqueado em âmbar (atenção, mas não crítico)
- CTA temático (gradiente único por categoria)

---

## 7. Responsividade

### Desktop (>1024px)
- Grid 3 colunas de cards
- BalanceCard largura completa
- Todas animações ativas

### Tablet (768-1024px)
- Grid 2 colunas de cards
- BalanceCard 2/3 da largura
- Animações reduzidas

### Mobile (<768px)
- Grid 1 coluna
- BalanceCard largura total
- Apenas animações essenciais
- Painel detalhes sempre fechado por padrão

---

## 8. Dark Mode

### BalanceCard
```
Light:  from-green-50 to-emerald-50
Dark:   from-green-900/20 to-emerald-900/20
```

### CampaignCard
```
Light:  border-green-200
Dark:   border-green-800
```

### Texto
```
Light:  text-gray-900
Dark:   text-white
```

---

## 🎯 Métricas de Sucesso

### Antes (estimado)
- CTR campanhas: ~15%
- Tickets suporte saldo: ~50/semana
- Tempo médio no /campaigns: 2min

### Depois (objetivo)
- CTR campanhas: **25%** (+67%)
- Tickets suporte saldo: **20/semana** (-60%)
- Tempo médio no /campaigns: **4min** (+100%)

### Indicadores
- ✅ Bounce rate em /history < 30%
- ✅ Expansão do BalanceCard > 40% usuários
- ✅ Cliques em badges URGENTE > 80%

---

**Conclusão:** Design transformado de genérico para ultra-engajante, aplicando princípios de gamificação (Duolingo), clareza (Stripe) e educação financeira (Nubank).
