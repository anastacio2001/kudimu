-- ========================================
-- KUDIMU INSIGHTS - DATABASE SCHEMA
-- Versão: 2.0
-- Data: 14 de outubro de 2025
-- ========================================

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- UUID
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefone TEXT,
    senha_hash TEXT NOT NULL,
    localizacao TEXT, -- Província ou cidade
    idioma TEXT DEFAULT 'pt-AO',
    perfil TEXT DEFAULT 'cidadao', -- estudante, profissional, etc
    reputacao INTEGER DEFAULT 50,
    saldo_pontos REAL DEFAULT 0.0,
    nivel TEXT DEFAULT 'Iniciante', -- Iniciante, Confiável, Líder, Embaixador
    verificado INTEGER DEFAULT 0, -- 0=não, 1=sim
    tipo_conta TEXT DEFAULT 'usuario', -- usuario, cliente, admin
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso TIMESTAMP,
    ativo INTEGER DEFAULT 1
);

-- Índices para users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_reputacao ON users(reputacao);
CREATE INDEX IF NOT EXISTS idx_users_localizacao ON users(localizacao);

-- Tabela de Campanhas
CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY, -- UUID
    titulo TEXT NOT NULL,
    descricao TEXT,
    cliente TEXT NOT NULL, -- Empresa ou órgão solicitante
    cliente_id TEXT, -- ID do usuário cliente
    tema TEXT, -- Saúde, consumo, educação, etc
    tipo TEXT DEFAULT 'comercial', -- comercial, social, teste
    recompensa_por_resposta REAL NOT NULL,
    quantidade_alvo INTEGER NOT NULL,
    quantidade_atual INTEGER DEFAULT 0,
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NOT NULL,
    status TEXT DEFAULT 'pendente', -- pendente, ativa, encerrada, em_validacao
    publico_alvo TEXT, -- JSON com critérios
    reputacao_minima INTEGER DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES users(id)
);

-- Índices para campaigns
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_tema ON campaigns(tema);
CREATE INDEX IF NOT EXISTS idx_campaigns_cliente_id ON campaigns(cliente_id);

-- Tabela de Perguntas
CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY, -- UUID
    campanha_id TEXT NOT NULL,
    texto TEXT NOT NULL,
    tipo TEXT NOT NULL, -- multipla_escolha, texto_livre, escala, sim_nao, geo
    opcoes TEXT, -- JSON com opções (se aplicável)
    ordem INTEGER NOT NULL,
    obrigatoria INTEGER DEFAULT 1,
    FOREIGN KEY (campanha_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

-- Índices para questions
CREATE INDEX IF NOT EXISTS idx_questions_campanha ON questions(campanha_id);

-- Tabela de Respostas
CREATE TABLE IF NOT EXISTS answers (
    id TEXT PRIMARY KEY, -- UUID
    usuario_id TEXT NOT NULL,
    campanha_id TEXT NOT NULL,
    pergunta_id TEXT NOT NULL,
    resposta TEXT NOT NULL, -- JSON para respostas complexas
    tempo_resposta INTEGER, -- em segundos
    data_resposta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validada INTEGER DEFAULT 0, -- 0=pendente, 1=aprovada, -1=rejeitada
    motivo_rejeicao TEXT,
    FOREIGN KEY (usuario_id) REFERENCES users(id),
    FOREIGN KEY (campanha_id) REFERENCES campaigns(id),
    FOREIGN KEY (pergunta_id) REFERENCES questions(id)
);

-- Índices para answers
CREATE INDEX IF NOT EXISTS idx_answers_usuario ON answers(usuario_id);
CREATE INDEX IF NOT EXISTS idx_answers_campanha ON answers(campanha_id);
CREATE INDEX IF NOT EXISTS idx_answers_validada ON answers(validada);

-- Tabela de Recompensas
CREATE TABLE IF NOT EXISTS rewards (
    id TEXT PRIMARY KEY, -- UUID
    usuario_id TEXT NOT NULL,
    campanha_id TEXT NOT NULL,
    valor REAL NOT NULL,
    tipo TEXT DEFAULT 'pontos', -- pontos, dinheiro, dados_moveis
    status TEXT DEFAULT 'pendente', -- pendente, pago, convertido, cancelado
    metodo_pagamento TEXT,
    referencia_pagamento TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_processamento TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id),
    FOREIGN KEY (campanha_id) REFERENCES campaigns(id)
);

