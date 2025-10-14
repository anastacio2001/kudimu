Documento Técnico — Plataforma Kudimu Insights

🧭 Visão Geral

Objetivo: Desenvolver uma plataforma de sondagens e inteligência coletiva com IA integrada, voltada inicialmente para o mercado angolano, com escalabilidade para outros países africanos.

Arquitetura: Serverless, escalável, segura e otimizada para dispositivos móveis e conexões instáveis.

Infraestrutura base: Cloudflare Developer Platform

---

🧱 Stack Tecnológico

Camada	Tecnologia	Função	
Front-end	Cloudflare Pages + React	Interface web responsiva	
Mobile	React Native (Expo)	App Android/iOS	
Back-end	Cloudflare Workers	Lógica de negócio, APIs, autenticação	
Banco de dados	D1 (SQL)	Usuários, campanhas, respostas, recompensas	
Armazenamento	R2	Relatórios, imagens, arquivos	
Cache e sessões	KV (Key-Value)	Sessões, tokens, dados temporários	
IA e análise	Workers AI + Vectorize	Embeddings, análise semântica, segmentação	
Segurança	Cloudflare Zero Trust + Access	Proteção de rotas e dados sensíveis	


---

🧩 Estrutura de Dados (resumo)

Tabelas principais (D1)

• `users`: dados do usuário, reputação, saldo
• `campaigns`: campanhas ativas, metas, recompensas
• `questions`: perguntas por campanha
• `answers`: respostas por usuário
• `rewards`: histórico de pagamentos
• `reports`: relatórios gerados por IA


---

🔄 Fluxos principais

1. Cadastro e autenticação

• Login via email, telefone ou social login
• Armazenamento em `users`
• Sessão gerenciada via KV


2. Distribuição de campanhas

• Workers filtra campanhas por perfil, reputação e localização
• Front-end exibe questionários disponíveis


3. Envio de respostas

• Validação automática (tempo, coerência, duplicidade)
• Armazenamento em `answers`
• IA gera embeddings e envia para Vectorize


4. Análise com IA

• Workers AI processa respostas abertas
• Vectorize agrupa por similaridade semântica
• Dados são agregados e enviados para geração de relatório


5. Recompensas

• Após validação, recompensa é registrada em `rewards`
• Saldo atualizado em `users`
• Integração futura com wallet ou operadora


---

🔐 Segurança e conformidade

• Cloudflare Access para rotas administrativas
• Tokens JWT para autenticação de usuários
• Dados sensíveis criptografados
• Logs e auditoria via Workers + R2
• Política de privacidade clara e adaptada à LGPD Angola


---

📈 Escalabilidade e performance

• Workers distribuem carga globalmente
• KV e R2 otimizam leitura e escrita rápida
• IA executada em edge com Workers AI
• Banco D1 replicável e com backup automático


---

📱 Requisitos de UX

• Interface leve, responsiva e acessível
• Suporte offline parcial (PWA)
• Idioma: português (com suporte futuro a kimbundu, umbundu)
• Inclusão de usuários com baixa literacia digital


---

🧪 Ambiente de testes

• Ambiente de staging com subdomínio `staging.kudimu.africa`
• Banco D1 separado para sandbox
• Workers com logs ativados
• Testes unitários e de integração com Vitest ou Playwright


---

🧠 IA e análise de dados

• Embeddings com Workers AI (modelo `text-embedding-ada`)
• Armazenamento vetorial com Vectorize
• Análise de sentimento, agrupamento semântico, previsão de aceitação
• Geração de relatórios com gráficos em JSON + exportação para PDF


---

🧱 Estrutura geral da plataforma

Nome provisório: Kudimu Insights

(ou outro nome que reflita inteligência coletiva africana — posso te ajudar a escolher depois)

---

🧠 Modelo de negócio: Inteligência Coletiva como Serviço (ICaaS)

Segmento	Valor gerado	Monetização	
Empresas	Dados para lançar produtos, entender mercados, testar campanhas	Venda de relatórios, dashboards, acesso por assinatura	
Governos/ONGs	Diagnóstico social, políticas públicas, mapeamento de necessidades	Projetos sob demanda, relatórios temáticos	
Usuários	Recompensa por participação, voz ativa, inclusão digital	Pagamento por resposta, sistema de pontos ou tokens	


---

💰 Plano financeiro inicial

