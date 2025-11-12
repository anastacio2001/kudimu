-- ==========================================
-- SISTEMA DE AVALIAÇÕES/REVIEWS DE PRODUTOS
-- ==========================================

-- Criar tabela de reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  images TEXT[], -- Array de URLs de imagens (opcional)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at DESC);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reviews_timestamp
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_reviews_updated_at();

-- RLS Policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Todos podem ver reviews
CREATE POLICY "Reviews são públicas"
  ON reviews FOR SELECT
  USING (true);

-- Usuários autenticados podem criar reviews
CREATE POLICY "Usuários autenticados podem criar reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem editar suas próprias reviews
CREATE POLICY "Usuários podem editar suas reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Usuários podem deletar suas próprias reviews
CREATE POLICY "Usuários podem deletar suas reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Admins podem fazer tudo
CREATE POLICY "Admins podem gerenciar todas reviews"
  ON reviews FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

-- View para estatísticas de produto
CREATE OR REPLACE VIEW product_review_stats AS
SELECT 
  product_id,
  COUNT(*) as total_reviews,
  AVG(rating)::NUMERIC(3,2) as average_rating,
  COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
  COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
  COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
  COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
  COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star,
  COUNT(CASE WHEN verified_purchase = true THEN 1 END) as verified_purchases
FROM reviews
GROUP BY product_id;

-- Comentário
COMMENT ON TABLE reviews IS 'Avaliações e comentários de produtos pelos clientes';

-- Inserir reviews de exemplo (opcional - descomente para usar)
/*
INSERT INTO reviews (product_id, user_name, user_email, rating, title, comment, verified_purchase)
VALUES
  ('1', 'João Silva', 'joao@email.com', 5, 'Excelente produto!', 'Muito bom, recomendo! Chegou rápido e bem embalado.', true),
  ('1', 'Maria Santos', 'maria@email.com', 4, 'Bom custo-benefício', 'Produto de qualidade, só achei o preço um pouco alto.', true),
  ('1', 'Pedro Costa', 'pedro@email.com', 5, 'Perfeito!', 'Exatamente como descrito, muito satisfeito.', false),
  ('2', 'Ana Lima', 'ana@email.com', 3, 'Produto OK', 'Funciona bem, mas esperava mais pela descrição.', true),
  ('2', 'Carlos Mendes', 'carlos@email.com', 5, 'Recomendo!', 'Ótima qualidade, entrega rápida.', true);
*/
