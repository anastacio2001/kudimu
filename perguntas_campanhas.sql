-- ========================================
-- PERGUNTAS PARA AS 50 CAMPANHAS
-- Total: 220 perguntas (4-5 por campanha)
-- ========================================

-- Perguntas para camp-001: Acesso a Serviços de Saúde em Angola
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-001-1', 'camp-001', 'Com que frequência você utiliza serviços de saúde pública?', 'escolha_multipla', '["Mensalmente","A cada 3 meses","A cada 6 meses","Raramente (1x por ano ou menos)","Nunca"]', 1, 1),
('q-001-2', 'camp-001', 'Como avalia a qualidade do atendimento nos centros de saúde da sua província?', 'escala', '{"min":1,"max":5,"label_min":"Muito ruim","label_max":"Excelente"}', 2, 1),
('q-001-3', 'camp-001', 'Qual o principal desafio para aceder a serviços de saúde?', 'escolha_multipla', '["Distância do centro de saúde","Falta de medicamentos","Longas filas de espera","Custo elevado","Falta de profissionais qualificados","Outro"]', 3, 1),
('q-001-4', 'camp-001', 'Já teve que viajar para outra província para receber tratamento médico?', 'sim_nao', '["Sim","Não"]', 4, 1),
('q-001-5', 'camp-001', 'Que melhorias considera mais urgentes no sistema de saúde?', 'texto_longo', NULL, 5, 0);

-- Perguntas para camp-002: Vacinação Infantil
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-002-1', 'camp-002', 'Todos os seus filhos têm o cartão de vacinação atualizado?', 'sim_nao', '["Sim","Não","Alguns sim, outros não"]', 1, 1),
('q-002-2', 'camp-002', 'Qual a principal dificuldade em vacinar os seus filhos?', 'escolha_multipla', '["Nenhuma dificuldade","Falta de vacinas no centro de saúde","Distância ao posto de vacinação","Horário incompatível","Desconhecimento do calendário","Receio de efeitos secundários"]', 2, 1),
('q-002-3', 'camp-002', 'Como recebe informações sobre campanhas de vacinação?', 'escolha_multipla', '["Centro de saúde","Rádio","Televisão","Redes sociais","Agentes comunitários","Não recebo"]', 3, 1),
('q-002-4', 'camp-002', 'Confia na segurança e eficácia das vacinas disponíveis em Angola?', 'escala', '{"min":1,"max":5,"label_min":"Não confio","label_max":"Confio totalmente"}', 4, 1);

-- Perguntas para camp-003: Malária
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-003-1', 'camp-003', 'Você ou alguém da sua família teve malária no último ano?', 'sim_nao', '["Sim","Não"]', 1, 1),
('q-003-2', 'camp-003', 'Que medidas de prevenção utiliza em casa?', 'escolha_multipla', '["Rede mosquiteira","Repelente","Inseticida ambiental","Eliminação de água parada","Nenhuma medida específica"]', 2, 1),
('q-003-3', 'camp-003', 'Ao sentir sintomas de malária, qual a sua primeira ação?', 'escolha_multipla', '["Vou imediatamente ao centro de saúde","Compro medicamento na farmácia","Uso remédios caseiros","Espero alguns dias para ver se melhora"]', 3, 1),
('q-003-4', 'camp-003', 'Sabe quais são os principais sintomas da malária?', 'sim_nao', '["Sim","Não","Tenho alguma ideia"]', 4, 1),
('q-003-5', 'camp-003', 'Na sua opinião, o que mais falta para combater a malária?', 'texto_longo', NULL, 5, 0);

-- Perguntas para camp-004: Saúde Mental
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-004-1', 'camp-004', 'Nos últimos 6 meses, sentiu ansiedade ou stress frequentes?', 'sim_nao', '["Sim, frequentemente","Sim, às vezes","Raramente","Nunca"]', 1, 1),
('q-004-2', 'camp-004', 'A crise econômica afetou a sua saúde mental?', 'escala', '{"min":1,"max":5,"label_min":"Não afetou","label_max":"Afetou muito"}', 2, 1),
('q-004-3', 'camp-004', 'Procurou ajuda profissional para problemas de saúde mental?', 'sim_nao', '["Sim","Não, mas gostaria","Não, não acho necessário"]', 3, 1),
('q-004-4', 'camp-004', 'Qual o principal obstáculo para procurar apoio psicológico?', 'escolha_multipla', '["Custo elevado","Estigma social","Falta de profissionais","Desconhecimento de onde procurar","Não considero necessário"]', 4, 1);

-- Perguntas para camp-005: Nutrição Infantil
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-005-1', 'camp-005', 'Quantas refeições por dia as suas crianças fazem?', 'escolha_multipla', '["1 refeição","2 refeições","3 refeições","Mais de 3 refeições"]', 1, 1),
('q-005-2', 'camp-005', 'Com que frequência as crianças consomem frutas e vegetais?', 'escolha_multipla', '["Diariamente","Várias vezes por semana","Raramente","Nunca"]', 2, 1),
('q-005-3', 'camp-005', 'Qual a principal dificuldade em fornecer alimentação adequada?', 'escolha_multipla', '["Custo dos alimentos","Falta de variedade no mercado","Desconhecimento nutricional","Falta de tempo","Preferências das crianças"]', 3, 1),
('q-005-4', 'camp-005', 'Alguma criança na sua família já foi diagnosticada com desnutrição?', 'sim_nao', '["Sim","Não","Não sei"]', 4, 1);

