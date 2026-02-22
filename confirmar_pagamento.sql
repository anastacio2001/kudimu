-- ==========================================
-- SCRIPT DE CONFIRMAÇÃO MANUAL DE PAGAMENTO
-- ==========================================
-- 
-- USO:
-- 1. Substitua os valores entre <> pelos dados reais
-- 2. Execute via wrangler:
--    npx wrangler d1 execute kudimu-db --local --file=confirmar_pagamento.sql
--
-- OU copie e cole no terminal:
--    npx wrangler d1 execute kudimu-db --local --command="[COLE O SQL AQUI]"
--

-- ==========================================
-- PASSO 1: CONSULTAR PAGAMENTOS PENDENTES
-- ==========================================

SELECT 
  t.id,
  t.referencia,
  c.nome as cliente_nome,
  u.email as cliente_email,
  t.quantidade as creditos,
  t.descricao,
  t.created_at as data_solicitacao,
  datetime('now', 'localtime') as data_atual
FROM transacoes t
JOIN clientes c ON t.cliente_id = c.user_id
JOIN users u ON c.user_id = u.id
WHERE t.tipo = 'pendente'
ORDER BY t.created_at DESC;

-- ==========================================
-- PASSO 2: CONFIRMAR PAGAMENTO ESPECÍFICO
-- ==========================================
-- 
-- INSTRUÇÕES:
-- 1. Copie a REFERÊNCIA do pagamento que deseja confirmar (ex: KDM-1738945612345-A7B3C9)
-- 2. Substitua <REFERENCIA> abaixo pela referência copiada
-- 3. Substitua <CLIENTE_ID> pelo user_id do cliente
-- 4. Execute o script completo
--

BEGIN TRANSACTION;

-- Buscar dados da transação pendente
-- SELECT * FROM transacoes WHERE referencia = '<REFERENCIA>';

-- Adicionar créditos ao cliente
UPDATE clientes 
SET saldo_creditos = saldo_creditos + (
  SELECT quantidade FROM transacoes WHERE referencia = '<REFERENCIA>'
)
WHERE user_id = (
  SELECT cliente_id FROM transacoes WHERE referencia = '<REFERENCIA>'
);

-- Atualizar transação para confirmada
UPDATE transacoes 
SET tipo = 'credito',
    descricao = REPLACE(descricao, 'Pagamento pendente', 'Pagamento confirmado'),
    saldo_apos = (
      SELECT saldo_creditos FROM clientes WHERE user_id = (
        SELECT cliente_id FROM transacoes WHERE referencia = '<REFERENCIA>'
      )
    )
WHERE referencia = '<REFERENCIA>';

COMMIT;

-- ==========================================
-- PASSO 3: VERIFICAR SE FOI CONFIRMADO
-- ==========================================

SELECT 
  t.id,
  t.referencia,
  t.tipo,
  t.quantidade,
  t.saldo_apos,
  c.saldo_creditos as saldo_atual,
  t.descricao,
  t.created_at
FROM transacoes t
JOIN clientes c ON t.cliente_id = c.user_id
WHERE t.referencia = '<REFERENCIA>';

-- ==========================================
-- EXEMPLO COMPLETO (COPIAR E COLAR)
-- ==========================================
-- 
-- Para confirmar o pagamento KDM-1738945612345-A7B3C9:
--

/*
BEGIN TRANSACTION;

UPDATE clientes 
SET saldo_creditos = saldo_creditos + (
  SELECT quantidade FROM transacoes WHERE referencia = 'KDM-1738945612345-A7B3C9'
)
WHERE user_id = (
  SELECT cliente_id FROM transacoes WHERE referencia = 'KDM-1738945612345-A7B3C9'
);

UPDATE transacoes 
SET tipo = 'credito',
    descricao = REPLACE(descricao, 'Pagamento pendente', 'Pagamento confirmado'),
    saldo_apos = (
      SELECT saldo_creditos FROM clientes WHERE user_id = (
        SELECT cliente_id FROM transacoes WHERE referencia = 'KDM-1738945612345-A7B3C9'
      )
    )
WHERE referencia = 'KDM-1738945612345-A7B3C9';

COMMIT;
*/

-- ==========================================
-- ATIVAR PLANO (SE APLICÁVEL)
-- ==========================================
--
-- Se o pagamento foi para um plano específico, ativar a assinatura:
--

/*
BEGIN TRANSACTION;

-- Buscar ID do plano da descrição
-- Assumindo descrição: "Pagamento confirmado - campanha-essencial - Aguardando confirmação bancária"

INSERT INTO assinaturas_clientes (
  id,
  cliente_id,
  plano_id,
  tipo,
  creditos_inclusos,
  features_json,
  campanhas_criadas_mes,
  data_inicio,
  proxima_renovacao,
  status,
  created_at
)
SELECT 
  'assin-' || strftime('%s', 'now') || '-' || abs(random() % 1000000),
  '<CLIENTE_ID>',
  '<PLANO_ID>', -- Ex: 'campanha-essencial'
  CASE WHEN p.tipo = 'assinatura' THEN 'mensal' ELSE 'unica' END,
  p.creditos_inclusos,
  json_object(
    'max_respostas', p.max_respostas,
    'max_campanhas_mes', p.max_campanhas_mes,
    'segmentacao_avancada', p.segmentacao_avancada,
    'analise_ia', p.analise_ia
  ),
  0,
  datetime('now'),
  CASE WHEN p.tipo = 'assinatura' 
    THEN datetime('now', '+30 days') 
    ELSE NULL 
  END,
  'ativa',
  datetime('now')
FROM planos p
WHERE p.id = '<PLANO_ID>';

-- Atualizar campo plano no cliente
UPDATE clientes 
SET plano = (SELECT nome FROM planos WHERE id = '<PLANO_ID>')
WHERE user_id = '<CLIENTE_ID>';

COMMIT;
*/

-- ==========================================
-- CONSULTAS ÚTEIS PARA ADMIN
-- ==========================================

-- Total de pagamentos pendentes
-- SELECT COUNT(*) as total_pendente, SUM(quantidade) as valor_total FROM transacoes WHERE tipo = 'pendente';

-- Pagamentos confirmados hoje
-- SELECT COUNT(*) as confirmados_hoje, SUM(quantidade) as receita_hoje FROM transacoes WHERE tipo = 'credito' AND DATE(created_at) = DATE('now');

-- Histórico completo de um cliente
-- SELECT * FROM transacoes WHERE cliente_id = '<CLIENTE_ID>' ORDER BY created_at DESC;
