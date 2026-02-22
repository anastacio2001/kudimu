-- ========================================
-- CAMPANHAS REALISTAS SOBRE ANGOLA
-- 50 Campanhas sobre temas sociais, econômicos e políticos
-- ========================================

-- ========================================
-- CAMPANHAS ATIVAS (50)
-- Temas: Saúde, Educação, Economia, Política, Cultura, Infraestrutura, Ambiente
-- ========================================

INSERT INTO campaigns (id, titulo, descricao, cliente, cliente_id, tema, tipo, recompensa_por_resposta, quantidade_alvo, quantidade_atual, data_inicio, data_fim, status, publico_alvo, reputacao_minima, data_criacao)
VALUES 
-- SAÚDE (10 campanhas)
('camp-001', 'Acesso a Serviços de Saúde em Angola', 'Avaliação da qualidade e disponibilidade dos serviços de saúde pública em diferentes províncias', 'Ministério da Saúde', 'client-018', 'Saúde', 'social', 500, 1000, 0, datetime('now', '-10 days'), datetime('now', '+50 days'), 'ativa', '{"idade_min":18,"provincias":["todas"]}', 0, datetime('now', '-10 days')),

('camp-002', 'Vacinação Infantil: Consciência e Desafios', 'Percepção dos pais sobre programas de vacinação e barreiras ao acesso', 'Ministério da Saúde', 'client-018', 'Saúde', 'social', 450, 800, 0, datetime('now', '-8 days'), datetime('now', '+52 days'), 'ativa', '{"idade_min":20,"tem_filhos":true}', 0, datetime('now', '-8 days')),

('camp-003', 'Malária: Prevenção e Tratamento', 'Conhecimento da população sobre prevenção e tratamento da malária', 'Clínica Girassol', 'client-012', 'Saúde', 'comercial', 400, 600, 0, datetime('now', '-15 days'), datetime('now', '+45 days'), 'ativa', '{"idade_min":16}', 0, datetime('now', '-15 days')),

('camp-004', 'Saúde Mental em Tempos de Crise', 'Avaliação do impacto da crise econômica na saúde mental dos angolanos', 'ADRA Angola', 'client-020', 'Saúde', 'social', 550, 700, 0, datetime('now', '-12 days'), datetime('now', '+48 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-12 days')),

('camp-005', 'Nutrição Infantil e Combate à Desnutrição', 'Hábitos alimentares das famílias e acesso a alimentos nutritivos', 'Ministério da Saúde', 'client-018', 'Saúde', 'social', 480, 900, 0, datetime('now', '-7 days'), datetime('now', '+53 days'), 'ativa', '{"idade_min":18,"tem_filhos":true}', 0, datetime('now', '-7 days')),

('camp-006', 'Planeamento Familiar em Angola', 'Acesso e utilização de métodos contraceptivos', 'Farmácias Ango-Cubanas', 'client-013', 'Saúde', 'comercial', 420, 650, 0, datetime('now', '-20 days'), datetime('now', '+40 days'), 'ativa', '{"idade_min":18,"idade_max":45}', 0, datetime('now', '-20 days')),

('camp-007', 'Tuberculose: Estigma e Tratamento', 'Percepções sobre tuberculose e adesão ao tratamento', 'Clínica Girassol', 'client-012', 'Saúde', 'social', 500, 550, 0, datetime('now', '-5 days'), datetime('now', '+55 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-5 days')),

('camp-008', 'HIV/SIDA: Prevenção e Consciencialização', 'Conhecimento sobre prevenção e tratamento do HIV/SIDA', 'Ministério da Saúde', 'client-018', 'Saúde', 'social', 520, 850, 0, datetime('now', '-18 days'), datetime('now', '+42 days'), 'ativa', '{"idade_min":16}', 0, datetime('now', '-18 days')),

('camp-009', 'Saneamento Básico e Saúde Pública', 'Acesso a água potável e saneamento básico', 'ADRA Angola', 'client-020', 'Saúde', 'social', 450, 750, 0, datetime('now', '-14 days'), datetime('now', '+46 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-14 days')),

('camp-010', 'Medicina Tradicional vs Medicina Moderna', 'Práticas de saúde e confiança em diferentes sistemas médicos', 'Universidade Católica de Angola', 'client-014', 'Saúde', 'academico', 380, 500, 0, datetime('now', '-22 days'), datetime('now', '+38 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-22 days')),