1. Fontes de receita

Produto	Descrição	Preço sugerido	
Relatório básico	Dados agregados + gráficos	€200–€500 por campanha	
Relatório avançado	Segmentação + IA + insights preditivos	€800–€2.000 por campanha	
Assinatura mensal	Acesso a painel com dados contínuos	€300–€1.000/mês	
API de dados	Integração com sistemas externos	sob consulta	


---

2. Custo por usuário (recompensa)

Tipo de campanha	Recompensa por resposta	Total por 1.000 respostas	
Curta (1–3 perguntas)	€0,05–€0,10	€50–€100	
Média (4–7 perguntas)	€0,15–€0,25	€150–€250	
Longa (8+ perguntas)	€0,30–€0,50	€300–€500	


💡 Sugestão: usar sistema de pontos que podem ser convertidos em dinheiro, dados móveis, ou benefícios locais.

---

3. Margem e sustentabilidade

• Custo por campanha: €100–€500 (recompensas + infra)
• Venda média por campanha: €500–€2.000
• Margem bruta estimada: 60–80%


---

📊 Exemplo prático

Uma empresa quer testar um novo refrigerante em Angola.

• Campanha com 5 perguntas
• Meta: 5.000 respostas
• Custo com usuários: €0,20 × 5.000 = €1.000
• Infraestrutura (Cloudflare, IA, equipe): €300
• Venda do relatório: €2.500
• Lucro estimado: €1.200


---

Maravilha, Ladislau! Vamos construir juntos essa plataforma histórica passo a passo. Aqui está o roteiro completo, e já começamos com o Passo 1: Wireframe da experiência do usuário.

---

🧭 Roteiro de desenvolvimento da plataforma

Etapa	Entregável	Objetivo	
1	Wireframe da experiência do usuário	Visualizar a jornada de uso e interface	
2	Modelo de dados	Estruturar tabelas e relacionamentos	
3	Fluxo de IA para análise	Definir como os dados serão tratados e transformados	
4	Sistema de reputação e validação	Garantir qualidade das respostas e premiar bons usuários	
5	Plano de crescimento até 1 milhão de usuários	Estratégia escalável e sustentável	
6	Pitch institucional	Apresentação para empresas, governos e parceiros	
7	Simulação de campanhas e retorno financeiro	Testar viabilidade e impacto econômico	


---

✅ Passo 1: Wireframe da experiência do usuário

🎯 Objetivo

Mapear visualmente como o usuário interage com a plataforma — desde o cadastro até a recompensa.

---

🧩 Fluxo principal do usuário

[1] Tela de boas-vindas
     ↓
[2] Cadastro / Login
     ↓
[3] Escolha de perfil (ex: estudante, profissional, etc.)
     ↓
[4] Painel de campanhas disponíveis
     ↓
[5] Questionário interativo
     ↓
[6] Confirmação de envio
     ↓
[7] Recompensa recebida (pontos, dinheiro, benefícios)
     ↓
[8] Histórico de participação e reputação
     ↓
[9] Sugestões de novas campanhas


---

🖼️ Wireframe por tela (descrição visual)

1. Tela de boas-vindas

• Logo da plataforma
• Frase de impacto: “Participe. Seja ouvido. Seja recompensado.”
• Botões: Entrar | Criar conta


2. Cadastro / Login

• Nome, email, país, idioma
• Escolha de método de login (email, Google, etc.)
• Aceite dos termos e política de privacidade


3. Perfil do usuário

• Seleção de interesses (educação, saúde, consumo, etc.)
• Localização (país, cidade)
• Preferência de recompensa (dinheiro, dados móveis, etc.)


4. Painel de campanhas

• Lista de questionários disponíveis
• Filtros por tema, duração, recompensa
• Indicador de reputação mínima exigida


5. Questionário

• Interface responsiva
• Barra de progresso
• Botão “Enviar respostas”


6. Confirmação

• Mensagem de agradecimento
• Tempo estimado para validação
• Botão “Ver histórico”


7. Recompensa

• Valor recebido ou pontos acumulados
• Histórico de recompensas
• Opção de saque ou conversão


8. Histórico e reputação

• Campanhas completadas
• Pontuação de qualidade
• Nível do usuário (ex: Explorador, Analista, Líder)


9. Sugestões personalizadas

