-- ========================================
-- KUDIMU INSIGHTS - POPULAÇÃO DE DADOS DE TESTE EM MASSA
-- Script para criar ambiente de teste completo
-- Data: 13 de Fevereiro de 2026
-- ========================================

-- ========================================
-- 1. CRIAR 50 USUÁRIOS DE TESTE
-- ========================================

-- 10 Admins
INSERT OR IGNORE INTO users (id, nome, email, telefone, senha_hash, localizacao, perfil, reputacao, saldo_pontos, nivel, verificado, tipo_conta, data_cadastro, ativo)
VALUES 
('admin-01', 'Admin Principal', 'admin@kudimu.ao', '+244 923 000 001', 'mock_hash_admin123', 'Luanda', 'admin', 100, 0, 'Embaixador', 1, 'admin', datetime('now'), 1),
('admin-02', 'Admin Teste 2', 'admin2@kudimu.ao', '+244 923 000 002', 'mock_hash_admin123', 'Luanda', 'admin', 95, 0, 'Embaixador', 1, 'admin', datetime('now'), 1),
('admin-03', 'Admin Teste 3', 'admin3@kudimu.ao', '+244 923 000 003', 'mock_hash_admin123', 'Benguela', 'admin', 90, 0, 'Líder', 1, 'admin', datetime('now'), 1),
('admin-04', 'Admin Teste 4', 'admin4@kudimu.ao', '+244 923 000 004', 'mock_hash_admin123', 'Huambo', 'admin', 85, 0, 'Líder', 1, 'admin', datetime('now'), 1),
('admin-05', 'Admin Teste 5', 'admin5@kudimu.ao', '+244 923 000 005', 'mock_hash_admin123', 'Lubango', 'admin', 80, 0, 'Líder', 1, 'admin', datetime('now'), 1),
('admin-06', 'Admin Teste 6', 'admin6@kudimu.ao', '+244 923 000 006', 'mock_hash_admin123', 'Namibe', 'admin', 75, 0, 'Confiável', 1, 'admin', datetime('now'), 1),
('admin-07', 'Admin Teste 7', 'admin7@kudimu.ao', '+244 923 000 007', 'mock_hash_admin123', 'Cabinda', 'admin', 70, 0, 'Confiável', 1, 'admin', datetime('now'), 1),
('admin-08', 'Admin Teste 8', 'admin8@kudimu.ao', '+244 923 000 008', 'mock_hash_admin123', 'Uíge', 'admin', 65, 0, 'Confiável', 1, 'admin', datetime('now'), 1),
('admin-09', 'Admin Teste 9', 'admin9@kudimu.ao', '+244 923 000 009', 'mock_hash_admin123', 'Malanje', 'admin', 60, 0, 'Iniciante', 1, 'admin', datetime('now'), 1),
('admin-10', 'Admin Teste 10', 'admin10@kudimu.ao', '+244 923 000 010', 'mock_hash_admin123', 'Luanda', 'admin', 55, 0, 'Iniciante', 1, 'admin', datetime('now'), 1);