-- EDUCAÇÃO (10 campanhas)
('camp-011', 'Qualidade do Ensino Público em Angola', 'Avaliação da qualidade das escolas públicas', 'Ministério da Educação', 'client-019', 'Educação', 'social', 480, 1200, 0, datetime('now', '-9 days'), datetime('now', '+51 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-9 days')),

('camp-012', 'Ensino à Distância: Desafios e Oportunidades', 'Experiência com educação online durante e pós-pandemia', 'Universidade Católica de Angola', 'client-014', 'Educação', 'academico', 450, 800, 0, datetime('now', '-11 days'), datetime('now', '+49 days'), 'ativa', '{"idade_min":16,"estudante":true}', 0, datetime('now', '-11 days')),

('camp-013', 'Alfabetização de Adultos em Angola', 'Barreiras e motivações para alfabetização de adultos', 'ADRA Angola', 'client-020', 'Educação', 'social', 500, 600, 0, datetime('now', '-16 days'), datetime('now', '+44 days'), 'ativa', '{"idade_min":25}', 0, datetime('now', '-16 days')),

('camp-014', 'Formação Profissional e Empregabilidade', 'Adequação da formação profissional às necessidades do mercado', 'Instituto Superior Politécnico', 'client-015', 'Educação', 'academico', 520, 700, 0, datetime('now', '-6 days'), datetime('now', '+54 days'), 'ativa', '{"idade_min":18,"idade_max":35}', 0, datetime('now', '-6 days')),

('camp-015', 'Infraestruturas Escolares: Estado Atual', 'Condições físicas das escolas (salas, bibliotecas, laboratórios)', 'Ministério da Educação', 'client-019', 'Educação', 'social', 460, 950, 0, datetime('now', '-13 days'), datetime('now', '+47 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-13 days')),

('camp-016', 'Professores: Formação e Condições de Trabalho', 'Avaliação das condições de trabalho dos professores', 'Ministério da Educação', 'client-019', 'Educação', 'social', 490, 650, 0, datetime('now', '-19 days'), datetime('now', '+41 days'), 'ativa', '{"idade_min":22,"profissao":"professor"}', 0, datetime('now', '-19 days')),

('camp-017', 'Ensino Superior: Acesso e Qualidade', 'Barreiras ao acesso e percepção da qualidade do ensino superior', 'Universidade Católica de Angola', 'client-014', 'Educação', 'academico', 510, 750, 0, datetime('now', '-4 days'), datetime('now', '+56 days'), 'ativa', '{"idade_min":17,"idade_max":30}', 0, datetime('now', '-4 days')),

('camp-018', 'Abandono Escolar: Causas e Soluções', 'Fatores que levam ao abandono escolar precoce', 'ADRA Angola', 'client-020', 'Educação', 'social', 470, 850, 0, datetime('now', '-17 days'), datetime('now', '+43 days'), 'ativa', '{"idade_min":15}', 0, datetime('now', '-17 days')),

('camp-019', 'Educação Inclusiva para Crianças com Deficiência', 'Acessibilidade e inclusão de crianças com deficiência nas escolas', 'Ministério da Educação', 'client-019', 'Educação', 'social', 530, 500, 0, datetime('now', '-21 days'), datetime('now', '+39 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-21 days')),

('camp-020', 'Literacia Digital nas Escolas', 'Acesso e uso de tecnologias digitais no ensino', 'Microsoft Angola', 'client-003', 'Educação', 'comercial', 550, 900, 0, datetime('now', '-3 days'), datetime('now', '+57 days'), 'ativa', '{"idade_min":16}', 0, datetime('now', '-3 days')),

-- ECONOMIA & EMPREGO (10 campanhas)
('camp-021', 'Desemprego Jovem em Angola', 'Desafios enfrentados pelos jovens no mercado de trabalho', 'Ministério da Educação', 'client-019', 'Economia', 'social', 490, 1000, 0, datetime('now', '-25 days'), datetime('now', '+35 days'), 'ativa', '{"idade_min":18,"idade_max":35}', 0, datetime('now', '-25 days')),

('camp-022', 'Empreendedorismo em Angola: Desafios e Oportunidades', 'Barreiras ao empreendedorismo e apoio necessário', 'Banco BAI', 'client-004', 'Economia', 'comercial', 520, 850, 0, datetime('now', '-24 days'), datetime('now', '+36 days'), 'ativa', '{"idade_min":20}', 0, datetime('now', '-24 days')),

('camp-023', 'Custo de Vida em Luanda e Províncias', 'Percepção sobre o custo de vida e poder de compra', 'Shoprite Angola', 'client-009', 'Economia', 'comercial', 450, 1100, 0, datetime('now', '-23 days'), datetime('now', '+37 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-23 days')),

