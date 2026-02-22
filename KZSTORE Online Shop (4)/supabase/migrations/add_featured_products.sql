-- ==========================================
-- ADICIONAR CAMPO PRODUTOS EM DESTAQUE
-- ==========================================

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