-- 20 Clientes
INSERT OR IGNORE INTO users (id, nome, email, telefone, senha_hash, localizacao, perfil, reputacao, saldo_pontos, nivel, verificado, tipo_conta, data_cadastro, ativo)
VALUES 
('client-01', 'Empresa ABC Lda', 'joao@empresaxyz.ao', '+244 923 100 001', 'mock_hash_cliente123', 'Luanda', 'empresarial', 0, 500000, 'Premium', 1, 'cliente', datetime('now'), 1),
('client-02', 'Tech Solutions Angola', 'maria@techsolutions.ao', '+244 923 100 002', 'mock_hash_cliente123', 'Luanda', 'empresarial', 0, 300000, 'Standard', 1, 'cliente', datetime('now'), 1),
('client-03', 'Banco Comercial Angola', 'comercial@bca.ao', '+244 923 100 003', 'mock_hash_cliente123', 'Luanda', 'empresarial', 0, 1000000, 'Enterprise', 1, 'cliente', datetime('now'), 1),
('client-04', 'Telecom Angola', 'pesquisa@telecom.ao', '+244 923 100 004', 'mock_hash_cliente123', 'Luanda', 'empresarial', 0, 750000, 'Premium', 1, 'cliente', datetime('now'), 1),
('client-05', 'Retail Market Lda', 'analytics@retail.ao', '+244 923 100 005', 'mock_hash_cliente123', 'Benguela', 'empresarial', 0, 450000, 'Standard', 1, 'cliente', datetime('now'), 1),
('client-06', 'Agro Business SA', 'info@agrobusiness.ao', '+244 923 100 006', 'mock_hash_cliente123', 'Huambo', 'empresarial', 0, 200000, 'Basic', 1, 'cliente', datetime('now'), 1),
('client-07', 'Educação Plus', 'pesquisas@educacaoplus.ao', '+244 923 100 007', 'mock_hash_cliente123', 'Lubango', 'educacional', 0, 350000, 'Standard', 1, 'cliente', datetime('now'), 1),
('client-08', 'Saúde Angola', 'estudos@saudeangola.ao', '+244 923 100 008', 'mock_hash_cliente123', 'Luanda', 'saude', 0, 600000, 'Premium', 1, 'cliente', datetime('now'), 1),
('client-09', 'Transport Solutions', 'pesquisa@transportsol.ao', '+244 923 100 009', 'mock_hash_cliente123', 'Luanda', 'empresarial', 0, 280000, 'Standard', 1, 'cliente', datetime('now'), 1),
('client-10', 'Media Group Angola', 'insights@mediagroup.ao', '+244 923 100 010', 'mock_hash_cliente123', 'Luanda', 'media', 0, 500000, 'Premium', 1, 'cliente', datetime('now'), 1),
('client-11', 'Construção Civil SA', 'estudos@construcao.ao', '+244 923 100 011', 'mock_hash_cliente123', 'Benguela', 'empresarial', 0, 150000, 'Basic', 1, 'cliente', datetime('now'), 1),
('client-12', 'Turismo Angola', 'pesquisas@turismo.ao', '+244 923 100 012', 'mock_hash_cliente123', 'Namibe', 'turismo', 0, 400000, 'Standard', 1, 'cliente', datetime('now'), 1),
('client-13', 'Energia Verde Lda', 'analytics@energiaverde.ao', '+244 923 100 013', 'mock_hash_cliente123', 'Luanda', 'empresarial', 0, 550000, 'Premium', 1, 'cliente', datetime('now'), 1),
('client-14', 'Fashion Angola', 'insights@fashion.ao', '+244 923 100 014', 'mock_hash_cliente123', 'Luanda', 'comercio', 0, 250000, 'Standard', 1, 'cliente', datetime('now'), 1),
('client-15', 'Restaurantes Unidos', 'pesquisas@restaurantes.ao', '+244 923 100 015', 'mock_hash_cliente123', 'Luanda', 'alimentacao', 0, 180000, 'Basic', 1, 'cliente', datetime('now'), 1),
('client-16', 'Academia Fitness', 'estudos@academiafitness.ao', '+244 923 100 016', 'mock_hash_cliente123', 'Luanda', 'desporto', 0, 120000, 'Basic', 1, 'cliente', datetime('now'), 1),
('client-17', 'Consultoria Estratégica', 'pesquisas@consultoria.ao', '+244 923 100 017', 'mock_hash_cliente123', 'Luanda', 'empresarial', 0, 800000, 'Enterprise', 1, 'cliente', datetime('now'), 1),
('client-18', 'Imobiliária Prime', 'analytics@imobiliaria.ao', '+244 923 100 018', 'mock_hash_cliente123', 'Luanda', 'imoveis', 0, 650000, 'Premium', 1, 'cliente', datetime('now'), 1),
('client-19', 'Segurança Total', 'estudos@seguranca.ao', '+244 923 100 019', 'mock_hash_cliente123', 'Luanda', 'seguranca', 0, 350000, 'Standard', 1, 'cliente', datetime('now'), 1),
('client-20', 'Universidade Angola', 'pesquisas@universidade.ao', '+244 923 100 020', 'mock_hash_cliente123', 'Luanda', 'educacional', 0, 900000, 'Enterprise', 1, 'cliente', datetime('now'), 1);

