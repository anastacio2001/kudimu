-- ============================================
-- SCHEMA DE PLANOS E ASSINATURAS - KUDIMU
-- ============================================

-- Tabela de Planos Disponíveis
CREATE TABLE IF NOT EXISTS planos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL, -- 'campanha', 'assinatura', 'academico'
    preco INTEGER NOT NULL, -- em AOA
    creditos INTEGER NOT NULL,
    bonus_creditos INTEGER DEFAULT 0,
    
    -- Limites e Features
    max_respostas INTEGER,
    max_campanhas_mes INTEGER, -- NULL = ilimitado
    max_perguntas INTEGER,
    
    -- Features booleanas
    segmentacao_avancada BOOLEAN DEFAULT 0,
    analise_ia BOOLEAN DEFAULT 0,
    insights_preditivos BOOLEAN DEFAULT 0,
    relatorio_pdf BOOLEAN DEFAULT 0,
    mapas_calor BOOLEAN DEFAULT 0,
    api_acesso BOOLEAN DEFAULT 0,
    suporte_prioritario BOOLEAN DEFAULT 0,
    dashboard_tempo_real BOOLEAN DEFAULT 0,
    
    -- Formato acadêmico
    formato_academico BOOLEAN DEFAULT 0,
    exportacao_latex BOOLEAN DEFAULT 0,
    
    -- Validações especiais
    requer_comprovativo BOOLEAN DEFAULT 0,
    validacao_etica_obrigatoria BOOLEAN DEFAULT 0,
    
    -- Tempo de entrega
    prazo_entrega_dias INTEGER DEFAULT 7,
    
    -- Metadados
    descricao TEXT,
    popular BOOLEAN DEFAULT 0,
    ativo BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Assinaturas de Clientes
CREATE TABLE IF NOT EXISTS assinaturas_clientes (
    id TEXT PRIMARY KEY,
    cliente_id TEXT NOT NULL,
    plano_id TEXT NOT NULL,
    
    -- Status da assinatura
    status TEXT DEFAULT 'ativa', -- 'ativa', 'pausada', 'cancelada', 'expirada'
    tipo TEXT DEFAULT 'unica', -- 'unica', 'mensal', 'anual'
    
    -- Datas
    data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_fim TIMESTAMP,
    proxima_renovacao TIMESTAMP,
    
    -- Controle de uso mensal (para assinaturas)
    campanhas_criadas_mes INTEGER DEFAULT 0,
    ultimo_reset_mensal TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Pagamento
    valor_pago INTEGER NOT NULL,
    metodo_pagamento TEXT,
    referencia_pagamento TEXT,
    
    -- Features ativadas (cache do plano no momento da compra)
    features_json TEXT, -- JSON com todas as features
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (plano_id) REFERENCES planos(id)
);

