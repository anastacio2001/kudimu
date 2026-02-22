-- ===================================================
-- DADOS DE TESTE PARA KUDIMU
-- ===================================================

-- Inserir usuário administrador de teste
INSERT OR REPLACE INTO users (
    id, nome, email, telefone, senha_hash, 
    localizacao, perfil, reputacao, saldo_pontos, 
    nivel, verificado, tipo_conta, data_cadastro, ativo
) VALUES (
    'admin-001', 
    'Admin Kudimu', 
    'admin@kudimu.ao', 
    '+244 900 000 001',
    '$2b$10$N9qo8uLOickgx2ZMRitAv.Hg9fUFOsKLhE7R2QE0iOe6H8bOqPJU.', -- senha: admin123
    'Luanda',
    'administrador',
    100,
    0.0,
    'Embaixador',
    1,
    'admin',
    CURRENT_TIMESTAMP,
    1
);

-- Inserir cliente empresa de teste
INSERT OR REPLACE INTO users (
    id, nome, email, telefone, senha_hash, 
    localizacao, perfil, reputacao, saldo_pontos, 
    nivel, verificado, tipo_conta, data_cadastro, ativo
) VALUES (
    'client-001', 
    'João Silva - Empresa XYZ', 
    'joao@empresaxyz.ao', 
    '+244 900 000 002',
    '$2b$10$N9qo8uLOickgx2ZMRitAv.Hg9fUFOsKLhE7R2QE0iOe6H8bOqPJU.', -- senha: cliente123
    'Luanda',
    'empresarial',
    85,
    0.0,
    'Confiável',
    1,
    'cliente',
    CURRENT_TIMESTAMP,
    1
);

-- Inserir usuário normal de teste
INSERT OR REPLACE INTO users (
    id, nome, email, telefone, senha_hash, 
    localizacao, perfil, reputacao, saldo_pontos, 
    nivel, verificado, tipo_conta, data_cadastro, ativo
) VALUES (
    'user-001', 
    'Maria Santos', 
    'maria@gmail.com', 
    '+244 900 000 003',
    '$2b$10$N9qo8uLOickgx2ZMRitAv.Hg9fUFOsKLhE7R2QE0iOe6H8bOqPJU.', -- senha: usuario123
    'Benguela',
    'profissional',
    75,
    45.0,
    'Confiável',
    1,
    'usuario',
    CURRENT_TIMESTAMP,
    1
);

-- Inserir campanha de teste
INSERT OR REPLACE INTO campaigns (
    id, titulo, descricao, cliente, cliente_id, tema, tipo,
    recompensa_por_resposta, quantidade_alvo, quantidade_atual,
    data_inicio, data_fim, status, publico_alvo, reputacao_minima,
    data_criacao
) VALUES (
    'camp-001',
    'Pesquisa sobre Hábitos de Consumo em Angola',
    'Queremos entender melhor os hábitos de consumo dos angolanos para desenvolver produtos mais adequados ao mercado local.',
    'Empresa XYZ',
    'client-001',
    'consumo',
    'comercial',
    25.0,
    1000,
    75,
    DATETIME('now', '-7 days'),
    DATETIME('now', '+30 days'),
    'ativa',
    '{"idade": "18-65", "localizacao": ["Luanda", "Benguela", "Huambo"], "renda": "qualquer"}',
    50,
    CURRENT_TIMESTAMP
);

-- Inserir algumas respostas de teste
INSERT OR REPLACE INTO responses (
    id, campanha_id, usuario_id, respostas, pontos_ganhos,
    tempo_resposta, data_resposta
) VALUES (
    'resp-001',
    'camp-001',
    'user-001',
    '{"q1": "Sim", "q2": "Mensalmente", "q3": "Online", "feedback": "Muito boa iniciativa!"}',
    25.0,
    180,
    CURRENT_TIMESTAMP
);

-- Inserir pagamentos de teste
INSERT OR REPLACE INTO payments (
    id, usuario_id, valor, metodo, referencia_externa,
    status, data_criacao
) VALUES (
    'pay-001',
    'user-001',
    25.0,
    'mb_way',
    'MB123456789',
    'concluido',
    CURRENT_TIMESTAMP
);

-- Mostrar resumo dos dados inseridos
SELECT 'USUÁRIOS CRIADOS:' as info;
SELECT tipo_conta, COUNT(*) as total FROM users GROUP BY tipo_conta;

SELECT 'CAMPANHAS ATIVAS:' as info;
SELECT COUNT(*) as total FROM campaigns WHERE status = 'ativa';

SELECT 'RESPOSTAS REGISTRADAS:' as info;
SELECT COUNT(*) as total FROM responses;