-- 20 Respondentes
INSERT OR IGNORE INTO users (id, nome, email, telefone, senha_hash, localizacao, perfil, reputacao, saldo_pontos, nivel, verificado, tipo_conta, data_cadastro, ativo)
VALUES 
('user-01', 'Maria Santos', 'maria@gmail.com', '+244 923 200 001', 'mock_hash_usuario123', 'Luanda', 'estudante', 250, 3500.00, 'Bronze', 1, 'usuario', datetime('now'), 1),
('user-02', 'João Silva', 'joao.silva@gmail.com', '+244 923 200 002', 'mock_hash_usuario123', 'Luanda', 'profissional', 450, 6200.00, 'Prata', 1, 'usuario', datetime('now'), 1),
('user-03', 'Ana Costa', 'ana.costa@outlook.com', '+244 923 200 003', 'mock_hash_usuario123', 'Benguela', 'estudante', 180, 2100.00, 'Bronze', 1, 'usuario', datetime('now'), 1),
('user-04', 'Carlos Eduardo', 'carlos.edu@yahoo.com', '+244 923 200 004', 'mock_hash_usuario123', 'Huambo', 'profissional', 750, 10500.00, 'Ouro', 1, 'usuario', datetime('now'), 1),
('user-05', 'Beatriz Lopes', 'beatriz.lopes@gmail.com', '+244 923 200 005', 'mock_hash_usuario123', 'Lubango', 'estudante', 95, 1200.00, 'Iniciante', 1, 'usuario', datetime('now'), 1),
('user-06', 'Pedro Martins', 'pedro.martins@gmail.com', '+244 923 200 006', 'mock_hash_usuario123', 'Luanda', 'profissional', 1250, 18000.00, 'Diamante', 1, 'usuario', datetime('now'), 1),
('user-07', 'Juliana Ferreira', 'juliana.f@hotmail.com', '+244 923 200 007', 'mock_hash_usuario123', 'Luanda', 'estudante', 320, 4800.00, 'Prata', 1, 'usuario', datetime('now'), 1),
('user-08', 'Ricardo Alves', 'ricardo.alves@gmail.com', '+244 923 200 008', 'mock_hash_usuario123', 'Cabinda', 'profissional', 580, 8400.00, 'Prata', 1, 'usuario', datetime('now'), 1),
('user-09', 'Fernanda Lima', 'fernanda.lima@yahoo.com', '+244 923 200 009', 'mock_hash_usuario123', 'Namibe', 'estudante', 140, 1800.00, 'Bronze', 1, 'usuario', datetime('now'), 1),
('user-10', 'Miguel Santos', 'miguel.santos@outlook.com', '+244 923 200 010', 'mock_hash_usuario123', 'Luanda', 'profissional', 890, 12600.00, 'Ouro', 1, 'usuario', datetime('now'), 1),
('user-11', 'Sofia Rodrigues', 'sofia.r@gmail.com', '+244 923 200 011', 'mock_hash_usuario123', 'Benguela', 'estudante', 210, 2900.00, 'Bronze', 1, 'usuario', datetime('now'), 1),
('user-12', 'André Oliveira', 'andre.oliveira@hotmail.com', '+244 923 200 012', 'mock_hash_usuario123', 'Luanda', 'profissional', 1100, 15400.00, 'Diamante', 1, 'usuario', datetime('now'), 1),
('user-13', 'Catarina Sousa', 'catarina.sousa@gmail.com', '+244 923 200 013', 'mock_hash_usuario123', 'Luanda', 'estudante', 65, 800.00, 'Iniciante', 1, 'usuario', datetime('now'), 1),
('user-14', 'Bruno Pereira', 'bruno.pereira@yahoo.com', '+244 923 200 014', 'mock_hash_usuario123', 'Huambo', 'profissional', 670, 9500.00, 'Ouro', 1, 'usuario', datetime('now'), 1),
('user-15', 'Mariana Dias', 'mariana.dias@outlook.com', '+244 923 200 015', 'mock_hash_usuario123', 'Luanda', 'estudante', 380, 5400.00, 'Prata', 1, 'usuario', datetime('now'), 1),
('user-16', 'Tiago Mendes', 'tiago.mendes@gmail.com', '+244 923 200 016', 'mock_hash_usuario123', 'Malanje', 'profissional', 520, 7200.00, 'Prata', 1, 'usuario', datetime('now'), 1),
('user-17', 'Inês Carvalho', 'ines.carvalho@hotmail.com', '+244 923 200 017', 'mock_hash_usuario123', 'Uíge', 'estudante', 155, 1950.00, 'Bronze', 1, 'usuario', datetime('now'), 1),
('user-18', 'Daniel Costa', 'daniel.costa@gmail.com', '+244 923 200 018', 'mock_hash_usuario123', 'Luanda', 'profissional', 1400, 20000.00, 'Diamante', 1, 'usuario', datetime('now'), 1),
('user-19', 'Laura Fernandes', 'laura.fernandes@yahoo.com', '+244 923 200 019', 'mock_hash_usuario123', 'Benguela', 'estudante', 95, 1150.00, 'Iniciante', 1, 'usuario', datetime('now'), 1),
('user-20', 'Rafael Silva', 'rafael.silva@outlook.com', '+244 923 200 020', 'mock_hash_usuario123', 'Luanda', 'profissional', 980, 13800.00, 'Ouro', 1, 'usuario', datetime('now'), 1);

