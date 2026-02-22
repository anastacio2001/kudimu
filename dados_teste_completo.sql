-- ========================================
-- KUDIMU INSIGHTS - DADOS DE TESTE COMPLETOS
-- Ambiente de Teste Realista para Angola
-- Data: 13 de Fevereiro de 2026
-- ========================================
-- IMPORTANTE: Estes dados serão deletados antes da produção
-- ========================================

PRAGMA foreign_keys = OFF;

-- Limpar dados existentes
DELETE FROM answers;
DELETE FROM rewards;
DELETE FROM questions;
DELETE FROM campaigns;
DELETE FROM users;

-- ========================================
-- 1. ADMINISTRADOR (1)
-- ========================================

INSERT INTO users (id, nome, email, telefone, senha_hash, localizacao, perfil, reputacao, saldo_pontos, nivel, verificado, tipo_conta, data_cadastro, ativo)
VALUES 
('admin-master', 'Administrador Kudimu', 'admin@kudimu.ao', '+244 923 000 001', 'mock_hash_admin123', 'Luanda', 'administrador', 1000, 0, 'Master', 1, 'admin', datetime('now'), 1);

-- ========================================
-- 2. CLIENTES EMPRESARIAIS (20)
-- Empresas que pagam para usar a plataforma
-- ========================================

INSERT INTO users (id, nome, email, telefone, senha_hash, localizacao, perfil, reputacao, saldo_pontos, nivel, verificado, tipo_conta, data_cadastro, ativo)
VALUES 
-- Telecomunicações & Tecnologia
('client-001', 'Unitel Angola', 'pesquisas@unitel.ao', '+244 923 100 001', 'mock_hash_cliente123', 'Luanda', 'telecomunicacoes', 0, 5000000, 'Enterprise', 1, 'cliente', datetime('now', '-180 days'), 1),
('client-002', 'Angola Telecom', 'insights@angolatelecom.ao', '+244 923 100 002', 'mock_hash_cliente123', 'Luanda', 'telecomunicacoes', 0, 3000000, 'Premium', 1, 'cliente', datetime('now', '-150 days'), 1),
('client-003', 'Microsoft Angola', 'research@microsoft.ao', '+244 923 100 003', 'mock_hash_cliente123', 'Luanda', 'tecnologia', 0, 4500000, 'Enterprise', 1, 'cliente', datetime('now', '-120 days'), 1),

-- Bancos & Finanças
('client-004', 'Banco BAI', 'estudos@bancobai.ao', '+244 923 100 004', 'mock_hash_cliente123', 'Luanda', 'financeiro', 0, 6000000, 'Enterprise', 1, 'cliente', datetime('now', '-200 days'), 1),
('client-005', 'BFA Banco', 'pesquisas@bfa.ao', '+244 923 100 005', 'mock_hash_cliente123', 'Luanda', 'financeiro', 0, 4000000, 'Premium', 1, 'cliente', datetime('now', '-160 days'), 1),
('client-006', 'Banco Millennium Atlântico', 'analytics@millenniumbcp.ao', '+244 923 100 006', 'mock_hash_cliente123', 'Luanda', 'financeiro', 0, 3500000, 'Premium', 1, 'cliente', datetime('now', '-140 days'), 1),

-- Petróleo & Energia
('client-007', 'Sonangol EP', 'pesquisas@sonangol.co.ao', '+244 923 100 007', 'mock_hash_cliente123', 'Luanda', 'petroleo', 0, 8000000, 'Enterprise', 1, 'cliente', datetime('now', '-250 days'), 1),
('client-008', 'ENDE - Empresa Nacional de Distribuição', 'estudos@ende.ao', '+244 923 100 008', 'mock_hash_cliente123', 'Luanda', 'energia', 0, 2500000, 'Standard', 1, 'cliente', datetime('now', '-100 days'), 1),

-- Retalho & Consumo
('client-009', 'Shoprite Angola', 'insights@shoprite.ao', '+244 923 100 009', 'mock_hash_cliente123', 'Luanda', 'retalho', 0, 3200000, 'Premium', 1, 'cliente', datetime('now', '-130 days'), 1),
('client-010', 'Kero Angola', 'pesquisas@kero.ao', '+244 923 100 010', 'mock_hash_cliente123', 'Luanda', 'retalho', 0, 2800000, 'Standard', 1, 'cliente', datetime('now', '-90 days'), 1),
('client-011', 'Candando Supermercados', 'analytics@candando.ao', '+244 923 100 011', 'mock_hash_cliente123', 'Luanda', 'retalho', 0, 1500000, 'Standard', 1, 'cliente', datetime('now', '-70 days'), 1),