-- Índices para rewards
CREATE INDEX IF NOT EXISTS idx_rewards_usuario ON rewards(usuario_id);
CREATE INDEX IF NOT EXISTS idx_rewards_status ON rewards(status);

-- Tabela de Relatórios
CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY, -- UUID
    campanha_id TEXT NOT NULL,
    cliente TEXT NOT NULL,
    resumo TEXT,
    graficos TEXT, -- JSON com dados visuais
    arquivo_url TEXT, -- Link para R2
    insights TEXT, -- JSON com análises de IA
    total_respostas INTEGER,
    data_geracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campanha_id) REFERENCES campaigns(id)
);

-- Índices para reports
CREATE INDEX IF NOT EXISTS idx_reports_campanha ON reports(campanha_id);

-- Tabela de Sessões (para JWT/Auth)
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY, -- UUID
    usuario_id TEXT NOT NULL,
    token_hash TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    expira_em TIMESTAMP NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para sessions
CREATE INDEX IF NOT EXISTS idx_sessions_usuario ON sessions(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);

-- Tabela de Logs de Atividade
CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id TEXT,
    acao TEXT NOT NULL, -- login, logout, resposta_enviada, campanha_criada, etc
    detalhes TEXT, -- JSON com informações adicionais
    ip_address TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id)
);