-- ========================================
-- 2. POPULAR CAMPANHAS DE TESTE (20 campanhas)
-- ========================================

INSERT OR IGNORE INTO campanhas (id, titulo, descricao, cliente_id, tema, recompensa_por_resposta, meta_participantes, total_respostas, data_inicio, data_fim, status, publico_alvo, created_at)
VALUES 
('camp-massa-01', 'Pesquisa sobre Mobilidade Urbana em Luanda', 'Queremos entender como os cidadãos se deslocam na capital', 'client-01', 'Mobilidade', 500, 1000, 0, datetime('now', '-5 days'), datetime('now', '+25 days'), 'ativa', '{"idade_min":18,"idade_max":65}', datetime('now', '-5 days')),
('camp-massa-02', 'Hábitos de Consumo Digital', 'Estudo sobre compras online em Angola', 'client-02', 'Tecnologia', 300, 800, 0, datetime('now', '-3 days'), datetime('now', '+27 days'), 'ativa', '{"idade_min":18,"idade_max":45}', datetime('now', '-3 days')),
('camp-massa-03', 'Alimentação Saudável', 'Como os angolanos se alimentam no dia a dia', 'client-03', 'Saúde', 200, 500, 0, datetime('now', '-7 days'), datetime('now', '+23 days'), 'ativa', '{"idade_min":18,"idade_max":60}', datetime('now', '-7 days')),
('camp-massa-04', 'Educação e Tecnologia', 'O uso de tecnologia nas escolas', 'client-07', 'Educação', 400, 600, 0, datetime('now', '-2 days'), datetime('now', '+28 days'), 'ativa', '{"idade_min":18,"idade_max":50}', datetime('now', '-2 days')),
('camp-massa-05', 'Turismo em Angola', 'Destinos preferidos dos angolanos', 'client-12', 'Turismo', 350, 700, 0, datetime('now', '-4 days'), datetime('now', '+26 days'), 'ativa', '{"idade_min":20,"idade_max":55}', datetime('now', '-4 days')),
('camp-massa-06', 'Empreendedorismo Jovem', 'Desafios e oportunidades para jovens empreendedores', 'client-05', 'Economia', 450, 500, 0, datetime('now', '-1 day'), datetime('now', '+29 days'), 'ativa', '{"idade_min":18,"idade_max":35}', datetime('now', '-1 day')),
('camp-massa-07', 'Segurança nas Cidades', 'Percepção de segurança pública', 'client-19', 'Segurança', 250, 900, 0, datetime('now', '-6 days'), datetime('now', '+24 days'), 'ativa', '{"idade_min":18,"idade_max":70}', datetime('now', '-6 days')),
('camp-massa-08', 'Meio Ambiente e Sustentabilidade', 'Consciência ambiental em Angola', 'client-13', 'Ambiente', 300, 650, 0, datetime('now', '-8 days'), datetime('now', '+22 days'), 'ativa', '{"idade_min":18,"idade_max":60}', datetime('now', '-8 days')),
('camp-massa-09', 'Entretenimento e Lazer', 'Preferências de entretenimento dos angolanos', 'client-10', 'Cultura', 320, 800, 0, datetime('now', '-3 days'), datetime('now', '+27 days'), 'ativa', '{"idade_min":16,"idade_max":55}', datetime('now', '-3 days')),
('camp-massa-10', 'Mercado de Trabalho', 'Oportunidades e desafios no emprego', 'client-17', 'Trabalho', 400, 1000, 0, datetime('now', '-5 days'), datetime('now', '+25 days'), 'ativa', '{"idade_min":18,"idade_max":65}', datetime('now', '-5 days')),
('camp-massa-11', 'Serviços Bancários', 'Satisfação com serviços bancários', 'client-03', 'Finanças', 350, 700, 0, datetime('now', '-2 days'), datetime('now', '+28 days'), 'ativa', '{"idade_min":18,"idade_max":70}', datetime('now', '-2 days')),
('camp-massa-12', 'Telecomunicações em Angola', 'Qualidade dos serviços de telecom', 'client-04', 'Tecnologia', 380, 900, 0, datetime('now', '-4 days'), datetime('now', '+26 days'), 'ativa', '{"idade_min":18,"idade_max":65}', datetime('now', '-4 days')),
('camp-massa-13', 'Construção Civil e Habitação', 'Necessidades habitacionais', 'client-11', 'Habitação', 280, 550, 0, datetime('now', '-7 days'), datetime('now', '+23 days'), 'ativa', '{"idade_min":25,"idade_max":70}', datetime('now', '-7 days')),
('camp-massa-14', 'Moda e Vestuário', 'Tendências de moda em Angola', 'client-14', 'Moda', 220, 600, 0, datetime('now', '-1 day'), datetime('now', '+29 days'), 'ativa', '{"idade_min":16,"idade_max":50}', datetime('now', '-1 day')),
('camp-massa-15', 'Gastronomia Angolana', 'Pratos e restaurantes preferidos', 'client-15', 'Alimentação', 260, 500, 0, datetime('now', '-6 days'), datetime('now', '+24 days'), 'ativa', '{"idade_min":18,"idade_max":65}', datetime('now', '-6 days')),
('camp-massa-16', 'Fitness e Bem-Estar', 'Hábitos de exercício físico', 'client-16', 'Saúde', 300, 450, 0, datetime('now', '-3 days'), datetime('now', '+27 days'), 'ativa', '{"idade_min":18,"idade_max":55}', datetime('now', '-3 days')),
('camp-massa-17', 'Imobiliário em Luanda', 'Mercado imobiliário e preços', 'client-18', 'Imóveis', 420, 700, 0, datetime('now', '-5 days'), datetime('now', '+25 days'), 'ativa', '{"idade_min":25,"idade_max":70}', datetime('now', '-5 days')),
('camp-massa-18', 'Energia e Eletricidade', 'Qualidade do fornecimento de energia', 'client-13', 'Infraestrutura', 340, 850, 0, datetime('now', '-8 days'), datetime('now', '+22 days'), 'ativa', '{"idade_min":18,"idade_max":70}', datetime('now', '-8 days')),
('camp-massa-19', 'Educação Superior', 'Qualidade do ensino universitário', 'client-20', 'Educação', 500, 1000, 0, datetime('now', '-2 days'), datetime('now', '+28 days'), 'ativa', '{"idade_min":18,"idade_max":30}', datetime('now', '-2 days')),
('camp-massa-20', 'Saúde Pública', 'Acesso e qualidade dos serviços de saúde', 'client-08', 'Saúde', 450, 1200, 0, datetime('now', '-4 days'), datetime('now', '+26 days'), 'ativa', '{"idade_min":18,"idade_max":70}', datetime('now', '-4 days'));