• Novas campanhas com base no perfil
• Convites para campanhas exclusivas
• Recomendações de impacto social


Excelente, Ladislau! Vamos para o Passo 2: Modelo de Dados, com foco no mercado angolano. A estrutura será pensada para escalar, mas respeitando desde já os desafios locais: conectividade, diversidade linguística, validação de identidade e recompensa justa.

---

🧩 Passo 2: Modelo de Dados da Plataforma

🎯 Objetivo

Criar uma base sólida para armazenar usuários, campanhas, respostas, recompensas e relatórios — com flexibilidade para IA e expansão futura.

---

🗂️ Estrutura de tabelas principais

1. Usuários (`users`)

Campo	Tipo	Descrição	
id	UUID	Identificador único	
nome	Texto	Nome completo	
email	Texto	Email (único)	
telefone	Texto	Opcional, para verificação	
localizacao	Texto	Província ou cidade	
idioma	Texto	Preferência (ex: português, kimbundu)	
perfil	Texto	Estudante, profissional, etc.	
reputacao	Inteiro	Pontuação de qualidade	
saldo_pontos	Decimal	Pontos acumulados	
data_cadastro	Timestamp	Registro de entrada	


---

2. Campanhas (`campaigns`)

Campo	Tipo	Descrição	
id	UUID	Identificador único	
titulo	Texto	Nome da campanha	
descricao	Texto	Objetivo da pesquisa	
cliente	Texto	Empresa ou órgão solicitante	
tema	Texto	Saúde, consumo, educação, etc.	
recompensa_por_resposta	Decimal	Valor em pontos ou dinheiro	
quantidade_alvo	Inteiro	Número de respostas desejadas	
data_inicio	Timestamp	Início da campanha	
data_fim	Timestamp	Fim da campanha	
status	Texto	Ativa, encerrada, em validação	


---

3. Perguntas (`questions`)

Campo	Tipo	Descrição	
id	UUID	Identificador único	
campanha_id	UUID	Referência à campanha	
texto	Texto	Enunciado da pergunta	
tipo	Texto	Múltipla escolha, texto livre, etc.	
opcoes	JSON	Lista de opções (se aplicável)	
ordem	Inteiro	Posição no questionário	


---

4. Respostas (`answers`)

Campo	Tipo	Descrição	
id	UUID	Identificador único	
usuario_id	UUID	Quem respondeu	
campanha_id	UUID	Qual campanha	
pergunta_id	UUID	Qual pergunta	
resposta	Texto ou JSON	Conteúdo da resposta	
data_resposta	Timestamp	Registro de envio	
validada	Booleano	Se foi aceita para recompensa	


---

5. Recompensas (`rewards`)

Campo	Tipo	Descrição	
id	UUID	Identificador único	
usuario_id	UUID	Quem recebeu	
campanha_id	UUID	Origem da recompensa	
valor	Decimal	Pontos ou dinheiro	
tipo	Texto	Dinheiro, dados móveis, etc.	
status	Texto	Pendente, pago, convertido	
data	Timestamp	Registro da operação	


---

6. Relatórios (`reports`)

Campo	Tipo	Descrição	
id	UUID	Identificador único	
campanha_id	UUID	Referência à campanha	
cliente	Texto	Empresa ou órgão	
resumo	Texto	Análise geral	
graficos	JSON	Dados visuais gerados por IA	
arquivo	Texto	Link para download (R2)	
data_geracao	Timestamp	Quando foi gerado	


---

🧠 IA e análise futura

• Embeddings: cada resposta pode ser transformada em vetor para análise semântica.
• Segmentação: cruzamento entre perfil, localização e respostas.
• Previsão: modelos para prever comportamento ou tendências.


---

🌍 Adaptação ao mercado angolano

• Campos para idiomas locais e províncias.
• Suporte a recompensas em dados móveis (via operadoras).
• Validação por telefone ou WhatsApp.
• Campanhas com foco em educação, saúde, consumo básico, mobilidade urbana.


---

Perfeito, Ladislau! Vamos para o Passo 3: Fluxo de IA para análise dos dados, que é o coração da tua proposta — transformar respostas em inteligência acionável para empresas, governos e ONGs.

---

🧠 Passo 3: Fluxo de IA para análise dos dados

🎯 Objetivo

Definir como a plataforma coleta, processa, analisa e transforma os dados dos questionários em insights úteis, confiáveis e visualmente claros — respeitando privacidade e contexto angolano.

