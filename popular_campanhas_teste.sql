-- ========================================
-- SCRIPT: Popular Campanhas de Teste
-- Objetivo: Criar 10 campanhas ativas para respondentes testarem
-- Data: 11 de Fevereiro de 2026
-- ========================================

-- ========================================
-- CAMPANHA 1: Mobilidade Urbana em Luanda
-- ========================================
INSERT INTO campaigns (
    id, titulo, descricao, cliente, cliente_id, tema, tipo,
    recompensa_por_resposta, quantidade_alvo, quantidade_atual,
    data_inicio, data_fim, status, publico_alvo, reputacao_minima
) VALUES (
    'camp-001',
    'Pesquisa sobre Mobilidade Urbana em Luanda',
    'Queremos entender os hábitos de transporte dos cidadãos de Luanda para melhorar o sistema de transporte público.',
    'Governo Provincial de Luanda',
    'user-1762153768833', -- ID do cliente João
    'Transporte',
    'comercial',
    500.0,
    1000,
    0,
    '2026-02-11 00:00:00',
    '2026-03-15 23:59:59',
    'ativa',
    '{"idade_min": 18, "idade_max": 65, "localizacao": ["Luanda"]}',
    0
);

-- Perguntas da Campanha 1
INSERT INTO questions (id, campanha_id, texto, tipo, opcoes, ordem, obrigatoria) VALUES
('q-001-1', 'camp-001', 'Qual é o seu principal meio de transporte?', 'multipla_escolha', 
 '["Carro próprio", "Táxi/Kupapata", "Autocarro (Ônibus)", "Candongueiro", "Moto", "A pé", "Outro"]', 1, 1),
('q-001-2', 'camp-001', 'Quanto tempo você gasta diariamente em deslocamento?', 'multipla_escolha',
 '["Menos de 30 min", "30 min - 1 hora", "1-2 horas", "2-3 horas", "Mais de 3 horas"]', 2, 1),
('q-001-3', 'camp-001', 'Qual a maior dificuldade no transporte público em Luanda?', 'multipla_escolha',
 '["Falta de autocarros", "Superlotação", "Preço elevado", "Rotas limitadas", "Insegurança", "Demora"]', 3, 1),
('q-001-4', 'camp-001', 'Você usaria um aplicativo de transporte público se existisse?', 'sim_nao', '["Sim", "Não"]', 4, 1),
('q-001-5', 'camp-001', 'Sugestões para melhorar o transporte em Luanda:', 'texto_livre', NULL, 5, 0);

-- ========================================
-- CAMPANHA 2: Hábitos de Consumo Digital
-- ========================================
INSERT INTO campaigns (
    id, titulo, descricao, cliente, cliente_id, tema, tipo,
    recompensa_por_resposta, quantidade_alvo, quantidade_atual,
    data_inicio, data_fim, status, publico_alvo, reputacao_minima
) VALUES (
    'camp-002',
    'Hábitos de Consumo Digital em Angola',
    'Pesquisa sobre como os angolanos usam a internet para compras e serviços online.',
    'Angola Telecom',
    'user-1762153768833',
    'Tecnologia',
    'comercial',
    300.0,
    500,
    0,
    '2026-02-11 00:00:00',
    '2026-03-20 23:59:59',
    'ativa',
    '{"idade_min": 16, "idade_max": 60}',
    0
);

INSERT INTO questions (id, campanha_id, texto, tipo, opcoes, ordem, obrigatoria) VALUES
('q-002-1', 'camp-002', 'Com que frequência você acessa a internet?', 'multipla_escolha',
 '["Várias vezes por dia", "Uma vez por dia", "Algumas vezes por semana", "Raramente", "Nunca"]', 1, 1),
('q-002-2', 'camp-002', 'Você já fez compras online?', 'sim_nao', '["Sim", "Não"]', 2, 1),
('q-002-3', 'camp-002', 'Qual a principal barreira para comprar online?', 'multipla_escolha',
 '["Não confio", "Preços altos", "Falta de opções de pagamento", "Dificuldade de entrega", "Prefiro presencial"]', 3, 1),