-- Saúde & Farmacêutico
('client-012', 'Clínica Girassol', 'estudos@clinicagirassol.ao', '+244 923 100 012', 'mock_hash_cliente123', 'Luanda', 'saude', 0, 2000000, 'Premium', 1, 'cliente', datetime('now', '-110 days'), 1),
('client-013', 'Farmácias Ango-Cubanas', 'pesquisas@angocubana.ao', '+244 923 100 013', 'mock_hash_cliente123', 'Luanda', 'farmaceutico', 0, 1800000, 'Standard', 1, 'cliente', datetime('now', '-85 days'), 1),

-- Educação & Formação
('client-014', 'Universidade Católica de Angola', 'research@ucan.edu', '+244 923 100 014', 'mock_hash_cliente123', 'Luanda', 'educacao', 0, 2500000, 'Premium', 1, 'cliente', datetime('now', '-95 days'), 1),
('client-015', 'Instituto Superior Politécnico', 'estudos@isptec.co.ao', '+244 923 100 015', 'mock_hash_cliente123', 'Luanda', 'educacao', 0, 1500000, 'Standard', 1, 'cliente', datetime('now', '-60 days'), 1),

-- Mídia & Entretenimento
('client-016', 'TV Zimbo', 'audiencia@tvzimbo.ao', '+244 923 100 016', 'mock_hash_cliente123', 'Luanda', 'media', 0, 2200000, 'Premium', 1, 'cliente', datetime('now', '-105 days'), 1),
('client-017', 'ZAP Angola', 'insights@zap.ao', '+244 923 100 017', 'mock_hash_cliente123', 'Luanda', 'entretenimento', 0, 3000000, 'Premium', 1, 'cliente', datetime('now', '-115 days'), 1),

-- Governo & ONGs
('client-018', 'Ministério da Saúde', 'pesquisas@minsa.gov.ao', '+244 923 100 018', 'mock_hash_cliente123', 'Luanda', 'governo', 0, 5000000, 'Enterprise', 1, 'cliente', datetime('now', '-220 days'), 1),
('client-019', 'Ministério da Educação', 'estudos@med.gov.ao', '+244 923 100 019', 'mock_hash_cliente123', 'Luanda', 'governo', 0, 4000000, 'Enterprise', 1, 'cliente', datetime('now', '-190 days'), 1),
('client-020', 'ADRA Angola', 'research@adra.ao', '+244 923 100 020', 'mock_hash_cliente123', 'Luanda', 'ong', 0, 1000000, 'Standard', 1, 'cliente', datetime('now', '-50 days'), 1);

-- ========================================
-- 3. USUÁRIOS RESPONDENTES (100)
-- Cidadãos angolanos que respondem questionários
-- ========================================

-- Províncias principais de Angola
-- Luanda (30), Benguela (15), Huambo (15), Huíla (10), Cabinda (10), 
-- Namibe (5), Malanje (5), Uíge (5), Zaire (5)