-- Perguntas para camp-006: Planeamento Familiar
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-006-1', 'camp-006', 'Utiliza algum método contraceptivo?', 'sim_nao', '["Sim","Não"]', 1, 1),
('q-006-2', 'camp-006', 'Teve acesso a informação sobre planeamento familiar?', 'sim_nao', '["Sim, informação completa","Sim, mas limitada","Não"]', 2, 1),
('q-006-3', 'camp-006', 'Qual a principal barreira ao acesso a métodos contraceptivos?', 'escolha_multipla', '["Custo","Falta de acesso em centros de saúde","Oposição familiar/parceiro","Crenças religiosas","Desconhecimento","Sem barreiras"]', 3, 1),
('q-006-4', 'camp-006', 'Como avalia o atendimento em planeamento familiar nos centros de saúde?', 'escala', '{"min":1,"max":5,"label_min":"Muito insatisfeito","label_max":"Muito satisfeito"}', 4, 1);

-- Perguntas para camp-007: Tuberculose
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-007-1', 'camp-007', 'Conhece alguém que teve ou tem tuberculose?', 'sim_nao', '["Sim","Não"]', 1, 1),
('q-007-2', 'camp-007', 'Sabe como a tuberculose se transmite?', 'sim_nao', '["Sim, sei bem","Tenho alguma ideia","Não sei"]', 2, 1),
('q-007-3', 'camp-007', 'Na sua comunidade, há estigma em relação a pessoas com tuberculose?', 'escala', '{"min":1,"max":5,"label_min":"Nenhum estigma","label_max":"Muito estigma"}', 3, 1),
('q-007-4', 'camp-007', 'Acredita que a tuberculose tem cura com tratamento adequado?', 'sim_nao', '["Sim","Não","Não sei"]', 4, 1);

-- Perguntas para camp-008: HIV/SIDA
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-008-1', 'camp-008', 'Já fez teste de HIV?', 'sim_nao', '["Sim, nos últimos 12 meses","Sim, há mais de 1 ano","Nunca fiz"]', 1, 1),
('q-008-2', 'camp-008', 'Conhece os métodos de prevenção do HIV?', 'escolha_multipla', '["Uso de preservativo","Testagem regular","Tratamento preventivo (PrEP)","Fidelidade/redução de parceiros","Conheço todos","Não conheço nenhum"]', 2, 1),
('q-008-3', 'camp-008', 'Sente que há discriminação contra pessoas vivendo com HIV?', 'escala', '{"min":1,"max":5,"label_min":"Nenhuma discriminação","label_max":"Muita discriminação"}', 3, 1),
('q-008-4', 'camp-008', 'Sabe onde fazer teste de HIV gratuito?', 'sim_nao', '["Sim","Não"]', 4, 1),
('q-008-5', 'camp-008', 'Que ações considera prioritárias no combate ao HIV?', 'texto_longo', NULL, 5, 0);

-- Perguntas para camp-009: Saneamento Básico
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-009-1', 'camp-009', 'Qual a fonte de água da sua residência?', 'escolha_multipla', '["Rede pública (canalizada)","Chafariz/Bomba comunitária","Poço privado","Camião cisterna","Rio/lago","Outro"]', 1, 1),
('q-009-2', 'camp-009', 'A água que consome é tratada/filtrada?', 'sim_nao', '["Sim, sempre","Às vezes","Não"]', 2, 1),
('q-009-3', 'camp-009', 'A sua casa tem sistema de esgotos ou fossa séptica?', 'sim_nao', '["Sim, rede de esgotos","Sim, fossa séptica","Não tem sistema adequado"]', 3, 1),
('q-009-4', 'camp-009', 'Como avalia as condições de saneamento no seu bairro?', 'escala', '{"min":1,"max":5,"label_min":"Muito ruins","label_max":"Excelentes"}', 4, 1);

-- Perguntas para camp-010: Medicina Tradicional
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-010-1', 'camp-010', 'Já recorreu a medicina tradicional para tratamento?', 'sim_nao', '["Sim, frequentemente","Sim, ocasionalmente","Nunca"]', 1, 1),
('q-010-2', 'camp-010', 'Confia na eficácia da medicina tradicional?', 'escala', '{"min":1,"max":5,"label_min":"Não confio","label_max":"Confio totalmente"}', 2, 1),
('q-010-3', 'camp-010', 'Em que situações prefere medicina tradicional a medicina moderna?', 'escolha_multipla', '["Doenças culturais/espirituais","Quando medicina moderna não funciona","Mais acessível financeiramente","Confiança no curandeiro","Nunca prefiro"]', 3, 1),
('q-010-4', 'camp-010', 'Acredita que ambos os sistemas podem trabalhar juntos?', 'sim_nao', '["Sim","Não","Depende da doença"]', 4, 1);

-- Perguntas para camp-011: Qualidade do Ensino Público
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-011-1', 'camp-011', 'Como avalia a qualidade das escolas públicas na sua região?', 'escala', '{"min":1,"max":5,"label_min":"Muito má","label_max":"Excelente"}', 1, 1),
('q-011-2', 'camp-011', 'Qual o maior problema das escolas públicas?', 'escolha_multipla', '["Falta de professores","Infraestrutura precária","Falta de materiais didáticos","Turmas superlotadas","Baixa qualidade do ensino","Todos os anteriores"]', 2, 1),
('q-011-3', 'camp-011', 'As escolas públicas preparam adequadamente os alunos?', 'sim_nao', '["Sim","Não","Parcialmente"]', 3, 1),
('q-011-4', 'camp-011', 'Preferiria escola privada se tivesse condições financeiras?', 'sim_nao', '["Sim","Não","Indiferente"]', 4, 1),
('q-011-5', 'camp-011', 'Que melhorias sugere para as escolas públicas?', 'texto_longo', NULL, 5, 0);