('q-002-4', 'camp-002', 'Você usa aplicativos de pagamento digital?', 'multipla_escolha',
 '["Multicaixa Express", "e-Kwanza", "PayPal", "Outros", "Não uso"]', 4, 1),
('q-002-5', 'camp-002', 'Quanto você gasta mensalmente com internet móvel?', 'multipla_escolha',
 '["Menos de 2.000 AOA", "2.000-5.000 AOA", "5.000-10.000 AOA", "Mais de 10.000 AOA"]', 5, 1);

-- ========================================
-- CAMPANHA 3: Alimentação Saudável
-- ========================================
INSERT INTO campaigns (
    id, titulo, descricao, cliente, cliente_id, tema, tipo,
    recompensa_por_resposta, quantidade_alvo, quantidade_atual,
    data_inicio, data_fim, status, publico_alvo, reputacao_minima
) VALUES (
    'camp-003',
    'Hábitos Alimentares e Saúde',
    'Pesquisa sobre nutrição e alimentação dos angolanos para programa de saúde pública.',
    'Ministério da Saúde',
    'user-1762153768833',
    'Saúde',
    'social',
    200.0,
    800,
    0,
    '2026-02-11 00:00:00',
    '2026-03-25 23:59:59',
    'ativa',
    '{"idade_min": 18, "idade_max": 70}',
    0
);

INSERT INTO questions (id, campanha_id, texto, tipo, opcoes, ordem, obrigatoria) VALUES
('q-003-1', 'camp-003', 'Quantas refeições você faz por dia?', 'multipla_escolha',
 '["1 refeição", "2 refeições", "3 refeições", "Mais de 3"]', 1, 1),
('q-003-2', 'camp-003', 'Você consome frutas e vegetais diariamente?', 'sim_nao', '["Sim", "Não"]', 2, 1),
('q-003-3', 'camp-003', 'Qual é a sua principal refeição do dia?', 'multipla_escolha',
 '["Pequeno-almoço", "Almoço", "Jantar"]', 3, 1),
('q-003-4', 'camp-003', 'Você pratica atividade física regularmente?', 'multipla_escolha',
 '["Sim, todos os dias", "2-3 vezes por semana", "Raramente", "Não pratico"]', 4, 1),
('q-003-5', 'camp-003', 'Quanto de água você bebe por dia?', 'multipla_escolha',
 '["Menos de 1 litro", "1-2 litros", "Mais de 2 litros"]', 5, 1);

-- ========================================
-- CAMPANHA 4: Educação e Tecnologia
-- ========================================
INSERT INTO campaigns (
    id, titulo, descricao, cliente, cliente_id, tema, tipo,
    recompensa_por_resposta, quantidade_alvo, quantidade_atual,
    data_inicio, data_fim, status, publico_alvo, reputacao_minima
) VALUES (
    'camp-004',
    'Tecnologia na Educação',
    'Como a tecnologia pode melhorar o ensino em Angola?',
    'Universidade Agostinho Neto',
    'user-1762153768833',
    'Educação',
    'academico',
    400.0,
    600,
    0,
    '2026-02-11 00:00:00',
    '2026-04-01 23:59:59',
    'ativa',
    '{"idade_min": 15, "idade_max": 40, "perfil": ["estudante", "professor"]}',
    0
);

INSERT INTO questions (id, campanha_id, texto, tipo, opcoes, ordem, obrigatoria) VALUES
('q-004-1', 'camp-004', 'Você é estudante ou professor?', 'multipla_escolha',
 '["Estudante", "Professor", "Ambos", "Outro"]', 1, 1),
('q-004-2', 'camp-004', 'Sua escola/universidade usa tecnologia no ensino?', 'sim_nao', '["Sim", "Não"]', 2, 1),
('q-004-3', 'camp-004', 'Quais ferramentas digitais você usa para estudar?', 'multipla_escolha',
 '["Google Classroom", "Zoom/Teams", "YouTube", "Aplicativos educativos", "E-books", "Nenhuma"]', 3, 1),
('q-004-4', 'camp-004', 'A tecnologia melhorou seu aprendizado?', 'escala',
 '["1 - Nada", "2 - Pouco", "3 - Razoável", "4 - Muito", "5 - Extremamente"]', 4, 1),
