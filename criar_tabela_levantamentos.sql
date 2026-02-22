-- ========================================
-- TABELA DE LEVANTAMENTOS
-- Sistema completo de saque de recompensas
-- ========================================

CREATE TABLE IF NOT EXISTS levantamentos (
    id TEXT PRIMARY KEY,
    usuario_id TEXT NOT NULL,
    valor REAL NOT NULL,
    metodo_pagamento TEXT NOT NULL, -- banco, unitel, movicel, ekwanza, paypay
    dados_pagamento TEXT NOT NULL, -- JSON com dados específicos do método
    status TEXT DEFAULT 'pendente', -- pendente, aprovado, processado, rejeitado, cancelado
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_processamento TIMESTAMP,
    admin_aprovador TEXT, -- ID do admin que aprovou
    observacoes TEXT,
    comprovativo_url TEXT, -- URL do comprovativo de pagamento (se houver)
    FOREIGN KEY (usuario_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_levantamentos_usuario ON levantamentos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_levantamentos_status ON levantamentos(status);
CREATE INDEX IF NOT EXISTS idx_levantamentos_data ON levantamentos(data_solicitacao);

-- ========================================
-- Inserir levantamentos
-- ========================================
SELECT 'Tabela levantamentos criada com sucesso!' as resultado;