('camp-024', 'Acesso a Crédito e Serviços Bancários', 'Facilidade de acesso a crédito e serviços financeiros', 'BFA Banco', 'client-005', 'Economia', 'comercial', 480, 900, 0, datetime('now', '-26 days'), datetime('now', '+34 days'), 'ativa', '{"idade_min":21}', 0, datetime('now', '-26 days')),

('camp-025', 'Economia Informal em Angola', 'Participação e percepções sobre o setor informal', 'Universidade Católica de Angola', 'client-014', 'Economia', 'academico', 500, 750, 0, datetime('now', '-28 days'), datetime('now', '+32 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-28 days')),

('camp-026', 'Salário Mínimo: Suficiência e Impacto', 'Percepção sobre a adequação do salário mínimo', 'ADRA Angola', 'client-020', 'Economia', 'social', 470, 950, 0, datetime('now', '-27 days'), datetime('now', '+33 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-27 days')),

('camp-027', 'Diversificação Económica: Para Além do Petróleo', 'Conhecimento sobre esforços de diversificação económica', 'Sonangol EP', 'client-007', 'Economia', 'comercial', 550, 700, 0, datetime('now', '-30 days'), datetime('now', '+30 days'), 'ativa', '{"idade_min":20}', 0, datetime('now', '-30 days')),

('camp-028', 'Inflação e Poder de Compra', 'Impacto da inflação no quotidiano das famílias', 'Banco Millennium Atlântico', 'client-006', 'Economia', 'comercial', 460, 850, 0, datetime('now', '-29 days'), datetime('now', '+31 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-29 days')),

('camp-029', 'Trabalho Remoto e Futuro do Emprego', 'Aceitação e desafios do trabalho remoto', 'Microsoft Angola', 'client-003', 'Economia', 'comercial', 510, 600, 0, datetime('now', '-31 days'), datetime('now', '+29 days'), 'ativa', '{"idade_min":22}', 0, datetime('now', '-31 days')),

('camp-030', 'Proteção Social e Subsídios Governamentais', 'Acesso e eficácia dos programas de proteção social', 'Ministério da Saúde', 'client-018', 'Economia', 'social', 490, 800, 0, datetime('now', '-32 days'), datetime('now', '+28 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-32 days')),

-- POLÍTICA & GOVERNAÇÃO (5 campanhas)
('camp-031', 'Confiança nas Instituições Públicas', 'Nível de confiança em instituições governamentais', 'Universidade Católica de Angola', 'client-014', 'Política', 'academico', 520, 1000, 0, datetime('now', '-33 days'), datetime('now', '+27 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-33 days')),

('camp-032', 'Participação Cívica e Eleições', 'Engajamento em processos eleitorais e participação política', 'Universidade Católica de Angola', 'client-014', 'Política', 'academico', 500, 900, 0, datetime('now', '-34 days'), datetime('now', '+26 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-34 days')),

('camp-033', 'Transparência e Combate à Corrupção', 'Percepções sobre corrupção e transparência governamental', 'ADRA Angola', 'client-020', 'Política', 'social', 530, 800, 0, datetime('now', '-35 days'), datetime('now', '+25 days'), 'ativa', '{"idade_min":21}', 0, datetime('now', '-35 days')),

('camp-034', 'Descentralização e Poder Local', 'Conhecimento e percepção sobre administrações locais', 'Universidade Católica de Angola', 'client-014', 'Política', 'academico', 480, 650, 0, datetime('now', '-36 days'), datetime('now', '+24 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-36 days')),

('camp-035', 'Liberdade de Expressão e Mídia', 'Percepção sobre liberdade de imprensa e expressão', 'TV Zimbo', 'client-016', 'Política', 'comercial', 510, 700, 0, datetime('now', '-37 days'), datetime('now', '+23 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-37 days')),

-- INFRAESTRUTURA & TRANSPORTES (5 campanhas)
('camp-036', 'Mobilidade Urbana em Luanda', 'Desafios de transporte na capital', 'Ministério da Educação', 'client-019', 'Infraestrutura', 'social', 470, 1200, 0, datetime('now', '-38 days'), datetime('now', '+22 days'), 'ativa', '{"provincia":"Luanda"}', 0, datetime('now', '-38 days')),

('camp-037', 'Estradas e Infraestrutura Rodoviária', 'Estado das estradas e acesso às províncias', 'Ministério da Educação', 'client-019', 'Infraestrutura', 'social', 460, 850, 0, datetime('now', '-39 days'), datetime('now', '+21 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-39 days')),