-- Perguntas para camp-012: Ensino à Distância
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-012-1', 'camp-012', 'Teve experiência com ensino online/à distância?', 'sim_nao', '["Sim","Não"]', 1, 1),
('q-012-2', 'camp-012', 'Qual a principal dificuldade do ensino online?', 'escolha_multipla', '["Falta de internet estável","Falta de dispositivos adequados","Dificuldade de concentração","Falta de interação presencial","Não domino a tecnologia"]', 2, 1),
('q-012-3', 'camp-012', 'Como compara ensino presencial vs online?', 'escala', '{"min":1,"max":5,"label_min":"Presencial muito melhor","label_max":"Online muito melhor"}', 3, 1),
('q-012-4', 'camp-012', 'Gostaria de ter mais opções de ensino à distância?', 'sim_nao', '["Sim","Não","Depende do curso"]', 4, 1);

-- Perguntas para camp-013: Alfabetização de Adultos
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-013-1', 'camp-013', 'Qual o seu nível de escolaridade?', 'escolha_multipla', '["Sem escolaridade","Ensino primário incompleto","Ensino primário completo","Ensino secundário incompleto","Ensino secundário completo","Ensino superior"]', 1, 1),
('q-013-2', 'camp-013', 'Conhece programas de alfabetização de adultos na sua área?', 'sim_nao', '["Sim","Não"]', 2, 1),
('q-013-3', 'camp-013', 'Qual a principal barreira para adultos frequentarem programas de alfabetização?', 'escolha_multipla', '["Falta de tempo (trabalho)","Vergonha/estigma","Falta de programas disponíveis","Distância","Custo","Falta de interesse"]', 3, 1),
('q-013-4', 'camp-013', 'Considera a alfabetização importante para melhorar a vida?', 'escala', '{"min":1,"max":5,"label_min":"Nada importante","label_max":"Muito importante"}', 4, 1);

-- Perguntas para camp-014: Formação Profissional
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-014-1', 'camp-014', 'Fez algum curso de formação profissional?', 'sim_nao', '["Sim","Não"]', 1, 1),
('q-014-2', 'camp-014', 'A formação que recebeu ajudou a conseguir emprego?', 'sim_nao', '["Sim, diretamente","Sim, indiretamente","Não","Não fiz formação"]', 2, 1),
('q-014-3', 'camp-014', 'Em que áreas gostaria de receber formação?', 'escolha_multipla', '["Tecnologia/Informática","Gestão/Empreendedorismo","Saúde/Enfermagem","Construção civil","Agricultura","Turismo e hotelaria","Mecânica/eletricidade","Outro"]', 3, 1),
('q-014-4', 'camp-014', 'Considera que há formação profissional suficiente em Angola?', 'sim_nao', '["Sim","Não"]', 4, 1),
('q-014-5', 'camp-014', 'O que falta nos programas de formação profissional?', 'texto_longo', NULL, 5, 0);

-- Perguntas para camp-015: Infraestruturas Escolares
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-015-1', 'camp-015', 'A escola mais próxima tem carteiras suficientes para todos os alunos?', 'sim_nao', '["Sim","Não","Não sei"]', 1, 1),
('q-015-2', 'camp-015', 'A escola tem biblioteca funcional?', 'sim_nao', '["Sim, bem equipada","Sim, mas precária","Não tem"]', 2, 1),
('q-015-3', 'camp-015', 'A escola tem laboratórios (ciências, informática)?', 'sim_nao', '["Sim, ambos","Apenas um","Nenhum"]', 3, 1),
('q-015-4', 'camp-015', 'Como avalia as condições físicas das escolas (edifícios, salas)?', 'escala', '{"min":1,"max":5,"label_min":"Muito ruins","label_max":"Excelentes"}', 4, 1);

-- Perguntas para camp-016: Professores
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-016-1', 'camp-016', 'É professor há quanto tempo?', 'escolha_multipla', '["Menos de 1 ano","1-5 anos","6-10 anos","11-20 anos","Mais de 20 anos"]', 1, 1),
('q-016-2', 'camp-016', 'Considera o salário adequado ao trabalho realizado?', 'sim_nao', '["Sim","Não"]', 2, 1),
('q-016-3', 'camp-016', 'Tem acesso a formação contínua?', 'sim_nao', '["Sim, regularmente","Sim, mas raramente","Não"]', 3, 1),
('q-016-4', 'camp-016', 'Qual o maior desafio como professor?', 'escolha_multipla', '["Turmas superlotadas","Falta de materiais didáticos","Baixo salário","Falta de apoio da direção","Indisciplina dos alunos","Falta de formação"]', 4, 1);

-- Perguntas para camp-017: Ensino Superior
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-017-1', 'camp-017', 'Frequenta ou frequentou o ensino superior?', 'sim_nao', '["Sim, atualmente","Sim, concluí","Não"]', 1, 1),
('q-017-2', 'camp-017', 'Qual a principal barreira ao acesso ao ensino superior?', 'escolha_multipla', '["Custo das propinas","Falta de vagas","Distância geográfica","Fraco desempenho escolar","Necessidade de trabalhar","Falta de informação"]', 2, 1),
('q-017-3', 'camp-017', 'Como avalia a qualidade do ensino superior em Angola?', 'escala', '{"min":1,"max":5,"label_min":"Muito má","label_max":"Excelente"}', 3, 1),
('q-017-4', 'camp-017', 'O ensino superior prepara adequadamente para o mercado de trabalho?', 'sim_nao', '["Sim","Não","Parcialmente"]', 4, 1);

-- Perguntas para camp-018: Abandono Escolar
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-018-1', 'camp-018', 'Conhece jovens que abandonaram a escola?', 'sim_nao', '["Sim, muitos","Sim, alguns","Não"]', 1, 1),
('q-018-2', 'camp-018', 'Qual a principal razão para abandono escolar?', 'escolha_multipla', '["Necessidade de trabalhar","Gravidez precoce","Falta de interesse","Dificuldades de aprendizagem","Distância à escola","Pobreza extrema"]', 2, 1),
('q-018-3', 'camp-018', 'Já pensou em abandonar os estudos?', 'sim_nao', '["Sim","Não","Já abandonei"]', 3, 1),
('q-018-4', 'camp-018', 'Que apoios ajudariam a reduzir o abandono escolar?', 'texto_longo', NULL, 4, 0);