INSERT INTO users (id, nome, email, telefone, senha_hash, localizacao, perfil, reputacao, saldo_pontos, nivel, verificado, tipo_conta, data_cadastro, ativo)
VALUES 
-- LUANDA (30 usuários)
('user-001', 'Maria Santos', 'maria.santos@gmail.com', '+244 923 200 001', 'mock_hash_usuario123', 'Luanda', 'estudante', 250, 12500, 'Prata', 1, 'usuario', datetime('now', '-120 days'), 1),
('user-002', 'João Silva', 'joao.silva@outlook.com', '+244 923 200 002', 'mock_hash_usuario123', 'Luanda', 'profissional', 450, 28750, 'Ouro', 1, 'usuario', datetime('now', '-200 days'), 1),
('user-003', 'Ana Costa', 'ana.costa@yahoo.com', '+244 923 200 003', 'mock_hash_usuario123', 'Luanda', 'desempregado', 180, 8200, 'Bronze', 1, 'usuario', datetime('now', '-90 days'), 1),
('user-004', 'Carlos Eduardo', 'carlos.edu@gmail.com', '+244 923 200 004', 'mock_hash_usuario123', 'Luanda', 'empresario', 750, 42300, 'Diamante', 1, 'usuario', datetime('now', '-300 days'), 1),
('user-005', 'Isabel Fernandes', 'isabel.f@hotmail.com', '+244 923 200 005', 'mock_hash_usuario123', 'Luanda', 'funcionario_publico', 320, 16500, 'Prata', 1, 'usuario', datetime('now', '-150 days'), 1),
('user-006', 'Pedro Miguel', 'pedro.miguel@gmail.com', '+244 923 200 006', 'mock_hash_usuario123', 'Luanda', 'comerciante', 280, 14200, 'Bronze', 1, 'usuario', datetime('now', '-100 days'), 1),
('user-007', 'Catarina Lopes', 'catarina.lopes@outlook.com', '+244 923 200 007', 'mock_hash_usuario123', 'Luanda', 'professora', 410, 22800, 'Prata', 1, 'usuario', datetime('now', '-180 days'), 1),
('user-008', 'Ricardo Pinto', 'ricardo.pinto@yahoo.com', '+244 923 200 008', 'mock_hash_usuario123', 'Luanda', 'estudante', 195, 9500, 'Bronze', 1, 'usuario', datetime('now', '-75 days'), 1),
('user-009', 'Beatriz Sousa', 'beatriz.sousa@gmail.com', '+244 923 200 009', 'mock_hash_usuario123', 'Luanda', 'enfermeira', 380, 19200, 'Prata', 1, 'usuario', datetime('now', '-160 days'), 1),
('user-010', 'Fernando Alves', 'fernando.alves@hotmail.com', '+244 923 200 010', 'mock_hash_usuario123', 'Luanda', 'motorista', 220, 11000, 'Bronze', 1, 'usuario', datetime('now', '-95 days'), 1),
('user-011', 'Juliana Martins', 'juliana.m@gmail.com', '+244 923 200 011', 'mock_hash_usuario123', 'Luanda', 'designer', 340, 17500, 'Prata', 1, 'usuario', datetime('now', '-140 days'), 1),
('user-012', 'Miguel Ferreira', 'miguel.ferreira@outlook.com', '+244 923 200 012', 'mock_hash_usuario123', 'Luanda', 'programador', 520, 32400, 'Ouro', 1, 'usuario', datetime('now', '-220 days'), 1),
('user-013', 'Sofia Rodrigues', 'sofia.r@yahoo.com', '+244 923 200 013', 'mock_hash_usuario123', 'Luanda', 'contabilista', 295, 15200, 'Bronze', 1, 'usuario', datetime('now', '-110 days'), 1),
('user-014', 'Tomás Ribeiro', 'tomas.ribeiro@gmail.com', '+244 923 200 014', 'mock_hash_usuario123', 'Luanda', 'mecanico', 240, 12100, 'Bronze', 1, 'usuario', datetime('now', '-88 days'), 1),
('user-015', 'Mariana Dias', 'mariana.dias@hotmail.com', '+244 923 200 015', 'mock_hash_usuario123', 'Luanda', 'advogada', 460, 25600, 'Ouro', 1, 'usuario', datetime('now', '-195 days'), 1),
('user-016', 'André Gomes', 'andre.gomes@gmail.com', '+244 923 200 016', 'mock_hash_usuario123', 'Luanda', 'vendedor', 265, 13400, 'Bronze', 1, 'usuario', datetime('now', '-102 days'), 1),
('user-017', 'Inês Pereira', 'ines.pereira@outlook.com', '+244 923 200 017', 'mock_hash_usuario123', 'Luanda', 'medica', 580, 36200, 'Ouro', 1, 'usuario', datetime('now', '-250 days'), 1),
('user-018', 'Hugo Carvalho', 'hugo.carvalho@yahoo.com', '+244 923 200 018', 'mock_hash_usuario123', 'Luanda', 'engenheiro', 490, 29800, 'Ouro', 1, 'usuario', datetime('now', '-210 days'), 1),
('user-019', 'Leonor Santos', 'leonor.santos@gmail.com', '+244 923 200 019', 'mock_hash_usuario123', 'Luanda', 'arquiteta', 355, 18200, 'Prata', 1, 'usuario', datetime('now', '-145 days'), 1),
('user-020', 'Diogo Oliveira', 'diogo.oliveira@hotmail.com', '+244 923 200 020', 'mock_hash_usuario123', 'Luanda', 'fotografo', 285, 14500, 'Bronze', 1, 'usuario', datetime('now', '-108 days'), 1),
('user-021', 'Marta Silva', 'marta.silva@gmail.com', '+244 923 200 021', 'mock_hash_usuario123', 'Luanda', 'jornalista', 425, 23800, 'Prata', 1, 'usuario', datetime('now', '-175 days'), 1),
('user-022', 'Bruno Costa', 'bruno.costa@outlook.com', '+244 923 200 022', 'mock_hash_usuario123', 'Luanda', 'musico', 215, 10800, 'Bronze', 1, 'usuario', datetime('now', '-82 days'), 1),
('user-023', 'Carolina Nunes', 'carolina.nunes@yahoo.com', '+244 923 200 023', 'mock_hash_usuario123', 'Luanda', 'psicologa', 395, 20500, 'Prata', 1, 'usuario', datetime('now', '-165 days'), 1),
('user-024', 'Rui Fernandes', 'rui.fernandes@gmail.com', '+244 923 200 024', 'mock_hash_usuario123', 'Luanda', 'policia', 305, 15800, 'Prata', 1, 'usuario', datetime('now', '-125 days'), 1),
('user-025', 'Teresa Almeida', 'teresa.almeida@hotmail.com', '+244 923 200 025', 'mock_hash_usuario123', 'Luanda', 'cozinheira', 190, 9200, 'Bronze', 1, 'usuario', datetime('now', '-72 days'), 1),
('user-026', 'Vasco Soares', 'vasco.soares@gmail.com', '+244 923 200 026', 'mock_hash_usuario123', 'Luanda', 'taxista', 235, 11800, 'Bronze', 1, 'usuario', datetime('now', '-92 days'), 1),
('user-027', 'Rita Cunha', 'rita.cunha@outlook.com', '+244 923 200 027', 'mock_hash_usuario123', 'Luanda', 'farmaceutica', 370, 19000, 'Prata', 1, 'usuario', datetime('now', '-155 days'), 1),
('user-028', 'Paulo Moreira', 'paulo.moreira@yahoo.com', '+244 923 200 028', 'mock_hash_usuario123', 'Luanda', 'carpinteiro', 255, 13000, 'Bronze', 1, 'usuario', datetime('now', '-98 days'), 1),
('user-029', 'Joana Baptista', 'joana.baptista@gmail.com', '+244 923 200 029', 'mock_hash_usuario123', 'Luanda', 'veterinaria', 440, 24400, 'Prata', 1, 'usuario', datetime('now', '-185 days'), 1),
('user-030', 'Nuno Correia', 'nuno.correia@hotmail.com', '+244 923 200 030', 'mock_hash_usuario123', 'Luanda', 'bombeiro', 320, 16600, 'Prata', 1, 'usuario', datetime('now', '-135 days'), 1),