-- Tabela de Serviços Adicionais
CREATE TABLE IF NOT EXISTS servicos_adicionais (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL, -- 'criacao_assistida', 'traducao', 'relatorio_visual', etc
    preco_min INTEGER NOT NULL,
    preco_max INTEGER,
    descricao TEXT,
    ativo BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Serviços Contratados
CREATE TABLE IF NOT EXISTS servicos_contratados (
    id TEXT PRIMARY KEY,
    cliente_id TEXT NOT NULL,
    campanha_id TEXT,
    servico_id TEXT NOT NULL,
    
    status TEXT DEFAULT 'pendente', -- 'pendente', 'em_andamento', 'concluido'
    valor_pago INTEGER NOT NULL,
    
    -- Detalhes específicos do serviço
    detalhes_json TEXT, -- idiomas para tradução, tipo de gráfico, etc
    
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_conclusao TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (campanha_id) REFERENCES campanhas(id),
    FOREIGN KEY (servico_id) REFERENCES servicos_adicionais(id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_assinaturas_cliente ON assinaturas_clientes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_status ON assinaturas_clientes(status);
CREATE INDEX IF NOT EXISTS idx_servicos_contratados_cliente ON servicos_contratados(cliente_id);
CREATE INDEX IF NOT EXISTS idx_servicos_contratados_campanha ON servicos_contratados(campanha_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER IF NOT EXISTS update_planos_timestamp 
AFTER UPDATE ON planos
BEGIN
    UPDATE planos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_assinaturas_timestamp 
AFTER UPDATE ON assinaturas_clientes
BEGIN
    UPDATE assinaturas_clientes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- ============================================
-- POPULAR PLANOS DISPONÍVEIS
-- ============================================

-- Campanha Social
INSERT OR REPLACE INTO planos (
    id, nome, tipo, preco, creditos, bonus_creditos,
    max_respostas, max_campanhas_mes, max_perguntas,
    validacao_etica_obrigatoria, relatorio_pdf,
    descricao, popular
) VALUES (
    'campanha-social',
    'Campanha Social',
    'campanha',
    50000,
    50000,
    0,
    500,
    NULL,
    10,
    1,
    1,
    'Projetos de impacto social para ONGs',
    0
);

-- Campanha Essencial
INSERT OR REPLACE INTO planos (
    id, nome, tipo, preco, creditos, bonus_creditos,
    max_respostas, max_campanhas_mes, max_perguntas,
    relatorio_pdf, prazo_entrega_dias,
    descricao, popular
) VALUES (
    'campanha-essencial',
    'Campanha Essencial',
    'campanha',
    100000,
    100000,
    0,
    1000,
    NULL,
    5,
    1,
    7,
    'Ideal para pequenas empresas e ONGs locais',
    0
);

-- Campanha Avançada (POPULAR)
INSERT OR REPLACE INTO planos (
    id, nome, tipo, preco, creditos, bonus_creditos,
    max_respostas, max_campanhas_mes, max_perguntas,
    segmentacao_avancada, analise_ia, insights_preditivos,
    relatorio_pdf, mapas_calor, suporte_prioritario,
    descricao, popular
) VALUES (
    'campanha-avancada',
    'Campanha Avançada',
    'campanha',
    500000,
    500000,
    50000,
    10000,
    NULL,
    NULL, -- ilimitado
    1,
    1,
    1,
    1,
    1,
    1,
    'Para produtos e políticas públicas',
    1
);

-- Assinatura Mensal
INSERT OR REPLACE INTO planos (
    id, nome, tipo, preco, creditos, bonus_creditos,
    max_respostas, max_campanhas_mes, max_perguntas,
    dashboard_tempo_real, api_acesso, relatorio_pdf,
    analise_ia, suporte_prioritario,
    descricao, popular
) VALUES (
    'assinatura-mensal',
    'Assinatura Mensal',
    'assinatura',
    400000,
    400000,
    100000,
    NULL,
    2, -- 2 campanhas incluídas por mês
    NULL,
    1,
    1,
    1,
    1,
    1,
    'Monitoramento contínuo com renovação mensal',
    0
);

-- Pesquisa Acadêmica
INSERT OR REPLACE INTO planos (
    id, nome, tipo, preco, creditos, bonus_creditos,
    max_respostas, max_perguntas,
    segmentacao_avancada, formato_academico, exportacao_latex,
    relatorio_pdf,
    descricao, popular
) VALUES (
    'plano-academico',
    'Pesquisa Acadêmica',
    'academico',
    120000,
    120000,
    0,
    1500,
    NULL,
    1,
    1,
    1,
    1,
    'Para doutoramento e pesquisa científica',
    0
);

-- Plano Estudante
INSERT OR REPLACE INTO planos (
    id, nome, tipo, preco, creditos, bonus_creditos,
    max_respostas, max_perguntas,
    requer_comprovativo, validacao_etica_obrigatoria,
    relatorio_pdf,
    descricao, popular
) VALUES (
    'plano-estudante',
    'Plano Estudante',
    'academico',
    50000,
    50000,
    0,
    500,
    10,
    1,
    1,
    1,
    'Para licenciatura e mestrado',
    0
);

-- ============================================
-- POPULAR SERVIÇOS ADICIONAIS
-- ============================================

INSERT OR REPLACE INTO servicos_adicionais (id, nome, tipo, preco_min, preco_max, descricao) VALUES
('criacao-assistida', 'Criação Assistida de Campanha', 'criacao_assistida', 20000, 50000, 'Ajuda na estruturação das perguntas e público-alvo'),
('traducao', 'Tradução para Línguas Locais', 'traducao', 15000, 15000, 'Umbundu, Kimbundu, Kikongo'),
('relatorio-visual', 'Relatório Visual Personalizado', 'relatorio_visual', 30000, 80000, 'Gráficos, mapa de calor, nuvem de palavras'),
('exportacao-academica', 'Exportação Formato Acadêmico', 'exportacao', 25000, 25000, 'PDF com estrutura de tese (método, resultados)'),
('simulacao', 'Simulação de Campanha', 'simulacao', 10000, 10000, 'Teste com dados fictícios para validação metodológica'),
('suporte-tecnico', 'Suporte Técnico 1:1', 'suporte', 15000, 15000, 'Sessão de 30 min com especialista Kudimu');

-- View para planos ativos
CREATE VIEW IF NOT EXISTS vw_planos_ativos AS
SELECT * FROM planos WHERE ativo = 1 ORDER BY popular DESC, preco ASC;

-- View para assinaturas ativas
CREATE VIEW IF NOT EXISTS vw_assinaturas_ativas AS
SELECT 
    a.*,
    p.nome as plano_nome,
    p.tipo as plano_tipo,
    c.nome as cliente_nome,
    c.email as cliente_email
FROM assinaturas_clientes a
JOIN planos p ON a.plano_id = p.id
JOIN clientes c ON a.cliente_id = c.id
WHERE a.status = 'ativa';