-- Perguntas para camp-019: Educação Inclusiva
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-019-1', 'camp-019', 'As escolas na sua região estão preparadas para crianças com deficiência?', 'sim_nao', '["Sim","Não","Algumas sim"]', 1, 1),
('q-019-2', 'camp-019', 'Conhece crianças com deficiência que não frequentam escola?', 'sim_nao', '["Sim","Não"]', 2, 1),
('q-019-3', 'camp-019', 'Qual a principal barreira à educação inclusiva?', 'escolha_multipla', '["Falta de infraestrutura adaptada","Falta de professores especializados","Estigma/discriminação","Falta de materiais adaptados","Custo elevado","Desconhecimento dos direitos"]', 3, 1),
('q-019-4', 'camp-019', 'Considera importante investir em educação inclusiva?', 'escala', '{"min":1,"max":5,"label_min":"Nada importante","label_max":"Muito importante"}', 4, 1);

-- Perguntas para camp-020: Literacia Digital
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-020-1', 'camp-020', 'A sua escola tem computadores para os alunos?', 'sim_nao', '["Sim, suficientes","Sim, mas insuficientes","Não tem"]', 1, 1),
('q-020-2', 'camp-020', 'Tem aulas de informática/TIC?', 'sim_nao', '["Sim, regulares","Sim, mas raramente","Não"]', 2, 1),
('q-020-3', 'camp-020', 'Sabe usar ferramentas básicas de informática (Word, Excel, Internet)?', 'escala', '{"min":1,"max":5,"label_min":"Não sei nada","label_max":"Sei muito bem"}', 3, 1),
('q-020-4', 'camp-020', 'Considera as competências digitais importantes para o futuro?', 'sim_nao', '["Sim","Não"]', 4, 1);

-- Perguntas para camp-021: Desemprego Jovem
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-021-1', 'camp-021', 'Qual a sua situação atual de emprego?', 'escolha_multipla', '["Empregado a tempo inteiro","Empregado a tempo parcial","Desempregado procurando","Desempregado sem procurar","Estudante","Trabalhador informal"]', 1, 1),
('q-021-2', 'camp-021', 'Há quanto tempo procura emprego (se desempregado)?', 'escolha_multipla', '["Menos de 3 meses","3-6 meses","6-12 meses","Mais de 1 ano","Não procuro","Não se aplica"]', 2, 1),
('q-021-3', 'camp-021', 'Qual o maior obstáculo para conseguir emprego?', 'escolha_multipla', '["Falta de experiência","Falta de formação adequada","Poucas oportunidades no mercado","Nepotismo/corrupção","Salários muito baixos","Localização geográfica"]', 3, 1),
('q-021-4', 'camp-021', 'Já considerou empreender/criar o próprio negócio?', 'sim_nao', '["Sim, já criei","Sim, estou a planear","Sim, mas sem condições","Não"]', 4, 1),
('q-021-5', 'camp-021', 'Que políticas ajudariam a reduzir o desemprego jovem?', 'texto_longo', NULL, 5, 0);

-- Perguntas para camp-022: Empreendedorismo
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-022-1', 'camp-022', 'Tem o seu próprio negócio?', 'sim_nao', '["Sim, formalizado","Sim, informal","Não, mas planejo","Não"]', 1, 1),
('q-022-2', 'camp-022', 'Qual o maior desafio para empreender em Angola?', 'escolha_multipla', '["Acesso a financiamento","Burocracia excessiva","Impostos elevados","Falta de clientes","Infraestrutura deficiente","Concorrência desleal"]', 2, 1),
('q-022-3', 'camp-022', 'Já tentou obter crédito bancário para o negócio?', 'sim_nao', '["Sim, consegui","Sim, mas rejeitado","Não tentei por receio","Não preciso"]', 3, 1),
('q-022-4', 'camp-022', 'Como avalia o ambiente de negócios em Angola?', 'escala', '{"min":1,"max":5,"label_min":"Muito desfavorável","label_max":"Muito favorável"}', 4, 1);

-- Perguntas para camp-023: Custo de Vida
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-023-1', 'camp-023', 'Como avalia o custo de vida na sua região?', 'escala', '{"min":1,"max":5,"label_min":"Muito baixo","label_max":"Muito elevado"}', 1, 1),
('q-023-2', 'camp-023', 'Qual item pesa mais no seu orçamento familiar?', 'escolha_multipla', '["Alimentação","Habitação (renda)","Transporte","Educação","Saúde","Energia e água"]', 2, 1),
('q-023-3', 'camp-023', 'Nos últimos 12 meses, o custo de vida aumentou?', 'sim_nao', '["Sim, muito","Sim, um pouco","Manteve-se","Diminuiu"]', 3, 1),
('q-023-4', 'camp-023', 'Consegue poupar algum dinheiro mensalmente?', 'sim_nao', '["Sim, regularmente","Sim, às vezes","Não"]', 4, 1);

-- Perguntas para camp-024: Acesso a Crédito
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-024-1', 'camp-024', 'Tem conta bancária?', 'sim_nao', '["Sim","Não"]', 1, 1),
('q-024-2', 'camp-024', 'Já solicitou crédito bancário (pessoal ou empresarial)?', 'sim_nao', '["Sim, aprovado","Sim, rejeitado","Não, nunca solicitei"]', 2, 1),
('q-024-3', 'camp-024', 'Qual a principal dificuldade em obter crédito?', 'escolha_multipla', '["Juros muito altos","Falta de garantias","Burocracia excessiva","Rendimento insuficiente","Histórico de crédito","Não confio nos bancos"]', 3, 1),
('q-024-4', 'camp-024', 'Utiliza serviços bancários digitais (mobile banking)?', 'sim_nao', '["Sim, frequentemente","Sim, raramente","Não"]', 4, 1);