-- BENGUELA (15 usuários)
('user-031', 'Paula Mendes', 'paula.mendes@gmail.com', '+244 923 200 031', 'mock_hash_usuario123', 'Benguela', 'professora', 380, 19400, 'Prata', 1, 'usuario', datetime('now', '-160 days'), 1),
('user-032', 'Alberto Ramos', 'alberto.ramos@outlook.com', '+244 923 200 032', 'mock_hash_usuario123', 'Benguela', 'pescador', 205, 10200, 'Bronze', 1, 'usuario', datetime('now', '-78 days'), 1),
('user-033', 'Cristina Barros', 'cristina.barros@yahoo.com', '+244 923 200 033', 'mock_hash_usuario123', 'Benguela', 'estudante', 195, 9600, 'Bronze', 1, 'usuario', datetime('now', '-74 days'), 1),
('user-034', 'Sérgio Lima', 'sergio.lima@gmail.com', '+244 923 200 034', 'mock_hash_usuario123', 'Benguela', 'comerciante', 315, 16000, 'Prata', 1, 'usuario', datetime('now', '-130 days'), 1),
('user-035', 'Helena Tavares', 'helena.tavares@hotmail.com', '+244 923 200 035', 'mock_hash_usuario123', 'Benguela', 'enfermeira', 355, 18000, 'Prata', 1, 'usuario', datetime('now', '-148 days'), 1),
('user-036', 'Filipe Marques', 'filipe.marques@gmail.com', '+244 923 200 036', 'mock_hash_usuario123', 'Benguela', 'agricultor', 225, 11400, 'Bronze', 1, 'usuario', datetime('now', '-86 days'), 1),
('user-037', 'Sandra Azevedo', 'sandra.azevedo@outlook.com', '+244 923 200 037', 'mock_hash_usuario123', 'Benguela', 'secretaria', 270, 13800, 'Bronze', 1, 'usuario', datetime('now', '-105 days'), 1),
('user-038', 'Manuel Jesus', 'manuel.jesus@yahoo.com', '+244 923 200 038', 'mock_hash_usuario123', 'Benguela', 'mecanico', 240, 12200, 'Bronze', 1, 'usuario', datetime('now', '-90 days'), 1),
('user-039', 'Francisca Castro', 'francisca.castro@gmail.com', '+244 923 200 039', 'mock_hash_usuario123', 'Benguela', 'empresaria', 460, 25200, 'Ouro', 1, 'usuario', datetime('now', '-192 days'), 1),
('user-040', 'Tiago Monteiro', 'tiago.monteiro@hotmail.com', '+244 923 200 040', 'mock_hash_usuario123', 'Benguela', 'vendedor', 260, 13200, 'Bronze', 1, 'usuario', datetime('now', '-100 days'), 1),
('user-041', 'Vera Machado', 'vera.machado@gmail.com', '+244 923 200 041', 'mock_hash_usuario123', 'Benguela', 'advogada', 435, 23400, 'Prata', 1, 'usuario', datetime('now', '-180 days'), 1),
('user-042', 'Henrique Neves', 'henrique.neves@outlook.com', '+244 923 200 042', 'mock_hash_usuario123', 'Benguela', 'motorista', 215, 10900, 'Bronze', 1, 'usuario', datetime('now', '-81 days'), 1),
('user-043', 'Carla Teixeira', 'carla.teixeira@yahoo.com', '+244 923 200 043', 'mock_hash_usuario123', 'Benguela', 'psicologa', 390, 20000, 'Prata', 1, 'usuario', datetime('now', '-162 days'), 1),
('user-044', 'Luís Simões', 'luis.simoes@gmail.com', '+244 923 200 044', 'mock_hash_usuario123', 'Benguela', 'eletricista', 250, 12700, 'Bronze', 1, 'usuario', datetime('now', '-95 days'), 1),
('user-045', 'Andreia Vicente', 'andreia.vicente@hotmail.com', '+244 923 200 045', 'mock_hash_usuario123', 'Benguela', 'dentista', 410, 22200, 'Prata', 1, 'usuario', datetime('now', '-172 days'), 1),

