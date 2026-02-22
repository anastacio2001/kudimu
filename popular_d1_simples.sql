-- ========================================
-- POPULAR D1 - ALINHADO COM SCHEMA REAL
-- Schema: id, nome, email, telefone, senha_hash, localizacao, idioma, perfil, 
--         reputacao, saldo_pontos, nivel, verificado, tipo_conta, data_cadastro, ultimo_acesso, ativo
-- ========================================

PRAGMA foreign_keys = OFF;

-- LIMPEZA
DELETE FROM answers;
DELETE FROM rewards;
DELETE FROM questions;
DELETE FROM campaigns;
DELETE FROM users;
DELETE FROM sqlite_sequence;

PRAGMA foreign_keys = ON;

-- ========================================
-- 1 ADMIN
-- ========================================
INSERT INTO users (id, nome, email, telefone, senha_hash, localizacao, idioma, perfil, reputacao, saldo_pontos, nivel, verificado, tipo_conta, data_cadastro, ultimo_acesso, ativo)
VALUES 
('admin-master', 'Administrador Kudimu', 'admin@kudimu.ao', '+244923000000', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'admin', 950, 1000000.0, 'Embaixador', 1, 'admin', datetime('now', '-365 days'), datetime('now'), 1);

-- ========================================
-- 20 CLIENTES EMPRESARIAIS
-- ========================================
INSERT INTO users (id, nome, email, telefone, senha_hash, localizacao, idioma, perfil, reputacao, saldo_pontos, nivel, verificado, tipo_conta, data_cadastro, ultimo_acesso, ativo)
VALUES 
('client-001', 'Unitel Angola', 'comercial@unitel.co.ao', '+244923111111', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'empresa', 100, 5000000.0, 'Líder', 1, 'cliente', datetime('now', '-180 days'), datetime('now', '-1 days'), 1),
('client-002', 'Movicel Telecomunicações', 'marketing@movicel.co.ao', '+244923222222', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'empresa', 100, 4500000.0, 'Líder', 1, 'cliente', datetime('now', '-150 days'), datetime('now', '-2 days'), 1),
('client-003', 'Microsoft Angola', 'info@microsoft.co.ao', '+244923333333', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'empresa', 100, 7000000.0, 'Embaixador', 1, 'cliente', datetime('now', '-200 days'), datetime('now', '-1 days'), 1),
('client-004', 'Banco BAI', 'estudos@bancobai.ao', '+244923444444', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'empresa', 100, 6000000.0, 'Líder', 1, 'cliente', datetime('now', '-220 days'), datetime('now', '-3 days'), 1),
('client-005', 'BFA - Banco de Fomento Angola', 'marketing@bfa.ao', '+244923555555', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'empresa', 100, 5500000.0, 'Líder', 1, 'cliente', datetime('now', '-190 days'), datetime('now', '-2 days'), 1),
('client-006', 'Banco Millennium Atlântico', 'pesquisa@millenniumbcp.ao', '+244923666666', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'empresa', 100, 5800000.0, 'Líder', 1, 'cliente', datetime('now', '-175 days'), datetime('now', '-4 days'), 1),
('client-007', 'Sonangol EP', 'comunicacao@sonangol.co.ao', '+244923777777', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'empresa', 100, 8000000.0, 'Embaixador', 1, 'cliente', datetime('now', '-300 days'), datetime('now', '-1 days'), 1),
('client-008', 'ENDE - Empresa Nacional de Distribuição de Eletricidade', 'relacionamento@ende.co.ao', '+244923888888', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'empresa', 100, 4000000.0, 'Líder', 1, 'cliente', datetime('now', '-160 days'), datetime('now', '-5 days'), 1),
('client-009', 'Shoprite Angola', 'marketing@shoprite.co.ao', '+244923999999', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'empresa', 100, 6500000.0, 'Líder', 1, 'cliente', datetime('now', '-140 days'), datetime('now', '-2 days'), 1),
('client-010', 'Refriango - Coca-Cola', 'pesquisa@refriango.co.ao', '+244924000000', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda - Viana', 'pt-AO', 'empresa', 100, 5200000.0, 'Líder', 1, 'cliente', datetime('now', '-185 days'), datetime('now', '-3 days'), 1),
('client-011', 'Empresa Portuária do Lobito', 'comercial@portolobito.ao', '+244924111111', '$2b$10$abcdefghijklmnopqrstuv', 'Benguela - Lobito', 'pt-AO', 'empresa', 100, 3500000.0, 'Confiável', 1, 'cliente', datetime('now', '-120 days'), datetime('now', '-6 days'), 1),
('client-012', 'Clínica Girassol', 'recepcao@clinicagirassol.ao', '+244924222222', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'empresa', 100, 3800000.0, 'Confiável', 1, 'cliente', datetime('now', '-130 days'), datetime('now', '-4 days'), 1),
('client-013', 'Farmácias Ango-Cubanas', 'marketing@farmang.ao', '+244924333333', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'empresa', 100, 4200000.0, 'Líder', 1, 'cliente', datetime('now', '-145 days'), datetime('now', '-3 days'), 1),
('client-014', 'Universidade Católica de Angola', 'pesquisa@ucan.edu', '+244924444444', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'academia', 100, 4800000.0, 'Líder', 1, 'cliente', datetime('now', '-210 days'), datetime('now', '-2 days'), 1),
('client-015', 'Instituto Superior Politécnico Independente', 'contacto@ispi.ao', '+244924555555', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda - Viana', 'pt-AO', 'academia', 100, 3200000.0, 'Confiável', 1, 'cliente', datetime('now', '-95 days'), datetime('now', '-7 days'), 1),
('client-016', 'TV Zimbo', 'redacao@tvzimbo.co.ao', '+244924666666', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'media', 100, 5500000.0, 'Líder', 1, 'cliente', datetime('now', '-165 days'), datetime('now', '-1 days'), 1),
('client-017', 'Jornal de Angola', 'redacao@jornaldeangola.ao', '+244924777777', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'media', 100, 4300000.0, 'Líder', 1, 'cliente', datetime('now', '-155 days'), datetime('now', '-3 days'), 1),
('client-018', 'Ministério da Saúde', 'gabinete@minsa.gov.ao', '+244924888888', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'governo', 100, 10000000.0, 'Embaixador', 1, 'cliente', datetime('now', '-280 days'), datetime('now', '-1 days'), 1),
('client-019', 'Ministério da Educação', 'gabinete@med.gov.ao', '+244924999999', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'governo', 100, 9500000.0, 'Embaixador', 1, 'cliente', datetime('now', '-270 days'), datetime('now', '-2 days'), 1),
('client-020', 'ADRA Angola', 'info@adra.co.ao', '+244925000000', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'ong', 100, 3000000.0, 'Confiável', 1, 'cliente', datetime('now', '-105 days'), datetime('now', '-4 days'), 1);

-- ========================================
-- 50 USUÁRIOS RESPONDENTES (de diferentes províncias)
-- ========================================
INSERT INTO users (id, nome, email, telefone, senha_hash, localizacao, idioma, perfil, reputacao, saldo_pontos, nivel, verificado, tipo_conta, data_cadastro, ultimo_acesso, ativo)
VALUES 
-- LUANDA (20 usuários)
('user-001', 'João Pedro Manuel', 'joao.manuel@gmail.com', '+244923456001', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda - Viana', 'pt-AO', 'estudante', 420, 12500.0, 'Confiável', 1, 'usuario', datetime('now', '-120 days'), datetime('now', '-1 hours'), 1),
('user-002', 'Maria da Conceição Silva', 'maria.silva@outlook.com', '+244923456002', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'profissional', 580, 28300.0, 'Líder', 1, 'usuario', datetime('now', '-150 days'), datetime('now', '-3 hours'), 1),
('user-003', 'António Carlos Fernandes', 'antonio.fernandes@yahoo.com', '+244923456003', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda - Belas', 'pt-AO', 'profissional', 720, 42300.0, 'Embaixador', 1, 'usuario', datetime('now', '-200 days'), datetime('now', '-2 hours'), 1),
('user-004', 'Isabel Domingos Santos', 'isabel.santos@hotmail.com', '+244923456004', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda - Cacuaco', 'pt-AO', 'profissional', 650, 35700.0, 'Líder', 1, 'usuario', datetime('now', '-180 days'), datetime('now', '-4 hours'), 1),
('user-005', 'Fernando José Rodrigues', 'fernando.rodrigues@gmail.com', '+244923456005', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda - Talatona', 'pt-AO', 'profissional', 610, 31200.0, 'Líder', 1, 'usuario', datetime('now', '-165 days'), datetime('now', '-5 hours'), 1),
('user-006', 'Catarina Miguel Andrade', 'catarina.andrade@outlook.com', '+244923456006', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'profissional', 560, 26800.0, 'Líder', 1, 'usuario', datetime('now', '-140 days'), datetime('now', '-1 days'), 1),
('user-007', 'Manuel Augusto Costa', 'manuel.costa@yahoo.com', '+244923456007', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda - Viana', 'pt-AO', 'estudante', 480, 19600.0, 'Confiável', 1, 'usuario', datetime('now', '-110 days'), datetime('now', '-8 hours'), 1),
('user-008', 'Beatriz Lopes Ferreira', 'beatriz.ferreira@gmail.com', '+244923456008', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda - Kilamba Kiaxi', 'pt-AO', 'profissional', 680, 38900.0, 'Líder', 1, 'usuario', datetime('now', '-190 days'), datetime('now', '-6 hours'), 1),
('user-009', 'Paulo Joaquim Martins', 'paulo.martins@hotmail.com', '+244923456009', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda - Cazenga', 'pt-AO', 'trabalhador', 280, 8200.0, 'Iniciante', 0, 'usuario', datetime('now', '-80 days'), datetime('now', '-12 hours'), 1),
('user-010', 'Juliana Cardoso Pereira', 'juliana.pereira@gmail.com', '+244923456010', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda - Sambizanga', 'pt-AO', 'trabalhador', 380, 14300.0, 'Confiável', 0, 'usuario', datetime('now', '-95 days'), datetime('now', '-15 hours'), 1),
('user-011', 'Ricardo Silva Mendes', 'ricardo.mendes@gmail.com', '+244923456011', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda - Maianga', 'pt-AO', 'profissional', 590, 29700.0, 'Líder', 1, 'usuario', datetime('now', '-145 days'), datetime('now', '-7 hours'), 1),
('user-012', 'Cristina Neves Almeida', 'cristina.almeida@outlook.com', '+244923456012', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'estudante', 410, 16800.0, 'Confiável', 0, 'usuario', datetime('now', '-105 days'), datetime('now', '-9 hours'), 1),
('user-013', 'Alberto Gonçalves Pinto', 'alberto.pinto@yahoo.com', '+244923456013', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda - Talatona', 'pt-AO', 'profissional', 670, 37200.0, 'Líder', 1, 'usuario', datetime('now', '-175 days'), datetime('now', '-5 hours'), 1),
('user-014', 'Marta Costa Ribeiro', 'marta.ribeiro@gmail.com', '+244923456014', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda - Belas', 'pt-AO', 'profissional', 630, 33400.0, 'Líder', 1, 'usuario', datetime('now', '-160 days'), datetime('now', '-4 hours'), 1),
('user-015', 'Jorge Santos Lima', 'jorge.lima@hotmail.com', '+244923456015', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda - Viana', 'pt-AO', 'trabalhador', 320, 10500.0, 'Iniciante', 0, 'usuario', datetime('now', '-85 days'), datetime('now', '-14 hours'), 1),
('user-016', 'Sofia Martins Oliveira', 'sofia.oliveira@gmail.com', '+244923456016', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda - Kilamba Kiaxi', 'pt-AO', 'estudante', 450, 18900.0, 'Confiável', 1, 'usuario', datetime('now', '-115 days'), datetime('now', '-6 hours'), 1),
('user-017', 'Tiago Ferreira Sousa', 'tiago.sousa@outlook.com', '+244923456017', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda - Cacuaco', 'pt-AO', 'trabalhador', 360, 13200.0, 'Confiável', 0, 'usuario', datetime('now', '-92 days'), datetime('now', '-11 hours'), 1),
('user-018', 'Ana Paula Correia', 'ana.correia@yahoo.com', '+244923456018', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda', 'pt-AO', 'profissional', 640, 34800.0, 'Líder', 1, 'usuario', datetime('now', '-170 days'), datetime('now', '-3 hours'), 1),
('user-019', 'Pedro Miguel Carvalho', 'pedro.carvalho@gmail.com', '+244923456019', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda - Talatona', 'pt-AO', 'profissional', 700, 40500.0, 'Líder', 1, 'usuario', datetime('now', '-195 days'), datetime('now', '-2 hours'), 1),
('user-020', 'Luísa Gomes Teixeira', 'luisa.teixeira@hotmail.com', '+244923456020', '$2b$10$abcdefghijklmnopqrstuv', 'Luanda - Maianga', 'pt-AO', 'estudante', 390, 15700.0, 'Confiável', 0, 'usuario', datetime('now', '-100 days'), datetime('now', '-10 hours'), 1),

-- BENGUELA (10 usuários)
('user-021', 'Carlos Eduardo Nunes', 'carlos.nunes@gmail.com', '+244923456021', '$2b$10$abcdefghijklmnopqrstuv', 'Benguela', 'pt-AO', 'profissional', 520, 24300.0, 'Confiável', 1, 'usuario', datetime('now', '-135 days'), datetime('now', '-1 days'), 1),
('user-022', 'Teresa Alves Moreira', 'teresa.moreira@outlook.com', '+244923456022', '$2b$10$abcdefghijklmnopqrstuv', 'Benguela - Lobito', 'pt-AO', 'profissional', 560, 27600.0, 'Líder', 1, 'usuario', datetime('now', '-148 days'), datetime('now', '-18 hours'), 1),
('user-023', 'Domingos Silva Baptista', 'domingos.baptista@yahoo.com', '+244923456023', '$2b$10$abcdefghijklmnopqrstuv', 'Benguela', 'pt-AO', 'trabalhador', 340, 11800.0, 'Confiável', 0, 'usuario', datetime('now', '-88 days'), datetime('now', '-22 hours'), 1),
('user-024', 'Márcia Santos Pires', 'marcia.pires@gmail.com', '+244923456024', '$2b$10$abcdefghijklmnopqrstuv', 'Benguela - Catumbela', 'pt-AO', 'estudante', 430, 17500.0, 'Confiável', 0, 'usuario', datetime('now', '-108 days'), datetime('now', '-16 hours'), 1),
('user-025', 'Rui Costa Lopes', 'rui.lopes@hotmail.com', '+244923456025', '$2b$10$abcdefghijklmnopqrstuv', 'Benguela - Lobito', 'pt-AO', 'profissional', 580, 29100.0, 'Líder', 1, 'usuario', datetime('now', '-152 days'), datetime('now', '-20 hours'), 1),
('user-026', 'Cláudia Rodrigues Fonseca', 'claudia.fonseca@gmail.com', '+244923456026', '$2b$10$abcdefghijklmnopqrstuv', 'Benguela', 'pt-AO', 'profissional', 610, 31800.0, 'Líder', 1, 'usuario', datetime('now', '-163 days'), datetime('now', '-19 hours'), 1),
('user-027', 'Vítor Manuel Dias', 'vitor.dias@outlook.com', '+244923456027', '$2b$10$abcdefghijklmnopqrstuv', 'Benguela', 'pt-AO', 'trabalhador', 290, 9400.0, 'Iniciante', 0, 'usuario', datetime('now', '-78 days'), datetime('now', '-1 days'), 1),
('user-028', 'Sandra Pereira Castro', 'sandra.castro@yahoo.com', '+244923456028', '$2b$10$abcdefghijklmnopqrstuv', 'Benguela - Lobito', 'pt-AO', 'estudante', 460, 20200.0, 'Confiável', 1, 'usuario', datetime('now', '-118 days'), datetime('now', '-17 hours'), 1),
('user-029', 'Nuno Soares Marques', 'nuno.marques@gmail.com', '+244923456029', '$2b$10$abcdefghijklmnopqrstuv', 'Benguela', 'pt-AO', 'profissional', 540, 25900.0, 'Líder', 1, 'usuario', datetime('now', '-142 days'), datetime('now', '-21 hours'), 1),
('user-030', 'Patrícia Gomes Silva', 'patricia.silva@hotmail.com', '+244923456030', '$2b$10$abcdefghijklmnopqrstuv', 'Benguela - Catumbela', 'pt-AO', 'trabalhador', 370, 13900.0, 'Confiável', 0, 'usuario', datetime('now', '-96 days'), datetime('now', '-23 hours'), 1),

-- HUAMBO (10 usuários)
('user-031', 'Miguel Ângelo Fernandes', 'miguel.fernandes@gmail.com', '+244923456031', '$2b$10$abcdefghijklmnopqrstuv', 'Huambo', 'pt-AO', 'profissional', 550, 26700.0, 'Líder', 1, 'usuario', datetime('now', '-146 days'), datetime('now', '-1 days'), 1),
('user-032', 'Helena Costa Ramos', 'helena.ramos@outlook.com', '+244923456032', '$2b$10$abcdefghijklmnopqrstuv', 'Huambo', 'pt-AO', 'profissional', 600, 30400.0, 'Líder', 1, 'usuario', datetime('now', '-158 days'), datetime('now', '-15 hours'), 1),
('user-033', 'José António Cunha', 'jose.cunha@yahoo.com', '+244923456033', '$2b$10$abcdefghijklmnopqrstuv', 'Huambo - Caála', 'pt-AO', 'trabalhador', 310, 10200.0, 'Iniciante', 0, 'usuario', datetime('now', '-82 days'), datetime('now', '-20 hours'), 1),
('user-034', 'Raquel Silva Monteiro', 'raquel.monteiro@gmail.com', '+244923456034', '$2b$10$abcdefghijklmnopqrstuv', 'Huambo', 'pt-AO', 'estudante', 440, 18200.0, 'Confiável', 1, 'usuario', datetime('now', '-112 days'), datetime('now', '-18 hours'), 1),
('user-035', 'André Luís Barbosa', 'andre.barbosa@hotmail.com', '+244923456035', '$2b$10$abcdefghijklmnopqrstuv', 'Huambo', 'pt-AO', 'profissional', 570, 28400.0, 'Líder', 1, 'usuario', datetime('now', '-150 days'), datetime('now', '-16 hours'), 1),
('user-036', 'Inês Maria Tavares', 'ines.tavares@gmail.com', '+244923456036', '$2b$10$abcdefghijklmnopqrstuv', 'Huambo - Caála', 'pt-AO', 'profissional', 620, 32700.0, 'Líder', 1, 'usuario', datetime('now', '-168 days'), datetime('now', '-19 hours'), 1),
('user-037', 'Filipe Santos Moura', 'filipe.moura@outlook.com', '+244923456037', '$2b$10$abcdefghijklmnopqrstuv', 'Huambo', 'pt-AO', 'trabalhador', 300, 9800.0, 'Iniciante', 0, 'usuario', datetime('now', '-76 days'), datetime('now', '-1 days'), 1),
('user-038', 'Gabriela Lopes Azevedo', 'gabriela.azevedo@yahoo.com', '+244923456038', '$2b$10$abcdefghijklmnopqrstuv', 'Huambo', 'pt-AO', 'estudante', 470, 20800.0, 'Confiável', 1, 'usuario', datetime('now', '-122 days'), datetime('now', '-17 hours'), 1),
('user-039', 'Daniel Oliveira Reis', 'daniel.reis@gmail.com', '+244923456039', '$2b$10$abcdefghijklmnopqrstuv', 'Huambo', 'pt-AO', 'profissional', 530, 25200.0, 'Confiável', 1, 'usuario', datetime('now', '-138 days'), datetime('now', '-14 hours'), 1),
('user-040', 'Vera Lúcia Correia', 'vera.correia@hotmail.com', '+244923456040', '$2b$10$abcdefghijklmnopqrstuv', 'Huambo - Caála', 'pt-AO', 'trabalhador', 350, 12600.0, 'Confiável', 0, 'usuario', datetime('now', '-90 days'), datetime('now', '-22 hours'), 1),

-- HUÍLA (5 usuários)
('user-041', 'Bruno Miguel Santos', 'bruno.santos@gmail.com', '+244923456041', '$2b$10$abcdefghijklmnopqrstuv', 'Huíla - Lubango', 'pt-AO', 'profissional', 510, 23600.0, 'Confiável', 1, 'usuario', datetime('now', '-132 days'), datetime('now', '-1 days'), 1),
('user-042', 'Liliana Costa Vieira', 'liliana.vieira@outlook.com', '+244923456042', '$2b$10$abcdefghijklmnopqrstuv', 'Huíla - Lubango', 'pt-AO', 'profissional', 560, 27200.0, 'Líder', 1, 'usuario', datetime('now', '-147 days'), datetime('now', '-18 hours'), 1),
('user-043', 'Sérgio Paulo Almeida', 'sergio.almeida@yahoo.com', '+244923456043', '$2b$10$abcdefghijklmnopqrstuv', 'Huíla - Lubango', 'pt-AO', 'trabalhador', 330, 11300.0, 'Confiável', 0, 'usuario', datetime('now', '-86 days'), datetime('now', '-21 hours'), 1),
('user-044', 'Vanessa Silva Pinto', 'vanessa.pinto@gmail.com', '+244923456044', '$2b$10$abcdefghijklmnopqrstuv', 'Huíla - Lubango', 'pt-AO', 'estudante', 420, 17100.0, 'Confiável', 0, 'usuario', datetime('now', '-106 days'), datetime('now', '-16 hours'), 1),
('user-045', 'Eduardo Ferreira Lima', 'eduardo.lima@hotmail.com', '+244923456045', '$2b$10$abcdefghijklmnopqrstuv', 'Huíla - Lubango', 'pt-AO', 'profissional', 590, 29600.0, 'Líder', 1, 'usuario', datetime('now', '-154 days'), datetime('now', '-19 hours'), 1),

-- CABINDA (5 usuários)
('user-046', 'Renato Silva Gonçalves', 'renato.goncalves@gmail.com', '+244923456046', '$2b$10$abcdefghijklmnopqrstuv', 'Cabinda', 'pt-AO', 'profissional', 540, 25500.0, 'Líder', 1, 'usuario', datetime('now', '-141 days'), datetime('now', '-1 days'), 1),
('user-047', 'Paula Cristina Rocha', 'paula.rocha@outlook.com', '+244923456047', '$2b$10$abcdefghijklmnopqrstuv', 'Cabinda', 'pt-AO', 'profissional', 570, 28100.0, 'Líder', 1, 'usuario', datetime('now', '-149 days'), datetime('now', '-17 hours'), 1),
('user-048', 'Orlando José Marques', 'orlando.marques@yahoo.com', '+244923456048', '$2b$10$abcdefghijklmnopqrstuv', 'Cabinda', 'pt-AO', 'trabalhador', 340, 11900.0, 'Confiável', 0, 'usuario', datetime('now', '-89 days'), datetime('now', '-22 hours'), 1),
('user-049', 'Susana Lopes Martins', 'susana.martins@gmail.com', '+244923456049', '$2b$10$abcdefghijklmnopqrstuv', 'Cabinda', 'pt-AO', 'estudante', 410, 16500.0, 'Confiável', 0, 'usuario', datetime('now', '-104 days'), datetime('now', '-15 hours'), 1),
('user-050', 'Hugo Manuel Soares', 'hugo.soares@hotmail.com', '+244923456050', '$2b$10$abcdefghijklmnopqrstuv', 'Cabinda', 'pt-AO', 'profissional', 600, 30800.0, 'Líder', 1, 'usuario', datetime('now', '-159 days'), datetime('now', '-20 hours'), 1);

PRAGMA foreign_keys = ON;
