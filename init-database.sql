-- ========================================
-- KUDIMU - DADOS INICIAIS
-- Script para popular banco com dados de teste
-- NOTA: As tabelas já foram criadas pelo schema.sql
-- ========================================

-- Desabilitar foreign keys temporariamente para inserir dados
PRAGMA foreign_keys = OFF;

-- ========================================
-- USUÁRIOS DE TESTE
-- ========================================

-- Admin
INSERT OR IGNORE INTO users (id, nome, email, senha_hash, tipo_conta, reputacao, saldo_pontos, verificado, ativo, data_cadastro)
VALUES ('admin-001', 'Admin Kudimu', 'admin@kudimu.ao', 'mock_hash_admin123', 'admin', 1000, 5000, 1, 1, datetime('now'));

-- Cliente 1 (Empresa)
INSERT OR IGNORE INTO users (id, nome, email, senha_hash, tipo_conta, saldo_pontos, verificado, ativo, data_cadastro, localizacao, perfil)
VALUES ('cliente-001', 'João Silva', 'joao@empresaxyz.ao', 'mock_hash_cliente123', 'cliente', 0, 1, 1, datetime('now'), 'Luanda', 'empresario');

-- Cliente 2 (Teste)
INSERT OR IGNORE INTO users (id, nome, email, senha_hash, tipo_conta, saldo_pontos, verificado, ativo, data_cadastro, localizacao, perfil)
VALUES ('cliente-002', 'Cliente Teste', 'cliente@teste.ao', 'mock_hash_cliente123', 'cliente', 0, 1, 1, datetime('now'), 'Luanda', 'empresario');

-- Respondente 1
INSERT OR IGNORE INTO users (id, nome, email, senha_hash, tipo_conta, reputacao, saldo_pontos, verificado, ativo, data_cadastro, localizacao, perfil)
VALUES ('respondente-001', 'Maria Santos', 'maria@gmail.com', 'mock_hash_usuario123', 'respondente', 150, 750, 0, 1, datetime('now'), 'Benguela', 'profissional');

-- Respondente 2
INSERT OR IGNORE INTO users (id, nome, email, senha_hash, tipo_conta, reputacao, saldo_pontos, verificado, ativo, data_cadastro, localizacao, perfil)
VALUES ('respondente-002', 'Usuário Regular', 'usuario@teste.ao', 'mock_hash_usuario123', 'respondente', 150, 750, 0, 1, datetime('now'), 'Luanda', 'estudante');

-- ========================================
-- CLIENTES (informações de pagamento)
-- ========================================

INSERT OR IGNORE INTO clientes (id, user_id, nome, email, saldo_creditos, plano, created_at)
VALUES ('cliente-001', 'cliente-001', 'João Silva', 'joao@empresaxyz.ao', 50000, 'business', datetime('now'));

INSERT OR IGNORE INTO clientes (id, user_id, nome, email, saldo_creditos, plano, created_at)
VALUES ('cliente-002', 'cliente-002', 'Cliente Teste', 'cliente@teste.ao', 25000, 'starter', datetime('now'));

-- ========================================
-- CAMPANHAS DE TESTE
-- ========================================

INSERT INTO campanhas (
    titulo, descricao, categoria, tema, recompensa, meta_participantes, 
    orcamento_total, data_inicio, data_fim, tempo_estimado, 
    localizacao_alvo, idade_min, idade_max, genero_target, 
    interesses_target, nivel_educacao, tags, perguntas, 
    status, cliente_id, total_respostas, orcamento_gasto, 
    qualidade_media, ativo, created_at
) VALUES (
    'Estudo de Mercado - Produtos Tecnológicos',
    'Pesquisa sobre preferências de consumo de produtos tecnológicos em Luanda',
    'tecnologia',
    'Preferências de Consumo em Tecnologia',
    250,
    100,
    25000,
    '2025-02-01',
    '2025-02-28',
    10,
    'Luanda',
    18,
    65,
    'todos',
    'tecnologia,inovação,gadgets',
    'todos',
    'tecnologia,mercado,pesquisa',
    '[{"tipo":"escolha_multipla","pergunta":"Qual tipo de dispositivo você mais usa?","opcoes":["Smartphone","Laptop","Tablet","Desktop"]}]',
    'ativa',
    'cliente-001',
    15,
    3750,
    4.2,
    1,
    datetime('now', '-5 days')
);

INSERT INTO campanhas (
    titulo, descricao, categoria, tema, recompensa, meta_participantes, 
    orcamento_total, data_inicio, data_fim, tempo_estimado, 
    localizacao_alvo, idade_min, idade_max, genero_target, 
    interesses_target, nivel_educacao, tags, perguntas, 
    status, cliente_id, total_respostas, orcamento_gasto, 
    qualidade_media, ativo, created_at
) VALUES (
    'Pesquisa de Satisfação - Serviços Bancários',
    'Avaliação da experiência dos clientes com serviços bancários digitais',
    'financas',
    'Satisfação com Serviços Bancários',
    300,
    150,
    45000,
    '2025-02-05',
    '2025-03-05',
    15,
    'Luanda',
    25,
    60,
    'todos',
    'finanças,bancário,digital',
    'superior',
    'finanças,satisfação,banco',
    '[{"tipo":"escala","pergunta":"Como você avalia o app do seu banco?","escala":5}]',
    'pendente',
    'cliente-001',
    0,
    0,
    0,
    1,
    datetime('now', '-2 days')
);

-- ========================================
-- TRANSAÇÕES DE TESTE
-- ========================================

INSERT INTO transacoes (
    user_id, tipo, valor, metodo_pagamento, 
    transaction_id, status, metadata, created_at
) VALUES (
    'cliente-001',
    'compra_creditos',
    50000,
    'express_payment',
    'txn_ep_' || hex(randomblob(8)),
    'aprovado',
    '{"pacote":"business","creditos":50000}',
    datetime('now', '-10 days')
);

INSERT INTO transacoes (
    user_id, tipo, valor, metodo_pagamento, 
    transaction_id, status, metadata, created_at
) VALUES (
    'cliente-001',
    'criacao_campanha',
    -25000,
    NULL,
    'txn_camp_' || hex(randomblob(8)),
    'aprovado',
    '{"campanha_id":1,"titulo":"Estudo de Mercado"}',
    datetime('now', '-5 days')
);

INSERT INTO transacoes (
    user_id, tipo, valor, metodo_pagamento, 
    transaction_id, status, metadata, created_at
) VALUES (
    'cliente-002',
    'compra_creditos',
    25000,
    'multicaixa',
    'txn_mc_' || hex(randomblob(8)),
    'aprovado',
    '{"pacote":"starter","creditos":25000}',
    datetime('now', '-3 days')
);

-- ========================================
-- RESUMO
-- ========================================

-- Reabilitar foreign keys
PRAGMA foreign_keys = ON;

SELECT '✅ Dados iniciais inseridos com sucesso!' as status;
SELECT COUNT(*) as total_usuarios FROM users;
SELECT COUNT(*) as total_clientes FROM clientes;
SELECT COUNT(*) as total_campanhas FROM campanhas;
SELECT COUNT(*) as total_transacoes FROM transacoes;
