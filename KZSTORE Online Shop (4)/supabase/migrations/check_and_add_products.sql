-- ==========================================
-- VERIFICAR E ADICIONAR PRODUTOS DE TESTE
-- ==========================================

-- 1. Verificar se há produtos
SELECT COUNT(*) as total_produtos FROM products;

-- 2. Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- 3. Ver todos os produtos atuais
SELECT id, nome, categoria, preco_aoa, estoque, is_featured
FROM products
ORDER BY created_at DESC
LIMIT 10;

-- 4. ADICIONAR PRODUTOS DE TESTE (Execute apenas se não houver produtos)
-- Descomente as linhas abaixo se precisar adicionar produtos:

/*
INSERT INTO products (nome, descricao, categoria, preco_aoa, peso_kg, estoque, imagem_url, is_featured, featured_order)
VALUES
  (
    'Memória RAM DDR4 16GB ECC - HP ProLiant',
    'Memória RAM DDR4 de 16GB com suporte ECC para servidores HP. Alta performance e confiabilidade.',
    'RAM',
    450000,
    0.5,
    12,
    'https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&h=500&fit=crop',
    true,
    100
  ),
  (
    'Memória RAM DDR3 8GB UDIMM',
    'Memória RAM DDR3 de 8GB UDIMM para servidores e estações de trabalho. Ideal para expansão de memória.',
    'RAM',
    280000,
    0.4,
    8,
    'https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&h=500&fit=crop',
    true,
    99
  ),
  (
    'Memória RAM DDR5 32GB - Dell PowerEdge',
    'Memória RAM DDR5 de última geração com 32GB. Alta velocidade para servidores Dell PowerEdge.',
    'RAM',
    850000,
    0.6,
    5,
    'https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&h=500&fit=crop',
    true,
    98
  ),
  (
    'HDD SAS 2TB 7200RPM - Enterprise',
    'Hard disk SAS de 2TB com 7200 RPM. Ideal para servidores e aplicações enterprise que exigem alta capacidade.',
    'HDD',
    680000,
    1.2,
    15,
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop',
    true,
    97
  ),
  (
    'SSD NVMe 1TB - Samsung 980 Pro',
    'SSD NVMe de alta performance com 1TB. Velocidades de leitura até 7000MB/s.',
    'SSD',
    520000,
    0.3,
    20,
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop',
    false,
    0
  ),
  (
    'Processador Intel Xeon Gold 6248',
    'Processador Intel Xeon Gold de 20 núcleos para servidores de alta performance.',
    'Processador',
    1850000,
    0.8,
    3,
    'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=500&h=500&fit=crop',
    false,
    0
  ),
  (
    'Placa Mãe Servidor Dell PowerEdge',
    'Placa mãe para servidor Dell PowerEdge R740. Suporte para 2x Xeon Scalable.',
    'Placa Mãe',
    920000,
    2.5,
    4,
    'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=500&h=500&fit=crop',
    false,
    0
  ),
  (
    'Fonte de Alimentação 750W 80+ Gold',
    'Fonte redundante de 750W com certificação 80+ Gold. Para servidores e workstations.',
    'Fonte',
    380000,
    1.8,
    10,
    'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=500&h=500&fit=crop',
    false,
    0
  ),
  (
    'Switch 24 Portas Gigabit - Cisco',
    'Switch gerenciável Cisco de 24 portas Gigabit. Ideal para redes empresariais.',
    'Redes',
    1250000,
    3.2,
    6,
    'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500&h=500&fit=crop',
    false,
    0
  ),
  (
    'Roteador Enterprise WiFi 6',
    'Roteador empresarial com WiFi 6 (802.11ax). Suporte para 500+ dispositivos.',
    'Redes',
    890000,
    1.5,
    7,
    'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500&h=500&fit=crop',
    false,
    0
  );
*/

-- 5. Verificar produtos em destaque
SELECT nome, is_featured, featured_order, preco_aoa, estoque
FROM products
WHERE is_featured = true
ORDER BY featured_order DESC;

-- 6. Marcar produtos existentes como destaque (se preferir)
-- Descomente para marcar seus 4 primeiros produtos como destaque:
/*
UPDATE products
SET is_featured = true, featured_order = 100 - ROW_NUMBER() OVER (ORDER BY created_at DESC)
WHERE id IN (
  SELECT id FROM products ORDER BY created_at DESC LIMIT 4
);
*/