-- ========================================
-- 3. CRIAR PERGUNTAS PARA AS CAMPANHAS
-- ========================================

-- Perguntas para camp-massa-01 (Mobilidade)
INSERT OR IGNORE INTO questions (id, campanha_id, texto, tipo, opcoes, ordem, obrigatoria)
VALUES 
('q-massa-01-1', 'camp-massa-01', 'Qual é o seu principal meio de transporte?', 'multipla_escolha', '["Carro próprio","Táxi","Candongueiro","Mota-táxi","A pé","Outro"]', 1, 1),
('q-massa-01-2', 'camp-massa-01', 'Quanto tempo leva no trajeto casa-trabalho?', 'multipla_escolha', '["Menos de 30 min","30-60 min","1-2 horas","Mais de 2 horas"]', 2, 1),
('q-massa-01-3', 'camp-massa-01', 'Está satisfeito com o transporte público em Luanda?', 'escala', '{"min":1,"max":5,"labels":["Muito insatisfeito","Insatisfeito","Neutro","Satisfeito","Muito satisfeito"]}', 3, 1);

-- Perguntas para camp-massa-02 (Consumo Digital)
INSERT OR IGNORE INTO questions (id, campanha_id, texto, tipo, opcoes, ordem, obrigatoria)
VALUES 
('q-massa-02-1', 'camp-massa-02', 'Já fez compras online?', 'sim_nao', 1, 1),
('q-massa-02-2', 'camp-massa-02', 'Que tipo de produtos compra online?', 'multipla_escolha', '["Eletrônicos","Roupas","Alimentos","Livros","Serviços","Não compro"]', 2, 1),
('q-massa-02-3', 'camp-massa-02', 'Qual a sua principal preocupação nas compras online?', 'multipla_escolha', '["Segurança de pagamento","Tempo de entrega","Qualidade do produto","Devolução","Preço"]', 3, 1);