---

🔄 Etapas do fluxo de IA

[1] Coleta de respostas
     ↓
[2] Validação automática
     ↓
[3] Limpeza e normalização dos dados
     ↓
[4] Geração de embeddings (vetores semânticos)
     ↓
[5] Agrupamento e segmentação inteligente
     ↓
[6] Análise estatística e preditiva
     ↓
[7] Geração de relatórios visuais e insights
     ↓
[8] Armazenamento seguro e entrega ao cliente


---

🧩 Tecnologias e ferramentas (Cloudflare + IA)

Etapa	Ferramenta	Função	
Coleta	Workers + D1	Armazenar respostas	
Validação	Workers + regras	Detectar spam, inconsistência	
Limpeza	Workers AI	Corrigir erros, padronizar	
Embeddings	Workers AI + Vectorize	Transformar texto em vetores	
Segmentação	Vectorize + filtros	Agrupar por perfil, região, padrão	
Análise	Workers AI + modelos	Estatística, correlação, previsão	
Relatórios	Workers + R2 + JSON	Gráficos, mapas, dashboards	
Entrega	API + painel	Acesso seguro ao cliente	


---

📊 Tipos de análise que a IA pode gerar

• Distribuição geográfica das respostas (por província)
• Mapas de calor de opinião ou comportamento
• Agrupamento semântico de respostas abertas (ex: sentimentos, temas)
• Previsão de aceitação de produto com base em perfil
• Correlação entre variáveis (ex: idade × preferência × localização)
• Detecção de padrões emergentes em tempo real


---

🌍 Adaptação ao contexto angolano

• IA treinada com expressões locais e variantes linguísticas
• Segmentação por província, zona urbana/rural, faixa etária
• Capacidade de lidar com respostas curtas, áudio transcrito, emojis
• Geração de relatórios em português claro e visualmente acessível


---

📁 Exemplo de relatório gerado

Campanha: “Preferências de transporte urbano em Luanda”

• 5.000 respostas validadas
• 3 perfis principais identificados: estudantes, trabalhadores, empreendedores
• 72% preferem transporte coletivo com ar-condicionado
• 18% indicam falta de segurança como principal problema
• Mapa interativo por bairro
• Previsão de aceitação de novo serviço: Alta


---

Perfeito, Ladislau! Vamos para o Passo 4: Sistema de reputação e validação de respostas, que é essencial para garantir qualidade dos dados, confiança dos clientes e recompensas justas para os usuários — especialmente num mercado como o angolano, onde inclusão e credibilidade são fundamentais.

---

🛡️ Passo 4: Sistema de Reputação e Validação

🎯 Objetivo

Avaliar a qualidade das respostas dos usuários, evitar fraudes, premiar participantes engajados e garantir que os dados entregues aos clientes sejam confiáveis e úteis.

---

🧩 Componentes do sistema

1. Pontuação de reputação (`reputacao`)

• Cada usuário começa com reputação neutra (ex: 50 pontos).
• Aumenta com respostas completas, coerentes e validadas.
• Diminui com respostas incompletas, incoerentes ou suspeitas.


2. Validação automática

• IA verifica:• Tempo de resposta (evita cliques rápidos demais)
• Coerência entre respostas
• Repetição de padrões suspeitos
• Linguagem ofensiva ou vazia

• Respostas aprovadas recebem recompensa.
• Respostas rejeitadas são notificadas ao usuário com explicação.


3. Níveis de usuário

Nível	Reputação mínima	Benefícios	
Explorador	0–49	Acesso limitado a campanhas	
Analista	50–79	Acesso completo + recompensas padrão	
Líder	80+	Acesso antecipado + bônus de recompensa + convites exclusivos	


4. Sistema de feedback

• Usuário pode contestar rejeição.
• IA reanalisa com base em histórico e contexto.
• Feedback ajuda a melhorar o modelo de validação.


5. Gamificação ética

• Medalhas por participação em temas sociais.
• Ranking por província ou grupo etário.
• Missões especiais com bônus (ex: “Ajude a mapear hábitos alimentares em Benguela”).


---

🔍 Exemplo prático

Usuário responde à campanha “Preferências de consumo de dados móveis”.