('camp-038', 'Acesso à Internet e Telecomunicações', 'Qualidade e acessibilidade dos serviços de internet', 'Unitel Angola', 'client-001', 'Infraestrutura', 'comercial', 490, 1000, 0, datetime('now', '-40 days'), datetime('now', '+20 days'), 'ativa', '{"idade_min":16}', 0, datetime('now', '-40 days')),

('camp-039', 'Fornecimento de Energia Elétrica', 'Frequência e qualidade do fornecimento de eletricidade', 'ENDE', 'client-008', 'Infraestrutura', 'social', 500, 950, 0, datetime('now', '-41 days'), datetime('now', '+19 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-41 days')),

('camp-040', 'Habitação e Acesso à Moradia', 'Desafios habitacionais e acesso a moradia digna', 'ADRA Angola', 'client-020', 'Infraestrutura', 'social', 520, 750, 0, datetime('now', '-42 days'), datetime('now', '+18 days'), 'ativa', '{"idade_min":20}', 0, datetime('now', '-42 days')),

-- CULTURA & SOCIEDADE (5 campanhas)
('camp-041', 'Identidade Cultural Angolana', 'Preservação e valorização da cultura angolana', 'TV Zimbo', 'client-016', 'Cultura', 'comercial', 440, 700, 0, datetime('now', '-43 days'), datetime('now', '+17 days'), 'ativa', '{"idade_min":16}', 0, datetime('now', '-43 days')),

('camp-042', 'Línguas Nacionais e Diversidade Linguística', 'Uso e valorização das línguas nacionais', 'Universidade Católica de Angola', 'client-014', 'Cultura', 'academico', 450, 600, 0, datetime('now', '-44 days'), datetime('now', '+16 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-44 days')),

('camp-043', 'Igualdade de Género em Angola', 'Percepções sobre igualdade entre homens e mulheres', 'ADRA Angola', 'client-020', 'Sociedade', 'social', 510, 850, 0, datetime('now', '-45 days'), datetime('now', '+15 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-45 days')),

('camp-044', 'Violência Doméstica: Consciencialização e Prevenção', 'Conhecimento sobre violência doméstica e recursos disponíveis', 'Ministério da Saúde', 'client-018', 'Sociedade', 'social', 530, 750, 0, datetime('now', '-46 days'), datetime('now', '+14 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-46 days')),

('camp-045', 'Juventude e Participação Social', 'Engajamento dos jovens em atividades comunitárias', 'ADRA Angola', 'client-020', 'Sociedade', 'social', 460, 650, 0, datetime('now', '-47 days'), datetime('now', '+13 days'), 'ativa', '{"idade_min":15,"idade_max":30}', 0, datetime('now', '-47 days')),

-- AMBIENTE & SUSTENTABILIDADE (5 campanhas)
('camp-046', 'Gestão de Resíduos Sólidos', 'Práticas de gestão de lixo e reciclagem', 'ADRA Angola', 'client-020', 'Ambiente', 'social', 470, 800, 0, datetime('now', '-48 days'), datetime('now', '+12 days'), 'ativa', '{"idade_min":16}', 0, datetime('now', '-48 days')),

('camp-047', 'Mudanças Climáticas: Consciencialização', 'Conhecimento sobre mudanças climáticas e impactos em Angola', 'Universidade Católica de Angola', 'client-014', 'Ambiente', 'academico', 480, 650, 0, datetime('now', '-49 days'), datetime('now', '+11 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-49 days')),

('camp-048', 'Acesso à Água Potável', 'Disponibilidade e qualidade da água para consumo', 'Ministério da Saúde', 'client-018', 'Ambiente', 'social', 500, 950, 0, datetime('now', '-50 days'), datetime('now', '+10 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-50 days')),

('camp-049', 'Proteção da Biodiversidade Angolana', 'Conhecimento sobre espécies e áreas protegidas', 'ADRA Angola', 'client-020', 'Ambiente', 'social', 490, 550, 0, datetime('now', '-51 days'), datetime('now', '+9 days'), 'ativa', '{"idade_min":18}', 0, datetime('now', '-51 days')),

('camp-050', 'Energia Renovável: Futuro Sustentável', 'Percepções sobre energia solar e outras alternativas', 'ENDE', 'client-008', 'Ambiente', 'social', 520, 700, 0, datetime('now', '-52 days'), datetime('now', '+8 days'), 'ativa', '{"idade_min":20}', 0, datetime('now', '-52 days'));

PRAGMA foreign_keys = ON;