-- Perguntas genéricas para as outras campanhas (para teste)
INSERT OR IGNORE INTO questions (id, campanha_id, texto, tipo, opcoes, ordem, obrigatoria)
SELECT 
    'q-massa-' || SUBSTR(id, -2) || '-1',
    id,
    'Como avalia este tema?',
    'escala',
    '{"min":1,"max":5}',
    1,
    1
FROM campanhas 
WHERE id LIKE 'camp-massa-%' AND id NOT IN ('camp-massa-01', 'camp-massa-02');

-- ========================================
-- 4. CRIAR LEVANTAMENTOS DE TESTE
-- ========================================

INSERT OR IGNORE INTO levantamentos (id, usuario_id, valor, metodo_pagamento, dados_pagamento, status, data_solicitacao)
VALUES 
('lev-massa-01', 'user-01', 2000, 'unitel', '{"telefone":"923200001"}', 'pendente', datetime('now', '-2 hours')),
('lev-massa-02', 'user-02', 5000, 'banco', '{"iban":"AO06000000001234567890","titular":"João Silva","banco":"BAI"}', 'pendente', datetime('now', '-5 hours')),
('lev-massa-03', 'user-04', 8000, 'unitel', '{"telefone":"923200004"}', 'aprovado', datetime('now', '-1 day')),
('lev-massa-04', 'user-06', 15000, 'banco', '{"iban":"AO06000000009876543210","titular":"Pedro Martins","banco":"BFA"}', 'processado', datetime('now', '-3 days')),
('lev-massa-05', 'user-08', 6000, 'movicel', '{"telefone":"923200008"}', 'pendente', datetime('now', '-4 hours')),
('lev-massa-06', 'user-10', 10000, 'ekwanza', '{"telefone":"923200010"}', 'pendente', datetime('now', '-1 hour')),
('lev-massa-07', 'user-12', 12000, 'banco', '{"iban":"AO06000000005555555555","titular":"André Oliveira","banco":"BCI"}', 'aprovado', datetime('now', '-2 days')),
('lev-massa-08', 'user-14', 7500, 'unitel', '{"telefone":"923200014"}', 'pendente', datetime('now', '-6 hours')),
('lev-massa-09', 'user-18', 18000, 'banco', '{"iban":"AO06000000007777777777","titular":"Daniel Costa","banco":"BAI"}', 'processado', datetime('now', '-5 days')),
('lev-massa-10', 'user-20', 11000, 'paypay', '{"telefone":"923200020"}', 'pendente', datetime('now', '-3 hours'));