-- HUAMBO (15 usuários)
('user-046', 'Jorge Pires', 'jorge.pires@gmail.com', '+244 923 200 046', 'mock_hash_usuario123', 'Huambo', 'professor', 365, 18600, 'Prata', 1, 'usuario', datetime('now', '-152 days'), 1),
('user-047', 'Patrícia Reis', 'patricia.reis@outlook.com', '+244 923 200 047', 'mock_hash_usuario123', 'Huambo', 'estudante', 185, 9100, 'Bronze', 1, 'usuario', datetime('now', '-70 days'), 1),
('user-048', 'Gonçalo Freitas', 'goncalo.freitas@yahoo.com', '+244 923 200 048', 'mock_hash_usuario123', 'Huambo', 'agricultor', 275, 14000, 'Bronze', 1, 'usuario', datetime('now', '-108 days'), 1),
('user-049', 'Sílvia Antunes', 'silvia.antunes@gmail.com', '+244 923 200 049', 'mock_hash_usuario123', 'Huambo', 'funcionaria_publica', 330, 16800, 'Prata', 1, 'usuario', datetime('now', '-138 days'), 1),
('user-050', 'Armando Vieira', 'armando.vieira@hotmail.com', '+244 923 200 050', 'mock_hash_usuario123', 'Huambo', 'comerciante', 295, 15000, 'Bronze', 1, 'usuario', datetime('now', '-115 days'), 1),
('user-051', 'Fátima Coelho', 'fatima.coelho@gmail.com', '+244 923 200 051', 'mock_hash_usuario123', 'Huambo', 'enfermeira', 375, 19100, 'Prata', 1, 'usuario', datetime('now', '-158 days'), 1),
('user-052', 'Joaquim Faria', 'joaquim.faria@outlook.com', '+244 923 200 052', 'mock_hash_usuario123', 'Huambo', 'motorista', 220, 11200, 'Bronze', 1, 'usuario', datetime('now', '-84 days'), 1),
('user-053', 'Raquel Matos', 'raquel.matos@yahoo.com', '+244 923 200 053', 'mock_hash_usuario123', 'Huambo', 'medica', 540, 33600, 'Ouro', 1, 'usuario', datetime('now', '-235 days'), 1),
('user-054', 'Vítor Leite', 'vitor.leite@gmail.com', '+244 923 200 054', 'mock_hash_usuario123', 'Huambo', 'engenheiro', 475, 27800, 'Ouro', 1, 'usuario', datetime('now', '-205 days'), 1),
('user-055', 'Mónica Leal', 'monica.leal@hotmail.com', '+244 923 200 055', 'mock_hash_usuario123', 'Huambo', 'arquiteta', 345, 17600, 'Prata', 1, 'usuario', datetime('now', '-143 days'), 1),
('user-056', 'Daniel Duarte', 'daniel.duarte@gmail.com', '+244 923 200 056', 'mock_hash_usuario123', 'Huambo', 'programador', 505, 31200, 'Ouro', 1, 'usuario', datetime('now', '-218 days'), 1),
('user-057', 'Liliana Campos', 'liliana.campos@outlook.com', '+244 923 200 057', 'mock_hash_usuario123', 'Huambo', 'contabilista', 285, 14600, 'Bronze', 1, 'usuario', datetime('now', '-112 days'), 1),
('user-058', 'Marco Rocha', 'marco.rocha@yahoo.com', '+244 923 200 058', 'mock_hash_usuario123', 'Huambo', 'vendedor', 245, 12500, 'Bronze', 1, 'usuario', datetime('now', '-93 days'), 1),
('user-059', 'Susana Henriques', 'susana.henriques@gmail.com', '+244 923 200 059', 'mock_hash_usuario123', 'Huambo', 'professora', 395, 20200, 'Prata', 1, 'usuario', datetime('now', '-165 days'), 1),
('user-060', 'Gabriel Morais', 'gabriel.morais@hotmail.com', '+244 923 200 060', 'mock_hash_usuario123', 'Huambo', 'mecanico', 235, 11900, 'Bronze', 1, 'usuario', datetime('now', '-89 days'), 1),

