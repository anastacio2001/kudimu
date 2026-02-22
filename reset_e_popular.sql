-- ========================================
-- SCRIPT COMPLETO: LIMPAR E POPULAR D1
-- ========================================

-- Desativar temporariamente foreign keys para limpeza
PRAGMA foreign_keys = OFF;

-- LIMPEZA TOTAL (ordem inversa das dependências)
DELETE FROM answers;
DELETE FROM rewards;
DELETE FROM questions;
DELETE FROM campaigns;
DELETE FROM users;

-- Resetar sequences se necessário
DELETE FROM sqlite_sequence;

-- Reativar foreign keys
PRAGMA foreign_keys = ON;

-- ========================================
-- POPULAR COM DADOS DE TESTE
-- ========================================

-- INSERIR 1 ADMIN
INSERT INTO users (id, nome, email, senha_hash, telefone, provincia, municipio, genero, data_nascimento, profissao, nivel_educacao, saldo_pontos, pontos_totais_ganhos, reputacao, nivel, tipo_conta, campanhas_completadas, precisao_respostas, data_criacao, ultimo_acesso)
VALUES
('admin-master', 'Administrador Kudimu', 'admin@kudimu.ao', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 923 000 000', 'Luanda', 'Luanda', 'M', '1985-01-15', 'Administrador de Sistemas', 'Superior Completo', 1000000, 1000000, 950, 10, 'admin', 0, 100.0, datetime('now', '-365 days'), datetime('now')),

-- INSERIR 20 CLIENTES EMPRESARIAIS
('client-001', 'Unitel Angola', 'comercial@unitel.co.ao', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 923 111 111', 'Luanda', 'Luanda', 'N/A', NULL, 'Telecomunicações', NULL, 5000000, 0, 0, 1, 'cliente', 0, 0, datetime('now', '-180 days'), datetime('now', '-1 days')),

('client-002', 'Movicel Telecomunicações', 'marketing@movicel.co.ao', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 923 222 222', 'Luanda', 'Luanda', 'N/A', NULL, 'Telecomunicações', NULL, 4500000, 0, 0, 1, 'cliente', 0, 0, datetime('now', '-150 days'), datetime('now', '-2 days')),

('client-003', 'Microsoft Angola', 'info@microsoft.co.ao', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 923 333 333', 'Luanda', 'Luanda', 'N/A', NULL, 'Tecnologia', NULL, 7000000, 0, 0, 1, 'cliente', 0, 0, datetime('now', '-200 days'), datetime('now', '-1 days')),

('client-004', 'Banco BAI', 'estudos@bancobai.ao', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 923 444 444', 'Luanda', 'Luanda', 'N/A', NULL, 'Banca e Finanças', NULL, 6000000, 0, 0, 1, 'cliente', 0, 0, datetime('now', '-220 days'), datetime('now', '-3 days')),

('client-005', 'BFA - Banco de Fomento Angola', 'marketing@bfa.ao', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 923 555 555', 'Luanda', 'Luanda', 'N/A', NULL, 'Banca e Finanças', NULL, 5500000, 0, 0, 1, 'cliente', 0, 0, datetime('now', '-190 days'), datetime('now', '-2 days')),

('client-006', 'Banco Millennium Atlântico', 'pesquisa@millenniumbcp.ao', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 923 666 666', 'Luanda', 'Luanda', 'N/A', NULL, 'Banca e Finanças', NULL, 5800000, 0, 0, 1, 'cliente', 0, 0, datetime('now', '-175 days'), datetime('now', '-4 days')),

('client-007', 'Sonangol EP', 'comunicacao@sonangol.co.ao', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 923 777 777', 'Luanda', 'Luanda', 'N/A', NULL, 'Petróleo e Gás', NULL, 8000000, 0, 0, 1, 'cliente', 0, 0, datetime('now', '-300 days'), datetime('now', '-1 days')),

('client-008', 'ENDE - Empresa Nacional de Distribuição de Eletricidade', 'relacionamento@ende.co.ao', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 923 888 888', 'Luanda', 'Luanda', 'N/A', NULL, 'Energia', NULL, 4000000, 0, 0, 1, 'cliente', 0, 0, datetime('now', '-160 days'), datetime('now', '-5 days')),

('client-009', 'Shoprite Angola', 'marketing@shoprite.co.ao', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 923 999 999', 'Luanda', 'Luanda', 'N/A', NULL, 'Retalho', NULL, 6500000, 0, 0, 1, 'cliente', 0, 0, datetime('now', '-140 days'), datetime('now', '-2 days')),

('client-010', 'Refriango - Coca-Cola', 'pesquisa@refriango.co.ao', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 924 000 000', 'Luanda', 'Viana', 'N/A', NULL, 'Indústria Alimentar', NULL, 5200000, 0, 0, 1, 'cliente', 0, 0, datetime('now', '-185 days'), datetime('now', '-3 days')),

('client-011', 'Empresa Portuária do Lobito', 'comercial@portolobito.ao', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 924 111 111', 'Benguela', 'Lobito', 'N/A', NULL, 'Logística Portuária', NULL, 3500000, 0, 0, 1, 'cliente', 0, 0, datetime('now', '-120 days'), datetime('now', '-6 days')),

('client-012', 'Clínica Girassol', 'recepcao@clinicagirassol.ao', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 924 222 222', 'Luanda', 'Luanda', 'N/A', NULL, 'Saúde Privada', NULL, 3800000, 0, 0, 1, 'cliente', 0, 0, datetime('now', '-130 days'), datetime('now', '-4 days')),

('client-013', 'Farmácias Ango-Cubanas', 'marketing@farmang.ao', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 924 333 333', 'Luanda', 'Luanda', 'N/A', NULL, 'Farmacêutica', NULL, 4200000, 0, 0, 1, 'cliente', 0, 0, datetime('now', '-145 days'), datetime('now', '-3 days')),

('client-014', 'Universidade Católica de Angola', 'pesquisa@ucan.edu', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 924 444 444', 'Luanda', 'Luanda', 'N/A', NULL, 'Ensino Superior', NULL, 4800000, 0, 0, 1, 'cliente', 0, 0, datetime('now', '-210 days'), datetime('now', '-2 days')),

('client-015', 'Instituto Superior Politécnico Independente', 'contacto@ispi.ao', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 924 555 555', 'Luanda', 'Viana', 'N/A', NULL, 'Ensino Técnico', NULL, 3200000, 0, 0, 1, 'cliente', 0, 0, datetime('now', '-95 days'), datetime('now', '-7 days')),

('client-016', 'TV Zimbo', 'redacao@tvzimbo.co.ao', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 924 666 666', 'Luanda', 'Luanda', 'N/A', NULL, 'Comunicação Social', NULL, 5500000, 0, 0, 1, 'cliente', 0, 0, datetime('now', '-165 days'), datetime('now', '-1 days')),

('client-017', 'Jornal de Angola', 'redacao@jornaldeangola.ao', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 924 777 777', 'Luanda', 'Luanda', 'N/A', NULL, 'Comunicação Social', NULL, 4300000, 0, 0, 1, 'cliente', 0, 0, datetime('now', '-155 days'), datetime('now', '-3 days')),

('client-018', 'Ministério da Saúde', 'gabinete@minsa.gov.ao', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 924 888 888', 'Luanda', 'Luanda', 'N/A', NULL, 'Governo - Saúde', NULL, 10000000, 0, 0, 1, 'cliente', 0, 0, datetime('now', '-280 days'), datetime('now', '-1 days')),

('client-019', 'Ministério da Educação', 'gabinete@med.gov.ao', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 924 999 999', 'Luanda', 'Luanda', 'N/A', NULL, 'Governo - Educação', NULL, 9500000, 0, 0, 1, 'cliente', 0, 0, datetime('now', '-270 days'), datetime('now', '-2 days')),

('client-020', 'ADRA Angola', 'info@adra.co.ao', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 925 000 000', 'Luanda', 'Luanda', 'N/A', NULL, 'ONG - Desenvolvimento', NULL, 3000000, 0, 0, 1, 'cliente', 0, 0, datetime('now', '-105 days'), datetime('now', '-4 days'));

-- INSERIR 100 USUÁRIOS (omitindo para brevidade - use o arquivo dados_teste_completo.sql original com os 100 usuários)
-- Por questões de espaço, vou incluir apenas 10 usuários como exemplo:

INSERT INTO users (id, nome, email, senha_hash, telefone, provincia, municipio, genero, data_nascimento, profissao, nivel_educacao, saldo_pontos, pontos_totais_ganhos, reputacao, nivel, tipo_conta, campanhas_completadas, precisao_respostas, data_criacao, ultimo_acesso)
VALUES
('user-001', 'João Pedro Manuel', 'joao.manuel@gmail.com', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 923 456 001', 'Luanda', 'Viana', 'M', '1995-03-20', 'Estudante Universitário', 'Ensino Médio Completo', 12500, 35600, 420, 4, 'usuario', 42, 92.5, datetime('now', '-120 days'), datetime('now', '-1 hours')),

('user-002', 'Maria da Conceição Silva', 'maria.silva@outlook.com', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 923 456 002', 'Luanda', 'Luanda', 'F', '1988-07-14', 'Professora do Ensino Primário', 'Superior Completo', 28300, 68400, 580, 6, 'usuario', 78, 95.2, datetime('now', '-150 days'), datetime('now', '-3 hours')),

('user-003', 'António Carlos Fernandes', 'antonio.fernandes@yahoo.com', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 923 456 003', 'Luanda', 'Belas', 'M', '1992-11-05', 'Engenheiro Civil', 'Superior Completo', 42300, 105800, 720, 7, 'usuario', 124, 97.1, datetime('now', '-200 days'), datetime('now', '-2 hours')),

('user-004', 'Isabel Domingos Santos', 'isabel.santos@hotmail.com', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 923 456 004', 'Luanda', 'Cacuaco', 'F', '1990-05-22', 'Enfermeira', 'Superior Completo', 35700, 89200, 650, 7, 'usuario', 102, 96.3, datetime('now', '-180 days'), datetime('now', '-4 hours')),

('user-005', 'Fernando José Rodrigues', 'fernando.rodrigues@gmail.com', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 923 456 005', 'Luanda', 'Talatona', 'M', '1985-09-30', 'Gestor de Recursos Humanos', 'Superior Completo', 31200, 74500, 610, 6, 'usuario', 86, 94.8, datetime('now', '-165 days'), datetime('now', '-5 hours')),

('user-006', 'Catarina Miguel Andrade', 'catarina.andrade@outlook.com', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 923 456 006', 'Luanda', 'Luanda', 'F', '1993-12-18', 'Advogada', 'Superior Completo', 26800, 62300, 560, 6, 'usuario', 72, 93.7, datetime('now', '-140 days'), datetime('now', '-1 days')),

('user-007', 'Manuel Augusto Costa', 'manuel.costa@yahoo.com', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 923 456 007', 'Luanda', 'Viana', 'M', '1998-04-08', 'Programador Junior', 'Ensino Médio Completo', 19600, 48900, 480, 5, 'usuario', 58, 91.2, datetime('now', '-110 days'), datetime('now', '-8 hours')),

('user-008', 'Beatriz Lopes Ferreira', 'beatriz.ferreira@gmail.com', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 923 456 008', 'Luanda', 'Kilamba Kiaxi', 'F', '1991-06-25', 'Médica', 'Superior Completo', 38900, 95700, 680, 7, 'usuario', 112, 96.8, datetime('now', '-190 days'), datetime('now', '-6 hours')),

('user-009', 'Paulo Joaquim Martins', 'paulo.martins@hotmail.com', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 923 456 009', 'Luanda', 'Cazenga', 'M', '1987-02-11', 'Motorista de Táxi', 'Ensino Médio Incompleto', 8200, 19400, 280, 3, 'usuario', 24, 88.5, datetime('now', '-80 days'), datetime('now', '-12 hours')),

('user-010', 'Juliana Cardoso Pereira', 'juliana.pereira@gmail.com', '$2b$10$abcdefghijklmnopqrstuv.w1x2y3z4a5b6c7d8e9f0', '+244 923 456 010', 'Luanda', 'Sambizanga', 'F', '1994-08-19', 'Vendedora', 'Ensino Médio Completo', 14300, 32800, 380, 4, 'usuario', 38, 90.1, datetime('now', '-95 days'), datetime('now', '-15 hours'));

-- NOTA: Em produção, adicionar os restantes 90 usuários do arquivo dados_teste_completo.sql

PRAGMA foreign_keys = ON;