('q-004-5', 'camp-004', 'Qual a maior dificuldade para usar tecnologia na educação?', 'texto_livre', NULL, 5, 0);

-- ========================================
-- CAMPANHA 5: Turismo em Angola
-- ========================================
INSERT INTO campaigns (
    id, titulo, descricao, cliente, cliente_id, tema, tipo,
    recompensa_por_resposta, quantidade_alvo, quantidade_atual,
    data_inicio, data_fim, status, publico_alvo, reputacao_minima
) VALUES (
    'camp-005',
    'Turismo em Angola - O que você pensa?',
    'Ajude-nos a promover o turismo em Angola compartilhando sua opinião.',
    'Ministério da Cultura e Turismo',
    'user-1762153768833',
    'Turismo',
    'social',
    350.0,
    400,
    0,
    '2026-02-11 00:00:00',
    '2026-03-30 23:59:59',
    'ativa',
    '{"idade_min": 18}',
    0
);

INSERT INTO questions (id, campanha_id, texto, tipo, opcoes, ordem, obrigatoria) VALUES
('q-005-1', 'camp-005', 'Você já viajou dentro de Angola como turista?', 'sim_nao', '["Sim", "Não"]', 1, 1),
('q-005-2', 'camp-005', 'Qual província você gostaria de visitar?', 'multipla_escolha',
 '["Benguela", "Huíla", "Namibe", "Cabinda", "Lunda Norte", "Cunene", "Outras"]', 2, 1),
('q-005-3', 'camp-005', 'O que mais te atrai no turismo angolano?', 'multipla_escolha',
 '["Praias", "Cultura local", "Gastronomia", "Natureza/Parques", "História", "Eventos"]', 3, 1),
('q-005-4', 'camp-005', 'Qual é a maior barreira para o turismo em Angola?', 'multipla_escolha',
 '["Preços altos", "Falta de infraestrutura", "Segurança", "Falta de informação", "Transporte"]', 4, 1),
('q-005-5', 'camp-005', 'Você recomendaria Angola para turistas estrangeiros?', 'escala',
 '["1 - Não recomendaria", "2 - Talvez", "3 - Sim", "4 - Com certeza", "5 - Fortemente"]', 5, 1);

-- ========================================
-- CAMPANHA 6: Empreendedorismo Jovem
-- ========================================
INSERT INTO campaigns (
    id, titulo, descricao, cliente, cliente_id, tema, tipo,
    recompensa_por_resposta, quantidade_alvo, quantidade_atual,
    data_inicio, data_fim, status, publico_alvo, reputacao_minima
) VALUES (
    'camp-006',
    'Empreendedorismo Jovem em Angola',
    'Entenda os desafios e oportunidades para jovens empreendedores.',
    'INAPEM',
    'user-1762153768833',
    'Negócios',
    'comercial',
    450.0,
    700,
    0,
    '2026-02-11 00:00:00',
    '2026-03-18 23:59:59',
    'ativa',
    '{"idade_min": 18, "idade_max": 35}',
    0
);

INSERT INTO questions (id, campanha_id, texto, tipo, opcoes, ordem, obrigatoria) VALUES
('q-006-1', 'camp-006', 'Você tem ou já teve um negócio próprio?', 'multipla_escolha',
 '["Sim, tenho atualmente", "Já tive mas fechei", "Estou planejando abrir", "Não tenho"]', 1, 1),
('q-006-2', 'camp-006', 'Qual área de negócio te interessa mais?', 'multipla_escolha',
 '["Tecnologia", "Comércio", "Serviços", "Agricultura", "Turismo", "Educação", "Outro"]', 2, 1),
('q-006-3', 'camp-006', 'Qual a maior dificuldade para empreender em Angola?', 'multipla_escolha',
 '["Falta de capital", "Burocracia", "Impostos altos", "Falta de conhecimento", "Mercado limitado"]', 3, 1),
