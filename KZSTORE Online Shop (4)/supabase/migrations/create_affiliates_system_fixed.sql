-- ==========================================
-- SISTEMA DE AFILIADOS COMPLETO - VERSÃO CORRIGIDA
-- ==========================================

-- Tabela de Afiliados
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  total_clicks INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  total_revenue DECIMAL(15,2) DEFAULT 0,
  total_commission DECIMAL(15,2) DEFAULT 0,
  paid_commission DECIMAL(15,2) DEFAULT 0,
  pending_commission DECIMAL(15,2) DEFAULT 0,
  payment_method VARCHAR(50),
  payment_details JSONB,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Campanhas de Afiliados
CREATE TABLE IF NOT EXISTS affiliate_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  product_id VARCHAR(255),
  category VARCHAR(100),
  link_code VARCHAR(50) UNIQUE NOT NULL,
  full_url TEXT,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(15,2) DEFAULT 0,
  commission DECIMAL(15,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Cliques de Afiliados
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES affiliate_campaigns(id) ON DELETE SET NULL,
  ip_address VARCHAR(50),
  user_agent TEXT,
  referrer TEXT,
  country VARCHAR(100),
  city VARCHAR(100),
  device_type VARCHAR(50),
  browser VARCHAR(100),
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Conversões/Vendas de Afiliados
CREATE TABLE IF NOT EXISTS affiliate_conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES affiliate_campaigns(id) ON DELETE SET NULL,
  order_id VARCHAR(255),
  product_id VARCHAR(255),
  customer_email VARCHAR(255),
  order_value DECIMAL(15,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  commission_amount DECIMAL(15,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  approved_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_reference VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Pagamentos de Afiliados
CREATE TABLE IF NOT EXISTS affiliate_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  conversion_ids UUID[],
  payment_method VARCHAR(50) NOT NULL,
  payment_details JSONB,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  reference VARCHAR(255),
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(code);
CREATE INDEX IF NOT EXISTS idx_affiliates_status ON affiliates(status);
CREATE INDEX IF NOT EXISTS idx_affiliates_email ON affiliates(email);
CREATE INDEX IF NOT EXISTS idx_affiliate_campaigns_affiliate ON affiliate_campaigns(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_campaigns_product ON affiliate_campaigns(product_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_campaigns_link ON affiliate_campaigns(link_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_affiliate ON affiliate_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_campaign ON affiliate_clicks(campaign_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_affiliate ON affiliate_conversions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_status ON affiliate_conversions(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_payments_affiliate ON affiliate_payments(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_payments_status ON affiliate_payments(status);

-- Função para gerar código único de afiliado
CREATE OR REPLACE FUNCTION generate_affiliate_code()
RETURNS VARCHAR(20) AS $$
DECLARE
  new_code VARCHAR(20);
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Gera código aleatório de 8 caracteres
    new_code := 'KZ' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    
    -- Verifica se já existe
    SELECT EXISTS(SELECT 1 FROM affiliates WHERE code = new_code) INTO code_exists;
    
    -- Se não existe, retorna o código
    IF NOT code_exists THEN
      RETURN new_code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON affiliates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_campaigns_updated_at BEFORE UPDATE ON affiliate_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_conversions_updated_at BEFORE UPDATE ON affiliate_conversions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_payments_updated_at BEFORE UPDATE ON affiliate_payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security)
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_payments ENABLE ROW LEVEL SECURITY;

-- Políticas para Afiliados
CREATE POLICY "Afiliados podem ver seus próprios dados"
  ON affiliates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Qualquer um pode se registrar como afiliado"
  ON affiliates FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Afiliados podem atualizar seus próprios dados"
  ON affiliates FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas para Campanhas
CREATE POLICY "Afiliados podem ver suas campanhas"
  ON affiliate_campaigns FOR SELECT
  USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()));

CREATE POLICY "Afiliados podem criar campanhas"
  ON affiliate_campaigns FOR INSERT
  WITH CHECK (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()));

CREATE POLICY "Afiliados podem atualizar suas campanhas"
  ON affiliate_campaigns FOR UPDATE
  USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()));

-- Políticas para Cliques (público para tracking)
CREATE POLICY "Permitir registro de cliques"
  ON affiliate_clicks FOR INSERT
  WITH CHECK (true);

-- Políticas para Conversões
CREATE POLICY "Afiliados podem ver suas conversões"
  ON affiliate_conversions FOR SELECT
  USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()));

-- Políticas para Pagamentos
CREATE POLICY "Afiliados podem ver seus pagamentos"
  ON affiliate_payments FOR SELECT
  USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()));

-- Comentários nas tabelas
COMMENT ON TABLE affiliates IS 'Cadastro de afiliados da loja';
COMMENT ON TABLE affiliate_campaigns IS 'Campanhas e links de afiliados';
COMMENT ON TABLE affiliate_clicks IS 'Rastreamento de cliques nos links de afiliados';
COMMENT ON TABLE affiliate_conversions IS 'Conversões e vendas geradas por afiliados';
COMMENT ON TABLE affiliate_payments IS 'Pagamentos realizados aos afiliados';
