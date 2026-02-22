# 🌟 Guia - Sistema de Produtos em Destaque

## ✅ O que foi implementado

### 1. **Banco de Dados**
- Campo `is_featured` (boolean) - Marca se produto está em destaque
- Campo `featured_order` (integer) - Controla ordem de exibição
- Índices para performance otimizada

### 2. **AdminPanel**
- Botão de estrela ⭐ em cada produto
- Click para adicionar/remover dos destaques
- Visual intuitivo:
  - ⭐ **Amarelo preenchido** = Produto em destaque
  - ☆ **Cinza vazio** = Produto normal

### 3. **HomePage**
- Exibe apenas produtos marcados como destaque
- Ordenados por `featured_order` (mais recente primeiro)
- Limita a 4 produtos
- Mostra mensagem se não houver produtos em destaque

---

## 🚀 Como Usar

### **Passo 1: Aplicar Migration no Supabase**

Execute no SQL Editor do Supabase:

```sql
-- Adicionar coluna is_featured na tabela products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Adicionar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;

-- Adicionar coluna featured_order para controlar ordem de exibição
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0;

-- Criar índice composto para ordem dos produtos em destaque
CREATE INDEX IF NOT EXISTS idx_products_featured_order ON products(is_featured, featured_order DESC) WHERE is_featured = true;

-- Comentário na coluna
COMMENT ON COLUMN products.is_featured IS 'Indica se o produto deve aparecer na seção de destaque da homepage';
COMMENT ON COLUMN products.featured_order IS 'Ordem de exibição dos produtos em destaque (maior = primeiro)';
```

Ou copie todo conteúdo de: `/supabase/migrations/add_featured_products.sql`

### **Passo 2: Marcar Produtos como Destaque**

1. Acesse o **Painel Admin**
2. Vá na aba **"Produtos"**
3. Encontre o produto que deseja destacar
4. Clique no **ícone de estrela** ⭐ na coluna "Destaque"
5. A estrela ficará **amarela e preenchida** ✨
6. Repita para até 4 produtos (recomendado)

### **Passo 3: Remover dos Destaques**

1. No Painel Admin → Produtos
2. Clique na **estrela amarela** do produto
3. Ela ficará **cinza e vazia** ☆
4. Produto não aparecerá mais na homepage

---

## 📊 Como Funciona a Ordem

Os produtos são ordenados por **featured_order** (maior número = aparece primeiro):

```
Exemplo:
Produto A: featured_order = 1700000000 (adicionado agora)
Produto B: featured_order = 1699000000 (adicionado ontem)
Produto C: featured_order = 1698000000 (adicionado há 2 dias)

Ordem de exibição: A → B → C
```

O sistema usa **timestamp** ao adicionar aos destaques, então o último produto marcado aparece primeiro.

---

## 🎨 Visual no AdminPanel

```
┌─────────────────────────────────────────────────────────────┐
│ Produto         │ Categoria │ Preço    │ Estoque │ Destaque │
├─────────────────────────────────────────────────────────────┤
│ iPhone 15 Pro   │ Telemóvel │ 850,000  │ 12      │   ⭐    │ ← Em destaque
│ Samsung S23     │ Telemóvel │ 620,000  │ 8       │   ☆    │ ← Normal
│ MacBook Pro     │ Laptop    │ 1,200,00 │ 5       │   ⭐    │ ← Em destaque
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 Boas Práticas

### **Quantos produtos destacar?**
- ✅ **Recomendado:** 4 produtos (preenche a linha completa)
- ⚠️ **Mínimo:** 1 produto (evite deixar vazio)
- 📱 **Mobile:** Mostra 1 por linha
- 💻 **Desktop:** Mostra 4 por linha

### **Quais produtos destacar?**
- 🔥 Produtos com desconto/Flash Sale
- ⭐ Produtos mais vendidos
- 🆕 Lançamentos recentes
- 💰 Produtos com melhor margem
- 📦 Produtos com bom estoque

### **Atualizar regularmente**
- 🔄 Troque produtos em destaque semanalmente
- 📅 Destaque produtos sazonais
- 🎯 Alinhe com campanhas de marketing
- 📊 Monitore performance no dashboard

---

## 🐛 Troubleshooting

### **Produtos não aparecem na homepage?**

1. **Verifique se migration foi aplicada:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('is_featured', 'featured_order');
```
Deve retornar 2 linhas.

2. **Verifique se produtos estão marcados:**
```sql
SELECT nome, is_featured, featured_order 
FROM products 
WHERE is_featured = true;
```

3. **Limpe cache do navegador:** Ctrl+Shift+R

### **Estrela não muda de cor ao clicar?**

- Recarregue a página: F5
- Verifique console do navegador (F12)
- Confirme que tem permissão de admin

### **Aparece mensagem "Nenhum produto em destaque"?**

Normal! Significa que nenhum produto está marcado como destaque. 
Vá no Admin Panel e marque alguns produtos.

---

## 📱 Resultado na Homepage

**Antes:**
```
Produtos em Destaque
────────────────────
[Produto 1] [Produto 2] [Produto 3] [Produto 4]
↑ Primeiros 4 produtos do banco (aleatório)
```

**Depois:**
```
Produtos em Destaque
────────────────────
[iPhone 15] [MacBook] [AirPods] [iPad]
↑ Apenas produtos selecionados pelo admin ⭐
```

---

## 🔄 Fluxo Completo

```
1. Admin marca produto ⭐
         ↓
2. is_featured = true
   featured_order = timestamp
         ↓
3. HomePage filtra produtos
   .filter(p => p.is_featured)
         ↓
4. Ordena por featured_order
   .sort((a, b) => b.order - a.order)
         ↓
5. Limita a 4 produtos
   .slice(0, 4)
         ↓
6. Exibe na seção "Produtos em Destaque"
```

---

## 🎯 Próximos Passos (Melhorias Futuras)

- [ ] Drag & drop para reordenar produtos em destaque
- [ ] Limite visual de quantos produtos estão em destaque (4/4)
- [ ] Prévia de como ficará na homepage
- [ ] Agendar produtos em destaque (data início/fim)
- [ ] Estatísticas de cliques em produtos destacados
- [ ] Banner personalizado para produtos em destaque
- [ ] Múltiplas seções de destaque (Por categoria, etc)

---

**Deploy realizado:** $(date)
**Branch:** main  
**Commit:** f83ba0d1

✅ Sistema pronto para uso!