• Responde em tempo razoável.
• Escolhe opções coerentes com perfil.
• Recebe 0,20€ + +2 pontos de reputação.
• Sobe para nível “Analista”.
• Recebe convite para nova campanha sobre apps mais usados.


---

🌍 Adaptação ao mercado angolano

• Validação respeita variações linguísticas e culturais.
• Incentivo à participação de jovens, mulheres e zonas rurais.
• Reputação pode ser usada para acesso a benefícios sociais ou educacionais no futuro.


---

🎨 Branding Visual — Kudimu Insights

🟣 Nome: Kudimu Insights

“Kudimu” pode remeter a sabedoria ancestral, escuta coletiva, ou inteligência comunitária. É sonoro, africano, forte e fácil de lembrar.

---

🔥 Essência da marca

Elemento	Valor	
Propósito	Transformar participação em progresso	
Tom de voz	Confiante, inclusivo, inteligente, ético	
Personalidade	Visionária, acessível, africana, tecnológica	
Público	Jovens urbanos, empreendedores, governos, ONGs	


---

🎯 Slogan principal

“Inteligência coletiva africana para decisões melhores.”
Alternativas:

• “Dados com alma. Decisões com impacto.”

---

🎨 Paleta de cores (sugestão)

Cor	Significado	Uso	
Roxo profundo	Sabedoria, tecnologia, ancestralidade	Fundo, destaque	
Laranja quente	Energia, juventude, ação	Botões, ícones	
Verde suave	Crescimento, confiança, inclusão	Gráficos, detalhes	
Branco	Clareza, acessibilidade	Texto, fundo secundário	


---

🔠 Tipografia

• Título: Montserrat Bold ou Poppins Bold — moderna, forte
• Texto: Open Sans ou Inter — legível, acessível
• Alternativa africana: fontes inspiradas em geometria bantu ou kente (para títulos especiais)


---

🖼️ Elementos visuais

• Ícone de círculo com ondas → representa escuta, comunidade, dados circulando
• Padrões inspirados em tecidos africanos estilizados em vetores
• Ilustrações com rostos diversos, jovens, urbanos, conectados
• Gráficos com mapas de calor, nuvens de palavras, barras segmentadas


---
Page Inicial 

Perfeito, Ladislau! Aqui está o conteúdo completo da Página Institucional (Landing Page) da tua plataforma — pensada para atrair empresas, governos, ONGs e usuários angolanos com clareza, impacto e propósito.

---

🌐 Landing Page — Kudimu Insights

🟣 Cabeçalho

Logo + Menu:

• Início | Como Funciona | Para Empresas | Para Usuários | Preços | Contato


Slogan:
“Inteligência coletiva africana para decisões melhores.”

Botões:
[Comece agora] [Agende uma demonstração]

---

🧭 Seção 1: O que é a Kudimu Insights?

Uma plataforma de sondagens e questionários que transforma participação em inteligência — e recompensa cada voz.

• Empresas testam produtos e campanhas
• Governos ouvem a população com dados reais
• ONGs mapeiam necessidades sociais
• Usuários participam e recebem recompensas


---

🧠 Seção 2: Como funciona

Para empresas e governos:

1. Crie sua campanha
2. Defina o público-alvo
3. Receba dados segmentados e relatórios com IA


Para usuários:

1. Cadastre-se gratuitamente
2. Responda questionários
3. Ganhe recompensas por cada participação


---

💡 Seção 3: Diferenciais

• IA adaptada ao contexto africano
• Sistema de reputação para garantir qualidade
• Recompensas em dinheiro, dados móveis ou benefícios locais
• Infraestrutura global com baixo custo e alta performance
• Foco em impacto social e inclusão digital


---

📊 Seção 4: Resultados reais

Campanha: “Preferências de consumo digital em Angola”

• 5.000 respostas validadas
• Segmentação por província e faixa etária
• Relatório com mapas, gráficos e previsões
• Recompensas distribuídas com transparência


---

💸 Seção 5: Planos e preços

Plano	Ideal para	Preço	
Campanha Básica	Testes rápidos	€200–€500	
Campanha Avançada	Segmentação + IA	€800–€2.000	
Assinatura Mensal	Acesso contínuo	€300–€1.000/mês	
API de Dados	Integração externa	sob consulta	


---

🌍 Seção 6: Impacto social