('q-006-4', 'camp-006', 'Você já recebeu apoio governamental para empreender?', 'sim_nao', '["Sim", "Não"]', 4, 1),
('q-006-5', 'camp-006', 'Que tipo de apoio você precisa para seu negócio?', 'texto_livre', NULL, 5, 0);

-- ========================================
-- CAMPANHA 7: Segurança Pública
-- ========================================
INSERT INTO campaigns (
    id, titulo, descricao, cliente, cliente_id, tema, tipo,
    recompensa_por_resposta, quantidade_alvo, quantidade_atual,
    data_inicio, data_fim, status, publico_alvo, reputacao_minima
) VALUES (
    'camp-007',
    'Percepção sobre Segurança Pública',
    'Sua opinião é importante para melhorar a segurança no bairro.',
    'Polícia Nacional',
    'user-1762153768833',
    'Segurança',
    'social',
    250.0,
    1200,
    0,
    '2026-02-11 00:00:00',
    '2026-03-10 23:59:59',
    'ativa',
    '{"idade_min": 18}',
    0
);

INSERT INTO questions (id, campanha_id, texto, tipo, opcoes, ordem, obrigatoria) VALUES
('q-007-1', 'camp-007', 'Como você avalia a segurança no seu bairro?', 'escala',
 '["1 - Muito inseguro", "2 - Inseguro", "3 - Razoável", "4 - Seguro", "5 - Muito seguro"]', 1, 1),
('q-007-2', 'camp-007', 'Você já foi vítima de algum crime nos últimos 12 meses?', 'sim_nao', '["Sim", "Não"]', 2, 1),
('q-007-3', 'camp-007', 'Você confia na polícia local?', 'escala',
 '["1 - Não confio", "2 - Confio pouco", "3 - Razoável", "4 - Confio", "5 - Confio muito"]', 3, 1),
('q-007-4', 'camp-007', 'Que medidas melhorariam a segurança?', 'multipla_escolha',
 '["Mais policiamento", "Iluminação pública", "Câmeras", "Policiamento comunitário", "Outras"]', 4, 1);

-- ========================================
-- CAMPANHA 8: Meio Ambiente
-- ========================================
INSERT INTO campaigns (
    id, titulo, descricao, cliente, cliente_id, tema, tipo,
    recompensa_por_resposta, quantidade_alvo, quantidade_atual,
    data_inicio, data_fim, status, publico_alvo, reputacao_minima
) VALUES (
    'camp-008',
    'Consciência Ambiental em Angola',
    'Pesquisa sobre práticas ambientais e reciclagem.',
    'Ministério do Ambiente',
    'user-1762153768833',
    'Meio Ambiente',
    'social',
    300.0,
    500,
    0,
    '2026-02-11 00:00:00',
    '2026-04-05 23:59:59',
    'ativa',
    '{}',
    0
);

INSERT INTO questions (id, campanha_id, texto, tipo, opcoes, ordem, obrigatoria) VALUES
('q-008-1', 'camp-008', 'Você separa lixo para reciclagem?', 'sim_nao', '["Sim", "Não"]', 1, 1),
('q-008-2', 'camp-008', 'Qual prática ambiental você adota?', 'multipla_escolha',
 '["Economizo água", "Economizo energia", "Uso sacolas reutilizáveis", "Reciclo", "Nenhuma"]', 2, 1),
('q-008-3', 'camp-008', 'O que te impede de ser mais sustentável?', 'multipla_escolha',
 '["Falta de informação", "Falta de infraestrutura", "Custo alto", "Falta de tempo", "Não vejo necessidade"]', 3, 1),
('q-008-4', 'camp-008', 'Você apoiaria leis mais rígidas de proteção ambiental?', 'sim_nao', '["Sim", "Não"]', 4, 1);

-- ========================================
-- CAMPANHA 9: Entretenimento e Cultura
-- ========================================
INSERT INTO campaigns (
    id, titulo, descricao, cliente, cliente_id, tema, tipo,
    recompensa_por_resposta, quantidade_alvo, quantidade_atual,
    data_inicio, data_fim, status, publico_alvo, reputacao_minima
) VALUES (
    'camp-009',
    'Hábitos de Entretenimento dos Angolanos',
    'O que você faz no tempo livre? Ajude-nos a entender!',
    'Produtora Cultural Vida',
    'user-1762153768833',
    'Entretenimento',
    'comercial',
    320.0,
    600,
    0,
    '2026-02-11 00:00:00',
    '2026-03-22 23:59:59',
    'ativa',
    '{"idade_min": 16}',
    0
);