-- Perguntas para camp-025: Economia Informal
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-025-1', 'camp-025', 'Trabalha ou já trabalhou no setor informal?', 'sim_nao', '["Sim, atualmente","Sim, no passado","Nunca"]', 1, 1),
('q-025-2', 'camp-025', 'Por que escolheu/escolhe o setor informal?', 'escolha_multipla', '["Falta de emprego formal","Mais liberdade/autonomia","Menos impostos","Mais rentável","Única opção disponível","Não se aplica"]', 2, 1),
('q-025-3', 'camp-025', 'Gostaria de formalizar a sua atividade?', 'sim_nao', '["Sim","Não","Já é formalizada","Não se aplica"]', 3, 1),
('q-025-4', 'camp-025', 'Qual o maior desafio do setor informal?', 'escolha_multipla', '["Instabilidade de rendimento","Falta de proteção social","Fiscalização/multas","Dificuldade em obter crédito","Concorrência","Todos os anteriores"]', 4, 1);

-- Perguntas para camp-026: Salário Mínimo
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-026-1', 'camp-026', 'O salário mínimo atual é suficiente para viver dignamente?', 'sim_nao', '["Sim","Não"]', 1, 1),
('q-026-2', 'camp-026', 'Ganha o salário mínimo ou acima?', 'escolha_multipla', '["Abaixo do mínimo","Salário mínimo","Acima do mínimo","Prefiro não responder"]', 2, 1),
('q-026-3', 'camp-026', 'Quantas pessoas dependem do seu rendimento?', 'escolha_multipla', '["Apenas eu","2-3 pessoas","4-5 pessoas","Mais de 5 pessoas"]', 3, 1),
('q-026-4', 'camp-026', 'Qual seria um salário mínimo adequado (em AOA)?', 'texto_curto', NULL, 4, 0);

-- Perguntas para camp-027: Diversificação Econômica
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-027-1', 'camp-027', 'Sabe que Angola está a tentar diversificar a economia para além do petróleo?', 'sim_nao', '["Sim","Não"]', 1, 1),
('q-027-2', 'camp-027', 'Que setores deveriam ser prioritários na diversificação?', 'escolha_multipla', '["Agricultura","Turismo","Tecnologia","Pescas","Indústria transformadora","Energias renováveis","Mineração"]', 2, 1),
('q-027-3', 'camp-027', 'A dependência do petróleo afeta negativamente a economia?', 'sim_nao', '["Sim","Não","Não sei"]', 3, 1),
('q-027-4', 'camp-027', 'Sente os efeitos da diversificação econômica no dia a dia?', 'escala', '{"min":1,"max":5,"label_min":"Nenhum efeito","label_max":"Muito efeito"}', 4, 1);

-- Perguntas para camp-028: Inflação
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-028-1', 'camp-028', 'Sente que o seu poder de compra diminuiu no último ano?', 'sim_nao', '["Sim, muito","Sim, um pouco","Não","Melhorou"]', 1, 1),
('q-028-2', 'camp-028', 'Que produtos subiram mais de preço?', 'escolha_multipla', '["Alimentos básicos","Combustível","Renda de casa","Transporte","Medicamentos","Educação"]', 2, 1),
('q-028-3', 'camp-028', 'Mudou hábitos de consumo devido à inflação?', 'sim_nao', '["Sim, drasticamente","Sim, um pouco","Não"]', 3, 1),
('q-028-4', 'camp-028', 'Como avalia a gestão da inflação pelo governo?', 'escala', '{"min":1,"max":5,"label_min":"Muito má","label_max":"Muito boa"}', 4, 1);

-- Perguntas para camp-029: Trabalho Remoto
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-029-1', 'camp-029', 'Já trabalhou remotamente (de casa)?', 'sim_nao', '["Sim, atualmente","Sim, no passado","Nunca"]', 1, 1),
('q-029-2', 'camp-029', 'Qual a sua opinião sobre trabalho remoto?', 'escala', '{"min":1,"max":5,"label_min":"Muito negativa","label_max":"Muito positiva"}', 2, 1),
('q-029-3', 'camp-029', 'Qual o maior desafio do trabalho remoto?', 'escolha_multipla', '["Internet instável","Falta de espaço adequado","Dificuldade de concentração","Isolamento social","Custo de eletricidade","Não vejo desafios"]', 3, 1),
('q-029-4', 'camp-029', 'Gostaria de ter opção de trabalhar remotamente?', 'sim_nao', '["Sim, totalmente remoto","Sim, modelo híbrido","Não, prefiro presencial"]', 4, 1);

-- Perguntas para camp-030: Proteção Social
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
('q-030-1', 'camp-030', 'Já beneficiou de programas de subsídios governamentais?', 'sim_nao', '["Sim","Não"]', 1, 1),
('q-030-2', 'camp-030', 'Conhece os programas de proteção social disponíveis?', 'sim_nao', '["Sim, bem","Sim, vagamente","Não"]', 2, 1),
('q-030-3', 'camp-030', 'Qual programa de proteção social considera mais importante?', 'escolha_multipla', '["Subsídio de desemprego","Apoio a famílias vulneráveis","Pensões de velhice","Subsídio alimentar","Bolsas de estudo","Apoio à habitação"]', 3, 1),
('q-030-4', 'camp-030', 'Como avalia a eficácia dos programas sociais?', 'escala', '{"min":1,"max":5,"label_min":"Muito ineficaz","label_max":"Muito eficaz"}', 4, 1);