-- Índices para activity_logs
CREATE INDEX IF NOT EXISTS idx_logs_usuario ON activity_logs(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_acao ON activity_logs(acao);

-- Tabela de Notificações
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY, -- UUID
    usuario_id TEXT NOT NULL,
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    tipo TEXT DEFAULT 'info', -- info, sucesso, alerta, erro
    lida INTEGER DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para notifications
CREATE INDEX IF NOT EXISTS idx_notifications_usuario ON notifications(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notifications_lida ON notifications(lida);

-- Tabela de Transações de Pagamento (Sistema AOA - Kwanza)
CREATE TABLE IF NOT EXISTS payment_transactions (
    id TEXT PRIMARY KEY, -- UUID
    usuario_id TEXT NOT NULL,
    tipo TEXT NOT NULL, -- 'recompensa' (crédito), 'saque' (débito)
    metodo_pagamento TEXT, -- 'dados_moveis', 'e-kwanza', 'paypay', 'pontos_internos'
    operadora TEXT, -- 'unitel', 'movicel', 'africell' (para dados móveis)
    valor_aoa REAL NOT NULL, -- Valor em Kwanzas
    saldo_anterior REAL NOT NULL,
    saldo_posterior REAL NOT NULL,
    status TEXT DEFAULT 'pendente', -- 'pendente', 'processando', 'concluido', 'erro', 'cancelado'
    campanha_id TEXT, -- Se for recompensa de campanha
    telefone_destino TEXT, -- Para recarga de dados móveis
    referencia_externa TEXT, -- ID da transação na operadora/gateway
    detalhes TEXT, -- JSON com informações adicionais
    motivo_erro TEXT, -- Se status = 'erro'
    processado_por TEXT, -- ID do admin que processou
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_processamento TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (campanha_id) REFERENCES campaigns(id),
    FOREIGN KEY (processado_por) REFERENCES users(id)
);

-- Índices para payment_transactions
CREATE INDEX IF NOT EXISTS idx_transactions_usuario ON payment_transactions(usuario_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_tipo ON payment_transactions(tipo);
CREATE INDEX IF NOT EXISTS idx_transactions_campanha ON payment_transactions(campanha_id);
CREATE INDEX IF NOT EXISTS idx_transactions_data ON payment_transactions(data_criacao);

-- Tabela de Configurações de Saque
CREATE TABLE IF NOT EXISTS withdrawal_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    saque_minimo_aoa REAL DEFAULT 2000.0,
    taxa_saque_percentual REAL DEFAULT 0.0,
    frequencia_maxima_dias INTEGER DEFAULT 7,
    tempo_processamento_horas INTEGER DEFAULT 48,
    ativo INTEGER DEFAULT 1,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir configurações padrão
INSERT OR IGNORE INTO withdrawal_settings (id, saque_minimo_aoa, taxa_saque_percentual, frequencia_maxima_dias, tempo_processamento_horas)
VALUES (1, 2000.0, 0.0, 7, 48);

-- Tabela de Subscrições Push (Web Push API)
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id TEXT PRIMARY KEY, -- UUID
    usuario_id TEXT NOT NULL,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh_key TEXT NOT NULL, -- Public key para encriptação
    auth_key TEXT NOT NULL, -- Authentication secret
    user_agent TEXT,
    ativo INTEGER DEFAULT 1,
    preferencias TEXT DEFAULT '{}', -- JSON com preferências de notificação
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para push_subscriptions
CREATE INDEX IF NOT EXISTS idx_push_usuario ON push_subscriptions(usuario_id);
CREATE INDEX IF NOT EXISTS idx_push_ativo ON push_subscriptions(ativo);
CREATE INDEX IF NOT EXISTS idx_push_endpoint ON push_subscriptions(endpoint);

-- ========================================
-- TABELAS ADICIONAIS PARA SISTEMA DE CLIENTES
-- ========================================

-- Tabela de Clientes (informações de pagamento e créditos)
CREATE TABLE IF NOT EXISTS clientes (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    saldo_creditos INTEGER DEFAULT 0,
    plano TEXT DEFAULT 'starter',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_clientes_user ON clientes(user_id);

-- Tabela de Campanhas (para clientes)
CREATE TABLE IF NOT EXISTS campanhas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT,
    categoria TEXT,
    tema TEXT,
    recompensa INTEGER NOT NULL,
    meta_participantes INTEGER NOT NULL,
    orcamento_total INTEGER NOT NULL,
    data_inicio TEXT NOT NULL,
    data_fim TEXT NOT NULL,
    tempo_estimado INTEGER DEFAULT 10,
    localizacao_alvo TEXT,
    idade_min INTEGER DEFAULT 18,
    idade_max INTEGER DEFAULT 65,
    genero_target TEXT DEFAULT 'todos',
    interesses_target TEXT,
    nivel_educacao TEXT DEFAULT 'todos',
    tags TEXT,
    perguntas TEXT,
    status TEXT DEFAULT 'pendente',
    cliente_id TEXT NOT NULL,
    total_respostas INTEGER DEFAULT 0,
    orcamento_gasto INTEGER DEFAULT 0,
    qualidade_media REAL DEFAULT 0,
    ativo INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_campanhas_cliente ON campanhas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_campanhas_status ON campanhas(status);
CREATE INDEX IF NOT EXISTS idx_campanhas_ativo ON campanhas(ativo);

-- Tabela de Transações (pagamentos e créditos)
CREATE TABLE IF NOT EXISTS transacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    tipo TEXT NOT NULL,
    valor INTEGER NOT NULL,
    metodo_pagamento TEXT,
    transaction_id TEXT UNIQUE,
    status TEXT DEFAULT 'pendente',
    metadata TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_transacoes_user ON transacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_status ON transacoes(status);

-- Views úteis
CREATE VIEW IF NOT EXISTS vw_campanhas_ativas AS
SELECT 
    c.*,
    u.nome as cliente_nome,
    u.email as cliente_email,
    CAST(c.total_respostas AS REAL) / CAST(c.meta_participantes AS REAL) * 100 as progresso
FROM campanhas c
JOIN users u ON c.cliente_id = u.id
WHERE c.ativo = 1 AND c.status IN ('ativa', 'pendente');

CREATE VIEW IF NOT EXISTS vw_usuarios_completo AS
SELECT 
    u.*,
    COALESCE(cl.saldo_creditos, 0) as saldo_creditos,
    cl.plano
FROM users u
LEFT JOIN clientes cl ON u.id = cl.user_id;

-- Triggers para atualizar updated_at
CREATE TRIGGER IF NOT EXISTS update_campanhas_timestamp
AFTER UPDATE ON campanhas
BEGIN
    UPDATE campanhas SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_clientes_timestamp
AFTER UPDATE ON clientes
BEGIN
    UPDATE clientes SET updated_at = datetime('now') WHERE id = NEW.id;
END;