• +10.000 usuários angolanos na fase inicial
• Inclusão de jovens, mulheres e zonas rurais
• Dados confiáveis para decisões públicas e privadas
• Fortalecimento da narrativa africana com protagonismo local


---

📞 Seção 7: Contato

Quer lançar uma campanha ou conhecer mais?
[Agende uma demonstração]
[Envie uma mensagem]
📧 contato@kudimu.africa
📱 WhatsApp: +244 931054015

Fluxo admin

Perfeito, Ladislau! Aqui está o documento técnico em formato Markdown (.md) com:

1. Todas as funcionalidades do painel administrativo para gestão da plataforma
2. A estrutura completa de criação e validação de campanhas
3. Pronto para ser salvo, versionado ou entregue ao programador.


---

# 📘 Documento Técnico — Painel Administrativo e Criação de Campanhas  
**Projeto:** Kudimu Insights  
**Versão:** 1.0  
**Data:** Outubro 2025  
**Responsável:** Ladislau

---

## 🛠️ 1. Funcionalidades do Painel Administrativo

### 1.1 Autenticação e segurança
- Login com credenciais administrativas
- Proteção via Cloudflare Access (Zero Trust)
- Logs de acesso e ações
- Níveis de permissão:
  - `Admin`: acesso total
  - `Analista`: acesso a dados e relatórios
  - `Cliente`: criação e acompanhamento de campanhas próprias

---

### 1.2 Gestão de campanhas

| Ação | Descrição |
|------|-----------|
| Criar campanha | Formulário completo com título, perguntas, público-alvo, recompensa, duração |
| Editar campanha | Permitido antes do início |
| Duplicar campanha | Reutiliza estrutura para nova |
| Agendar campanha | Define data de início e fim |
| Encerrar campanha | Finaliza coleta manualmente |
| Visualizar status | Ativa, encerrada, em validação |

---

### 1.3 Visualização de dados e relatórios

- Acompanhamento em tempo real (respostas, taxa de validação, perfil dos usuários)
- Relatórios com IA (gráficos, mapas, agrupamentos semânticos)
- Exportação: PDF, CSV, JSON
- Segmentação por região, idade, gênero, reputação
- Histórico de campanhas com comparativos

---

### 1.4 Gestão de recompensas

- Visualizar saldo e histórico de recompensas por usuário
- Confirmar pagamentos (manual ou automático)
- Relatórios de distribuição por campanha
- Integração futura com operadoras ou wallets

---

### 1.5 Gestão de usuários

- Buscar usuários por nome, email, reputação, localização
- Visualizar perfil completo (participações, saldo, reputação)
- Bloquear ou limitar acesso
- Enviar notificações (convites, avisos, alertas)

---

### 1.6 Testes e simulações

- Criar campanhas de teste (sandbox)
- Simular respostas e relatórios
- Testar segmentações e previsões

---

### 1.7 Configurações avançadas

- Gerenciar categorias temáticas
- Definir regras de reputação e validação
- Configurar recompensas por tipo de campanha
- Gerenciar acesso à API externa
- Personalizar visual do painel (logo, cores, idioma)

---

## 🧩 2. Estrutura de Criação de Campanhas

### 2.1 Perfis autorizados

| Perfil | Permissão | Exemplo |
|--------|-----------|---------|
| Admin interno | Total | Equipe Kudimu |
| Cliente verificado | Parcial | Empresa, governo |
| ONG/parceiro | Moderado | Campanhas sociais |

---

### 2.2 Fluxo de criação