-- CONTINUA... (mais 20 campanhas = 80-100 perguntas)
-- Vou adicionar as restantes de forma condensada

-- Perguntas para camp-031 a camp-050 (4 perguntas cada = 80 perguntas)
INSERT INTO questions (id, campanha_id, pergunta_texto, tipo_resposta, opcoes_resposta, ordem, obrigatoria)
VALUES
-- camp-031: Confiança nas Instituições
('q-031-1', 'camp-031', 'Confia nas instituições governamentais?', 'escala', '{"min":1,"max":5,"label_min":"Nada","label_max":"Totalmente"}', 1, 1),
('q-031-2', 'camp-031', 'Em qual instituição confia mais?', 'escolha_multipla', '["Presidência","Assembleia Nacional","Tribunais","Polícia","Forças Armadas","Governos provinciais","Nenhuma"]', 2, 1),
('q-031-3', 'camp-031', 'Sente que suas preocupações são ouvidas pelo governo?', 'sim_nao', '["Sim","Não","Às vezes"]', 3, 1),
('q-031-4', 'camp-031', 'O que aumentaria sua confiança nas instituições?', 'texto_longo', NULL, 4, 0),

-- camp-032: Participação Cívica
('q-032-1', 'camp-032', 'Votou nas últimas eleições?', 'sim_nao', '["Sim","Não","Não tinha idade"]', 1, 1),
('q-032-2', 'camp-032', 'Por que votou ou não votou?', 'escolha_multipla', '["Dever cívico","Fazer diferença","Não acredito no sistema","Problemas logísticos","Desinteresse","Não se aplica"]', 2, 1),
('q-032-3', 'camp-032', 'Participa em atividades comunitárias ou políticas?', 'sim_nao', '["Sim, ativamente","Sim, ocasionalmente","Não"]', 3, 1),
('q-032-4', 'camp-032', 'Sente que seu voto faz diferença?', 'escala', '{"min":1,"max":5,"label_min":"Nenhuma diferença","label_max":"Muita diferença"}', 4, 1),

-- camp-033: Transparência e Corrupção
('q-033-1', 'camp-033', 'Considera a corrupção um problema grave em Angola?', 'escala', '{"min":1,"max":5,"label_min":"Não é problema","label_max":"Muito grave"}', 1, 1),
('q-033-2', 'camp-033', 'Já presenciou ou foi vítima de corrupção?', 'sim_nao', '["Sim, várias vezes","Sim, uma vez","Não"]', 2, 1),
('q-033-3', 'camp-033', 'Em que setores a corrupção é mais prevalente?', 'escolha_multipla', '["Polícia/Justiça","Saúde","Educação","Administração pública","Negócios/Economia","Todos"]', 3, 1),
('q-033-4', 'camp-033', 'Sente que o combate à corrupção está a funcionar?', 'sim_nao', '["Sim","Não","Parcialmente"]', 4, 1),

-- camp-034: Descentralização
('q-034-1', 'camp-034', 'Conhece o administrador/governador da sua região?', 'sim_nao', '["Sim","Não"]', 1, 1),
('q-034-2', 'camp-034', 'Sente que o poder local responde às necessidades da comunidade?', 'escala', '{"min":1,"max":5,"label_min":"Não responde","label_max":"Responde muito bem"}', 2, 1),
('q-034-3', 'camp-034', 'Já participou em reuniões ou consultas públicas locais?', 'sim_nao', '["Sim","Não","Não sabia que existiam"]', 3, 1),
('q-034-4', 'camp-034', 'A descentralização melhorou os serviços locais?', 'sim_nao', '["Sim","Não","Não notei diferença"]', 4, 1),

-- camp-035: Liberdade de Expressão
('q-035-1', 'camp-035', 'Sente-se livre para expressar opiniões políticas?', 'sim_nao', '["Sim, totalmente","Sim, com algum receio","Não"]', 1, 1),
('q-035-2', 'camp-035', 'Como avalia a liberdade de imprensa em Angola?', 'escala', '{"min":1,"max":5,"label_min":"Muito restrita","label_max":"Muito livre"}', 2, 1),
('q-035-3', 'camp-035', 'Confia nas notícias dos meios de comunicação tradicionais?', 'escala', '{"min":1,"max":5,"label_min":"Não confio","label_max":"Confio totalmente"}', 3, 1),
('q-035-4', 'camp-035', 'Utiliza redes sociais para se informar?', 'sim_nao', '["Sim, principalmente","Sim, juntamente com outros","Não"]', 4, 1),

-- camp-036: Mobilidade Urbana Luanda
('q-036-1', 'camp-036', 'Que meio de transporte usa diariamente?', 'escolha_multipla', '["Candongueiro","Autocarro/Ônibus","Táxi/Uber","Moto/Kupapata","Viatura própria","A pé"]', 1, 1),
('q-036-2', 'camp-036', 'Quanto tempo gasta no transporte por dia?', 'escolha_multipla', '["Menos de 30min","30min-1h","1h-2h","2h-3h","Mais de 3h"]', 2, 1),
('q-036-3', 'camp-036', 'Como avalia o transporte público em Luanda?', 'escala', '{"min":1,"max":5,"label_min":"Muito mau","label_max":"Excelente"}', 3, 1),
('q-036-4', 'camp-036', 'Qual a maior necessidade em mobilidade urbana?', 'escolha_multipla', '["Mais transportes públicos","Melhores estradas","Reduzir trânsito","Transportes mais baratos","Mais segurança","Tudo"]', 4, 1),