-- HUÍLA (10 usuários)
('user-061', 'Elisabete Borges', 'elisabete.borges@gmail.com', '+244 923 200 061', 'mock_hash_usuario123', 'Huíla', 'enfermeira', 360, 18400, 'Prata', 1, 'usuario', datetime('now', '-150 days'), 1),
('user-062', 'Augusto Cruz', 'augusto.cruz@outlook.com', '+244 923 200 062', 'mock_hash_usuario123', 'Huíla', 'agricultor', 210, 10600, 'Bronze', 1, 'usuario', datetime('now', '-80 days'), 1),
('user-063', 'Conceição Xavier', 'conceicao.xavier@yahoo.com', '+244 923 200 063', 'mock_hash_usuario123', 'Huíla', 'professora', 385, 19600, 'Prata', 1, 'usuario', datetime('now', '-163 days'), 1),
('user-064', 'Renato Fonseca', 'renato.fonseca@gmail.com', '+244 923 200 064', 'mock_hash_usuario123', 'Huíla', 'comerciante', 300, 15300, 'Prata', 1, 'usuario', datetime('now', '-120 days'), 1),
('user-065', 'Amélia Guedes', 'amelia.guedes@hotmail.com', '+244 923 200 065', 'mock_hash_usuario123', 'Huíla', 'estudante', 175, 8500, 'Bronze', 1, 'usuario', datetime('now', '-65 days'), 1),
('user-066', 'Sebastião Correia', 'sebastiao.correia@gmail.com', '+244 923 200 066', 'mock_hash_usuario123', 'Huíla', 'motorista', 230, 11600, 'Bronze', 1, 'usuario', datetime('now', '-87 days'), 1),
('user-067', 'Graça Neto', 'graca.neto@outlook.com', '+244 923 200 067', 'mock_hash_usuario123', 'Huíla', 'funcionaria_publica', 325, 16400, 'Prata', 1, 'usuario', datetime('now', '-133 days'), 1),
('user-068', 'Edmundo Brito', 'edmundo.brito@yahoo.com', '+244 923 200 068', 'mock_hash_usuario123', 'Huíla', 'advogado', 445, 24200, 'Prata', 1, 'usuario', datetime('now', '-187 days'), 1),
('user-069', 'Lurdes Pinto', 'lurdes.pinto@gmail.com', '+244 923 200 069', 'mock_hash_usuario123', 'Huíla', 'secretaria', 265, 13500, 'Bronze', 1, 'usuario', datetime('now', '-103 days'), 1),
('user-070', 'Domingos Ferreira', 'domingos.ferreira@hotmail.com', '+244 923 200 070', 'mock_hash_usuario123', 'Huíla', 'eletricista', 255, 13100, 'Bronze', 1, 'usuario', datetime('now', '-97 days'), 1),