```plaintext
[1] Acessar painel
     ↓
[2] Escolher tipo de campanha (comercial, social, teste)
     ↓
[3] Definir público-alvo (idade, região, reputação mínima)
     ↓
[4] Criar perguntas (múltipla escolha, texto livre, escala)
     ↓
[5] Definir recompensa por resposta
     ↓
[6] Estabelecer meta de respostas e duração
     ↓
[7] Pré-visualizar campanha
     ↓
[8] Submeter para validação (clientes externos)
     ↓
[9] Aprovação e publicação


---

2.3 Tipos de perguntas permitidas

Tipo	Uso	
Múltipla escolha	Preferências, hábitos	
Texto livre	Opiniões, sugestões	
Escala (1–5)	Satisfação, intensidade	
Sim/não	Validação rápida	
Geolocalização (opcional)	Mapas de calor	


---

2.4 Parâmetros obrigatórios

• Título e descrição
• Público-alvo (idade, localização, reputação)
• Recompensa por resposta
• Meta de respostas
• Duração (início e fim)
• Idioma (pt-AO)
• Categoria temática


---

2.5 Validação de campanhas

Origem	Validação	
Interna (admin)	Aprovação automática	
Externa (cliente)	Revisão manual:	


• Linguagem clara e ética
• Fluxo técnico funcional
• Coerência com público-alvo
• Aprovação em até 24h |


---

2.6 Automação futura (IA)

• Sugestão automática de perguntas com base no objetivo
• Recomendação de público-alvo ideal
• Previsão de engajamento com base em campanhas anteriores


---

📎 Endpoints REST (Admin)

POST   /admin/campaigns/create
GET    /admin/campaigns/:id
PUT    /admin/campaigns/:id/edit
POST   /admin/campaigns/:id/approve
GET    /admin/users/:id
GET    /admin/reports/:id
GET    /admin/rewards/:userId
POST   /admin/notifications/send


---

📞 Contato técnico

Responsável: Ladislau
📧 contato@kudimu.africa
🌐 www.kudimu.africa
📱 WhatsApp: +244 XXX XXX XXX


---

Perfeito, Ladislau! Vamos definir o processo completo de criação de conta e evolução até se tornar um perfil autorizado dentro da plataforma Kudimu Insights. Isso garante segurança, qualidade dos dados e confiança entre usuários, clientes e parceiros.

Abaixo está o conteúdo pronto para ser incluído no documento técnico em formato `.md`, com etapas claras e critérios objetivos.

---

# 📘 Processo de Criação de Conta e Evolução para Perfil Autorizado  
**Projeto:** Kudimu Insights  
**Versão:** 1.0  
**Data:** Outubro 2025  
**Responsável:** Ladislau

---

## 🧭 1. Criação de Conta (Usuário Comum)

### 1.1 Fluxo de cadastro

```plaintext
[1] Tela de boas-vindas
     ↓
[2] Escolha de idioma (pt-AO)
     ↓
[3] Cadastro via email ou telefone
     ↓
[4] Verificação por código (OTP)
     ↓
[5] Escolha de perfil: cidadão, estudante, profissional, outro
     ↓
[6] Preenchimento de dados básicos (idade, província, gênero, interesses)
     ↓
[7] Aceite dos termos e política de privacidade
     ↓
[8] Conta criada com reputação inicial = 0


---

🧩 2. Evolução de Reputação

2.1 Pontuação por participação

Ação	Pontos	
Responder campanha validada	+10	
Resposta rejeitada	-5	
Compartilhar campanha	+5	
Receber avaliação positiva	+15	
Denúncia confirmada	-20	


2.2 Níveis de reputação

Nível	Pontuação mínima	Acesso	
Iniciante	0	Campanhas básicas	
Confiável	100	Campanhas avançadas	
Líder	300	Convites para testes, bônus	
Embaixador	500+	Acesso a campanhas premium e moderação	


---

🛡️ 3. Verificação para Perfil Autorizado

3.1 Quem pode solicitar

• Empresas
• ONGs
• Órgãos públicos
• Pesquisadores
• Parceiros estratégicos


3.2 Processo de verificação

[1] Preenchimento de formulário de solicitação
     ↓
[2] Envio de documentos (CNPJ, alvará, identidade institucional)
     ↓
[3] Análise pela equipe Kudimu (até 48h)
     ↓
[4] Aprovação e atribuição de perfil autorizado
     ↓
[5] Acesso ao painel de criação de campanhas


---

🔐 4. Permissões de Perfil Autorizado

Permissão	Descrição	
Criar campanhas	Com validação interna	
Acompanhar dados em tempo real	Painel com filtros e gráficos	
Exportar relatórios	PDF, CSV, JSON	
Gerenciar campanhas	Editar, duplicar, encerrar	
Enviar notificações	Para usuários segmentados	
Acessar API	(sob consulta)	


---

📎 Endpoints REST relacionados

POST   /auth/register
POST   /auth/verify
GET    /user/profile
GET    /user/reputation
POST   /user/request-verification
GET    /admin/verification-requests
POST   /admin/approve-verification


---

📞 Contato técnico

Responsável: Ladislau
📧 contato@kudimu.africa
🌐 www.kudimu.africa
📱 WhatsApp: +244 XXX XXX XXX

