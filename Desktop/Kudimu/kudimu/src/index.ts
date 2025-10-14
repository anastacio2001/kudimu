/**
 * Kudimu Insights - API Completa
 * Cloudflare Workers com D1 (Sem dependências externas)
 */

import { generateUUID, hashPassword, verifyPassword, generateJWT, verifyJWT, hashToken } from './utils/crypto';
import { validateEmail, validatePassword, validateName, sanitizeText } from './utils/validation';
import { 
  calcularNivel, 
  calcularProgressoNivel, 
  calcularBonusRecompensa, 
  verificarMedalhas, 
  validarQualidadeResposta,
  gerarRanking,
  ACOES_REPUTACAO 
} from './utils/reputation';

// Tipos
interface Env {
  kudimu_db: D1Database;
  kudimu_assets: R2Bucket;
  kudimu_ai: any;
  kudimu: any; // Vectorize index
  JWT_SECRET: string;
}

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Middleware: Autenticação
async function requireAuth(request: Request, env: Env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Token não fornecido');
  }

  const token = authHeader.substring(7);
  const secret = env.JWT_SECRET || 'kudimu-secret-key-2025';
  
  try {
    const payload = await verifyJWT(token, secret);
    return payload;
  } catch (error) {
    throw new Error('Token inválido ou expirado');
  }
}

// HELPERS

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

async function logActivity(env: Env, userId: string, action: string, details: any) {
  try {
    await env.kudimu_db
      .prepare('INSERT INTO activity_logs (usuario_id, acao, detalhes) VALUES (?, ?, ?)')
      .bind(userId, action, JSON.stringify(details))
      .run();
  } catch (error) {
    console.error('Erro ao registrar log:', error);
  }
}

// ROUTER NATIVO (SEM DEPENDÊNCIAS)
async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // AUTH ROUTES
    if (path === '/auth/register' && method === 'POST') {
      return await handleRegister(request, env);
    }
    if (path === '/auth/login' && method === 'POST') {
      return await handleLogin(request, env);
    }
    if (path === '/auth/me' && method === 'GET') {
      return await handleGetMe(request, env);
    }
    if (path === '/auth/logout' && method === 'POST') {
      return await handleLogout(request, env);
    }

    // CAMPAIGNS ROUTES
    if (path === '/campaigns' && method === 'GET') {
      return await handleGetCampaigns(request, env);
    }
    if (path.startsWith('/campaigns/') && method === 'GET') {
      const id = path.split('/')[2];
      return await handleGetCampaign(id, env);
    }
    if (path === '/campaigns' && method === 'POST') {
      return await handleCreateCampaign(request, env);
    }

    // ANSWERS ROUTES
    if (path === '/answers' && method === 'POST') {
      return await handleSubmitAnswers(request, env);
    }
    if (path === '/answers/me' && method === 'GET') {
      return await handleGetMyAnswers(request, env);
    }

    // REWARDS ROUTES
    if (path === '/rewards/me' && method === 'GET') {
      return await handleGetMyRewards(request, env);
    }

    // REPUTATION ROUTES
    if (path === '/reputation/me' && method === 'GET') {
      return await handleGetMyReputation(request, env);
    }
    if (path === '/reputation/ranking' && method === 'GET') {
      return await handleGetRanking(request, env);
    }
    if (path === '/reputation/medals' && method === 'GET') {
      return await handleGetMedals(request, env);
    }

    // ADMIN ROUTES
    if (path === '/admin/dashboard' && method === 'GET') {
      return await handleAdminDashboard(request, env);
    }
    if (path === '/admin/users' && method === 'GET') {
      return await handleAdminGetUsers(request, env);
    }
    if (path.startsWith('/admin/users/') && method === 'PATCH') {
      const userId = path.split('/')[3];
      return await handleAdminUpdateUser(userId, request, env);
    }
    if (path === '/admin/campaigns' && method === 'GET') {
      return await handleAdminGetCampaigns(request, env);
    }
    if (path.startsWith('/admin/campaigns/') && method === 'PATCH') {
      const campaignId = path.split('/')[3];
      return await handleAdminUpdateCampaign(campaignId, request, env);
    }
    if (path.startsWith('/admin/campaigns/') && method === 'DELETE') {
      const campaignId = path.split('/')[3];
      return await handleAdminDeleteCampaign(campaignId, request, env);
    }
    if (path === '/admin/answers' && method === 'GET') {
      return await handleAdminGetAnswers(request, env);
    }
    if (path.startsWith('/admin/answers/') && method === 'PATCH') {
      const answerId = path.split('/')[3];
      return await handleAdminValidateAnswer(answerId, request, env);
    }

    // AI ROUTES
    if (path.startsWith('/ai/analyze-answer/') && method === 'POST') {
      const answerId = path.split('/')[3];
      return await handleAnalyzeAnswer(answerId, request, env);
    }
    if (path.startsWith('/ai/campaign-insights/') && method === 'GET') {
      const campaignId = path.split('/')[3];
      return await handleCampaignInsights(campaignId, request, env);
    }
    if (path === '/ai/detect-spam' && method === 'POST') {
      return await handleDetectSpam(request, env);
    }

    // PAYMENTS ROUTES
    if (path === '/rewards/validate' && method === 'POST') {
      return await handleRewardsValidate(request, env);
    }
    if (path === '/rewards/credit' && method === 'POST') {
      return await handleRewardsCredit(request, env);
    }
    if (path === '/user/rewards/history' && method === 'GET') {
      return await handleUserRewardsHistory(request, env);
    }
    if (path === '/user/rewards/withdraw' && method === 'POST') {
      return await handleUserRewardsWithdraw(request, env);
    }
    if (path === '/admin/rewards/pending' && method === 'GET') {
      return await handleAdminRewardsPending(request, env);
    }
    if (path === '/admin/rewards/confirm' && method === 'POST') {
      return await handleAdminRewardsConfirm(request, env);
    }

    // REPORTS ROUTES
    if (path.startsWith('/reports/campaign/') && method === 'GET') {
      const campaignId = path.split('/')[3];
      return await handleReportsCampaign(campaignId, request, env);
    }
    if (path.startsWith('/reports/user/') && method === 'GET') {
      const userId = path.split('/')[3];
      return await handleReportsUser(userId, request, env);
    }
    if (path === '/reports/system/overview' && method === 'GET') {
      return await handleReportsSystemOverview(request, env);
    }
    if (path === '/reports/financial' && method === 'GET') {
      return await handleReportsFinancial(request, env);
    }
    if (path.startsWith('/reports/export/') && method === 'GET') {
      const type = path.split('/')[3];
      return await handleReportsExport(type, request, env);
    }

    // 404
    return jsonResponse({ success: false, error: 'Rota não encontrada' }, 404);

  } catch (error: any) {
    console.error('Erro no worker:', error);
    return jsonResponse({ 
      success: false, 
      error: 'Erro interno do servidor', 
      details: error.message 
    }, 500);
  }
}

// HELPERS

async function verificarAdmin(request: Request, env: Env): Promise<{ isAdmin: boolean; userId?: string; error?: string }> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return { isAdmin: false, error: 'Token não fornecido' };
  }

  const token = authHeader.replace('Bearer ', '');
  const secret = env.JWT_SECRET || 'kudimu-secret-key-2025';
  
  try {
    const payload = await verifyJWT(token, secret) as any;
    
    // Verificar se usuário é admin
    const user = await env.kudimu_db
      .prepare('SELECT perfil FROM users WHERE id = ?')
      .bind(payload.userId)
      .first() as any;
    
    if (!user || user.perfil !== 'admin') {
      return { isAdmin: false, error: 'Acesso negado: apenas administradores' };
    }
    
    return { isAdmin: true, userId: payload.userId };
  } catch (error) {
    return { isAdmin: false, error: 'Token inválido' };
  }
}

async function atualizarReputacao(
  env: Env, 
  usuarioId: string, 
  acao: keyof typeof ACOES_REPUTACAO,
  metadata?: any
): Promise<void> {
  const pontos = ACOES_REPUTACAO[acao].pontos;
  
  await env.kudimu_db
    .prepare('UPDATE users SET reputacao = reputacao + ? WHERE id = ?')
    .bind(pontos, usuarioId)
    .run();
  
  await logActivity(env, usuarioId, 'reputacao_alterada', {
    acao,
    pontos,
    ...metadata
  });
}

// HANDLERS

async function handleRegister(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as any;
    const { nome, email, senha, telefone, localizacao, perfil } = body;

    const nameValidation = validateName(nome);
    if (!nameValidation.valid) {
      return jsonResponse({ success: false, error: nameValidation.error }, 400);
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return jsonResponse({ success: false, error: emailValidation.error }, 400);
    }

    const passwordValidation = validatePassword(senha);
    if (!passwordValidation.valid) {
      return jsonResponse({ success: false, error: passwordValidation.error }, 400);
    }

    const existingUser = await env.kudimu_db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(email)
      .first();

    if (existingUser) {
      return jsonResponse({ success: false, error: 'Email já cadastrado' }, 400);
    }

    const userId = generateUUID();
    const senhaHash = await hashPassword(senha);

    await env.kudimu_db
      .prepare(`
        INSERT INTO users (id, nome, email, senha_hash, telefone, localizacao, perfil, idioma)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pt-AO')
      `)
      .bind(userId, sanitizeText(nome), email, senhaHash, telefone || null, localizacao || null, perfil || 'cidadao')
      .run();

    const secret = env.JWT_SECRET || 'kudimu-secret-key-2025';
    const token = await generateJWT({ userId, email, nome }, secret, 86400 * 7);

    const sessionId = generateUUID();
    const tokenHash = await hashToken(token);
    const expiresAt = new Date(Date.now() + 86400 * 7 * 1000).toISOString();

    await env.kudimu_db
      .prepare('INSERT INTO sessions (id, usuario_id, token_hash, expira_em) VALUES (?, ?, ?, ?)')
      .bind(sessionId, userId, tokenHash, expiresAt)
      .run();

    await logActivity(env, userId, 'cadastro', { email });

    // Verificar se é um dos primeiros 1000 usuários (medalha PIONEIRO)
    const totalUsers = await env.kudimu_db
      .prepare('SELECT COUNT(*) as total FROM users')
      .first() as any;
    
    if (Number(totalUsers?.total || 0) <= 1000) {
      await logActivity(env, userId, 'medalha_pioneiro', { posicao: totalUsers.total });
    }

    return jsonResponse({
      success: true,
      message: 'Usuário cadastrado com sucesso',
      data: { userId, nome, email, token }
    }, 201);

  } catch (error: any) {
    console.error('Erro no registro:', error);
    return jsonResponse({ success: false, error: error.message || 'Erro ao cadastrar usuário' }, 500);
  }
}