-- CABINDA (10 usuários)
('user-071', 'Matilde Barbosa', 'matilde.barbosa@gmail.com', '+244 923 200 071', 'mock_hash_usuario123', 'Cabinda', 'professora', 405, 21800, 'Prata', 1, 'usuario', datetime('now', '-170 days'), 1),
('user-072', 'Osvaldo Lopes', 'osvaldo.lopes@outlook.com', '+244 923 200 072', 'mock_hash_usuario123', 'Cabinda', 'pescador', 195, 9700, 'Bronze', 1, 'usuario', datetime('now', '-73 days'), 1),
('user-073', 'Piedade Gomes', 'piedade.gomes@yahoo.com', '+244 923 200 073', 'mock_hash_usuario123', 'Cabinda', 'enfermeira', 350, 17900, 'Prata', 1, 'usuario', datetime('now', '-147 days'), 1),
('user-074', 'Aníbal Pereira', 'anibal.pereira@gmail.com', '+244 923 200 074', 'mock_hash_usuario123', 'Cabinda', 'motorista', 225, 11400, 'Bronze', 1, 'usuario', datetime('now', '-85 days'), 1),
('user-075', 'Margarida Cardoso', 'margarida.cardoso@hotmail.com', '+244 923 200 075', 'mock_hash_usuario123', 'Cabinda', 'comerciante', 310, 15700, 'Prata', 1, 'usuario', datetime('now', '-127 days'), 1),
('user-076', 'Ernesto Sousa', 'ernesto.sousa@gmail.com', '+244 923 200 076', 'mock_hash_usuario123', 'Cabinda', 'medico', 525, 32800, 'Ouro', 1, 'usuario', datetime('now', '-228 days'), 1),
('user-077', 'Palmira Santos', 'palmira.santos@outlook.com', '+244 923 200 077', 'mock_hash_usuario123', 'Cabinda', 'estudante', 180, 8900, 'Bronze', 1, 'usuario', datetime('now', '-68 days'), 1),
('user-078', 'Casimiro Dias', 'casimiro.dias@yahoo.com', '+244 923 200 078', 'mock_hash_usuario123', 'Cabinda', 'funcionario_publico', 335, 17000, 'Prata', 1, 'usuario', datetime('now', '-140 days'), 1),
('user-079', 'Deolinda Alves', 'deolinda.alves@gmail.com', '+244 923 200 079', 'mock_hash_usuario123', 'Cabinda', 'contabilista', 290, 14800, 'Bronze', 1, 'usuario', datetime('now', '-113 days'), 1),
('user-080', 'Bartolomeu Costa', 'bartolomeu.costa@hotmail.com', '+244 923 200 080', 'mock_hash_usuario123', 'Cabinda', 'engenheiro', 480, 28400, 'Ouro', 1, 'usuario', datetime('now', '-208 days'), 1),

-- NAMIBE (5 usuários)
('user-081', 'Ester Silva', 'ester.silva@gmail.com', '+244 923 200 081', 'mock_hash_usuario123', 'Namibe', 'professora', 370, 18900, 'Prata', 1, 'usuario', datetime('now', '-157 days'), 1),
('user-082', 'Felisberto Martins', 'felisberto.martins@outlook.com', '+244 923 200 082', 'mock_hash_usuario123', 'Namibe', 'pescador', 200, 10000, 'Bronze', 1, 'usuario', datetime('now', '-76 days'), 1),
('user-083', 'Zélia Rodrigues', 'zelia.rodrigues@yahoo.com', '+244 923 200 083', 'mock_hash_usuario123', 'Namibe', 'enfermeira', 340, 17300, 'Prata', 1, 'usuario', datetime('now', '-142 days'), 1),
('user-084', 'Hermenegildo Ferreira', 'hermenegildo.ferreira@gmail.com', '+244 923 200 084', 'mock_hash_usuario123', 'Namibe', 'motorista', 220, 11100, 'Bronze', 1, 'usuario', datetime('now', '-83 days'), 1),
('user-085', 'Adelaide Mendes', 'adelaide.mendes@hotmail.com', '+244 923 200 085', 'mock_hash_usuario123', 'Namibe', 'comerciante', 280, 14300, 'Bronze', 1, 'usuario', datetime('now', '-107 days'), 1),

