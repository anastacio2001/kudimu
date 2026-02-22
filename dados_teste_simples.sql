-- ========================================
-- KUDIMU INSIGHTS - DADOS DE TESTE SIMPLES
-- Apenas dados básicos para testar
-- ========================================

PRAGMA foreign_keys = OFF;

-- Limpar dados existentes
DELETE FROM campaigns;
DELETE FROM users;

-- Admins
INSERT OR IGNORE INTO users (id, nome, email, telefone, senha_hash, localizacao, perfil, reputacao, saldo_pontos, nivel, verificado, tipo_conta, data_cadastro, ativo)
VALUES 
('admin-01', 'Admin Principal', 'admin@kudimu.ao', '+244 923 000 001', 'mock_hash_admin123', 'Luanda', 'admin', 100, 0, 'Embaixador', 1, 'admin', datetime('now'), 1),
('admin-02', 'Admin Teste', 'admin2@kudimu.ao', '+244 923 000 002', 'mock_hash_admin123', 'Luanda', 'admin', 95, 0, 'Embaixador', 1, 'admin', datetime('now'), 1);

-- Clientes
INSERT OR IGNORE INTO users (id, nome, email, telefone, senha_hash, localizacao, perfil, reputacao, saldo_pontos, nivel, verificado, tipo_conta, data_cadastro, ativo)
VALUES 
('client-01', 'Empresa XYZ Lda', 'joao@empresaxyz.ao', '+244 923 100 001', 'mock_hash_cliente123', 'Luanda', 'empresarial', 0, 500000, 'Premium', 1, 'cliente', datetime('now'), 1),
('client-02', 'Tech Solutions', 'maria@techsolutions.ao', '+244 923 100 002', 'mock_hash_cliente123', 'Luanda', 'empresarial', 0, 300000, 'Standard', 1, 'cliente', datetime('now'), 1);

-- Usuários normais
INSERT OR IGNORE INTO users (id, nome, email, telefone, senha_hash, localizacao, perfil, reputacao, saldo_pontos, nivel, verificado, tipo_conta, data_cadastro, ativo)
VALUES 
('user-01', 'Maria Santos', 'maria@gmail.com', '+244 923 200 001', 'mock_hash_usuario123', 'Luanda', 'estudante', 250, 3500.00, 'Bronze', 1, 'usuario', datetime('now'), 1),
('user-02', 'João Silva', 'joao.silva@gmail.com', '+244 923 200 002', 'mock_hash_usuario123', 'Luanda', 'profissional', 450, 6200.00, 'Prata', 1, 'usuario', datetime('now'), 1);

-- Campanhas
INSERT OR IGNORE INTO campaigns (id, titulo, descricao, cliente, cliente_id, tema, tipo, recompensa_por_resposta, quantidade_alvo, quantidade_atual, data_inicio, data_fim, status, publico_alvo, reputacao_minima, data_criacao)
VALUES 
('camp-01', 'Pesquisa de Mobilidade', 'Como você se desloca em Luanda?', 'Empresa XYZ', 'client-01', 'Mobilidade', 'comercial', 500, 1000, 0, datetime('now', '-5 days'), datetime('now', '+25 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-5 days')),
('camp-02', 'Consumo Digital', 'Hábitos de compras online', 'Tech Solutions', 'client-02', 'Tecnologia', 'comercial', 300, 800, 0, datetime('now', '-3 days'), datetime('now', '+27 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-3 days'));