async function handleLogin(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as any;
    const { email, senha } = body;

    if (!email || !senha) {
      return jsonResponse({ success: false, error: 'Email e senha são obrigatórios' }, 400);
    }

    const user = await env.kudimu_db
      .prepare('SELECT id, nome, email, senha_hash, reputacao, nivel, ativo FROM users WHERE email = ?')
      .bind(email)
      .first() as any;

    if (!user) {
      return jsonResponse({ success: false, error: 'Credenciais inválidas' }, 401);
    }

    if (!user.ativo) {
      return jsonResponse({ success: false, error: 'Conta desativada' }, 403);
    }

    const senhaValida = await verifyPassword(senha, user.senha_hash);
    if (!senhaValida) {
      return jsonResponse({ success: false, error: 'Credenciais inválidas' }, 401);
    }

    const secret = env.JWT_SECRET || 'kudimu-secret-key-2025';
    const token = await generateJWT({ userId: user.id, email: user.email, nome: user.nome }, secret, 86400 * 7);

    const sessionId = generateUUID();
    const tokenHash = await hashToken(token);
    const expiresAt = new Date(Date.now() + 86400 * 7 * 1000).toISOString();

    await env.kudimu_db
      .prepare('INSERT INTO sessions (id, usuario_id, token_hash, expira_em) VALUES (?, ?, ?, ?)')
      .bind(sessionId, user.id, tokenHash, expiresAt)
      .run();

    await env.kudimu_db
      .prepare('UPDATE users SET ultimo_acesso = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(user.id)
      .run();

    await logActivity(env, user.id, 'login', { email });

    return jsonResponse({
      success: true,
      message: 'Login realizado com sucesso',
      data: { userId: user.id, nome: user.nome, email: user.email, reputacao: user.reputacao, nivel: user.nivel, token }
    });

  } catch (error: any) {
    console.error('Erro no login:', error);
    return jsonResponse({ success: false, error: error.message || 'Erro ao fazer login' }, 500);
  }
}

async function handleGetMe(request: Request, env: Env): Promise<Response> {
  try {
    const user = await requireAuth(request, env);

    const userData = await env.kudimu_db
      .prepare('SELECT id, nome, email, telefone, localizacao, idioma, perfil, reputacao, saldo_pontos, nivel, tipo_conta, data_cadastro FROM users WHERE id = ?')
      .bind(user.userId)
      .first();

    return jsonResponse({ success: true, data: userData });

  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 401);
  }
}

async function handleLogout(request: Request, env: Env): Promise<Response> {
  try {
    const user = await requireAuth(request, env);
    const authHeader = request.headers.get('Authorization');
    const token = authHeader!.substring(7);
    const tokenHash = await hashToken(token);

    await env.kudimu_db
      .prepare('DELETE FROM sessions WHERE usuario_id = ? AND token_hash = ?')
      .bind(user.userId, tokenHash)
      .run();

    await logActivity(env, user.userId, 'logout', {});

    return jsonResponse({ success: true, message: 'Logout realizado com sucesso' });

  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 401);
  }
}