-- MALANJE (5 usuários)
('user-086', 'Bernardino Ramos', 'bernardino.ramos@gmail.com', '+244 923 200 086', 'mock_hash_usuario123', 'Malanje', 'agricultor', 240, 12200, 'Bronze', 1, 'usuario', datetime('now', '-91 days'), 1),
('user-087', 'Dulce Barros', 'dulce.barros@outlook.com', '+244 923 200 087', 'mock_hash_usuario123', 'Malanje', 'professora', 390, 19900, 'Prata', 1, 'usuario', datetime('now', '-164 days'), 1),
('user-088', 'Faustino Lima', 'faustino.lima@yahoo.com', '+244 923 200 088', 'mock_hash_usuario123', 'Malanje', 'motorista', 215, 10800, 'Bronze', 1, 'usuario', datetime('now', '-82 days'), 1),
('user-089', 'Glória Tavares', 'gloria.tavares@gmail.com', '+244 923 200 089', 'mock_hash_usuario123', 'Malanje', 'enfermeira', 355, 18100, 'Prata', 1, 'usuario', datetime('now', '-149 days'), 1),
('user-090', 'Ilídio Marques', 'ilidio.marques@hotmail.com', '+244 923 200 090', 'mock_hash_usuario123', 'Malanje', 'comerciante', 275, 14100, 'Bronze', 1, 'usuario', datetime('now', '-109 days'), 1),

-- UÍGE (5 usuários)
('user-091', 'Leopoldina Azevedo', 'leopoldina.azevedo@gmail.com', '+244 923 200 091', 'mock_hash_usuario123', 'Uíge', 'professora', 380, 19300, 'Prata', 1, 'usuario', datetime('now', '-159 days'), 1),
('user-092', 'Norberto Jesus', 'norberto.jesus@outlook.com', '+244 923 200 092', 'mock_hash_usuario123', 'Uíge', 'agricultor', 230, 11700, 'Bronze', 1, 'usuario', datetime('now', '-88 days'), 1),
('user-093', 'Olinda Castro', 'olinda.castro@yahoo.com', '+244 923 200 093', 'mock_hash_usuario123', 'Uíge', 'enfermeira', 365, 18600, 'Prata', 1, 'usuario', datetime('now', '-153 days'), 1),
('user-094', 'Pascoal Monteiro', 'pascoal.monteiro@gmail.com', '+244 923 200 094', 'mock_hash_usuario123', 'Uíge', 'motorista', 210, 10500, 'Bronze', 1, 'usuario', datetime('now', '-79 days'), 1),
('user-095', 'Quitéria Machado', 'quiteria.machado@hotmail.com', '+244 923 200 095', 'mock_hash_usuario123', 'Uíge', 'comerciante', 290, 14900, 'Bronze', 1, 'usuario', datetime('now', '-114 days'), 1),

-- ZAIRE (5 usuários)
('user-096', 'Rosalina Neves', 'rosalina.neves@gmail.com', '+244 923 200 096', 'mock_hash_usuario123', 'Zaire', 'professora', 375, 19100, 'Prata', 1, 'usuario', datetime('now', '-156 days'), 1),
('user-097', 'Salvador Teixeira', 'salvador.teixeira@outlook.com', '+244 923 200 097', 'mock_hash_usuario123', 'Zaire', 'pescador', 205, 10300, 'Bronze', 1, 'usuario', datetime('now', '-77 days'), 1),
('user-098', 'Ticiana Simões', 'ticiana.simoes@yahoo.com', '+244 923 200 098', 'mock_hash_usuario123', 'Zaire', 'enfermeira', 360, 18400, 'Prata', 1, 'usuario', datetime('now', '-151 days'), 1),
('user-099', 'Ulisses Vicente', 'ulisses.vicente@gmail.com', '+244 923 200 099', 'mock_hash_usuario123', 'Zaire', 'motorista', 225, 11300, 'Bronze', 1, 'usuario', datetime('now', '-86 days'), 1),
('user-100', 'Vitória Cunha', 'vitoria.cunha@hotmail.com', '+244 923 200 100', 'mock_hash_usuario123', 'Zaire', 'comerciante', 295, 15100, 'Prata', 1, 'usuario', datetime('now', '-117 days'), 1);

-- Continua no próximo bloco...