-- camp-037: Infraestrutura Rodoviária
('q-037-1', 'camp-037', 'Como avalia o estado das estradas na sua província?', 'escala', '{"min":1,"max":5,"label_min":"Muito má","label_max":"Excelente"}', 1, 1),
('q-037-2', 'camp-037', 'As estradas dificultam o seu dia a dia?', 'sim_nao', '["Sim, muito","Sim, um pouco","Não"]', 2, 1),
('q-037-3', 'camp-037', 'Há estradas intransitáveis em certas épocas do ano?', 'sim_nao', '["Sim","Não","Não sei"]', 3, 1),
('q-037-4', 'camp-037', 'Nota melhorias na infraestrutura rodoviária?', 'sim_nao', '["Sim, significativas","Sim, algumas","Não"]', 4, 1),

-- camp-038: Internet e Telecomunicações
('q-038-1', 'camp-038', 'Tem acesso à internet em casa?', 'sim_nao', '["Sim","Não"]', 1, 1),
('q-038-2', 'camp-038', 'Como avalia a qualidade da internet que usa?', 'escala', '{"min":1,"max":5,"label_min":"Muito má","label_max":"Excelente"}', 2, 1),
('q-038-3', 'camp-038', 'Considera o custo da internet acessível?', 'sim_nao', '["Sim","Não"]', 3, 1),
('q-038-4', 'camp-038', 'A falta de internet afeta seu trabalho/estudos?', 'sim_nao', '["Sim, muito","Sim, um pouco","Não"]', 4, 1),

-- camp-039: Energia Elétrica
('q-039-1', 'camp-039', 'Quantas horas por dia tem eletricidade?', 'escolha_multipla', '["24 horas","18-23 horas","12-17 horas","6-11 horas","Menos de 6 horas","Sem eletricidade"]', 1, 1),
('q-039-2', 'camp-039', 'Tem gerador ou painéis solares em casa?', 'sim_nao', '["Sim, gerador","Sim, solar","Ambos","Não"]', 2, 1),
('q-039-3', 'camp-039', 'Os cortes de energia afetam sua atividade econômica?', 'sim_nao', '["Sim, muito","Sim, um pouco","Não"]', 3, 1),
('q-039-4', 'camp-039', 'Como avalia a prestação do serviço de eletricidade?', 'escala', '{"min":1,"max":5,"label_min":"Muito má","label_max":"Excelente"}', 4, 1),

-- camp-040: Habitação
('q-040-1', 'camp-040', 'Qual a sua situação habitacional?', 'escolha_multipla', '["Casa própria","Casa arrendada","Casa de familiares","Casa cedida","Musseque/informal","Sem-abrigo"]', 1, 1),
('q-040-2', 'camp-040', 'Considera o custo da habitação acessível?', 'sim_nao', '["Sim","Não"]', 2, 1),
('q-040-3', 'camp-040', 'A sua habitação tem condições dignas (água, saneamento)?', 'sim_nao', '["Sim, todas","Sim, algumas","Não"]', 3, 1),
('q-040-4', 'camp-040', 'Qual o maior desafio habitacional em Angola?', 'escolha_multipla', '["Custo elevado","Falta de habitação social","Qualidade das construções","Acesso a crédito","Especulação imobiliária","Tudo"]', 4, 1),

-- camp-041: Identidade Cultural
('q-041-1', 'camp-041', 'Sente orgulho da cultura angolana?', 'escala', '{"min":1,"max":5,"label_min":"Nenhum","label_max":"Muito orgulho"}', 1, 1),
('q-041-2', 'camp-041', 'Participa em eventos culturais tradicionais?', 'sim_nao', '["Sim, frequentemente","Sim, às vezes","Raramente","Nunca"]', 2, 1),
('q-041-3', 'camp-041', 'Sente que a cultura angolana está a ser preservada?', 'sim_nao', '["Sim","Não","Parcialmente"]', 3, 1),
('q-041-4', 'camp-041', 'Que manifestação cultural valoriza mais?', 'escolha_multipla', '["Música tradicional","Dança","Artesanato","Gastronomia","Literatura","Todas"]', 4, 1),

-- camp-042: Línguas Nacionais
('q-042-1', 'camp-042', 'Fala alguma língua nacional além do português?', 'sim_nao', '["Sim, fluentemente","Sim, um pouco","Não"]', 1, 1),
('q-042-2', 'camp-042', 'Qual/quais língua(s) nacional(is) fala?', 'escolha_multipla', '["Umbundu","Kimbundu","Kikongo","Chokwe","Nhaneca","Fiote","Outra","Nenhuma"]', 2, 1),
('q-042-3', 'camp-042', 'Considera importante ensinar línguas nacionais nas escolas?', 'sim_nao', '["Sim","Não"]', 3, 1),
('q-042-4', 'camp-042', 'Sente que as línguas nacionais estão valorizadas?', 'escala', '{"min":1,"max":5,"label_min":"Nada valorizadas","label_max":"Muito valorizadas"}', 4, 1),

-- camp-043: Igualdade de Género
('q-043-1', 'camp-043', 'Considera que existe igualdade entre homens e mulheres em Angola?', 'sim_nao', '["Sim","Não","Parcialmente"]', 1, 1),
('q-043-2', 'camp-043', 'Em que área há mais desigualdade de género?', 'escolha_multipla', '["Mercado de trabalho","Educação","Política","Família/casa","Saúde","Todas"]', 2, 1),
('q-043-3', 'camp-043', 'Apoia medidas de promoção da igualdade de género?', 'sim_nao', '["Sim","Não","Depende"]', 3, 1),
('q-043-4', 'camp-043', 'Mulheres têm as mesmas oportunidades que homens?', 'escala', '{"min":1,"max":5,"label_min":"Muito menos","label_max":"Iguais oportunidades"}', 4, 1),