-- ========================================
-- 5. CRIAR RECOMPENSAS (histórico de ganhos)
-- ========================================

INSERT OR IGNORE INTO rewards (id, usuario_id, campanha_id, valor, tipo, status, data_criacao)
VALUES 
('rew-massa-01', 'user-01', 'camp-massa-01', 500, 'pontos', 'pago', datetime('now', '-10 days')),
('rew-massa-02', 'user-01', 'camp-massa-02', 300, 'pontos', 'pago', datetime('now', '-8 days')),
('rew-massa-03', 'user-02', 'camp-massa-01', 500, 'pontos', 'pago', datetime('now', '-9 days')),
('rew-massa-04', 'user-02', 'camp-massa-03', 200, 'pontos', 'pago', datetime('now', '-7 days')),
('rew-massa-05', 'user-04', 'camp-massa-04', 400, 'pontos', 'pago', datetime('now', '-6 days')),
('rew-massa-06', 'user-06', 'camp-massa-05', 350, 'pontos', 'pago', datetime('now', '-5 days')),
('rew-massa-07', 'user-08', 'camp-massa-06', 450, 'pontos', 'pago', datetime('now', '-4 days')),
('rew-massa-08', 'user-10', 'camp-massa-07', 250, 'pontos', 'pago', datetime('now', '-3 days')),
('rew-massa-09', 'user-12', 'camp-massa-08', 300, 'pontos', 'pago', datetime('now', '-2 days')),
('rew-massa-10', 'user-14', 'camp-massa-09', 320, 'pontos', 'pago', datetime('now', '-1 day'));

-- ========================================
-- RESUMO
-- ========================================

SELECT '========================================' as '';
SELECT 'DADOS DE TESTE POPULADOS COM SUCESSO!' as '';
SELECT '========================================' as '';
SELECT '' as '';
SELECT 'Usuários criados:' as '';
SELECT '- 10 Admins' as '';
SELECT '- 20 Clientes' as '';
SELECT '- 20 Respondentes' as '';
SELECT '' as '';
SELECT 'Campanhas: 20 ativas' as '';
SELECT 'Perguntas: ~60 questões' as '';
SELECT 'Levantamentos: 10 (4 pendentes, 2 aprovados, 4 processados)' as '';
SELECT 'Recompensas: 10 históricos' as '';
SELECT '' as '';
SELECT 'Execute agora o script de teste:' as '';
SELECT './test_plataforma_completo.sh' as '';
SELECT '========================================' as '';