async function handleGetCampaigns(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const tema = url.searchParams.get('tema');
    const status = url.searchParams.get('status') || 'ativa';

    let query = 'SELECT * FROM campaigns WHERE status = ?';
    const params: any[] = [status];

    if (tema) {
      query += ' AND tema = ?';
      params.push(tema);
    }

    query += ' ORDER BY data_inicio DESC LIMIT 50';

    const { results } = await env.kudimu_db.prepare(query).bind(...params).all();

    return jsonResponse({ success: true, data: results });

  } catch (error: any) {
    console.error('Erro ao listar campanhas:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleGetCampaign(id: string, env: Env): Promise<Response> {
  try {
    const campaign = await env.kudimu_db
      .prepare('SELECT * FROM campaigns WHERE id = ?')
      .bind(id)
      .first();

    if (!campaign) {
      return jsonResponse({ success: false, error: 'Campanha não encontrada' }, 404);
    }

    const { results: questions } = await env.kudimu_db
      .prepare('SELECT * FROM questions WHERE campanha_id = ? ORDER BY ordem')
      .bind(id)
      .all();

    return jsonResponse({ success: true, data: { ...campaign, questions } });

  } catch (error: any) {
    console.error('Erro ao buscar campanha:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleCreateCampaign(request: Request, env: Env): Promise<Response> {
  try {
    const user = await requireAuth(request, env);
    const body = await request.json() as any;

    const { titulo, descricao, tema, tipo, recompensa_por_resposta, quantidade_alvo, data_inicio, data_fim, perguntas } = body;

    if (!titulo || !recompensa_por_resposta || !quantidade_alvo) {
      return jsonResponse({ success: false, error: 'Campos obrigatórios faltando' }, 400);
    }

    const campaignId = generateUUID();

    await env.kudimu_db
      .prepare(`
        INSERT INTO campaigns (id, titulo, descricao, cliente_id, tema, tipo, recompensa_por_resposta, quantidade_alvo, data_inicio, data_fim, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendente')
      `)
      .bind(
        campaignId, sanitizeText(titulo), sanitizeText(descricao || ''), user.userId, tema || 'geral', tipo || 'comercial',
        recompensa_por_resposta, quantidade_alvo,
        data_inicio || new Date().toISOString(), data_fim || new Date(Date.now() + 30 * 86400000).toISOString()
      )
      .run();

    if (perguntas && Array.isArray(perguntas)) {
      for (let i = 0; i < perguntas.length; i++) {
        const pergunta = perguntas[i];
        const questionId = generateUUID();

        await env.kudimu_db
          .prepare('INSERT INTO questions (id, campanha_id, texto, tipo, opcoes, ordem) VALUES (?, ?, ?, ?, ?, ?)')
          .bind(questionId, campaignId, sanitizeText(pergunta.texto), pergunta.tipo || 'texto_livre',
                pergunta.opcoes ? JSON.stringify(pergunta.opcoes) : null, i + 1)
          .run();
      }
    }

    await logActivity(env, user.userId, 'campanha_criada', { campaignId, titulo });

    return jsonResponse({ success: true, message: 'Campanha criada com sucesso', data: { campaignId } }, 201);

  } catch (error: any) {
    console.error('Erro ao criar campanha:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleSubmitAnswers(request: Request, env: Env): Promise<Response> {
  try {
    const user = await requireAuth(request, env);
    const body = await request.json() as any;
    const { campanha_id, respostas } = body;

    if (!campanha_id || !respostas || !Array.isArray(respostas)) {
      return jsonResponse({ success: false, error: 'Dados inválidos' }, 400);
    }

    const campaign = await env.kudimu_db
      .prepare('SELECT * FROM campaigns WHERE id = ? AND status = ?')
      .bind(campanha_id, 'ativa')
      .first() as any;

    if (!campaign) {
      return jsonResponse({ success: false, error: 'Campanha não encontrada ou inativa' }, 404);
    }

    const existingAnswer = await env.kudimu_db
      .prepare('SELECT id FROM answers WHERE campanha_id = ? AND usuario_id = ? LIMIT 1')
      .bind(campanha_id, user.userId)
      .first();

    if (existingAnswer) {
      return jsonResponse({ success: false, error: 'Você já respondeu esta campanha' }, 400);
    }

    let pontosReputacaoTotal = ACOES_REPUTACAO.RESPOSTA_VALIDADA.pontos;
    let respostasValidadas = 0;
    let respostasRejeitadas = 0;

    // Validar e inserir cada resposta
    for (const resposta of respostas) {
      const tempoResposta = resposta.tempo_resposta || 60; // segundos
      const validacao = validarQualidadeResposta(resposta.resposta, tempoResposta);

      if (!validacao.valida) {
        // Resposta rejeitada
        respostasRejeitadas++;
        const answerId = generateUUID();
        await env.kudimu_db
          .prepare('INSERT INTO answers (id, usuario_id, campanha_id, pergunta_id, resposta, validada) VALUES (?, ?, ?, ?, ?, 0)')
          .bind(answerId, user.userId, campanha_id, resposta.pergunta_id,
                typeof resposta.resposta === 'object' ? JSON.stringify(resposta.resposta) : resposta.resposta)
          .run();
        
        await logActivity(env, user.userId, 'resposta_rejeitada', { 
          campanha_id, 
          motivo: validacao.motivo 
        });
        continue;
      }

      // Resposta válida
      respostasValidadas++;
      pontosReputacaoTotal += validacao.pontosAdicionais;

      const answerId = generateUUID();
      await env.kudimu_db
        .prepare('INSERT INTO answers (id, usuario_id, campanha_id, pergunta_id, resposta, validada) VALUES (?, ?, ?, ?, ?, 1)')
        .bind(answerId, user.userId, campanha_id, resposta.pergunta_id,
              typeof resposta.resposta === 'object' ? JSON.stringify(resposta.resposta) : resposta.resposta)
        .run();
    }

    // Se todas foram rejeitadas, retornar erro
    if (respostasValidadas === 0) {
      return jsonResponse({ 
        success: false, 
        error: 'Todas as respostas foram rejeitadas por não passarem na validação de qualidade',
        data: { respostas_rejeitadas: respostasRejeitadas }
      }, 400);
    }

    // Atualizar campanha
    await env.kudimu_db
      .prepare('UPDATE campaigns SET quantidade_atual = quantidade_atual + 1 WHERE id = ?')
      .bind(campanha_id)
      .run();

    // Buscar reputação atual para calcular bônus
    const userData = await env.kudimu_db
      .prepare('SELECT reputacao FROM users WHERE id = ?')
      .bind(user.userId)
      .first() as any;

    // Calcular recompensa com bônus de nível
    const recompensaBase = campaign.recompensa_por_resposta;
    const recompensaFinal = calcularBonusRecompensa(userData.reputacao, recompensaBase);
    const bonusGanho = recompensaFinal - recompensaBase;

    // Criar recompensa
    const rewardId = generateUUID();
    await env.kudimu_db
      .prepare('INSERT INTO rewards (id, usuario_id, campanha_id, valor, tipo, status) VALUES (?, ?, ?, ?, "pontos", "pago")')
      .bind(rewardId, user.userId, campanha_id, recompensaFinal)
      .run();

    // Verificar se é a primeira campanha completa do usuário
    const campanhasAnteriores = await env.kudimu_db
      .prepare('SELECT COUNT(DISTINCT campanha_id) as total FROM answers WHERE usuario_id = ? AND validada = 1')
      .bind(user.userId)
      .first() as any;
    
    const isPrimeiraCampanha = Number(campanhasAnteriores?.total || 0) === 0;
    if (isPrimeiraCampanha) {
      pontosReputacaoTotal += ACOES_REPUTACAO.PRIMEIRA_CAMPANHA.pontos;
      await logActivity(env, user.userId, 'primeira_campanha_completa', { campanha_id });
    } else {
      pontosReputacaoTotal += ACOES_REPUTACAO.CAMPANHA_COMPLETA.pontos;
    }

    // Atualizar pontos e reputação do usuário
    await env.kudimu_db
      .prepare('UPDATE users SET saldo_pontos = saldo_pontos + ?, reputacao = reputacao + ? WHERE id = ?')
      .bind(recompensaFinal, pontosReputacaoTotal, user.userId)
      .run();

    await logActivity(env, user.userId, 'resposta_enviada', { campanha_id, respostas_validadas: respostasValidadas });

    return jsonResponse({ 
      success: true, 
      message: 'Respostas enviadas com sucesso',
      data: { 
        recompensa: recompensaFinal,
        bonus_nivel: bonusGanho,
        reputacao_ganha: pontosReputacaoTotal,
        respostas_validadas: respostasValidadas,
        respostas_rejeitadas: respostasRejeitadas
      }
    }, 201);

  } catch (error: any) {
    console.error('Erro ao enviar respostas:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleGetMyAnswers(request: Request, env: Env): Promise<Response> {
  try {
    const user = await requireAuth(request, env);

    const { results } = await env.kudimu_db
      .prepare(`
        SELECT a.*, c.titulo as campanha_titulo, c.recompensa_por_resposta
        FROM answers a JOIN campaigns c ON a.campanha_id = c.id
        WHERE a.usuario_id = ? GROUP BY a.campanha_id ORDER BY a.data_resposta DESC LIMIT 50
      `)
      .bind(user.userId)
      .all();

    return jsonResponse({ success: true, data: results });

  } catch (error: any) {
    console.error('Erro ao buscar histórico:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleGetMyRewards(request: Request, env: Env): Promise<Response> {
  try {
    const user = await requireAuth(request, env);

    const { results } = await env.kudimu_db
      .prepare('SELECT r.*, c.titulo as campanha_titulo FROM rewards r JOIN campaigns c ON r.campanha_id = c.id WHERE r.usuario_id = ? ORDER BY r.data_criacao DESC LIMIT 50')
      .bind(user.userId)
      .all();

    return jsonResponse({ success: true, data: results });

  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// REPUTATION HANDLERS

async function handleGetMyReputation(request: Request, env: Env): Promise<Response> {
  try {
    const user = await requireAuth(request, env);

    // Buscar dados completos do usuário
    const userData = await env.kudimu_db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(user.userId)
      .first() as any;

    if (!userData) {
      return jsonResponse({ success: false, error: 'Usuário não encontrado' }, 404);
    }

    // Calcular estatísticas
    const { results: campanhasCompletas } = await env.kudimu_db
      .prepare('SELECT COUNT(DISTINCT campanha_id) as total FROM answers WHERE usuario_id = ? AND validada = 1')
      .bind(user.userId)
      .all();

    const { results: respostasRejeitadas } = await env.kudimu_db
      .prepare('SELECT COUNT(*) as total FROM answers WHERE usuario_id = ? AND validada = 0')
      .bind(user.userId)
      .all();

    const totalCampanhas = Number(campanhasCompletas[0]?.total || 0);
    const totalRejeitadas = Number(respostasRejeitadas[0]?.total || 0);
    const totalRespostas = totalCampanhas + totalRejeitadas;
    const taxaAprovacao = totalRespostas > 0 ? Math.round((totalCampanhas / totalRespostas) * 100) : 100;

    // Calcular nível e progresso
    const nivel = calcularNivel(userData.reputacao);
    const progresso = calcularProgressoNivel(userData.reputacao);

    // Verificar medalhas
    const usuarioComStats = {
      ...userData,
      campanhas_completas: totalCampanhas,
      taxa_aprovacao: taxaAprovacao,
      respostas_detalhadas: 0, // TODO: implementar contador
      respostas_rapidas: 0, // TODO: implementar contador
      convites_aceitos: 0, // TODO: implementar contador
      denuncias_procedentes: 0, // TODO: implementar contador
      streak_dias: 0 // TODO: implementar contador
    };

    const medalhas = verificarMedalhas(usuarioComStats);

    return jsonResponse({
      success: true,
      data: {
        reputacao: userData.reputacao,
        nivel: {
          nome: nivel.nome,
          cor: nivel.cor,
          icone: nivel.icone,
          beneficios: nivel.beneficios
        },
        progresso: progresso,
        estatisticas: {
          campanhas_completas: totalCampanhas,
          respostas_totais: totalRespostas,
          taxa_aprovacao: taxaAprovacao,
          saldo_pontos: userData.saldo_pontos
        },
        medalhas: medalhas
      }
    });

  } catch (error: any) {
    console.error('Erro ao buscar reputação:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleGetRanking(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const limite = parseInt(url.searchParams.get('limite') || '100');
    const tipo = url.searchParams.get('tipo') || 'geral'; // geral, semanal, mensal

    let query = `
      SELECT 
        id, nome, reputacao, saldo_pontos, nivel, localizacao,
        (SELECT COUNT(DISTINCT campanha_id) FROM answers WHERE usuario_id = users.id AND validada = 1) as campanhas_completas
      FROM users 
      WHERE ativo = 1
    `;

    // Filtrar por período
    if (tipo === 'semanal') {
      query += ` AND ultimo_acesso >= datetime('now', '-7 days')`;
    } else if (tipo === 'mensal') {
      query += ` AND ultimo_acesso >= datetime('now', '-30 days')`;
    }

    query += ` ORDER BY reputacao DESC, saldo_pontos DESC LIMIT ?`;

    const { results } = await env.kudimu_db
      .prepare(query)
      .bind(Math.min(limite, 500)) // Máximo 500
      .all();

    const ranking = results.map((user: any, index: number) => {
      const nivelInfo = calcularNivel(user.reputacao);
      return {
        posicao: index + 1,
        nome: user.nome,
        reputacao: user.reputacao,
        nivel: {
          nome: nivelInfo.nome,
          icone: nivelInfo.icone,
          cor: nivelInfo.cor
        },
        campanhas_completas: user.campanhas_completas,
        localizacao: user.localizacao
      };
    });

    return jsonResponse({ success: true, data: ranking });

  } catch (error: any) {
    console.error('Erro ao gerar ranking:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleGetMedals(request: Request, env: Env): Promise<Response> {
  try {
    const user = await requireAuth(request, env);

    // Buscar dados do usuário
    const userData = await env.kudimu_db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(user.userId)
      .first() as any;

    // Calcular estatísticas
    const { results: stats } = await env.kudimu_db
      .prepare(`
        SELECT 
          COUNT(DISTINCT campanha_id) as campanhas_completas,
          COUNT(*) as total_respostas
        FROM answers 
        WHERE usuario_id = ? AND validada = 1
      `)
      .bind(user.userId)
      .all();

    const usuarioComStats = {
      ...userData,
      campanhas_completas: stats[0]?.campanhas_completas || 0,
      taxa_aprovacao: 100, // Simplificado
      respostas_detalhadas: 0,
      respostas_rapidas: 0,
      convites_aceitos: 0,
      denuncias_procedentes: 0,
      streak_dias: 0
    };

    const medalhas = verificarMedalhas(usuarioComStats);

    return jsonResponse({ success: true, data: medalhas });

  } catch (error: any) {
    console.error('Erro ao buscar medalhas:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// ADMIN HANDLERS

async function handleAdminDashboard(request: Request, env: Env): Promise<Response> {
  try {
    const adminCheck = await verificarAdmin(request, env);
    if (!adminCheck.isAdmin) {
      return jsonResponse({ success: false, error: adminCheck.error }, 403);
    }

    // Estatísticas gerais
    const stats = {
      usuarios: await env.kudimu_db.prepare('SELECT COUNT(*) as total FROM users').first() as any,
      campanhas: await env.kudimu_db.prepare('SELECT COUNT(*) as total FROM campaigns').first() as any,
      respostas: await env.kudimu_db.prepare('SELECT COUNT(*) as total FROM answers').first() as any,
      recompensas: await env.kudimu_db.prepare('SELECT SUM(valor) as total FROM rewards WHERE status = "pago"').first() as any,
    };

    // Usuários ativos (últimos 7 dias)
    const usuariosAtivos = await env.kudimu_db
      .prepare(`SELECT COUNT(*) as total FROM users WHERE ultimo_acesso >= datetime('now', '-7 days')`)
      .first() as any;

    // Campanhas ativas
    const campanhasAtivas = await env.kudimu_db
      .prepare(`SELECT COUNT(*) as total FROM campaigns WHERE status = 'ativa'`)
      .first() as any;

    // Taxa de aprovação de respostas
    const aprovacao = await env.kudimu_db
      .prepare(`
        SELECT 
          SUM(CASE WHEN validada = 1 THEN 1 ELSE 0 END) as aprovadas,
          COUNT(*) as total
        FROM answers
      `)
      .first() as any;

    // Últimas atividades
    const atividades = await env.kudimu_db
      .prepare(`
        SELECT a.*, u.nome as usuario_nome
        FROM activity_logs a
        LEFT JOIN users u ON a.usuario_id = u.id
        ORDER BY a.timestamp DESC
        LIMIT 10
      `)
      .all();

    return jsonResponse({
      success: true,
      data: {
        totais: {
          usuarios: Number(stats.usuarios?.total || 0),
          campanhas: Number(stats.campanhas?.total || 0),
          respostas: Number(stats.respostas?.total || 0),
          recompensas_pagas: Number(stats.recompensas?.total || 0)
        },
        metricas: {
          usuarios_ativos_7d: Number(usuariosAtivos?.total || 0),
          campanhas_ativas: Number(campanhasAtivas?.total || 0),
          taxa_aprovacao: Number(aprovacao?.total || 0) > 0 
            ? Math.round((Number(aprovacao?.aprovadas || 0) / Number(aprovacao?.total || 1)) * 100)
            : 0
        },
        atividades_recentes: atividades.results
      }
    });

  } catch (error: any) {
    console.error('Erro no dashboard admin:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleAdminGetUsers(request: Request, env: Env): Promise<Response> {
  try {
    const adminCheck = await verificarAdmin(request, env);
    if (!adminCheck.isAdmin) {
      return jsonResponse({ success: false, error: adminCheck.error }, 403);
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || ''; // ativo, inativo, banido
    const perfil = url.searchParams.get('perfil') || ''; // cidadao, empresa, admin

    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        id, nome, email, telefone, localizacao, perfil, reputacao,
        saldo_pontos, ativo, data_cadastro, ultimo_acesso,
        (SELECT COUNT(*) FROM answers WHERE usuario_id = users.id) as total_respostas
      FROM users
      WHERE 1=1
    `;

    const params: any[] = [];

    if (search) {
      query += ` AND (nome LIKE ? OR email LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status === 'ativo') {
      query += ` AND ativo = 1`;
    } else if (status === 'inativo') {
      query += ` AND ativo = 0`;
    }

    if (perfil) {
      query += ` AND perfil = ?`;
      params.push(perfil);
    }

    query += ` ORDER BY data_cadastro DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const { results } = await env.kudimu_db
      .prepare(query)
      .bind(...params)
      .all();

    // Contar total
    let countQuery = `SELECT COUNT(*) as total FROM users WHERE 1=1`;
    const countParams: any[] = [];

    if (search) {
      countQuery += ` AND (nome LIKE ? OR email LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }
    if (status === 'ativo') countQuery += ` AND ativo = 1`;
    if (status === 'inativo') countQuery += ` AND ativo = 0`;
    if (perfil) {
      countQuery += ` AND perfil = ?`;
      countParams.push(perfil);
    }

    const totalResult = await env.kudimu_db
      .prepare(countQuery)
      .bind(...countParams)
      .first() as any;

    const total = Number(totalResult?.total || 0);

    return jsonResponse({
      success: true,
      data: {
        users: results,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error: any) {
    console.error('Erro ao buscar usuários:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleAdminUpdateUser(userId: string, request: Request, env: Env): Promise<Response> {
  try {
    const adminCheck = await verificarAdmin(request, env);
    if (!adminCheck.isAdmin) {
      return jsonResponse({ success: false, error: adminCheck.error }, 403);
    }

    const body = await request.json() as any;
    const { ativo, perfil, reputacao, saldo_pontos } = body;

    const updates: string[] = [];
    const params: any[] = [];

    if (typeof ativo === 'number') {
      updates.push('ativo = ?');
      params.push(ativo);
    }
    if (perfil) {
      updates.push('perfil = ?');
      params.push(perfil);
    }
    if (typeof reputacao === 'number') {
      updates.push('reputacao = ?');
      params.push(reputacao);
    }
    if (typeof saldo_pontos === 'number') {
      updates.push('saldo_pontos = ?');
      params.push(saldo_pontos);
    }

    if (updates.length === 0) {
      return jsonResponse({ success: false, error: 'Nenhum campo para atualizar' }, 400);
    }

    params.push(userId);

    await env.kudimu_db
      .prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...params)
      .run();

    await logActivity(env, adminCheck.userId!, 'admin_atualizar_usuario', { 
      usuario_modificado: userId,
      alteracoes: body
    });

    return jsonResponse({ success: true, message: 'Usuário atualizado com sucesso' });

  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleAdminGetCampaigns(request: Request, env: Env): Promise<Response> {
  try {
    const adminCheck = await verificarAdmin(request, env);
    if (!adminCheck.isAdmin) {
      return jsonResponse({ success: false, error: adminCheck.error }, 403);
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        c.*,
        u.nome as criador_nome,
        (SELECT COUNT(*) FROM answers WHERE campanha_id = c.id) as total_respostas,
        (SELECT COUNT(DISTINCT usuario_id) FROM answers WHERE campanha_id = c.id) as participantes_unicos
      FROM campaigns c
      LEFT JOIN users u ON c.criador_id = u.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (status) {
      query += ` AND c.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY c.data_criacao DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const { results } = await env.kudimu_db
      .prepare(query)
      .bind(...params)
      .all();

    return jsonResponse({ success: true, data: results });

  } catch (error: any) {
    console.error('Erro ao buscar campanhas:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleAdminUpdateCampaign(campaignId: string, request: Request, env: Env): Promise<Response> {
  try {
    const adminCheck = await verificarAdmin(request, env);
    if (!adminCheck.isAdmin) {
      return jsonResponse({ success: false, error: adminCheck.error }, 403);
    }

    const body = await request.json() as any;
    const { status, quantidade_necessaria, recompensa_por_resposta } = body;

    const updates: string[] = [];
    const params: any[] = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (typeof quantidade_necessaria === 'number') {
      updates.push('quantidade_necessaria = ?');
      params.push(quantidade_necessaria);
    }
    if (typeof recompensa_por_resposta === 'number') {
      updates.push('recompensa_por_resposta = ?');
      params.push(recompensa_por_resposta);
    }

    if (updates.length === 0) {
      return jsonResponse({ success: false, error: 'Nenhum campo para atualizar' }, 400);
    }

    params.push(campaignId);

    await env.kudimu_db
      .prepare(`UPDATE campaigns SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...params)
      .run();

    await logActivity(env, adminCheck.userId!, 'admin_atualizar_campanha', {
      campanha_id: campaignId,
      alteracoes: body
    });

    return jsonResponse({ success: true, message: 'Campanha atualizada com sucesso' });

  } catch (error: any) {
    console.error('Erro ao atualizar campanha:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleAdminDeleteCampaign(campaignId: string, request: Request, env: Env): Promise<Response> {
  try {
    const adminCheck = await verificarAdmin(request, env);
    if (!adminCheck.isAdmin) {
      return jsonResponse({ success: false, error: adminCheck.error }, 403);
    }

    // Deletar campanha (soft delete mudando status)
    await env.kudimu_db
      .prepare(`UPDATE campaigns SET status = 'cancelada' WHERE id = ?`)
      .bind(campaignId)
      .run();

    await logActivity(env, adminCheck.userId!, 'admin_deletar_campanha', {
      campanha_id: campaignId
    });

    return jsonResponse({ success: true, message: 'Campanha deletada com sucesso' });

  } catch (error: any) {
    console.error('Erro ao deletar campanha:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleAdminGetAnswers(request: Request, env: Env): Promise<Response> {
  try {
    const adminCheck = await verificarAdmin(request, env);
    if (!adminCheck.isAdmin) {
      return jsonResponse({ success: false, error: adminCheck.error }, 403);
    }

    const url = new URL(request.url);
    const validada = url.searchParams.get('validada');
    const campaignId = url.searchParams.get('campanha_id');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        a.*,
        u.nome as usuario_nome,
        u.email as usuario_email,
        c.titulo as campanha_titulo,
        q.texto as pergunta_texto
      FROM answers a
      LEFT JOIN users u ON a.usuario_id = u.id
      LEFT JOIN campaigns c ON a.campanha_id = c.id
      LEFT JOIN questions q ON a.pergunta_id = q.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (validada !== null && validada !== '') {
      query += ` AND a.validada = ?`;
      params.push(validada === '1' ? 1 : 0);
    }

    if (campaignId) {
      query += ` AND a.campanha_id = ?`;
      params.push(campaignId);
    }

    query += ` ORDER BY a.data_resposta DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const { results } = await env.kudimu_db
      .prepare(query)
      .bind(...params)
      .all();

    return jsonResponse({ success: true, data: results });

  } catch (error: any) {
    console.error('Erro ao buscar respostas:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleAdminValidateAnswer(answerId: string, request: Request, env: Env): Promise<Response> {
  try {
    const adminCheck = await verificarAdmin(request, env);
    if (!adminCheck.isAdmin) {
      return jsonResponse({ success: false, error: adminCheck.error }, 403);
    }

    const body = await request.json() as any;
    const { validada } = body; // 1 ou 0

    if (typeof validada !== 'number' || (validada !== 0 && validada !== 1)) {
      return jsonResponse({ success: false, error: 'Campo validada deve ser 0 ou 1' }, 400);
    }

    // Buscar resposta
    const answer = await env.kudimu_db
      .prepare('SELECT * FROM answers WHERE id = ?')
      .bind(answerId)
      .first() as any;

    if (!answer) {
      return jsonResponse({ success: false, error: 'Resposta não encontrada' }, 404);
    }

    // Atualizar validação
    await env.kudimu_db
      .prepare('UPDATE answers SET validada = ? WHERE id = ?')
      .bind(validada, answerId)
      .run();

    // Atualizar reputação do usuário
    if (validada === 1 && answer.validada === 0) {
      // Estava rejeitada, agora aprovada: +15 pontos
      await atualizarReputacao(env, answer.usuario_id, 'RESPOSTA_VALIDADA', { answer_id: answerId });
    } else if (validada === 0 && answer.validada === 1) {
      // Estava aprovada, agora rejeitada: -15 pontos
      await atualizarReputacao(env, answer.usuario_id, 'RESPOSTA_REJEITADA', { answer_id: answerId });
    }

    await logActivity(env, adminCheck.userId!, 'admin_validar_resposta', {
      answer_id: answerId,
      validada,
      usuario_afetado: answer.usuario_id
    });

    return jsonResponse({ success: true, message: 'Resposta atualizada com sucesso' });

  } catch (error: any) {
    console.error('Erro ao validar resposta:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// ============================================
// AI HANDLERS
// ============================================

/**
 * POST /ai/analyze-answer/:id
 * Analisa sentimento e qualidade de uma resposta usando Workers AI
 */
async function handleAnalyzeAnswer(answerId: string, request: Request, env: Env) {
  try {
    const authCheck = await verificarAdmin(request, env);
    if (!authCheck.isAdmin) {
      return jsonResponse({ success: false, error: authCheck.error || 'Acesso negado' }, 403);
    }

    // Buscar resposta
    const answer = await env.kudimu_db
      .prepare(`
        SELECT a.*, q.texto as pergunta, c.titulo as campanha_titulo
        FROM answers a
        JOIN questions q ON a.pergunta_id = q.id
        JOIN campaigns c ON q.campanha_id = c.campanha_id
        WHERE a.id = ?
      `)
      .bind(answerId)
      .first() as any;

    if (!answer) {
      return jsonResponse({ success: false, error: 'Resposta não encontrada' }, 404);
    }

    // Preparar prompt para análise
    const prompt = `Analise a seguinte resposta a uma pergunta de pesquisa de mercado:

Pergunta: ${answer.pergunta}
Resposta: ${answer.resposta}

Por favor, forneça uma análise estruturada com:
1. Sentimento (positivo, neutro, negativo)
2. Qualidade da resposta (1-10)
3. Principais temas mencionados
4. Se a resposta parece spam ou inválida (sim/não)
5. Resumo em uma frase

Responda APENAS em formato JSON válido com as chaves: sentiment, quality_score, themes (array), is_spam (boolean), summary.`;

    // Chamar Workers AI
    const aiResponse = await env.kudimu_ai.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        { role: 'system', content: 'Você é um analista de pesquisas de mercado especializado em análise de sentimentos e qualidade de respostas.' },
        { role: 'user', content: prompt }
      ]
    });

    let analysis;
    try {
      // Extrair JSON da resposta
      const responseText = aiResponse.response || '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = {
          sentiment: 'neutro',
          quality_score: 5,
          themes: [],
          is_spam: false,
          summary: 'Análise não disponível',
          raw_response: responseText
        };
      }
    } catch (parseError) {
      analysis = {
        sentiment: 'neutro',
        quality_score: 5,
        themes: [],
        is_spam: false,
        summary: 'Erro ao processar análise',
        raw_response: aiResponse.response
      };
    }

    // Gerar embedding para busca semântica
    const embeddingResponse = await env.kudimu_ai.run('@cf/baai/bge-base-en-v1.5', {
      text: `${answer.pergunta} ${answer.resposta}`
    });

    const embedding = embeddingResponse.data[0];

    // Salvar no Vectorize
    await env.kudimu.upsert([{
      id: `answer-${answerId}`,
      values: embedding,
      metadata: {
        type: 'answer',
        answer_id: answerId,
        campaign_id: answer.campanha_id,
        sentiment: analysis.sentiment,
        quality_score: analysis.quality_score,
        is_spam: analysis.is_spam
      }
    }]);

    // Log da análise
    await logActivity(env, authCheck.userId!, 'ai_analyze_answer', {
      answer_id: answerId,
      sentiment: analysis.sentiment,
      quality_score: analysis.quality_score,
      is_spam: analysis.is_spam
    });

    return jsonResponse({
      success: true,
      data: {
        answer_id: answerId,
        analysis: analysis,
        embedding_stored: true
      }
    });

  } catch (error: any) {
    console.error('Erro ao analisar resposta:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * GET /ai/campaign-insights/:id
 * Gera insights inteligentes sobre uma campanha
 */
async function handleCampaignInsights(campaignId: string, request: Request, env: Env) {
  try {
    const authCheck = await verificarAdmin(request, env);
    if (!authCheck.isAdmin) {
      return jsonResponse({ success: false, error: authCheck.error || 'Acesso negado' }, 403);
    }

    // Buscar campanha e respostas
    const campaign = await env.kudimu_db
      .prepare('SELECT * FROM campaigns WHERE campanha_id = ?')
      .bind(campaignId)
      .first() as any;

    if (!campaign) {
      return jsonResponse({ success: false, error: 'Campanha não encontrada' }, 404);
    }

    // Buscar respostas da campanha
    const answers = await env.kudimu_db
      .prepare(`
        SELECT a.resposta, a.validada, q.texto as pergunta
        FROM answers a
        JOIN questions q ON a.pergunta_id = q.id
        WHERE q.campanha_id = ?
        LIMIT 100
      `)
      .bind(campaignId)
      .all();

    if (!answers.results || answers.results.length === 0) {
      return jsonResponse({
        success: true,
        data: {
          campaign_id: campaignId,
          insights: 'Sem respostas para analisar ainda',
          total_answers: 0
        }
      });
    }

    // Preparar dados para análise
    const responsesText = answers.results
      .map((a: any) => `P: ${a.pergunta}\nR: ${a.resposta}`)
      .join('\n\n');

    const prompt = `Analise as seguintes respostas de uma pesquisa de mercado sobre "${campaign.titulo}":

${responsesText.substring(0, 3000)} // Limitar tamanho

Forneça insights em formato JSON com:
1. overall_sentiment: sentimento geral (positivo/neutro/negativo)
2. key_findings: array de 3-5 descobertas principais
3. common_themes: array de temas recorrentes
4. recommendations: array de 2-3 recomendações
5. satisfaction_score: nota de satisfação (1-10)

Responda APENAS em formato JSON válido.`;

    const aiResponse = await env.kudimu_ai.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        { role: 'system', content: 'Você é um analista de pesquisas de mercado especializado em extrair insights de feedback de consumidores.' },
        { role: 'user', content: prompt }
      ]
    });

    let insights;
    try {
      const responseText = aiResponse.response || '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      } else {
        insights = {
          overall_sentiment: 'neutro',
          key_findings: ['Análise em andamento'],
          common_themes: [],
          recommendations: ['Coletar mais respostas'],
          satisfaction_score: 5,
          raw_response: responseText
        };
      }
    } catch (parseError) {
      insights = {
        overall_sentiment: 'neutro',
        key_findings: ['Erro ao processar insights'],
        common_themes: [],
        recommendations: [],
        satisfaction_score: 5
      };
    }

    // Gerar embedding da campanha para busca semântica
    const campaignText = `${campaign.titulo} ${campaign.descricao || ''} ${campaign.tema}`;
    const embeddingResponse = await env.kudimu_ai.run('@cf/baai/bge-base-en-v1.5', {
      text: campaignText
    });

    const embedding = embeddingResponse.data[0];

    // Salvar no Vectorize
    await env.kudimu.upsert([{
      id: `campaign-${campaignId}`,
      values: embedding,
      metadata: {
        type: 'campaign',
        campaign_id: campaignId,
        titulo: campaign.titulo,
        tema: campaign.tema,
        overall_sentiment: insights.overall_sentiment,
        satisfaction_score: insights.satisfaction_score
      }
    }]);

    await logActivity(env, authCheck.userId!, 'ai_campaign_insights', {
      campaign_id: campaignId,
      total_answers: answers.results.length,
      sentiment: insights.overall_sentiment
    });

    return jsonResponse({
      success: true,
      data: {
        campaign_id: campaignId,
        campaign_title: campaign.titulo,
        total_answers: answers.results.length,
        insights: insights,
        embedding_stored: true
      }
    });

  } catch (error: any) {
    console.error('Erro ao gerar insights:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * POST /ai/detect-spam
 * Detecta se uma resposta é spam
 */
async function handleDetectSpam(request: Request, env: Env) {
  try {
    await requireAuth(request, env);

    const body = await request.json() as any;
    const { text } = body;

    if (!text) {
      return jsonResponse({ success: false, error: 'Texto não fornecido' }, 400);
    }

    const prompt = `Analise se o seguinte texto é spam, resposta inválida ou de baixa qualidade:

"${text}"

Responda APENAS em formato JSON com:
- is_spam (boolean): true se for spam/inválido
- confidence (number): confiança da detecção (0-1)
- reason (string): motivo da classificação

JSON:`;

    const aiResponse = await env.kudimu_ai.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        { role: 'system', content: 'Você é um detector de spam especializado em identificar respostas inválidas em pesquisas.' },
        { role: 'user', content: prompt }
      ]
    });

    let result;
    try {
      const responseText = aiResponse.response || '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = {
          is_spam: false,
          confidence: 0.5,
          reason: 'Análise inconclusiva'
        };
      }
    } catch (parseError) {
      result = {
        is_spam: false,
        confidence: 0,
        reason: 'Erro ao processar resposta'
      };
    }

    return jsonResponse({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('Erro ao detectar spam:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// ============================================
// PAYMENTS HANDLERS (Sistema AOA - Kwanza)
// ============================================

/**
 * POST /rewards/validate
 * Valida se uma resposta merece recompensa
 */
async function handleRewardsValidate(request: Request, env: Env) {
  try {
    const payload = await requireAuth(request, env) as any;
    const body = await request.json() as any;
    const { answer_id, usuario_id } = body;

    // Buscar resposta e usuário
    const answer = await env.kudimu_db
      .prepare('SELECT * FROM answers WHERE id = ?')
      .bind(answer_id)
      .first() as any;

    if (!answer) {
      return jsonResponse({ success: false, error: 'Resposta não encontrada' }, 404);
    }

    const user = await env.kudimu_db
      .prepare('SELECT reputacao, nivel FROM users WHERE id = ?')
      .bind(usuario_id)
      .first() as any;

    // Validações automáticas
    const validations = {
      tempo_minimo: answer.tempo_resposta >= 5, // Mínimo 5 segundos
      usuario_ativo: user && user.reputacao >= 0,
      resposta_nao_vazia: answer.resposta && answer.resposta.length > 10,
      nao_duplicada: true // TODO: Verificar duplicidade
    };

    const is_valid = Object.values(validations).every(v => v);

    return jsonResponse({
      success: true,
      data: {
        is_valid,
        validations,
        usuario_reputacao: user?.reputacao || 0,
        usuario_nivel: user?.nivel || 'Iniciante'
      }
    });

  } catch (error: any) {
    console.error('Erro ao validar recompensa:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * POST /rewards/credit
 * Credita recompensa em AOA ao usuário
 */
async function handleRewardsCredit(request: Request, env: Env) {
  try {
    const authCheck = await verificarAdmin(request, env);
    if (!authCheck.isAdmin) {
      return jsonResponse({ success: false, error: authCheck.error || 'Acesso negado' }, 403);
    }

    const body = await request.json() as any;
    const { usuario_id, campanha_id, valor_aoa, detalhes } = body;

    if (!usuario_id || !valor_aoa) {
      return jsonResponse({ success: false, error: 'Dados incompletos' }, 400);
    }

    // Buscar saldo atual
    const user = await env.kudimu_db
      .prepare('SELECT saldo_pontos FROM users WHERE id = ?')
      .bind(usuario_id)
      .first() as any;

    if (!user) {
      return jsonResponse({ success: false, error: 'Usuário não encontrado' }, 404);
    }

    const saldo_anterior = user.saldo_pontos;
    const saldo_posterior = saldo_anterior + valor_aoa;

    // Criar transação
    const transactionId = await generateUUID();
    await env.kudimu_db
      .prepare(`
        INSERT INTO payment_transactions 
        (id, usuario_id, tipo, valor_aoa, saldo_anterior, saldo_posterior, status, campanha_id, detalhes, data_criacao)
        VALUES (?, ?, 'recompensa', ?, ?, ?, 'concluido', ?, ?, CURRENT_TIMESTAMP)
      `)
      .bind(transactionId, usuario_id, valor_aoa, saldo_anterior, saldo_posterior, campanha_id, JSON.stringify(detalhes || {}))
      .run();

    // Atualizar saldo do usuário
    await env.kudimu_db
      .prepare('UPDATE users SET saldo_pontos = ? WHERE id = ?')
      .bind(saldo_posterior, usuario_id)
      .run();

    await logActivity(env, usuario_id, 'recompensa_creditada', {
      valor_aoa,
      campanha_id,
      transaction_id: transactionId
    });

    return jsonResponse({
      success: true,
      data: {
        transaction_id: transactionId,
        valor_creditado_aoa: valor_aoa,
        saldo_anterior_aoa: saldo_anterior,
        saldo_atual_aoa: saldo_posterior
      }
    });

  } catch (error: any) {
    console.error('Erro ao creditar recompensa:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * GET /user/rewards/history
 * Histórico de transações do usuário
 */
async function handleUserRewardsHistory(request: Request, env: Env) {
  try {
    const payload = await requireAuth(request, env) as any;
    const userId = payload.userId;

    const transactions = await env.kudimu_db
      .prepare(`
        SELECT 
          pt.*,
          c.titulo as campanha_titulo
        FROM payment_transactions pt
        LEFT JOIN campaigns c ON pt.campanha_id = c.id
        WHERE pt.usuario_id = ?
        ORDER BY pt.data_criacao DESC
        LIMIT 100
      `)
      .bind(userId)
      .all();

    // Buscar saldo atual
    const user = await env.kudimu_db
      .prepare('SELECT saldo_pontos FROM users WHERE id = ?')
      .bind(userId)
      .first() as any;

    return jsonResponse({
      success: true,
      data: {
        saldo_atual_aoa: user?.saldo_pontos || 0,
        transacoes: transactions.results || [],
        total_transacoes: transactions.results?.length || 0
      }
    });

  } catch (error: any) {
    console.error('Erro ao buscar histórico:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * POST /user/rewards/withdraw
 * Solicitar saque de recompensas
 */
async function handleUserRewardsWithdraw(request: Request, env: Env) {
  try {
    const payload = await requireAuth(request, env) as any;
    const userId = payload.userId;
    const body = await request.json() as any;
    
    const { valor_aoa, metodo_pagamento, operadora, telefone_destino } = body;

    if (!valor_aoa || !metodo_pagamento) {
      return jsonResponse({ success: false, error: 'Dados incompletos' }, 400);
    }

    // Buscar configurações de saque
    const settings = await env.kudimu_db
      .prepare('SELECT * FROM withdrawal_settings WHERE id = 1')
      .first() as any;

    // Validar saque mínimo
    if (valor_aoa < settings.saque_minimo_aoa) {
      return jsonResponse({ 
        success: false, 
        error: `Saque mínimo é ${settings.saque_minimo_aoa} AOA` 
      }, 400);
    }

    // Buscar saldo atual
    const user = await env.kudimu_db
      .prepare('SELECT saldo_pontos FROM users WHERE id = ?')
      .bind(userId)
      .first() as any;

    if (!user || user.saldo_pontos < valor_aoa) {
      return jsonResponse({ success: false, error: 'Saldo insuficiente' }, 400);
    }

    // Verificar frequência de saques (1x por semana)
    const ultimoSaque = await env.kudimu_db
      .prepare(`
        SELECT data_criacao 
        FROM payment_transactions 
        WHERE usuario_id = ? AND tipo = 'saque' AND status != 'cancelado'
        ORDER BY data_criacao DESC 
        LIMIT 1
      `)
      .bind(userId)
      .first() as any;

    if (ultimoSaque) {
      const diasDesdeUltimoSaque = (Date.now() - new Date(ultimoSaque.data_criacao).getTime()) / (1000 * 60 * 60 * 24);
      if (diasDesdeUltimoSaque < settings.frequencia_maxima_dias) {
        return jsonResponse({ 
          success: false, 
          error: `Aguarde ${settings.frequencia_maxima_dias} dias entre saques` 
        }, 400);
      }
    }

    const saldo_anterior = user.saldo_pontos;
    const saldo_posterior = saldo_anterior - valor_aoa;

    // Criar transação de saque (pendente até admin aprovar)
    const transactionId = await generateUUID();
    await env.kudimu_db
      .prepare(`
        INSERT INTO payment_transactions 
        (id, usuario_id, tipo, metodo_pagamento, operadora, valor_aoa, saldo_anterior, saldo_posterior, 
         status, telefone_destino, detalhes, data_criacao)
        VALUES (?, ?, 'saque', ?, ?, ?, ?, ?, 'pendente', ?, ?, CURRENT_TIMESTAMP)
      `)
      .bind(
        transactionId, 
        userId, 
        metodo_pagamento, 
        operadora || null,
        valor_aoa, 
        saldo_anterior, 
        saldo_posterior,
        telefone_destino || null,
        JSON.stringify({ metodo: metodo_pagamento })
      )
      .run();

    // Atualizar saldo (reservar valor)
    await env.kudimu_db
      .prepare('UPDATE users SET saldo_pontos = ? WHERE id = ?')
      .bind(saldo_posterior, userId)
      .run();

    await logActivity(env, userId, 'saque_solicitado', {
      valor_aoa,
      metodo: metodo_pagamento,
      transaction_id: transactionId
    });

    return jsonResponse({
      success: true,
      data: {
        transaction_id: transactionId,
        valor_solicitado_aoa: valor_aoa,
        status: 'pendente',
        tempo_processamento_estimado_horas: settings.tempo_processamento_horas,
        mensagem: 'Saque solicitado com sucesso. Aguarde processamento.'
      }
    });

  } catch (error: any) {
    console.error('Erro ao solicitar saque:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * GET /admin/rewards/pending
 * Lista saques pendentes para admin processar
 */
async function handleAdminRewardsPending(request: Request, env: Env) {
  try {
    const authCheck = await verificarAdmin(request, env);
    if (!authCheck.isAdmin) {
      return jsonResponse({ success: false, error: authCheck.error || 'Acesso negado' }, 403);
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'pendente';

    const transactions = await env.kudimu_db
      .prepare(`
        SELECT 
          pt.*,
          u.nome as usuario_nome,
          u.email as usuario_email,
          u.telefone as usuario_telefone
        FROM payment_transactions pt
        JOIN users u ON pt.usuario_id = u.id
        WHERE pt.tipo = 'saque' AND pt.status = ?
        ORDER BY pt.data_criacao DESC
      `)
      .bind(status)
      .all();

    // Calcular totais
    const totais = await env.kudimu_db
      .prepare(`
        SELECT 
          COUNT(*) as total_pendentes,
          SUM(valor_aoa) as valor_total_pendente
        FROM payment_transactions
        WHERE tipo = 'saque' AND status = 'pendente'
      `)
      .first() as any;

    return jsonResponse({
      success: true,
      data: {
        transacoes: transactions.results || [],
        total_transacoes: transactions.results?.length || 0,
        estatisticas: {
          total_pendentes: totais.total_pendentes || 0,
          valor_total_pendente_aoa: totais.valor_total_pendente || 0
        }
      }
    });

  } catch (error: any) {
    console.error('Erro ao buscar saques pendentes:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * POST /admin/rewards/confirm
 * Confirma ou rejeita um saque
 */
async function handleAdminRewardsConfirm(request: Request, env: Env) {
  try {
    const authCheck = await verificarAdmin(request, env);
    if (!authCheck.isAdmin) {
      return jsonResponse({ success: false, error: authCheck.error || 'Acesso negado' }, 403);
    }

    const body = await request.json() as any;
    const { transaction_id, status, referencia_externa, motivo_erro } = body;

    if (!transaction_id || !status) {
      return jsonResponse({ success: false, error: 'Dados incompletos' }, 400);
    }

    if (!['concluido', 'erro', 'cancelado'].includes(status)) {
      return jsonResponse({ success: false, error: 'Status inválido' }, 400);
    }

    // Buscar transação
    const transaction = await env.kudimu_db
      .prepare('SELECT * FROM payment_transactions WHERE id = ?')
      .bind(transaction_id)
      .first() as any;

    if (!transaction) {
      return jsonResponse({ success: false, error: 'Transação não encontrada' }, 404);
    }

    if (transaction.status !== 'pendente') {
      return jsonResponse({ success: false, error: 'Transação já foi processada' }, 400);
    }

    // Se cancelar ou erro, devolver saldo ao usuário
    if (status === 'cancelado' || status === 'erro') {
      await env.kudimu_db
        .prepare('UPDATE users SET saldo_pontos = saldo_pontos + ? WHERE id = ?')
        .bind(transaction.valor_aoa, transaction.usuario_id)
        .run();
    }

    // Atualizar transação
    await env.kudimu_db
      .prepare(`
        UPDATE payment_transactions 
        SET status = ?, 
            referencia_externa = ?, 
            motivo_erro = ?,
            processado_por = ?,
            data_processamento = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
      .bind(status, referencia_externa || null, motivo_erro || null, authCheck.userId, transaction_id)
      .run();

    await logActivity(env, authCheck.userId!, 'admin_processar_saque', {
      transaction_id,
      status,
      usuario_id: transaction.usuario_id,
      valor_aoa: transaction.valor_aoa
    });

    return jsonResponse({
      success: true,
      data: {
        transaction_id,
        status,
        mensagem: `Saque ${status === 'concluido' ? 'aprovado' : status} com sucesso`
      }
    });

  } catch (error: any) {
    console.error('Erro ao confirmar saque:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// ============================================
// REPORTS HANDLERS
// ============================================

/**
 * GET /reports/campaign/:id
 * Relatório completo de uma campanha
 */
async function handleReportsCampaign(campaignId: string, request: Request, env: Env) {
  try {
    const authCheck = await verificarAdmin(request, env);
    if (!authCheck.isAdmin) {
      return jsonResponse({ success: false, error: authCheck.error || 'Acesso negado' }, 403);
    }

    // Buscar dados da campanha
    const campaign = await env.kudimu_db
      .prepare('SELECT * FROM campaigns WHERE id = ?')
      .bind(campaignId)
      .first() as any;

    if (!campaign) {
      return jsonResponse({ success: false, error: 'Campanha não encontrada' }, 404);
    }

    // Estatísticas gerais
    const stats = await env.kudimu_db
      .prepare(`
        SELECT 
          COUNT(DISTINCT a.usuario_id) as total_participantes,
          COUNT(a.id) as total_respostas,
          AVG(a.tempo_resposta) as tempo_medio_resposta,
          SUM(CASE WHEN a.validada = 1 THEN 1 ELSE 0 END) as respostas_validadas,
          SUM(CASE WHEN a.validada = 0 THEN 1 ELSE 0 END) as respostas_rejeitadas
        FROM answers a
        JOIN questions q ON a.pergunta_id = q.id
        WHERE q.campanha_id = ?
      `)
      .bind(campaignId)
      .first() as any;

    // Respostas por dia (últimos 30 dias)
    const respostasPorDia = await env.kudimu_db
      .prepare(`
        SELECT 
          DATE(a.data_resposta) as dia,
          COUNT(*) as total
        FROM answers a
        JOIN questions q ON a.pergunta_id = q.id
        WHERE q.campanha_id = ?
        GROUP BY DATE(a.data_resposta)
        ORDER BY dia DESC
        LIMIT 30
      `)
      .bind(campaignId)
      .all();

    // Taxa de conversão por região
    const porRegiao = await env.kudimu_db
      .prepare(`
        SELECT 
          u.localizacao,
          COUNT(DISTINCT a.usuario_id) as participantes,
          COUNT(a.id) as respostas
        FROM answers a
        JOIN questions q ON a.pergunta_id = q.id
        JOIN users u ON a.usuario_id = u.id
        WHERE q.campanha_id = ?
        GROUP BY u.localizacao
        ORDER BY participantes DESC
        LIMIT 10
      `)
      .bind(campaignId)
      .all();

    // Distribuição de reputação dos participantes
    const porReputacao = await env.kudimu_db
      .prepare(`
        SELECT 
          u.nivel,
          COUNT(DISTINCT a.usuario_id) as participantes,
          AVG(u.reputacao) as reputacao_media
        FROM answers a
        JOIN questions q ON a.pergunta_id = q.id
        JOIN users u ON a.usuario_id = u.id
        WHERE q.campanha_id = ?
        GROUP BY u.nivel
        ORDER BY participantes DESC
      `)
      .bind(campaignId)
      .all();

    // Custos e recompensas
    const financeiro = await env.kudimu_db
      .prepare(`
        SELECT 
          SUM(pt.valor_aoa) as total_pago_aoa,
          COUNT(pt.id) as total_transacoes
        FROM payment_transactions pt
        WHERE pt.campanha_id = ? AND pt.tipo = 'recompensa' AND pt.status = 'concluido'
      `)
      .bind(campaignId)
      .first() as any;

    const custoProjetado = campaign.quantidade_alvo * campaign.recompensa_por_resposta;
    const custoReal = financeiro.total_pago_aoa || 0;
    const economia = custoProjetado - custoReal;

    // Perguntas com mais respostas
    const topPerguntas = await env.kudimu_db
      .prepare(`
        SELECT 
          q.texto as pergunta,
          q.tipo,
          COUNT(a.id) as total_respostas
        FROM questions q
        LEFT JOIN answers a ON q.id = a.pergunta_id
        WHERE q.campanha_id = ?
        GROUP BY q.id
        ORDER BY total_respostas DESC
      `)
      .bind(campaignId)
      .all();

    return jsonResponse({
      success: true,
      data: {
        campanha: {
          id: campaign.id,
          titulo: campaign.titulo,
          cliente: campaign.cliente,
          status: campaign.status,
          data_inicio: campaign.data_inicio,
          data_fim: campaign.data_fim,
          quantidade_alvo: campaign.quantidade_alvo,
          quantidade_atual: campaign.quantidade_atual,
          recompensa_por_resposta: campaign.recompensa_por_resposta
        },
        estatisticas: {
          total_participantes: stats.total_participantes || 0,
          total_respostas: stats.total_respostas || 0,
          tempo_medio_resposta_segundos: Math.round(stats.tempo_medio_resposta || 0),
          respostas_validadas: stats.respostas_validadas || 0,
          respostas_rejeitadas: stats.respostas_rejeitadas || 0,
          taxa_aprovacao: stats.total_respostas > 0 
            ? ((stats.respostas_validadas / stats.total_respostas) * 100).toFixed(1)
            : 0,
          progresso_percentual: ((campaign.quantidade_atual / campaign.quantidade_alvo) * 100).toFixed(1)
        },
        financeiro: {
          custo_projetado_aoa: custoProjetado,
          custo_real_aoa: custoReal,
          economia_aoa: economia,
          total_transacoes: financeiro.total_transacoes || 0,
          custo_por_resposta_real: stats.total_respostas > 0 
            ? (custoReal / stats.total_respostas).toFixed(2)
            : 0
        },
        graficos: {
          respostas_por_dia: respostasPorDia.results || [],
          por_regiao: porRegiao.results || [],
          por_nivel_reputacao: porReputacao.results || [],
          top_perguntas: topPerguntas.results || []
        }
      }
    });

  } catch (error: any) {
    console.error('Erro ao gerar relatório de campanha:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * GET /reports/user/:id
 * Relatório de performance de um usuário
 */
async function handleReportsUser(userId: string, request: Request, env: Env) {
  try {
    const payload = await requireAuth(request, env) as any;
    
    // Permitir apenas o próprio usuário ou admin
    const authCheck = await verificarAdmin(request, env);
    if (!authCheck.isAdmin && payload.userId !== userId) {
      return jsonResponse({ success: false, error: 'Acesso negado' }, 403);
    }

    // Dados do usuário
    const user = await env.kudimu_db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first() as any;

    if (!user) {
      return jsonResponse({ success: false, error: 'Usuário não encontrado' }, 404);
    }

    // Estatísticas de respostas
    const statsRespostas = await env.kudimu_db
      .prepare(`
        SELECT 
          COUNT(*) as total_respostas,
          SUM(CASE WHEN validada = 1 THEN 1 ELSE 0 END) as respostas_aprovadas,
          SUM(CASE WHEN validada = 0 THEN 1 ELSE 0 END) as respostas_rejeitadas,
          AVG(tempo_resposta) as tempo_medio_resposta
        FROM answers
        WHERE usuario_id = ?
      `)
      .bind(userId)
      .first() as any;

    // Campanhas participadas
    const campanhasParticipadas = await env.kudimu_db
      .prepare(`
        SELECT 
          c.id,
          c.titulo,
          c.cliente,
          COUNT(DISTINCT a.id) as total_respostas,
          SUM(CASE WHEN a.validada = 1 THEN 1 ELSE 0 END) as aprovadas
        FROM campaigns c
        JOIN questions q ON c.id = q.campanha_id
        JOIN answers a ON q.id = a.pergunta_id
        WHERE a.usuario_id = ?
        GROUP BY c.id
        ORDER BY total_respostas DESC
      `)
      .bind(userId)
      .all();

    // Histórico financeiro
    const financeiro = await env.kudimu_db
      .prepare(`
        SELECT 
          SUM(CASE WHEN tipo = 'recompensa' THEN valor_aoa ELSE 0 END) as total_ganho_aoa,
          SUM(CASE WHEN tipo = 'saque' AND status = 'concluido' THEN valor_aoa ELSE 0 END) as total_sacado_aoa,
          COUNT(CASE WHEN tipo = 'recompensa' THEN 1 END) as total_recompensas,
          COUNT(CASE WHEN tipo = 'saque' THEN 1 END) as total_saques
        FROM payment_transactions
        WHERE usuario_id = ?
      `)
      .bind(userId)
      .first() as any;

    // Evolução da reputação (últimas 20 atividades)
    const evolucaoReputacao = await env.kudimu_db
      .prepare(`
        SELECT 
          acao,
          detalhes,
          timestamp
        FROM activity_logs
        WHERE usuario_id = ? AND (
          acao LIKE '%reputacao%' OR 
          acao LIKE '%medalha%' OR
          acao = 'RESPOSTA_VALIDADA' OR
          acao = 'RESPOSTA_REJEITADA'
        )
        ORDER BY timestamp DESC
        LIMIT 20
      `)
      .bind(userId)
      .all();

    // Medalhas conquistadas (via activity_logs)
    const medalhas = await env.kudimu_db
      .prepare(`
        SELECT 
          acao,
          detalhes,
          timestamp as data_conquista
        FROM activity_logs
        WHERE usuario_id = ? AND acao LIKE 'medalha_%'
        ORDER BY timestamp DESC
      `)
      .bind(userId)
      .all();

    // Respostas por mês (últimos 6 meses)
    const respostasPorMes = await env.kudimu_db
      .prepare(`
        SELECT 
          strftime('%Y-%m', data_resposta) as mes,
          COUNT(*) as total
        FROM answers
        WHERE usuario_id = ?
        GROUP BY mes
        ORDER BY mes DESC
        LIMIT 6
      `)
      .bind(userId)
      .all();

    return jsonResponse({
      success: true,
      data: {
        usuario: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          perfil: user.perfil,
          reputacao: user.reputacao,
          nivel: user.nivel,
          saldo_aoa: user.saldo_pontos,
          data_cadastro: user.data_cadastro
        },
        estatisticas_respostas: {
          total_respostas: statsRespostas.total_respostas || 0,
          respostas_aprovadas: statsRespostas.respostas_aprovadas || 0,
          respostas_rejeitadas: statsRespostas.respostas_rejeitadas || 0,
          taxa_aprovacao: statsRespostas.total_respostas > 0
            ? ((statsRespostas.respostas_aprovadas / statsRespostas.total_respostas) * 100).toFixed(1)
            : 0,
          tempo_medio_resposta_segundos: Math.round(statsRespostas.tempo_medio_resposta || 0)
        },
        financeiro: {
          total_ganho_aoa: financeiro.total_ganho_aoa || 0,
          total_sacado_aoa: financeiro.total_sacado_aoa || 0,
          saldo_atual_aoa: user.saldo_pontos,
          total_recompensas: financeiro.total_recompensas || 0,
          total_saques: financeiro.total_saques || 0,
          media_por_resposta_aoa: statsRespostas.total_respostas > 0
            ? ((financeiro.total_ganho_aoa || 0) / statsRespostas.total_respostas).toFixed(2)
            : 0
        },
        campanhas_participadas: campanhasParticipadas.results || [],
        medalhas: medalhas.results || [],
        graficos: {
          respostas_por_mes: respostasPorMes.results || [],
          evolucao_reputacao: evolucaoReputacao.results || []
        }
      }
    });

  } catch (error: any) {
    console.error('Erro ao gerar relatório de usuário:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * GET /reports/system/overview
 * Visão geral da plataforma (admin)
 */
async function handleReportsSystemOverview(request: Request, env: Env) {
  try {
    const authCheck = await verificarAdmin(request, env);
    if (!authCheck.isAdmin) {
      return jsonResponse({ success: false, error: authCheck.error || 'Acesso negado' }, 403);
    }

    // Estatísticas de usuários
    const statsUsuarios = await env.kudimu_db
      .prepare(`
        SELECT 
          COUNT(*) as total_usuarios,
          SUM(CASE WHEN ativo = 1 THEN 1 ELSE 0 END) as usuarios_ativos,
          SUM(CASE WHEN perfil = 'cidadao' THEN 1 ELSE 0 END) as cidadaos,
          SUM(CASE WHEN perfil = 'empresa' THEN 1 ELSE 0 END) as empresas,
          AVG(reputacao) as reputacao_media
        FROM users
      `)
      .first() as any;

    // Estatísticas de campanhas
    const statsCampanhas = await env.kudimu_db
      .prepare(`
        SELECT 
          COUNT(*) as total_campanhas,
          SUM(CASE WHEN status = 'ativa' THEN 1 ELSE 0 END) as campanhas_ativas,
          SUM(CASE WHEN status = 'encerrada' THEN 1 ELSE 0 END) as campanhas_encerradas,
          SUM(quantidade_alvo) as total_respostas_esperadas,
          SUM(quantidade_atual) as total_respostas_coletadas
        FROM campaigns
      `)
      .first() as any;

    // Estatísticas financeiras
    const statsFinanceiro = await env.kudimu_db
      .prepare(`
        SELECT 
          SUM(CASE WHEN tipo = 'recompensa' AND status = 'concluido' THEN valor_aoa ELSE 0 END) as total_pago_aoa,
          SUM(CASE WHEN tipo = 'saque' AND status = 'concluido' THEN valor_aoa ELSE 0 END) as total_sacado_aoa,
          SUM(CASE WHEN tipo = 'saque' AND status = 'pendente' THEN valor_aoa ELSE 0 END) as total_pendente_aoa,
          COUNT(CASE WHEN tipo = 'recompensa' THEN 1 END) as total_transacoes_recompensa,
          COUNT(CASE WHEN tipo = 'saque' THEN 1 END) as total_transacoes_saque
        FROM payment_transactions
      `)
      .first() as any;

    // Crescimento de usuários (últimos 12 meses)
    const crescimentoUsuarios = await env.kudimu_db
      .prepare(`
        SELECT 
          strftime('%Y-%m', data_cadastro) as mes,
          COUNT(*) as novos_usuarios
        FROM users
        GROUP BY mes
        ORDER BY mes DESC
        LIMIT 12
      `)
      .all();

    // Atividade recente (últimos 7 dias)
    const atividadeRecente = await env.kudimu_db
      .prepare(`
        SELECT 
          DATE(data_resposta) as dia,
          COUNT(*) as total_respostas
        FROM answers
        WHERE DATE(data_resposta) >= DATE('now', '-7 days')
        GROUP BY dia
        ORDER BY dia DESC
      `)
      .all();

    // Top usuários por reputação
    const topUsuarios = await env.kudimu_db
      .prepare(`
        SELECT 
          id,
          nome,
          email,
          reputacao,
          nivel,
          (SELECT COUNT(*) FROM answers WHERE usuario_id = users.id) as total_respostas
        FROM users
        WHERE perfil = 'cidadao'
        ORDER BY reputacao DESC
        LIMIT 10
      `)
      .all();

    // Top campanhas por participação
    const topCampanhas = await env.kudimu_db
      .prepare(`
        SELECT 
          c.id,
          c.titulo,
          c.cliente,
          c.quantidade_atual,
          c.quantidade_alvo,
          (SELECT COUNT(DISTINCT usuario_id) 
           FROM answers a 
           JOIN questions q ON a.pergunta_id = q.id 
           WHERE q.campanha_id = c.id) as participantes
        FROM campaigns c
        ORDER BY participantes DESC
        LIMIT 10
      `)
      .all();

    // Distribuição por província
    const porProvincia = await env.kudimu_db
      .prepare(`
        SELECT 
          localizacao,
          COUNT(*) as total_usuarios
        FROM users
        WHERE localizacao IS NOT NULL
        GROUP BY localizacao
        ORDER BY total_usuarios DESC
        LIMIT 18
      `)
      .all();

    return jsonResponse({
      success: true,
      data: {
        usuarios: {
          total: statsUsuarios.total_usuarios || 0,
          ativos: statsUsuarios.usuarios_ativos || 0,
          cidadaos: statsUsuarios.cidadaos || 0,
          empresas: statsUsuarios.empresas || 0,
          reputacao_media: Math.round(statsUsuarios.reputacao_media || 0),
          taxa_ativacao: statsUsuarios.total_usuarios > 0
            ? ((statsUsuarios.usuarios_ativos / statsUsuarios.total_usuarios) * 100).toFixed(1)
            : 0
        },
        campanhas: {
          total: statsCampanhas.total_campanhas || 0,
          ativas: statsCampanhas.campanhas_ativas || 0,
          encerradas: statsCampanhas.campanhas_encerradas || 0,
          respostas_esperadas: statsCampanhas.total_respostas_esperadas || 0,
          respostas_coletadas: statsCampanhas.total_respostas_coletadas || 0,
          taxa_conclusao: statsCampanhas.total_respostas_esperadas > 0
            ? ((statsCampanhas.total_respostas_coletadas / statsCampanhas.total_respostas_esperadas) * 100).toFixed(1)
            : 0
        },
        financeiro: {
          total_pago_aoa: statsFinanceiro.total_pago_aoa || 0,
          total_sacado_aoa: statsFinanceiro.total_sacado_aoa || 0,
          total_pendente_aoa: statsFinanceiro.total_pendente_aoa || 0,
          saldo_plataforma_aoa: (statsFinanceiro.total_pago_aoa || 0) - (statsFinanceiro.total_sacado_aoa || 0),
          total_transacoes_recompensa: statsFinanceiro.total_transacoes_recompensa || 0,
          total_transacoes_saque: statsFinanceiro.total_transacoes_saque || 0
        },
        graficos: {
          crescimento_usuarios: crescimentoUsuarios.results || [],
          atividade_7_dias: atividadeRecente.results || [],
          top_usuarios: topUsuarios.results || [],
          top_campanhas: topCampanhas.results || [],
          por_provincia: porProvincia.results || []
        }
      }
    });

  } catch (error: any) {
    console.error('Erro ao gerar relatório geral:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

async function handleReportsFinancial(request: Request, env: Env) {
  try {
    const authCheck = await verificarAdmin(request, env);
    if (!authCheck.isAdmin) {
      return jsonResponse({ success: false, error: authCheck.error }, 403);
    }

    // Resumo financeiro geral
    const resumo = await env.kudimu_db
      .prepare(`
        SELECT 
          SUM(CASE WHEN tipo = 'credito' THEN valor_aoa ELSE 0 END) as total_pago_aoa,
          SUM(CASE WHEN tipo = 'saque' AND status = 'concluido' THEN valor_aoa ELSE 0 END) as total_sacado_aoa,
          SUM(CASE WHEN tipo = 'saque' AND status = 'pendente' THEN valor_aoa ELSE 0 END) as total_pendente_aoa,
          COUNT(CASE WHEN tipo = 'credito' THEN 1 END) as total_transacoes_credito,
          COUNT(CASE WHEN tipo = 'saque' THEN 1 END) as total_transacoes_saque
        FROM payment_transactions
      `)
      .first() as any;

    const saldo_plataforma_aoa = (resumo.total_pago_aoa || 0) - (resumo.total_sacado_aoa || 0);

    // Transações por método de pagamento
    const porMetodo = await env.kudimu_db
      .prepare(`
        SELECT 
          metodo_pagamento,
          COUNT(*) as total_transacoes,
          SUM(valor_aoa) as total_valor_aoa
        FROM payment_transactions
        WHERE tipo = 'saque' AND status = 'concluido'
        GROUP BY metodo_pagamento
        ORDER BY total_valor_aoa DESC
      `)
      .all();

    // Transações por operadora (dados móveis)
    const porOperadora = await env.kudimu_db
      .prepare(`
        SELECT 
          operadora,
          COUNT(*) as total_transacoes,
          SUM(valor_aoa) as total_valor_aoa
        FROM payment_transactions
        WHERE tipo = 'saque' AND metodo_pagamento = 'dados_moveis' AND status = 'concluido'
        GROUP BY operadora
        ORDER BY total_valor_aoa DESC
      `)
      .all();

    // Movimentação por dia (últimos 30 dias)
    const porDia = await env.kudimu_db
      .prepare(`
        SELECT 
          DATE(data_criacao) as dia,
          SUM(CASE WHEN tipo = 'credito' THEN valor_aoa ELSE 0 END) as creditos_aoa,
          SUM(CASE WHEN tipo = 'saque' AND status = 'concluido' THEN valor_aoa ELSE 0 END) as saques_aoa
        FROM payment_transactions
        WHERE data_criacao >= DATE('now', '-30 days')
        GROUP BY dia
        ORDER BY dia DESC
      `)
      .all();

    // Top usuários por valor recebido
    const topUsuarios = await env.kudimu_db
      .prepare(`
        SELECT 
          u.id,
          u.nome,
          u.email,
          SUM(CASE WHEN pt.tipo = 'credito' THEN pt.valor_aoa ELSE 0 END) as total_ganho_aoa,
          SUM(CASE WHEN pt.tipo = 'saque' AND pt.status = 'concluido' THEN pt.valor_aoa ELSE 0 END) as total_sacado_aoa,
          u.saldo_pontos as saldo_atual_aoa
        FROM users u
        LEFT JOIN payment_transactions pt ON u.id = pt.usuario_id
        GROUP BY u.id
        HAVING total_ganho_aoa > 0
        ORDER BY total_ganho_aoa DESC
        LIMIT 20
      `)
      .all();

    return jsonResponse({
      success: true,
      data: {
        resumo: {
          total_pago_aoa: resumo.total_pago_aoa || 0,
          total_sacado_aoa: resumo.total_sacado_aoa || 0,
          total_pendente_aoa: resumo.total_pendente_aoa || 0,
          saldo_plataforma_aoa,
          total_transacoes_credito: resumo.total_transacoes_credito || 0,
          total_transacoes_saque: resumo.total_transacoes_saque || 0
        },
        por_metodo_pagamento: porMetodo.results || [],
        por_operadora: porOperadora.results || [],
        graficos: {
          movimentacao_30_dias: porDia.results || [],
          top_usuarios: topUsuarios.results || []
        }
      }
    });

  } catch (error: any) {
    console.error('Erro ao gerar relatório financeiro:', error);
    return jsonResponse({ success: false, error: 'Erro interno do servidor', details: error.message }, 500);
  }
}

async function handleReportsExport(type: string, request: Request, env: Env) {
  try {
    const authCheck = await verificarAdmin(request, env);
    if (!authCheck.isAdmin) {
      return jsonResponse({ success: false, error: authCheck.error }, 403);
    }

    let csvData = '';
    let filename = '';

    if (type === 'campaigns') {
      const campaigns = await env.kudimu_db
        .prepare(`
          SELECT 
            c.id,
            c.titulo,
            c.cliente,
            c.status,
            c.data_inicio,
            c.data_fim,
            c.quantidade_alvo,
            c.quantidade_atual,
            c.recompensa_por_resposta
          FROM campaigns c
          ORDER BY c.data_criacao DESC
        `)
        .all();

      csvData = 'ID,Titulo,Cliente,Status,Data Inicio,Data Fim,Quantidade Alvo,Quantidade Atual,Recompensa AOA\n';
      for (const c of (campaigns.results as any[])) {
        csvData += `${c.id},"${c.titulo}","${c.cliente}",${c.status},${c.data_inicio},${c.data_fim},${c.quantidade_alvo},${c.quantidade_atual},${c.recompensa_por_resposta}\n`;
      }
      filename = `campanhas_${new Date().toISOString().split('T')[0]}.csv`;

    } else if (type === 'users') {
      const users = await env.kudimu_db
        .prepare(`
          SELECT 
            id,
            nome,
            email,
            telefone,
            perfil,
            reputacao,
            nivel,
            saldo_pontos,
            localizacao,
            data_cadastro,
            ultimo_acesso
          FROM users
          ORDER BY data_cadastro DESC
        `)
        .all();

      csvData = 'ID,Nome,Email,Telefone,Perfil,Reputacao,Nivel,Saldo AOA,Localizacao,Data Cadastro,Ultimo Acesso\n';
      for (const u of (users.results as any[])) {
        csvData += `${u.id},"${u.nome}","${u.email}","${u.telefone || ''}",${u.perfil},${u.reputacao},${u.nivel},${u.saldo_pontos},"${u.localizacao || ''}",${u.data_cadastro},${u.ultimo_acesso || ''}\n`;
      }
      filename = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;

    } else if (type === 'transactions') {
      const transactions = await env.kudimu_db
        .prepare(`
          SELECT 
            pt.id,
            u.nome as usuario_nome,
            u.email as usuario_email,
            pt.tipo,
            pt.metodo_pagamento,
            pt.operadora,
            pt.valor_aoa,
            pt.status,
            pt.referencia_externa,
            pt.data_criacao,
            pt.data_processamento
          FROM payment_transactions pt
          JOIN users u ON pt.usuario_id = u.id
          ORDER BY pt.data_criacao DESC
        `)
        .all();

      csvData = 'ID,Usuario Nome,Usuario Email,Tipo,Metodo,Operadora,Valor AOA,Status,Referencia,Data Criacao,Data Processamento\n';
      for (const t of (transactions.results as any[])) {
        csvData += `${t.id},"${t.usuario_nome}","${t.usuario_email}",${t.tipo},${t.metodo_pagamento || ''},${t.operadora || ''},${t.valor_aoa},${t.status},"${t.referencia_externa || ''}",${t.data_criacao},${t.data_processamento || ''}\n`;
      }
      filename = `transacoes_${new Date().toISOString().split('T')[0]}.csv`;

    } else {
      return jsonResponse({ success: false, error: 'Tipo de exportação inválido. Use: campaigns, users ou transactions' }, 400);
    }

    return new Response(csvData, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error: any) {
    console.error('Erro ao exportar dados:', error);
    return jsonResponse({ success: false, error: 'Erro interno do servidor', details: error.message }, 500);
  }
}

// EXPORT

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return await handleRequest(request, env);
  }
};