-- camp-044: Violência Doméstica
('q-044-1', 'camp-044', 'Considera a violência doméstica um problema grave em Angola?', 'escala', '{"min":1,"max":5,"label_min":"Não é problema","label_max":"Muito grave"}', 1, 1),
('q-044-2', 'camp-044', 'Sabe onde denunciar casos de violência doméstica?', 'sim_nao', '["Sim","Não"]', 2, 1),
('q-044-3', 'camp-044', 'Conhece vítimas de violência doméstica?', 'sim_nao', '["Sim","Não"]', 3, 1),
('q-044-4', 'camp-044', 'Que medidas são mais eficazes no combate à violência doméstica?', 'escolha_multipla', '["Educação/sensibilização","Leis mais severas","Apoio às vítimas","Mudança cultural","Tudo"]', 4, 1),

-- camp-045: Juventude e Participação
('q-045-1', 'camp-045', 'Participa em organizações juvenis ou comunitárias?', 'sim_nao', '["Sim, ativamente","Sim, ocasionalmente","Não"]', 1, 1),
('q-045-2', 'camp-045', 'Sente que os jovens têm voz na sociedade angolana?', 'escala', '{"min":1,"max":5,"label_min":"Nenhuma voz","label_max":"Muita voz"}', 2, 1),
('q-045-3', 'camp-045', 'Qual a principal barreira à participação juvenil?', 'escolha_multipla', '["Desemprego","Falta de oportunidades","Desinteresse político","Falta de espaços","Custo","Todas"]', 3, 1),
('q-045-4', 'camp-045', 'Gostaria de se envolver mais em atividades comunitárias?', 'sim_nao', '["Sim","Não","Talvez"]', 4, 1),

-- camp-046: Gestão de Resíduos
('q-046-1', 'camp-046', 'Há recolha regular de lixo no seu bairro?', 'sim_nao', '["Sim, regularmente","Sim, irregularmente","Não"]', 1, 1),
('q-046-2', 'camp-046', 'Pratica separação/reciclagem de resíduos?', 'sim_nao', '["Sim","Não","Gostaria mas não há sistema"]', 2, 1),
('q-046-3', 'camp-046', 'Como avalia a limpeza pública na sua área?', 'escala', '{"min":1,"max":5,"label_min":"Muito suja","label_max":"Muito limpa"}', 3, 1),
('q-046-4', 'camp-046', 'Qual a maior necessidade em gestão de resíduos?', 'escolha_multipla', '["Mais contentores","Mais recolhas","Educação ambiental","Reciclagem","Fiscalização","Tudo"]', 4, 1),

-- camp-047: Mudanças Climáticas
('q-047-1', 'camp-047', 'Acredita que as mudanças climáticas são reais?', 'sim_nao', '["Sim","Não","Não sei"]', 1, 1),
('q-047-2', 'camp-047', 'Já sentiu impactos das mudanças climáticas?', 'sim_nao', '["Sim","Não","Não sei"]', 2, 1),
('q-047-3', 'camp-047', 'Que impacto climático nota mais?', 'escolha_multipla', '["Seca/falta de chuva","Chuvas intensas/inundações","Calor extremo","Erosão","Não noto","Outro"]', 3, 1),
('q-047-4', 'camp-047', 'Considera importante combater as mudanças climáticas?', 'escala', '{"min":1,"max":5,"label_min":"Nada importante","label_max":"Muito importante"}', 4, 1),

-- camp-048: Água Potável
('q-048-1', 'camp-048', 'Tem acesso a água potável em casa?', 'sim_nao', '["Sim, sempre","Sim, às vezes","Não"]', 1, 1),
('q-048-2', 'camp-048', 'Qual a fonte de água da sua casa?', 'escolha_multipla', '["Rede pública","Chafariz/Bomba","Poço","Camião cisterna","Rio/lago","Outro"]', 2, 1),
('q-048-3', 'camp-048', 'A água que consome é segura?', 'sim_nao', '["Sim, confio","Não tenho certeza","Não"]', 3, 1),
('q-048-4', 'camp-048', 'Quantas horas por dia tem água canalizada?', 'escolha_multipla', '["24h","12-23h","6-11h","Menos de 6h","Não tenho"]', 4, 1),

-- camp-049: Biodiversidade
('q-049-1', 'camp-049', 'Conhece áreas protegidas/parques nacionais em Angola?', 'sim_nao', '["Sim, vários","Sim, alguns","Não"]', 1, 1),
('q-049-2', 'camp-049', 'Já visitou algum parque nacional ou reserva?', 'sim_nao', '["Sim","Não"]', 2, 1),
('q-049-3', 'camp-049', 'Considera importante proteger a biodiversidade?', 'escala', '{"min":1,"max":5,"label_min":"Nada importante","label_max":"Muito importante"}', 3, 1),
('q-049-4', 'camp-049', 'Que ameaça maior à biodiversidade em Angola?', 'escolha_multipla', '["Caça ilegal","Desmatamento","Poluição","Expansão urbana","Mudanças climáticas","Todas"]', 4, 1),

-- camp-050: Energia Renovável
('q-050-1', 'camp-050', 'Sabe o que são energias renováveis?', 'sim_nao', '["Sim, bem","Sim, vagamente","Não"]', 1, 1),
('q-050-2', 'camp-050', 'Consideraria usar energia solar em casa?', 'sim_nao', '["Sim","Não","Já uso"]', 2, 1),
('q-050-3', 'camp-050', 'Qual a principal barreira às energias renováveis?', 'escolha_multipla', '["Custo elevado","Falta de informação","Falta de tecnologia","Não vejo barreiras","Não é prioritário"]', 3, 1),
('q-050-4', 'camp-050', 'Angola deveria investir mais em energias renováveis?', 'escala', '{"min":1,"max":5,"label_min":"Não deve","label_max":"Deve muito"}', 4, 1);

PRAGMA foreign_keys = ON;