INSERT INTO questions (id, campanha_id, texto, tipo, opcoes, ordem, obrigatoria) VALUES
('q-009-1', 'camp-009', 'Como você passa seu tempo livre?', 'multipla_escolha',
 '["Assistir TV/Streaming", "Redes sociais", "Ler", "Esportes", "Sair com amigos", "Jogar videogames"]', 1, 1),
('q-009-2', 'camp-009', 'Qual gênero musical você mais gosta?', 'multipla_escolha',
 '["Kizomba", "Kuduro", "Semba", "Afrobeat", "Hip-Hop", "Gospel", "Outro"]', 2, 1),
('q-009-3', 'camp-009', 'Você frequenta eventos culturais?', 'multipla_escolha',
 '["Sempre", "Às vezes", "Raramente", "Nunca"]', 3, 1),
('q-009-4', 'camp-009', 'Que tipo de evento você mais gosta?', 'multipla_escolha',
 '["Shows/Concertos", "Teatro", "Cinema", "Festivais", "Exposições", "Eventos esportivos"]', 4, 1),
('q-009-5', 'camp-009', 'Quanto você gasta mensalmente com entretenimento?', 'multipla_escolha',
 '["Menos de 5.000 AOA", "5.000-15.000 AOA", "15.000-30.000 AOA", "Mais de 30.000 AOA"]', 5, 1);

-- ========================================
-- CAMPANHA 10: Trabalho e Emprego
-- ========================================
INSERT INTO campaigns (
    id, titulo, descricao, cliente, cliente_id, tema, tipo,
    recompensa_por_resposta, quantidade_alvo, quantidade_atual,
    data_inicio, data_fim, status, publico_alvo, reputacao_minima
) VALUES (
    'camp-010',
    'Mercado de Trabalho em Angola',
    'Pesquisa sobre emprego e desenvolvimento profissional.',
    'Ministério do Trabalho',
    'user-1762153768833',
    'Emprego',
    'social',
    400.0,
    900,
    0,
    '2026-02-11 00:00:00',
    '2026-03-28 23:59:59',
    'ativa',
    '{"idade_min": 18, "idade_max": 60}',
    0
);

INSERT INTO questions (id, campanha_id, texto, tipo, opcoes, ordem, obrigatoria) VALUES
('q-010-1', 'camp-010', 'Qual é sua situação profissional atual?', 'multipla_escolha',
 '["Empregado", "Desempregado", "Estudante", "Empreendedor", "Freelancer", "Aposentado"]', 1, 1),
('q-010-2', 'camp-010', 'Qual área profissional você trabalha/gostaria de trabalhar?', 'multipla_escolha',
 '["Tecnologia", "Saúde", "Educação", "Comércio", "Serviços", "Agricultura", "Indústria", "Outro"]', 2, 1),
('q-010-3', 'camp-010', 'Qual a maior dificuldade para encontrar emprego?', 'multipla_escolha',
 '["Falta de vagas", "Baixa qualificação", "Salários baixos", "Experiência exigida", "Networking"]', 3, 1),
('q-010-4', 'camp-010', 'Você está satisfeito com seu trabalho atual?', 'escala',
 '["1 - Muito insatisfeito", "2 - Insatisfeito", "3 - Neutro", "4 - Satisfeito", "5 - Muito satisfeito"]', 4, 1),
('q-010-5', 'camp-010', 'Você investiria em formação profissional para melhorar suas oportunidades?', 'sim_nao', '["Sim", "Não"]', 5, 1);

-- ========================================
-- CONFIRMAÇÃO
-- ========================================
SELECT 'Campanhas inseridas com sucesso!' as resultado;
SELECT COUNT(*) as total_campanhas FROM campaigns WHERE status = 'ativa';
SELECT COUNT(*) as total_perguntas FROM questions;
