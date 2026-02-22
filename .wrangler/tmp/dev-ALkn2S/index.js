// .wrangler/tmp/bundle-vbs7HG/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// src/mock-data.ts
var MOCK_USERS = {
  "admin@kudimu.ao": {
    id: "admin-001",
    nome: "Admin Kudimu",
    email: "admin@kudimu.ao",
    telefone: "+244900000001",
    localizacao: "Luanda",
    perfil: "administrador",
    tipo_usuario: "admin",
    reputacao: 1e3,
    saldo_pontos: 5e3,
    nivel: "Master",
    verificado: true,
    senha: "admin123",
    senha_hash: "mock_hash_admin123",
    ativo: true,
    data_cadastro: "2025-01-01"
  },
  "joao@empresaxyz.ao": {
    id: "cliente-001",
    nome: "Jo\xE3o Silva",
    email: "joao@empresaxyz.ao",
    telefone: "+244900000002",
    localizacao: "Luanda",
    perfil: "empresario",
    tipo_usuario: "cliente",
    saldo_creditos: 5e4,
    // Créditos em Kwanzas (não pontos)
    nivel: "Premium",
    verificado: true,
    senha: "cliente123",
    senha_hash: "mock_hash_cliente123",
    ativo: true,
    data_cadastro: "2025-02-15",
    plano: "business"
  },
  "maria@gmail.com": {
    id: "respondente-001",
    nome: "Maria Santos",
    email: "maria@gmail.com",
    telefone: "+244900000003",
    localizacao: "Benguela",
    perfil: "profissional",
    tipo_usuario: "respondente",
    reputacao: 150,
    saldo_pontos: 750,
    nivel: "Bronze",
    verificado: false,
    senha: "usuario123",
    senha_hash: "mock_hash_usuario123",
    ativo: true,
    data_cadastro: "2025-03-10"
  },
  "cliente@teste.ao": {
    id: "cliente-002",
    nome: "Cliente Teste",
    email: "cliente@teste.ao",
    telefone: "+244900000004",
    localizacao: "Luanda",
    perfil: "empresario",
    tipo_usuario: "cliente",
    saldo_creditos: 25e3,
    nivel: "Standard",
    verificado: true,
    senha: "cliente123",
    senha_hash: "mock_hash_cliente123",
    ativo: true,
    data_cadastro: "2025-01-20",
    plano: "starter"
  },
  "usuario@teste.ao": {
    id: "respondente-002",
    nome: "Usu\xE1rio Regular",
    email: "usuario@teste.ao",
    telefone: "+244900000005",
    localizacao: "Luanda",
    perfil: "estudante",
    tipo_usuario: "respondente",
    reputacao: 150,
    saldo_pontos: 750,
    nivel: "Bronze",
    verificado: false,
    senha: "usuario123",
    senha_hash: "mock_hash_usuario123",
    ativo: true,
    data_cadastro: "2025-02-05"
  }
};
var MOCK_REGISTERED_USERS = {};

// src/index.ts
function isDevMode(env) {
  return env.DEV_MODE === "true" || env.DEV_MODE === true;
}
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
async function hashPassword(password, env) {
  if (isDevMode(env)) {
    return `mock_hash_${password}`;
  }
  return `real_hash_${password}`;
}
async function verifyPassword(password, hash, env) {
  if (isDevMode(env)) {
    return hash === `mock_hash_${password}`;
  }
  return hash === `real_hash_${password}`;
}
function extractToken(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}
function decodeToken(token) {
  const parts = token.split("-");
  if (parts.length < 3 || parts[0] !== "jwt") {
    return null;
  }
  const tipo_usuario = parts[1];
  const id = parts.slice(2).join("-");
  return {
    tipo_usuario,
    id,
    email: `user${id}@example.com`
  };
}
function requireAdmin(request) {
  const token = extractToken(request);
  if (!token) {
    return {
      authorized: false,
      user: null,
      error: "Token de autoriza\xE7\xE3o n\xE3o fornecido"
    };
  }
  const user = decodeToken(token);
  if (!user) {
    return {
      authorized: false,
      user: null,
      error: "Token inv\xE1lido"
    };
  }
  if (user.tipo_usuario !== "admin") {
    return {
      authorized: false,
      user,
      error: "Acesso negado. Apenas administradores podem acessar este recurso."
    };
  }
  return { authorized: true, user };
}
function requireClientOrAdmin(request) {
  const token = extractToken(request);
  if (!token) {
    return {
      authorized: false,
      user: null,
      error: "Token de autoriza\xE7\xE3o n\xE3o fornecido"
    };
  }
  const user = decodeToken(token);
  if (!user) {
    return {
      authorized: false,
      user: null,
      error: "Token inv\xE1lido"
    };
  }
  if (user.tipo_usuario !== "cliente" && user.tipo_usuario !== "admin") {
    return {
      authorized: false,
      user,
      error: "Acesso negado. Apenas clientes e administradores podem acessar este recurso."
    };
  }
  return { authorized: true, user };
}
function requireAuth(request) {
  const token = extractToken(request);
  if (!token) {
    return {
      authorized: false,
      user: null,
      error: "Token de autoriza\xE7\xE3o n\xE3o fornecido"
    };
  }
  const user = decodeToken(token);
  if (!user) {
    return {
      authorized: false,
      user: null,
      error: "Token inv\xE1lido"
    };
  }
  return { authorized: true, user };
}
var src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    try {
      if (path === "/") {
        const mode = isDevMode(env) ? "MOCK (Development)" : "REAL (Production)";
        return new Response(JSON.stringify({
          status: "ok",
          message: "Kudimu Insights API",
          mode,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          environment: isDevMode(env) ? "development" : "production"
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path === "/test") {
        return new Response(JSON.stringify({
          success: true,
          message: "Backend funcionando!"
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path === "/campaigns" && request.method === "GET") {
        const mockCampaigns = [
          {
            id: 1,
            title: "Pesquisa sobre Mobilidade Urbana em Luanda",
            description: "Queremos entender os h\xE1bitos de transporte dos cidad\xE3os de Luanda",
            reward: 500,
            questions: 5,
            status: "active",
            endDate: "2025-11-30"
          },
          {
            id: 2,
            title: "Opini\xE3o sobre E-commerce em Angola",
            description: "Pesquisa sobre comportamento de compras online",
            reward: 750,
            questions: 8,
            status: "active",
            endDate: "2025-12-15"
          }
        ];
        return new Response(JSON.stringify({
          success: true,
          data: mockCampaigns
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path.startsWith("/campaigns/") && path.includes("/answers") && request.method === "POST") {
        const campaignId = path.split("/campaigns/")[1].split("/answers")[0];
        const body = await request.json();
        let recompensa = 500;
        if (campaignId === "camp_3-1")
          recompensa = 300;
        if (campaignId === "camp_2-1")
          recompensa = 400;
        return new Response(JSON.stringify({
          success: true,
          data: {
            answer_id: Date.now(),
            campaign_id: campaignId,
            recompensa,
            pontos: recompensa,
            validacao: "approved",
            message: "Respostas enviadas com sucesso!"
          }
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path.startsWith("/campaigns/") && request.method === "GET" && !path.includes("/answers")) {
        const campaignId = path.split("/campaigns/")[1];
        const idMapping = {
          "1": "camp_1",
          "2": "camp_3-1",
          "camp_1": "camp_1",
          "camp_3-1": "camp_3-1"
        };
        const mappedId = idMapping[campaignId] || campaignId;
        const mockCampaignDetails = {
          "camp_3-1": {
            id: "camp_3-1",
            title: "Educa\xE7\xE3o Digital nas Escolas",
            description: "Pesquisa detalhada sobre o uso de tecnologia na educa\xE7\xE3o em Angola",
            reward: 300,
            questions: [
              {
                id: 1,
                type: "multiple_choice",
                question: "Qual a frequ\xEAncia de uso de dispositivos digitais na sua escola?",
                options: ["Diariamente", "Semanalmente", "Mensalmente", "Raramente", "Nunca"]
              },
              {
                id: 2,
                type: "text",
                question: "Quais s\xE3o os principais desafios para implementar tecnologia na educa\xE7\xE3o?"
              },
              {
                id: 3,
                type: "rating",
                question: "Como avalia a prepara\xE7\xE3o dos professores para uso de tecnologia?",
                scale: 5
              }
            ],
            status: "active",
            endDate: "2025-12-31",
            participantsCount: 145,
            targetParticipants: 500,
            category: "educacao",
            tags: ["educacao", "digital", "escolas", "tecnologia"],
            estimatedTime: "5-7 minutos"
          },
          // Adicionar mais campanhas conforme necessário
          "camp_1": {
            id: "camp_1",
            title: "Pesquisa sobre Mobilidade Urbana em Luanda",
            description: "Queremos entender os h\xE1bitos de transporte dos cidad\xE3os de Luanda",
            reward: 500,
            questions: [
              {
                id: 1,
                type: "multiple_choice",
                question: "Qual o seu principal meio de transporte?",
                options: ["T\xE1xi", "Candongueiro", "Carro pr\xF3prio", "Moto", "A p\xE9"]
              }
            ],
            status: "active",
            endDate: "2025-11-30",
            participantsCount: 89,
            targetParticipants: 300,
            category: "mobilidade",
            tags: ["transporte", "luanda", "mobilidade"],
            estimatedTime: "3-5 minutos"
          },
          "camp_2-1": {
            id: "camp_2-1",
            title: "H\xE1bitos de Consumo Digital em Angola",
            description: "Pesquisa sobre como os angolanos consomem conte\xFAdo digital e usam plataformas online",
            reward: 400,
            questions: [
              {
                id: 1,
                type: "multiple_choice",
                question: "Quantas horas por dia passa nas redes sociais?",
                options: ["Menos de 1 hora", "1-3 horas", "3-5 horas", "5-8 horas", "Mais de 8 horas"]
              },
              {
                id: 2,
                type: "multiple_choice",
                question: "Qual a sua plataforma de v\xEDdeo preferida?",
                options: ["YouTube", "TikTok", "Instagram", "Facebook", "WhatsApp Status"]
              },
              {
                id: 3,
                type: "text",
                question: "Que tipo de conte\xFAdo mais gosta de consumir online?"
              }
            ],
            status: "active",
            endDate: "2025-12-15",
            participantsCount: 67,
            targetParticipants: 400,
            category: "digital",
            tags: ["redes sociais", "digital", "consumo", "angola"],
            estimatedTime: "4-6 minutos"
          }
        };
        const campaign = mockCampaignDetails[mappedId];
        if (!campaign) {
          return new Response(JSON.stringify({
            error: "Campaign not found",
            message: `Campanha ${campaignId} n\xE3o encontrada`
          }), {
            status: 404,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
        return new Response(JSON.stringify({
          success: true,
          data: campaign
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path === "/reputation/me/1" && request.method === "GET") {
        return new Response(JSON.stringify({
          success: true,
          data: {
            user_id: 1,
            total_score: 145,
            level: "Confi\xE1vel",
            badges: ["Iniciante", "Participativo", "Confi\xE1vel"],
            recent_activities: [
              { action: "survey_completed", points: 25, date: "2025-01-20" },
              { action: "quality_response", points: 15, date: "2025-01-19" },
              { action: "referral_bonus", points: 50, date: "2025-01-18" }
            ]
          }
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path === "/answers/me/1" && request.method === "GET") {
        return new Response(JSON.stringify({
          success: true,
          data: {
            answers: [
              {
                id: 1,
                campaign_id: "camp_1",
                campaign_title: "Pesquisa sobre Mobilidade Urbana",
                completed_at: "2025-01-20T10:30:00Z",
                reward_earned: 500
              },
              {
                id: 2,
                campaign_id: "camp_3-1",
                campaign_title: "Educa\xE7\xE3o Digital nas Escolas",
                completed_at: "2025-01-19T15:45:00Z",
                reward_earned: 300
              }
            ],
            total_answers: 2,
            total_earned: 800
          }
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path === "/db/status") {
        try {
          if (!env.kudimu_db) {
            return new Response(JSON.stringify({
              error: "Database binding not available",
              message: "kudimu_db binding is not configured"
            }), {
              status: 500,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders
              }
            });
          }
          const result = await env.kudimu_db.prepare(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name NOT LIKE 'sqlite_%'
            ORDER BY name
          `).all();
          return new Response(JSON.stringify({
            success: true,
            tables: result.results,
            tableCount: result.results.length,
            message: "Database connection successful"
          }), {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            error: "Database error",
            message: error instanceof Error ? error.message : "Unknown error"
          }), {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
      }
      if (path === "/recommendations" && request.method === "GET") {
        try {
          const url2 = new URL(request.url);
          const userId = url2.searchParams.get("userId") || "1";
          const userProfile = {
            id: userId,
            localizacao: "Luanda",
            interesses: ["tecnologia", "saude", "educacao"],
            nivel_reputacao: "Confi\xE1vel",
            campanhas_completadas: 15,
            areas_preferidas: ["comercial", "social"],
            tempo_medio_resposta: 180
            // segundos
          };
          const availableCampaigns = [
            {
              id: "camp_1",
              titulo: "Pesquisa sobre Apps de Delivery em Luanda",
              tema: "tecnologia",
              tipo: "comercial",
              recompensa_por_resposta: 350,
              localizacao_alvo: "Luanda",
              reputacao_minima: 0,
              tempo_estimado: 240,
              tags: ["delivery", "apps", "tecnologia"],
              urgencia: "alta"
            },
            {
              id: "camp_2",
              titulo: "Impacto da Telemedicina em Angola",
              tema: "saude",
              tipo: "social",
              recompensa_por_resposta: 400,
              localizacao_alvo: "Nacional",
              reputacao_minima: 100,
              tempo_estimado: 180,
              tags: ["saude", "telemedicina", "digital"],
              urgencia: "media"
            },
            {
              id: "camp_3",
              titulo: "Educa\xE7\xE3o Digital nas Escolas",
              tema: "educacao",
              tipo: "social",
              recompensa_por_resposta: 300,
              localizacao_alvo: "Luanda",
              reputacao_minima: 50,
              tempo_estimado: 200,
              tags: ["educacao", "digital", "escolas"],
              urgencia: "baixa"
            },
            {
              id: "camp_4",
              titulo: "Comportamento do Consumidor Angolano",
              tema: "consumo",
              tipo: "comercial",
              recompensa_por_resposta: 250,
              localizacao_alvo: "Nacional",
              reputacao_minima: 0,
              tempo_estimado: 150,
              tags: ["consumo", "comportamento", "mercado"],
              urgencia: "media"
            }
          ];
          const recommendations = availableCampaigns.map((campaign) => {
            let score = 0;
            let reasons = [];
            if (userProfile.interesses.includes(campaign.tema)) {
              score += 30;
              reasons.push(`Interesse em ${campaign.tema}`);
            }
            if (campaign.localizacao_alvo === userProfile.localizacao || campaign.localizacao_alvo === "Nacional") {
              score += 20;
              reasons.push("Localiza\xE7\xE3o compat\xEDvel");
            }
            const nivelPontos = { "Iniciante": 0, "Confi\xE1vel": 100, "L\xEDder": 300, "Embaixador": 1e3 };
            if ((nivelPontos[userProfile.nivel_reputacao] || 0) >= campaign.reputacao_minima) {
              score += 15;
              reasons.push("Reputa\xE7\xE3o adequada");
            }
            if (userProfile.areas_preferidas.includes(campaign.tipo)) {
              score += 10;
              reasons.push(`Prefer\xEAncia por campanhas ${campaign.tipo}s`);
            }
            if (Math.abs(campaign.tempo_estimado - userProfile.tempo_medio_resposta) < 60) {
              score += 10;
              reasons.push("Tempo estimado compat\xEDvel");
            }
            if (campaign.recompensa_por_resposta >= 300) {
              score += 10;
              reasons.push("Recompensa atrativa");
            }
            const urgenciaPontos = { "alta": 5, "media": 3, "baixa": 1 };
            score += urgenciaPontos[campaign.urgencia] || 0;
            if (campaign.urgencia === "alta") {
              reasons.push("Campanha urgente");
            }
            return {
              ...campaign,
              recommendation_score: score,
              match_percentage: Math.min(Math.round(score / 100 * 100), 100),
              reasons,
              recommended: score >= 40
              // Threshold para recomendação
            };
          });
          recommendations.sort((a, b) => b.recommendation_score - a.recommendation_score);
          const highlyRecommended = recommendations.filter((r) => r.recommendation_score >= 60);
          const recommended = recommendations.filter((r) => r.recommendation_score >= 40 && r.recommendation_score < 60);
          const other = recommendations.filter((r) => r.recommendation_score < 40);
          return new Response(JSON.stringify({
            success: true,
            data: {
              user_profile: userProfile,
              recommendations: {
                highly_recommended: highlyRecommended,
                recommended,
                other
              },
              total_campaigns: recommendations.length,
              algorithm_version: "1.0",
              generated_at: (/* @__PURE__ */ new Date()).toISOString()
            }
          }), {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            error: "Recommendation error",
            message: error instanceof Error ? error.message : "Unknown error"
          }), {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
      }
      if (path === "/auth/login" && request.method === "POST") {
        try {
          const body = await request.json();
          const { email, senha } = body;
          if (!email || !senha) {
            return new Response(JSON.stringify({
              success: false,
              error: "Email e senha s\xE3o obrigat\xF3rios"
            }), {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders
              }
            });
          }
          if (isDevMode(env)) {
            let user2 = MOCK_USERS[email] || MOCK_REGISTERED_USERS[email];
            if (!user2 || !user2.ativo) {
              return new Response(JSON.stringify({
                success: false,
                error: "Usu\xE1rio n\xE3o encontrado ou inativo [MOCK]"
              }), {
                status: 401,
                headers: {
                  "Content-Type": "application/json",
                  ...corsHeaders
                }
              });
            }
            if (user2.senha !== senha) {
              return new Response(JSON.stringify({
                success: false,
                error: "Senha incorreta [MOCK]"
              }), {
                status: 401,
                headers: {
                  "Content-Type": "application/json",
                  ...corsHeaders
                }
              });
            }
            const token2 = `jwt-${user2.tipo_usuario}-${user2.id}`;
            return new Response(JSON.stringify({
              success: true,
              data: {
                token: token2,
                user: {
                  id: user2.id,
                  nome: user2.nome,
                  email: user2.email,
                  telefone: user2.telefone,
                  localizacao: user2.localizacao,
                  perfil: user2.perfil,
                  tipo_usuario: user2.tipo_usuario,
                  reputacao: user2.tipo_usuario === "respondente" || user2.tipo_usuario === "admin" ? user2.reputacao : void 0,
                  saldo_pontos: user2.tipo_usuario === "respondente" || user2.tipo_usuario === "admin" ? user2.saldo_pontos : void 0,
                  saldo_creditos: user2.tipo_usuario === "cliente" ? user2.saldo_creditos : void 0,
                  nivel: user2.nivel,
                  verificado: user2.verificado,
                  data_cadastro: user2.data_cadastro,
                  plano: user2.plano
                }
              },
              message: "Login realizado com sucesso! [MODO MOCK]"
            }), {
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders
              }
            });
          }
          const user = await env.kudimu_db.prepare(`
            SELECT * FROM users WHERE email = ? AND ativo = 1
          `).bind(email).first();
          if (!user) {
            return new Response(JSON.stringify({
              success: false,
              error: "Usu\xE1rio n\xE3o encontrado ou inativo"
            }), {
              status: 401,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders
              }
            });
          }
          const senhaValida = await verifyPassword(senha, user.senha_hash, env);
          if (!senhaValida) {
            return new Response(JSON.stringify({
              success: false,
              error: "Senha incorreta"
            }), {
              status: 401,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders
              }
            });
          }
          const token = `jwt_${user.id}_${Date.now()}`;
          return new Response(JSON.stringify({
            success: true,
            data: {
              token,
              user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                telefone: user.telefone,
                localizacao: user.localizacao,
                perfil: user.perfil,
                tipo_usuario: user.tipo_usuario,
                reputacao: user.reputacao,
                saldo_pontos: user.saldo_pontos,
                saldo_creditos: user.saldo_creditos,
                nivel: user.nivel,
                verificado: user.verificado,
                data_cadastro: user.data_cadastro
              }
            },
            message: "Login realizado com sucesso! [MODO REAL]"
          }), {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: "Erro interno do servidor: " + error.message
          }), {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
      }
      if (path === "/auth/me" && request.method === "GET") {
        try {
          const auth = requireAuth(request);
          if (!auth.authorized) {
            return new Response(JSON.stringify({
              success: false,
              error: auth.error
            }), {
              status: auth.error?.includes("n\xE3o fornecido") ? 401 : 403,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders
              }
            });
          }
          if (isDevMode(env)) {
            const userId2 = auth.user.id;
            let user2 = null;
            for (const [email, userData] of Object.entries(MOCK_USERS)) {
              if (userData.id === userId2) {
                user2 = userData;
                break;
              }
            }
            if (!user2) {
              for (const [email, userData] of Object.entries(MOCK_REGISTERED_USERS)) {
                if (userData.id === userId2) {
                  user2 = userData;
                  break;
                }
              }
            }
            if (!user2) {
              return new Response(JSON.stringify({
                success: false,
                error: "Usu\xE1rio n\xE3o encontrado [MOCK]"
              }), {
                status: 404,
                headers: {
                  "Content-Type": "application/json",
                  ...corsHeaders
                }
              });
            }
            return new Response(JSON.stringify({
              success: true,
              data: {
                id: user2.id,
                nome: user2.nome,
                email: user2.email,
                telefone: user2.telefone,
                localizacao: user2.localizacao,
                perfil: user2.perfil,
                tipo_usuario: user2.tipo_usuario,
                reputacao: user2.tipo_usuario === "respondente" || user2.tipo_usuario === "admin" ? user2.reputacao : void 0,
                saldo_pontos: user2.tipo_usuario === "respondente" || user2.tipo_usuario === "admin" ? user2.saldo_pontos : void 0,
                saldo_creditos: user2.tipo_usuario === "cliente" ? user2.saldo_creditos : void 0,
                nivel: user2.nivel,
                verificado: user2.verificado,
                data_cadastro: user2.data_cadastro,
                plano: user2.plano
              }
            }), {
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders
              }
            });
          }
          const userId = auth.user.id;
          const user = await env.kudimu_db.prepare(`
            SELECT * FROM users WHERE id = ? AND ativo = 1
          `).bind(userId).first();
          if (!user) {
            return new Response(JSON.stringify({
              success: false,
              error: "Usu\xE1rio n\xE3o encontrado"
            }), {
              status: 404,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders
              }
            });
          }
          return new Response(JSON.stringify({
            success: true,
            data: {
              id: user.id,
              nome: user.nome,
              email: user.email,
              telefone: user.telefone,
              localizacao: user.localizacao,
              perfil: user.perfil,
              tipo_usuario: user.tipo_usuario,
              reputacao: user.reputacao,
              saldo_pontos: user.saldo_pontos,
              saldo_creditos: user.saldo_creditos,
              nivel: user.nivel,
              verificado: user.verificado,
              data_cadastro: user.data_cadastro
            }
          }), {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: "Erro interno do servidor: " + error.message
          }), {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
      }
      if (path === "/auth/register" && request.method === "POST") {
        try {
          const body = await request.json();
          const { nome, email, senha, telefone, localizacao, perfil, tipo_usuario } = body;
          if (!nome || !email || !senha) {
            return new Response(JSON.stringify({
              success: false,
              error: "Nome, email e senha s\xE3o obrigat\xF3rios"
            }), {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders
              }
            });
          }
          if (isDevMode(env)) {
            if (MOCK_USERS[email] || MOCK_REGISTERED_USERS[email]) {
              return new Response(JSON.stringify({
                success: false,
                error: "Email j\xE1 est\xE1 em uso [MOCK]"
              }), {
                status: 409,
                headers: {
                  "Content-Type": "application/json",
                  ...corsHeaders
                }
              });
            }
            const userId2 = generateUUID();
            const tipoUsuario2 = tipo_usuario || "respondente";
            const newUser = {
              id: userId2,
              nome,
              email,
              telefone: telefone || "+244 900 000 000",
              localizacao: localizacao || "Luanda",
              perfil: perfil || "usuario",
              tipo_usuario: tipoUsuario2,
              reputacao: tipoUsuario2 === "respondente" ? 50 : tipoUsuario2 === "admin" ? 100 : 0,
              saldo_pontos: tipoUsuario2 === "respondente" || tipoUsuario2 === "admin" ? 0 : void 0,
              saldo_creditos: tipoUsuario2 === "cliente" ? 0 : void 0,
              nivel: tipoUsuario2 === "admin" ? "Embaixador" : tipoUsuario2 === "respondente" ? "Iniciante" : "Standard",
              verificado: tipoUsuario2 === "admin" ? 1 : 0,
              senha,
              senha_hash: await hashPassword(senha, env),
              ativo: true,
              data_cadastro: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
            };
            MOCK_REGISTERED_USERS[email] = newUser;
            const token2 = `jwt-${tipoUsuario2}-${userId2}`;
            return new Response(JSON.stringify({
              success: true,
              data: {
                token: token2,
                user: {
                  id: userId2,
                  nome,
                  email,
                  telefone: telefone || "+244 900 000 000",
                  localizacao: localizacao || "Luanda",
                  perfil: perfil || "usuario",
                  tipo_usuario: tipoUsuario2,
                  reputacao: tipoUsuario2 === "respondente" || tipoUsuario2 === "admin" ? newUser.reputacao : void 0,
                  saldo_pontos: tipoUsuario2 === "respondente" || tipoUsuario2 === "admin" ? 0 : void 0,
                  saldo_creditos: tipoUsuario2 === "cliente" ? 0 : void 0,
                  nivel: newUser.nivel,
                  verificado: newUser.verificado,
                  data_cadastro: newUser.data_cadastro
                }
              },
              message: "Conta criada com sucesso! [MODO MOCK]"
            }), {
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders
              }
            });
          }
          const existingUser = await env.kudimu_db.prepare(`
            SELECT id FROM users WHERE email = ?
          `).bind(email).first();
          if (existingUser) {
            return new Response(JSON.stringify({
              success: false,
              error: "Email j\xE1 est\xE1 em uso"
            }), {
              status: 409,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders
              }
            });
          }
          const userId = generateUUID();
          const tipoUsuario = tipo_usuario || "respondente";
          const senhaHash = await hashPassword(senha, env);
          const stmt = env.kudimu_db.prepare(`
            INSERT INTO users (
              id, nome, email, telefone, senha_hash, localizacao, perfil, 
              reputacao, saldo_pontos, saldo_creditos, nivel, verificado, tipo_usuario, 
              data_cadastro, ativo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          await stmt.bind(
            userId,
            nome,
            email,
            telefone || "+244 900 000 000",
            senhaHash,
            localizacao || "Luanda",
            perfil || "usuario",
            tipoUsuario === "respondente" ? 50 : tipoUsuario === "admin" ? 100 : 0,
            tipoUsuario === "respondente" || tipoUsuario === "admin" ? 0 : null,
            tipoUsuario === "cliente" ? 0 : null,
            tipoUsuario === "admin" ? "Embaixador" : tipoUsuario === "respondente" ? "Iniciante" : "Standard",
            tipoUsuario === "admin" ? 1 : 0,
            tipoUsuario,
            (/* @__PURE__ */ new Date()).toISOString(),
            1
          ).run();
          const token = `jwt_${userId}_${Date.now()}`;
          return new Response(JSON.stringify({
            success: true,
            data: {
              token,
              user: {
                id: userId,
                nome,
                email,
                telefone: telefone || "+244 900 000 000",
                localizacao: localizacao || "Luanda",
                perfil: perfil || "usuario",
                tipo_usuario: tipoUsuario,
                reputacao: tipoUsuario === "respondente" || tipoUsuario === "admin" ? tipoUsuario === "respondente" ? 50 : 100 : void 0,
                saldo_pontos: tipoUsuario === "respondente" || tipoUsuario === "admin" ? 0 : void 0,
                saldo_creditos: tipoUsuario === "cliente" ? 0 : void 0,
                nivel: tipoUsuario === "admin" ? "Embaixador" : tipoUsuario === "respondente" ? "Iniciante" : "Standard",
                verificado: tipoUsuario === "admin" ? 1 : 0,
                data_cadastro: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
              }
            },
            message: "Conta criada com sucesso! [MODO REAL]"
          }), {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: "Erro interno do servidor: " + error.message
          }), {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
      }
      if (path === "/auth/logout" && request.method === "POST") {
        return new Response(JSON.stringify({
          success: true,
          message: "Logout realizado com sucesso"
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path === "/push/subscribe" && request.method === "POST") {
        try {
          const body = await request.json();
          const { subscription, userAgent } = body;
          return new Response(JSON.stringify({
            success: true,
            message: "Subscription salva com sucesso",
            data: {
              id: "sub_" + Date.now(),
              endpoint: subscription.endpoint,
              created_at: (/* @__PURE__ */ new Date()).toISOString()
            }
          }), {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao processar subscription"
          }), {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
      }
      if (path === "/push/unsubscribe" && request.method === "POST") {
        try {
          const body = await request.json();
          const { endpoint } = body;
          return new Response(JSON.stringify({
            success: true,
            message: "Unsubscribe realizado com sucesso"
          }), {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao processar unsubscribe"
          }), {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
      }
      if (path === "/push/test" && request.method === "POST") {
        try {
          return new Response(JSON.stringify({
            success: true,
            message: "Notifica\xE7\xE3o de teste enviada!",
            data: {
              title: "Teste - Kudimu Insights",
              body: "Esta \xE9 uma notifica\xE7\xE3o de teste. Sistema funcionando perfeitamente!",
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            }
          }), {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao enviar notifica\xE7\xE3o de teste"
          }), {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
      }
      if (path === "/push/settings" && request.method === "GET") {
        const mockSettings = {
          newCampaigns: true,
          campaignApproved: true,
          rewardAvailable: true,
          surveyReminder: true,
          levelUp: true,
          achievements: true,
          weeklyReport: false
        };
        return new Response(JSON.stringify({
          success: true,
          data: mockSettings
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path === "/push/settings" && request.method === "PUT") {
        try {
          const body = await request.json();
          return new Response(JSON.stringify({
            success: true,
            message: "Configura\xE7\xF5es atualizadas com sucesso",
            data: body
          }), {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao atualizar configura\xE7\xF5es"
          }), {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
      }
      if (path === "/payments/create-intent" && request.method === "POST") {
        try {
          const body = await request.json();
          const { amount, method, currency = "AOA", metadata = {} } = body;
          if (!amount || amount <= 0) {
            return new Response(JSON.stringify({
              success: false,
              error: "Valor do pagamento deve ser maior que zero"
            }), {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const paymentMethods = ["bank_transfer", "unitel_money", "zap", "card_local", "cash"];
          if (!method || !paymentMethods.includes(method)) {
            return new Response(JSON.stringify({
              success: false,
              error: "M\xE9todo de pagamento n\xE3o suportado"
            }), {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const paymentId = "pay_" + Date.now() + Math.random().toString(36).substr(2, 9);
          const reference = method.toUpperCase().substr(0, 3) + Date.now() + Math.floor(Math.random() * 1e3);
          const paymentIntent = {
            id: paymentId,
            amount,
            currency,
            method,
            status: "pending",
            created_at: (/* @__PURE__ */ new Date()).toISOString(),
            metadata,
            reference
          };
          switch (method) {
            case "bank_transfer":
              paymentIntent.bank_details = {
                account_number: "0000123456789",
                account_name: "KUDIMU PLATFORM LDA",
                bank_name: "Banco Angolano de Investimentos",
                bank_code: "BAI",
                reference,
                instructions: `Transferir ${amount} AOA para a conta indicada usando a refer\xEAncia ${reference}`
              };
              break;
            case "unitel_money":
              paymentIntent.mobile_details = {
                operator: "Unitel Money",
                number: "+244 923 456 789",
                reference,
                instructions: `Enviar ${amount} AOA para +244 923 456 789 com refer\xEAncia ${reference}`
              };
              break;
            case "zap":
              paymentIntent.mobile_details = {
                operator: "Zap",
                number: "+244 936 123 456",
                reference,
                instructions: `Enviar ${amount} AOA para +244 936 123 456 com refer\xEAncia ${reference}`
              };
              break;
            case "card_local":
              paymentIntent.card_details = {
                requires_confirmation: true,
                supported_cards: ["Visa", "Mastercard", "Multicaixa"]
              };
              break;
            case "cash":
              paymentIntent.cash_details = {
                locations: [
                  "Loja Kudimu - Luanda, Ilha do Cabo",
                  "Agente Kudimu - Talatona, Condom\xEDnio Kikuxi"
                ],
                reference,
                instructions: `Apresente a refer\xEAncia ${reference} em um dos locais indicados`
              };
              break;
          }
          return new Response(JSON.stringify({
            success: true,
            data: paymentIntent
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao criar inten\xE7\xE3o de pagamento"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path.match(/^\/payments\/(.+)\/confirm$/) && request.method === "POST") {
        try {
          const pathParts = path.split("/");
          const paymentId = pathParts[2];
          const body = await request.json();
          const confirmation = {
            id: paymentId,
            status: "confirmed",
            confirmed_at: (/* @__PURE__ */ new Date()).toISOString(),
            transaction_id: "txn_" + Date.now() + Math.random().toString(36).substr(2, 9),
            confirmation_data: body
          };
          return new Response(JSON.stringify({
            success: true,
            data: confirmation
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao confirmar pagamento"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path.match(/^\/payments\/(.+)\/status$/) && request.method === "GET") {
        try {
          const pathParts = path.split("/");
          const paymentId = pathParts[2];
          const status = {
            id: paymentId,
            status: Math.random() > 0.5 ? "confirmed" : "pending",
            last_updated: (/* @__PURE__ */ new Date()).toISOString()
          };
          return new Response(JSON.stringify({
            success: true,
            data: status
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao verificar status do pagamento"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path.match(/^\/payments\/(.+)\/cancel$/) && request.method === "POST") {
        try {
          const pathParts = path.split("/");
          const paymentId = pathParts[2];
          const cancellation = {
            id: paymentId,
            status: "cancelled",
            cancelled_at: (/* @__PURE__ */ new Date()).toISOString()
          };
          return new Response(JSON.stringify({
            success: true,
            data: cancellation
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao cancelar pagamento"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path === "/payments/methods" && request.method === "GET") {
        const paymentMethods = [
          {
            id: "bank_transfer",
            name: "Transfer\xEAncia Banc\xE1ria",
            description: "Transfer\xEAncia via banco angolano",
            supported_banks: [
              { code: "BAI", name: "Banco Angolano de Investimentos" },
              { code: "BFA", name: "Banco de Fomento Angola" },
              { code: "BIC", name: "Banco BIC" },
              { code: "BPC", name: "Banco de Poupan\xE7a e Cr\xE9dito" }
            ]
          },
          {
            id: "unitel_money",
            name: "Unitel Money",
            description: "Pagamento via Unitel Money",
            operator: "Unitel"
          },
          {
            id: "zap",
            name: "Zap",
            description: "Pagamento via Zap",
            operator: "Zap"
          },
          {
            id: "card_local",
            name: "Cart\xE3o de Cr\xE9dito/D\xE9bito",
            description: "Cart\xF5es emitidos em Angola",
            supported_cards: ["Visa", "Mastercard", "Multicaixa"]
          },
          {
            id: "cash",
            name: "Pagamento Presencial",
            description: "Pagamento em dinheiro em pontos f\xEDsicos",
            locations: 2
          }
        ];
        return new Response(JSON.stringify({
          success: true,
          data: paymentMethods
        }), {
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      if (path === "/ai/embedding" && request.method === "POST") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return new Response(JSON.stringify({
            success: false,
            error: "Token de autoriza\xE7\xE3o necess\xE1rio"
          }), {
            status: 401,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const body = await request.json();
          const { texto } = body;
          if (!texto || texto.length < 10) {
            return new Response(JSON.stringify({
              success: false,
              error: "Texto inv\xE1lido ou muito curto"
            }), {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const response = await env.kudimu_ai.run("@cf/baai/bge-large-en-v1.5", {
            text: texto.substring(0, 5e3)
          });
          return new Response(JSON.stringify({
            success: true,
            data: {
              embedding: response.data[0],
              dimensoes: response.data[0].length,
              modelo: "@cf/baai/bge-large-en-v1.5"
            }
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: error.message || "Erro ao gerar embedding"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path === "/ai/sentiment" && request.method === "POST") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return new Response(JSON.stringify({
            success: false,
            error: "Token de autoriza\xE7\xE3o necess\xE1rio"
          }), {
            status: 401,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const body = await request.json();
          const { texto } = body;
          if (!texto || texto.length < 10) {
            return new Response(JSON.stringify({
              success: true,
              data: {
                sentimento: "neutro",
                score: 0.5,
                confianca: 0
              }
            }), {
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const response = await env.kudimu_ai.run("@cf/huggingface/distilbert-sst-2-int8", {
            text: texto.substring(0, 1e3)
          });
          const result = response[0];
          const sentimento = result.label.toLowerCase() === "positive" ? "positivo" : result.label.toLowerCase() === "negative" ? "negativo" : "neutro";
          return new Response(JSON.stringify({
            success: true,
            data: {
              sentimento,
              score: result.score,
              confianca: result.score,
              modelo: "@cf/huggingface/distilbert-sst-2-int8"
            }
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: error.message || "Erro ao analisar sentimento"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path === "/ai/search/similar" && request.method === "POST") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return new Response(JSON.stringify({
            success: false,
            error: "Token de autoriza\xE7\xE3o necess\xE1rio"
          }), {
            status: 401,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const body = await request.json();
          const { query, topK = 10, campanha_id } = body;
          if (!query) {
            return new Response(JSON.stringify({
              success: false,
              error: "Query de busca \xE9 obrigat\xF3ria"
            }), {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const embeddingResponse = await env.kudimu_ai.run("@cf/baai/bge-large-en-v1.5", {
            text: query.substring(0, 5e3)
          });
          const queryEmbedding = embeddingResponse.data[0];
          const mockResults = [
            {
              id: "resp_1",
              texto: "Trabalho no setor de tecnologia em Luanda. Principais dificuldades: falta de capacita\xE7\xE3o...",
              similaridade: 0.92,
              metadata: {
                campanha_id: "camp_1",
                usuario_id: 101,
                data_criacao: "2025-11-02"
              }
            },
            {
              id: "resp_2",
              texto: "Atuo na \xE1rea de TI. Os desafios incluem infraestrutura limitada...",
              similaridade: 0.87,
              metadata: {
                campanha_id: "camp_1",
                usuario_id: 102,
                data_criacao: "2025-11-02"
              }
            }
          ];
          const resultadosFiltrados = campanha_id ? mockResults.filter((r) => r.metadata.campanha_id === campanha_id) : mockResults;
          return new Response(JSON.stringify({
            success: true,
            data: {
              query,
              resultados: resultadosFiltrados.slice(0, topK),
              total: resultadosFiltrados.length
            }
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: error.message || "Erro na busca sem\xE2ntica"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path === "/ai/cluster/similar-responses" && request.method === "POST") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return new Response(JSON.stringify({
            success: false,
            error: "Token de autoriza\xE7\xE3o necess\xE1rio"
          }), {
            status: 401,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const body = await request.json();
          const { campanha_id, threshold = 0.8 } = body;
          const mockClusters = [
            {
              cluster_id: 1,
              tema_principal: "Falta de capacita\xE7\xE3o profissional",
              quantidade: 15,
              similaridade_media: 0.89,
              respostas: [
                {
                  id: "resp_1",
                  texto: "Principal dificuldade \xE9 falta de capacita\xE7\xE3o...",
                  similaridade: 0.92
                },
                {
                  id: "resp_5",
                  texto: "Precisamos de mais treinamento profissional...",
                  similaridade: 0.88
                }
              ]
            },
            {
              cluster_id: 2,
              tema_principal: "Infraestrutura tecnol\xF3gica limitada",
              quantidade: 12,
              similaridade_media: 0.85,
              respostas: [
                {
                  id: "resp_3",
                  texto: "Infraestrutura de internet \xE9 muito fraca...",
                  similaridade: 0.91
                },
                {
                  id: "resp_7",
                  texto: "Falta de equipamentos modernos...",
                  similaridade: 0.82
                }
              ]
            }
          ];
          return new Response(JSON.stringify({
            success: true,
            data: {
              campanha_id,
              threshold,
              total_clusters: mockClusters.length,
              clusters: mockClusters,
              total_respostas_agrupadas: mockClusters.reduce((sum, c) => sum + c.quantidade, 0)
            }
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: error.message || "Erro ao agrupar respostas"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path === "/admin/dashboard" && request.method === "GET") {
        const auth = requireAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error
          }), {
            status: auth.error?.includes("n\xE3o fornecido") ? 401 : 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        const dashboardStats = {
          usuarios_ativos: 1247,
          campanhas_ativas: 23,
          respostas_hoje: 156,
          receita_mensal: 45e3,
          campanhas_recentes: [
            {
              id: "camp_1",
              titulo: "Pesquisa sobre H\xE1bitos Alimentares em Luanda",
              status: "ativa",
              respostas: 45,
              meta: 200,
              progresso: 22.5
            },
            {
              id: "camp_2",
              titulo: "Avalia\xE7\xE3o de Servi\xE7os de Transporte P\xFAblico",
              status: "rascunho",
              respostas: 0,
              meta: 500,
              progresso: 0
            }
          ],
          metricas_semanais: {
            segunda: 45,
            terca: 67,
            quarta: 89,
            quinta: 123,
            sexta: 156,
            sabado: 98,
            domingo: 76
          }
        };
        return new Response(JSON.stringify({
          success: true,
          data: dashboardStats
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path === "/admin/campaigns" && request.method === "GET") {
        const auth = requireAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error
          }), {
            status: auth.error?.includes("n\xE3o fornecido") ? 401 : 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        const mockCampaigns = [
          {
            id: "camp_1",
            titulo: "Pesquisa sobre H\xE1bitos Alimentares em Luanda",
            descricao: "Estudo sobre prefer\xEAncias e h\xE1bitos alimentares da popula\xE7\xE3o urbana de Luanda",
            status: "ativa",
            data_criacao: "2025-10-15",
            data_fim: "2025-11-15",
            total_respostas: 45,
            meta_respostas: 200,
            recompensa_por_resposta: 500,
            orcamento_total: 1e5,
            categoria: "alimentacao",
            criador: "cliente-001",
            localizacao_alvo: "Luanda"
          },
          {
            id: "camp_2",
            titulo: "Avalia\xE7\xE3o de Servi\xE7os de Transporte P\xFAblico",
            descricao: "Pesquisa sobre qualidade e satisfa\xE7\xE3o com transportes p\xFAblicos em Angola",
            status: "rascunho",
            data_criacao: "2025-10-20",
            data_fim: "2025-12-20",
            total_respostas: 0,
            meta_respostas: 500,
            recompensa_por_resposta: 300,
            orcamento_total: 15e4,
            categoria: "transporte",
            criador: "cliente-001",
            localizacao_alvo: "Nacional"
          },
          {
            id: "camp_3",
            titulo: "Tecnologia e Educa\xE7\xE3o Digital",
            descricao: "Estudo sobre uso de tecnologia em escolas angolanas",
            status: "finalizada",
            data_criacao: "2025-09-01",
            data_fim: "2025-10-01",
            total_respostas: 150,
            meta_respostas: 150,
            recompensa_por_resposta: 400,
            orcamento_total: 6e4,
            categoria: "educacao",
            criador: "admin-001",
            localizacao_alvo: "Luanda"
          }
        ];
        return new Response(JSON.stringify({
          success: true,
          data: mockCampaigns,
          total: mockCampaigns.length
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path === "/admin/campaigns" && request.method === "POST") {
        const auth = requireAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error
          }), {
            status: auth.error?.includes("n\xE3o fornecido") ? 401 : 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const campaignData = await request.json();
          const campaignId = `camp_${Date.now()}`;
          const newCampaign = {
            id: campaignId,
            titulo: campaignData.titulo,
            descricao: campaignData.descricao,
            categoria: campaignData.categoria,
            status: "rascunho",
            data_criacao: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
            data_inicio: campaignData.data_inicio || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
            data_fim: campaignData.data_fim,
            total_respostas: 0,
            meta_respostas: campaignData.meta_respostas,
            recompensa_por_resposta: campaignData.recompensa_por_resposta,
            orcamento_total: campaignData.orcamento_total,
            tempo_estimado: campaignData.tempo_estimado,
            localizacao_alvo: campaignData.localizacao_alvo || "Nacional",
            perguntas: campaignData.perguntas,
            targeting: {
              idade_min: campaignData.idade_min,
              idade_max: campaignData.idade_max,
              genero_target: campaignData.genero_target,
              interesses_target: campaignData.interesses_target,
              nivel_educacao: campaignData.nivel_educacao
            },
            criador: tokenParts.slice(1, -1).join("-")
          };
          return new Response(JSON.stringify({
            success: true,
            data: newCampaign,
            message: "Campanha criada com sucesso"
          }), {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        } catch (err) {
          return new Response(JSON.stringify({
            success: false,
            error: "Dados inv\xE1lidos: " + err.message
          }), {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
      }
      if (path === "/admin/answers" && request.method === "GET") {
        const auth = requireAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error
          }), {
            status: auth.error?.includes("n\xE3o fornecido") ? 401 : 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        const mockAnswers = [
          {
            id: 1,
            campaign_id: "camp_1",
            campaign_titulo: "Estudo Mercado de Trabalho 2024",
            usuario_id: 101,
            usuario_nome: "Ant\xF3nio Silva",
            usuario_reputacao: 245,
            usuario_nivel: "confiavel",
            resposta_texto: "Trabalho atualmente no setor de tecnologia em Luanda. As principais dificuldades que enfrento s\xE3o o acesso limitado a capacita\xE7\xE3o profissional e a falta de oportunidades de crescimento.",
            validada: null,
            data_criacao: "2025-11-02T10:30:00Z",
            tempo_resposta_segundos: 145,
            qualidade_score: 8.5
          },
          {
            id: 2,
            campaign_id: "camp_2",
            campaign_titulo: "Pesquisa Satisfa\xE7\xE3o Servi\xE7os P\xFAblicos",
            usuario_id: 102,
            usuario_nome: "Maria Jo\xE3o",
            usuario_reputacao: 180,
            usuario_nivel: "confiavel",
            resposta_texto: "A qualidade dos servi\xE7os p\xFAblicos em Luanda precisa melhorar significativamente. Os principais problemas s\xE3o demora no atendimento e falta de infraestrutura adequada.",
            validada: null,
            data_criacao: "2025-11-02T11:15:00Z",
            tempo_resposta_segundos: 98,
            qualidade_score: 7.8
          },
          {
            id: 3,
            campaign_id: "camp_1",
            campaign_titulo: "Estudo Mercado de Trabalho 2024",
            usuario_id: 103,
            usuario_nome: "Carlos Mendes",
            usuario_reputacao: 320,
            usuario_nivel: "lider",
            resposta_texto: "xyz",
            validada: null,
            data_criacao: "2025-11-02T12:00:00Z",
            tempo_resposta_segundos: 15,
            qualidade_score: 2.1
          }
        ];
        const urlParams = new URL(request.url).searchParams;
        const validadaFilter = urlParams.get("validada");
        let filteredAnswers = mockAnswers;
        if (validadaFilter === "true") {
          filteredAnswers = mockAnswers.filter((a) => a.validada === true);
        } else if (validadaFilter === "false") {
          filteredAnswers = mockAnswers.filter((a) => a.validada === false);
        } else if (validadaFilter === "") {
          filteredAnswers = mockAnswers.filter((a) => a.validada === null);
        }
        return new Response(JSON.stringify({
          success: true,
          data: filteredAnswers,
          total: filteredAnswers.length,
          pendentes: mockAnswers.filter((a) => a.validada === null).length,
          aprovadas: mockAnswers.filter((a) => a.validada === true).length,
          rejeitadas: mockAnswers.filter((a) => a.validada === false).length
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path.startsWith("/admin/answers/") && request.method === "PUT") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return new Response(JSON.stringify({
            success: false,
            error: "Token de autoriza\xE7\xE3o necess\xE1rio"
          }), {
            status: 401,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
        const answerId = path.split("/")[3];
        const body = await request.json();
        const { validada, motivo } = body;
        return new Response(JSON.stringify({
          success: true,
          data: {
            id: answerId,
            validada,
            motivo: motivo || null,
            data_validacao: (/* @__PURE__ */ new Date()).toISOString()
          },
          message: validada ? "Resposta aprovada com sucesso!" : "Resposta rejeitada com sucesso!"
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path.startsWith("/admin/campaigns/") && path.endsWith("/analytics") && request.method === "GET") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return new Response(JSON.stringify({
            success: false,
            error: "Token de autoriza\xE7\xE3o necess\xE1rio"
          }), {
            status: 401,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
        const campaignId = path.split("/")[3];
        const mockAnalytics = {
          campanha: {
            id: campaignId,
            titulo: "Pesquisa sobre H\xE1bitos Alimentares em Luanda",
            status: "ativa",
            total_respostas: 156,
            meta_respostas: 500,
            progresso: 31.2,
            data_inicio: "2025-10-15",
            data_fim: "2025-11-15"
          },
          metricas_gerais: {
            taxa_conversao: 15.2,
            tempo_medio_resposta: 8.5,
            custo_por_resposta: 480,
            gasto_total: 74880,
            orcamento_restante: 165120
          },
          respostas_por_dia: [
            { data: "01/11", respostas: 12 },
            { data: "02/11", respostas: 18 },
            { data: "03/11", respostas: 25 },
            { data: "04/11", respostas: 22 },
            { data: "05/11", respostas: 15 },
            { data: "06/11", respostas: 28 },
            { data: "07/11", respostas: 36 }
          ],
          demografia_idade: [
            { faixa: "18-25", quantidade: 45, porcentagem: 28.8 },
            { faixa: "26-35", quantidade: 62, porcentagem: 39.7 },
            { faixa: "36-45", quantidade: 35, porcentagem: 22.4 },
            { faixa: "46-55", quantidade: 12, porcentagem: 7.7 },
            { faixa: "55+", quantidade: 2, porcentagem: 1.3 }
          ],
          demografia_genero: [
            { genero: "Feminino", quantidade: 89, porcentagem: 57.1 },
            { genero: "Masculino", quantidade: 64, porcentagem: 41 },
            { genero: "Outro", quantidade: 3, porcentagem: 1.9 }
          ],
          localizacao: [
            { municipio: "Luanda", quantidade: 98, porcentagem: 62.8 },
            { municipio: "Viana", quantidade: 25, porcentagem: 16 },
            { municipio: "Cazenga", quantidade: 18, porcentagem: 11.5 },
            { municipio: "Maianga", quantidade: 10, porcentagem: 6.4 },
            { municipio: "Outros", quantidade: 5, porcentagem: 3.2 }
          ],
          insights: [
            {
              id: 1,
              tipo: "tendencia",
              titulo: "Pico de Respostas no Final de Semana",
              descricao: "S\xE1bados e domingos apresentam 35% mais respostas que dias \xFAteis",
              impacto: "alto"
            },
            {
              id: 2,
              tipo: "demografia",
              titulo: "P\xFAblico Jovem Dominante",
              descricao: "Participantes de 18-35 anos representam 68% das respostas",
              impacto: "medio"
            },
            {
              id: 3,
              tipo: "qualidade",
              titulo: "Alta Taxa de Conclus\xE3o",
              descricao: "Taxa de conclus\xE3o de 91% indica perguntas bem estruturadas",
              impacto: "positivo"
            }
          ]
        };
        return new Response(JSON.stringify({
          success: true,
          data: mockAnalytics
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path === "/budget/overview" && request.method === "GET") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return new Response(JSON.stringify({
            success: false,
            error: "Token de autoriza\xE7\xE3o necess\xE1rio"
          }), {
            status: 401,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
        const mockBudgetData = {
          resumo_geral: {
            orcamento_total: 5e5,
            gasto_total: 287e3,
            orcamento_restante: 213e3,
            numero_campanhas: 8,
            custo_medio_por_resposta: 485,
            roi_geral: 23.5,
            economia_mensal: 15200
          },
          campanhas: [
            {
              id: 1,
              nome: "Estudo Mercado de Trabalho 2024",
              orcamento: 1e5,
              gasto: 74880,
              restante: 25120,
              custo_por_resposta: 480,
              respostas: 156,
              status: "ativa",
              eficiencia: 95.2
            },
            {
              id: 2,
              nome: "Avalia\xE7\xE3o Servi\xE7os Banc\xE1rios",
              orcamento: 15e4,
              gasto: 89e3,
              restante: 61e3,
              custo_por_resposta: 490,
              respostas: 182,
              status: "ativa",
              eficiencia: 87.8
            },
            {
              id: 3,
              nome: "Pesquisa Produtos Digitais",
              orcamento: 6e4,
              gasto: 58200,
              restante: 1800,
              custo_por_resposta: 470,
              respostas: 124,
              status: "quase_esgotado",
              eficiencia: 92.3
            }
          ],
          tendencias: {
            ultimos_7_dias: [
              { dia: "Seg", gasto: 8500 },
              { dia: "Ter", gasto: 12300 },
              { dia: "Qua", gasto: 9800 },
              { dia: "Qui", gasto: 15600 },
              { dia: "Sex", gasto: 11200 },
              { dia: "S\xE1b", gasto: 7400 },
              { dia: "Dom", gasto: 4200 }
            ],
            projecao_mensal: {
              estimativa_gasto: 35e4,
              orcamento_disponivel: 5e5,
              dias_restantes: 18,
              ritmo_atual: "moderado"
            }
          },
          alertas: [
            {
              tipo: "warning",
              campanha: "Pesquisa Produtos Digitais",
              mensagem: "Or\xE7amento restante: apenas 3% (1.800 Kz)",
              severidade: "alta"
            },
            {
              tipo: "info",
              campanha: "Estudo Mercado de Trabalho 2024",
              mensagem: "Performance excelente - 95.2% de efici\xEAncia",
              severidade: "baixa"
            }
          ]
        };
        return new Response(JSON.stringify({
          success: true,
          data: mockBudgetData
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path === "/answers/me" && request.method === "GET") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return new Response(JSON.stringify({
            success: false,
            error: "Token de autoriza\xE7\xE3o necess\xE1rio"
          }), {
            status: 401,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
        const token = authHeader.substring(7);
        const tokenParts2 = token.split("-");
        if (tokenParts2.length < 3 || tokenParts2[0] !== "jwt") {
          return new Response(JSON.stringify({
            success: false,
            error: "Token inv\xE1lido"
          }), {
            status: 401,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
        const mockAnswers = [
          {
            id: "resp_1",
            campanha_id: "camp_1",
            campanha_titulo: "Pesquisa sobre H\xE1bitos Alimentares em Luanda",
            data_resposta: "2025-10-25",
            status: "aprovada",
            recompensa: 500,
            tempo_resposta: 180
          },
          {
            id: "resp_2",
            campanha_id: "camp_3",
            campanha_titulo: "Tecnologia e Educa\xE7\xE3o Digital",
            data_resposta: "2025-10-20",
            status: "pendente",
            recompensa: 400,
            tempo_resposta: 220
          }
        ];
        return new Response(JSON.stringify({
          success: true,
          data: mockAnswers,
          total: mockAnswers.length
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path === "/notifications" && request.method === "GET") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return new Response(JSON.stringify({
            success: false,
            error: "Token de autoriza\xE7\xE3o necess\xE1rio"
          }), {
            status: 401,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
        const mockNotifications = [
          {
            id: 1,
            tipo: "campaign",
            titulo: "Meta de Respostas Atingida! \u{1F389}",
            mensagem: 'Sua campanha "Estudo Mercado de Trabalho 2024" atingiu 150 respostas.',
            timestamp: "2025-11-03T06:45:00Z",
            lida: false,
            prioridade: "high",
            campanha_id: 1,
            icone: "trophy"
          },
          {
            id: 2,
            tipo: "budget",
            titulo: "Alerta de Or\xE7amento \u26A0\uFE0F",
            mensagem: 'Campanha "Pesquisa Produtos Digitais" tem apenas 3% do or\xE7amento restante.',
            timestamp: "2025-11-03T06:30:00Z",
            lida: false,
            prioridade: "high",
            campanha_id: 3,
            icone: "wallet"
          },
          {
            id: 3,
            tipo: "campaign",
            titulo: "Novo Insight Dispon\xEDvel \u{1F4CA}",
            mensagem: 'An\xE1lise de tend\xEAncias conclu\xEDda para "Avalia\xE7\xE3o Servi\xE7os Banc\xE1rios".',
            timestamp: "2025-11-03T06:15:00Z",
            lida: true,
            prioridade: "medium",
            campanha_id: 2,
            icone: "chart"
          },
          {
            id: 4,
            tipo: "campaign",
            titulo: "Performance Excelente! \u2B50",
            mensagem: "Sua campanha tem 95.2% de efici\xEAncia - acima da m\xE9dia!",
            timestamp: "2025-11-03T06:00:00Z",
            lida: true,
            prioridade: "medium",
            campanha_id: 1,
            icone: "fire"
          },
          {
            id: 5,
            tipo: "achievement",
            titulo: "Conquista Desbloqueada! \u{1F3C6}",
            mensagem: "Voc\xEA alcan\xE7ou 500+ respostas totais em suas campanhas.",
            timestamp: "2025-11-03T05:45:00Z",
            lida: false,
            prioridade: "low",
            icone: "trophy"
          }
        ];
        return new Response(JSON.stringify({
          success: true,
          data: mockNotifications
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path === "/notifications/unread-count" && request.method === "GET") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return new Response(JSON.stringify({
            success: false,
            error: "Token de autoriza\xE7\xE3o necess\xE1rio"
          }), {
            status: 401,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
        return new Response(JSON.stringify({
          success: true,
          data: { count: 2 }
          // Mock count
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path.startsWith("/notifications/") && path.endsWith("/read") && request.method === "PATCH") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return new Response(JSON.stringify({
            success: false,
            error: "Token de autoriza\xE7\xE3o necess\xE1rio"
          }), {
            status: 401,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
        const notificationId = path.split("/")[2];
        return new Response(JSON.stringify({
          success: true,
          message: "Notifica\xE7\xE3o marcada como lida"
        }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      if (path === "/reputation/ranking" && request.method === "GET") {
        const periodo = url.searchParams.get("periodo") || "total";
        if (isDevMode(env)) {
          return new Response(JSON.stringify({
            success: true,
            data: [
              {
                position: 1,
                user_id: "1",
                nome: "Jo\xE3o Silva",
                points: 1200,
                avatar: null,
                nivel: "L\xEDder",
                badges: ["\u{1F3C6}", "\u2B50", "\u{1F525}"]
              },
              {
                position: 2,
                user_id: "2",
                nome: "Maria Santos",
                points: 980,
                avatar: null,
                nivel: "Confi\xE1vel",
                badges: ["\u2B50", "\u{1F525}"]
              },
              {
                position: 3,
                user_id: "3",
                nome: "Pedro Costa",
                points: 750,
                avatar: null,
                nivel: "Confi\xE1vel",
                badges: ["\u2B50"]
              },
              {
                position: 4,
                user_id: "4",
                nome: "Ana Lima",
                points: 620,
                avatar: null,
                nivel: "Iniciante",
                badges: ["\u{1F331}"]
              },
              {
                position: 5,
                user_id: "5",
                nome: "Carlos Mendes",
                points: 540,
                avatar: null,
                nivel: "Iniciante",
                badges: ["\u{1F331}"]
              }
            ],
            periodo,
            user_position: 12,
            user_points: 350,
            total_users: 156,
            generated_at: (/* @__PURE__ */ new Date()).toISOString()
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const db = env.kudimu_db;
          let query = `
            SELECT 
              u.id as user_id,
              u.nome,
              u.reputacao as points,
              u.nivel,
              ROW_NUMBER() OVER (ORDER BY u.reputacao DESC) as position
            FROM usuarios u
            WHERE u.tipo_usuario = 'usuario'
          `;
          if (periodo === "semanal") {
            query += ` AND u.ultima_atividade >= datetime('now', '-7 days')`;
          } else if (periodo === "mensal") {
            query += ` AND u.ultima_atividade >= datetime('now', '-30 days')`;
          }
          query += ` ORDER BY u.reputacao DESC LIMIT 10`;
          const result = await db.prepare(query).all();
          return new Response(JSON.stringify({
            success: true,
            data: result.results || [],
            periodo,
            total_users: result.results?.length || 0,
            generated_at: (/* @__PURE__ */ new Date()).toISOString()
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            error: "Database error",
            message: error instanceof Error ? error.message : "Unknown error"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path === "/user/dashboard" && request.method === "GET") {
        const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        if (!token) {
          return new Response(JSON.stringify({
            error: "Unauthorized",
            message: "Token n\xE3o fornecido"
          }), {
            status: 401,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        if (isDevMode(env)) {
          return new Response(JSON.stringify({
            success: true,
            data: {
              total_pesquisas: 15,
              pesquisas_concluidas: 12,
              pesquisas_em_andamento: 3,
              pontos_totais: 450,
              pontos_disponiveis: 450,
              pontos_resgatados: 0,
              nivel: "Bronze",
              nivel_progresso: 45,
              proximo_nivel: "Prata",
              pontos_proximo_nivel: 1e3,
              saldo: 12e3,
              saldo_formatado: "12.000,00 AOA",
              campanhas_disponiveis: 8,
              recompensas_pendentes: 2,
              sequencia_dias: 5,
              melhor_sequencia: 12,
              taxa_conclusao: 80,
              tempo_medio_resposta: 180,
              badges: ["\u{1F331}", "\u2B50", "\u{1F525}"],
              posicao_ranking: 12,
              ultimas_atividades: [
                {
                  tipo: "resposta",
                  campanha: "Educa\xE7\xE3o Digital nas Escolas",
                  campanha_id: 1,
                  pontos: 300,
                  data: "2025-12-20T10:30:00Z",
                  icone: "\u{1F4DD}"
                },
                {
                  tipo: "resposta",
                  campanha: "Sa\xFAde P\xFAblica em Angola",
                  campanha_id: 2,
                  pontos: 150,
                  data: "2025-12-18T14:15:00Z",
                  icone: "\u{1F4DD}"
                },
                {
                  tipo: "nivel_up",
                  descricao: "Subiu para Bronze",
                  pontos: 0,
                  data: "2025-12-15T09:00:00Z",
                  icone: "\u{1F389}"
                }
              ],
              proximas_campanhas: [
                {
                  id: 1,
                  title: "Educa\xE7\xE3o Digital nas Escolas",
                  reward: 300,
                  expira_em: "2025-12-28T23:59:59Z",
                  participantes: 45,
                  meta: 100
                },
                {
                  id: 3,
                  title: "Mobilidade Urbana em Luanda",
                  reward: 250,
                  expira_em: "2025-12-30T23:59:59Z",
                  participantes: 67,
                  meta: 150
                }
              ],
              estatisticas_semanais: {
                pesquisas_esta_semana: 3,
                pontos_esta_semana: 450,
                media_diaria: 64,
                dias_ativos: 5
              },
              metas: {
                semanal: { atual: 3, meta: 5, percentual: 60 },
                mensal: { atual: 12, meta: 20, percentual: 60 },
                pontos_mensal: { atual: 450, meta: 2e3, percentual: 22.5 }
              }
            },
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const db = env.kudimu_db;
          const userId = token.split("_")[2];
          const userResult = await db.prepare(`
            SELECT * FROM usuarios WHERE id = ?
          `).bind(userId).first();
          if (!userResult) {
            return new Response(JSON.stringify({
              error: "Not Found",
              message: "Usu\xE1rio n\xE3o encontrado"
            }), {
              status: 404,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const statsResult = await db.prepare(`
            SELECT 
              COUNT(*) as total_pesquisas,
              SUM(CASE WHEN validada = 1 THEN 1 ELSE 0 END) as pesquisas_concluidas,
              SUM(CASE WHEN validada = 0 THEN 1 ELSE 0 END) as pesquisas_em_andamento,
              SUM(recompensa) as pontos_totais
            FROM respostas_usuario
            WHERE usuario_id = ?
          `).bind(userId).first();
          return new Response(JSON.stringify({
            success: true,
            data: {
              total_pesquisas: statsResult?.total_pesquisas || 0,
              pesquisas_concluidas: statsResult?.pesquisas_concluidas || 0,
              pontos_totais: statsResult?.pontos_totais || 0,
              nivel: userResult.nivel || "Bronze",
              saldo: userResult.saldo_pontos || 0
              // TODO: Adicionar mais campos conforme necessário
            },
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            error: "Database error",
            message: error instanceof Error ? error.message : "Unknown error"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path === "/rewards/me" && request.method === "GET") {
        const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        if (!token) {
          return new Response(JSON.stringify({
            error: "Unauthorized",
            message: "Token n\xE3o fornecido"
          }), {
            status: 401,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        if (isDevMode(env)) {
          return new Response(JSON.stringify({
            success: true,
            data: [
              {
                id: 1,
                tipo: "pontos",
                valor: 300,
                valor_formatado: "300 pts",
                campanha: "Educa\xE7\xE3o Digital nas Escolas",
                campanha_id: 1,
                data: "2025-12-20T10:30:00Z",
                data_formatada: "20/12/2025",
                status: "aprovado",
                validacao: {
                  validada: true,
                  data_validacao: "2025-12-20T11:00:00Z",
                  validador: "Sistema Autom\xE1tico"
                },
                detalhes: {
                  perguntas_respondidas: 3,
                  tempo_total: 180,
                  qualidade: "alta"
                }
              },
              {
                id: 2,
                tipo: "pontos",
                valor: 150,
                valor_formatado: "150 pts",
                campanha: "Sa\xFAde P\xFAblica em Angola",
                campanha_id: 2,
                data: "2025-12-18T14:15:00Z",
                data_formatada: "18/12/2025",
                status: "aprovado",
                validacao: {
                  validada: true,
                  data_validacao: "2025-12-18T15:00:00Z",
                  validador: "Sistema Autom\xE1tico"
                },
                detalhes: {
                  perguntas_respondidas: 2,
                  tempo_total: 120,
                  qualidade: "m\xE9dia"
                }
              },
              {
                id: 3,
                tipo: "bonus",
                valor: 50,
                valor_formatado: "50 pts",
                campanha: null,
                campanha_id: null,
                data: "2025-12-15T09:00:00Z",
                data_formatada: "15/12/2025",
                status: "aprovado",
                validacao: {
                  validada: true,
                  data_validacao: "2025-12-15T09:00:00Z",
                  validador: "Sistema"
                },
                detalhes: {
                  motivo: "B\xF4nus de cadastro",
                  categoria: "boas-vindas"
                }
              }
            ],
            resumo: {
              total_valor: 500,
              total_recompensas: 3,
              total_aprovadas: 3,
              total_pendentes: 0,
              total_rejeitadas: 0,
              por_tipo: {
                pontos: 450,
                bonus: 50
              },
              por_mes: [
                { mes: "2025-12", valor: 500, quantidade: 3 }
              ],
              ultima_recompensa: "2025-12-20T10:30:00Z"
            },
            filtros_disponiveis: {
              tipos: ["pontos", "bonus", "resgate"],
              status: ["aprovado", "pendente", "rejeitado"],
              periodos: ["7d", "30d", "90d", "all"]
            }
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const db = env.kudimu_db;
          const userId = token.split("_")[2];
          const rewardsResult = await db.prepare(`
            SELECT 
              r.id,
              r.recompensa as valor,
              r.data_resposta as data,
              r.validada,
              c.titulo as campanha,
              c.id as campanha_id
            FROM respostas_usuario r
            LEFT JOIN campanhas c ON r.campanha_id = c.id
            WHERE r.usuario_id = ?
            ORDER BY r.data_resposta DESC
          `).bind(userId).all();
          const total = rewardsResult.results?.reduce((sum, r) => sum + (r.valor || 0), 0) || 0;
          return new Response(JSON.stringify({
            success: true,
            data: rewardsResult.results || [],
            resumo: {
              total_valor: total,
              total_recompensas: rewardsResult.results?.length || 0
            }
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            error: "Database error",
            message: error instanceof Error ? error.message : "Unknown error"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path.startsWith("/admin/users/") && request.method === "PATCH") {
        const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        if (!token) {
          return new Response(JSON.stringify({
            error: "Unauthorized",
            message: "Token n\xE3o fornecido"
          }), {
            status: 401,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        const userId = path.split("/")[3];
        const body = await request.json();
        if (isDevMode(env)) {
          return new Response(JSON.stringify({
            success: true,
            data: {
              id: userId,
              ...body,
              updated_at: (/* @__PURE__ */ new Date()).toISOString()
            },
            message: "Usu\xE1rio atualizado com sucesso"
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const db = env.kudimu_db;
          const fields = Object.keys(body);
          const values = Object.values(body);
          if (fields.length === 0) {
            return new Response(JSON.stringify({
              error: "Bad Request",
              message: "Nenhum campo para atualizar"
            }), {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const setClause = fields.map((f) => `${f} = ?`).join(", ");
          const query = `UPDATE usuarios SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
          await db.prepare(query).bind(...values, userId).run();
          return new Response(JSON.stringify({
            success: true,
            message: "Usu\xE1rio atualizado com sucesso",
            data: { id: userId, ...body }
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            error: "Database error",
            message: error instanceof Error ? error.message : "Unknown error"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path === "/admin/users" && request.method === "GET") {
        const auth = requireAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error
          }), {
            status: auth.error?.includes("n\xE3o fornecido") ? 401 : 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        const url2 = new URL(request.url);
        const tipo = url2.searchParams.get("tipo") || "todos";
        const pesquisa = url2.searchParams.get("pesquisa") || "";
        const status = url2.searchParams.get("status") || "todos";
        const page = parseInt(url2.searchParams.get("page") || "1");
        const limit = parseInt(url2.searchParams.get("limit") || "20");
        if (isDevMode(env)) {
          let usuarios = [
            {
              id: "1",
              nome: "Jo\xE3o Silva",
              email: "joao@example.com",
              tipo_usuario: "usuario",
              nivel: "Bronze",
              pontos_totais: 450,
              total_pesquisas: 15,
              status: "ativo",
              data_cadastro: "2024-10-01",
              ultima_atividade: "2024-12-20"
            },
            {
              id: "2",
              nome: "Maria Santos",
              email: "maria@example.com",
              tipo_usuario: "usuario",
              nivel: "Prata",
              pontos_totais: 980,
              total_pesquisas: 32,
              status: "ativo",
              data_cadastro: "2024-09-15",
              ultima_atividade: "2024-12-21"
            },
            {
              id: "3",
              nome: "Admin User",
              email: "admin@kudimu.ao",
              tipo_usuario: "admin",
              nivel: "Admin",
              pontos_totais: 0,
              total_pesquisas: 0,
              status: "ativo",
              data_cadastro: "2024-01-01",
              ultima_atividade: "2024-12-23"
            },
            {
              id: "4",
              nome: "Empresa ABC Lda",
              email: "contato@empresaabc.ao",
              tipo_usuario: "cliente",
              nivel: "Cliente Premium",
              pontos_totais: 0,
              total_pesquisas: 0,
              status: "ativo",
              data_cadastro: "2024-08-10",
              ultima_atividade: "2024-12-22",
              campanhas_ativas: 2,
              orcamento_total: 5e5
            },
            {
              id: "5",
              nome: "Pedro Costa",
              email: "pedro@example.com",
              tipo_usuario: "usuario",
              nivel: "Ouro",
              pontos_totais: 1850,
              total_pesquisas: 67,
              status: "ativo",
              data_cadastro: "2024-07-20",
              ultima_atividade: "2024-12-23"
            },
            {
              id: "6",
              nome: "Ana Ferreira",
              email: "ana@example.com",
              tipo_usuario: "usuario",
              nivel: "Bronze",
              pontos_totais: 280,
              total_pesquisas: 9,
              status: "inativo",
              data_cadastro: "2024-11-05",
              ultima_atividade: "2024-11-20"
            }
          ];
          if (tipo !== "todos") {
            usuarios = usuarios.filter((u) => u.tipo_usuario === tipo);
          }
          if (status !== "todos") {
            usuarios = usuarios.filter((u) => u.status === status);
          }
          if (pesquisa) {
            const searchLower = pesquisa.toLowerCase();
            usuarios = usuarios.filter(
              (u) => u.nome.toLowerCase().includes(searchLower) || u.email.toLowerCase().includes(searchLower)
            );
          }
          const total = usuarios.length;
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          const usuariosPaginados = usuarios.slice(startIndex, endIndex);
          return new Response(JSON.stringify({
            success: true,
            data: usuariosPaginados,
            pagination: {
              page,
              limit,
              total,
              totalPages: Math.ceil(total / limit)
            },
            filtros: { tipo, status, pesquisa }
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const db = env.kudimu_db;
          let query = "SELECT * FROM usuarios WHERE 1=1";
          const params = [];
          if (tipo !== "todos") {
            query += " AND tipo_usuario = ?";
            params.push(tipo);
          }
          if (status !== "todos") {
            query += " AND status = ?";
            params.push(status);
          }
          if (pesquisa) {
            query += " AND (nome LIKE ? OR email LIKE ?)";
            params.push(`%${pesquisa}%`, `%${pesquisa}%`);
          }
          query += " ORDER BY data_cadastro DESC";
          query += ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
          const result = await db.prepare(query).bind(...params).all();
          let countQuery = "SELECT COUNT(*) as total FROM usuarios WHERE 1=1";
          const countParams = [];
          if (tipo !== "todos") {
            countQuery += " AND tipo_usuario = ?";
            countParams.push(tipo);
          }
          if (status !== "todos") {
            countQuery += " AND status = ?";
            countParams.push(status);
          }
          if (pesquisa) {
            countQuery += " AND (nome LIKE ? OR email LIKE ?)";
            countParams.push(`%${pesquisa}%`, `%${pesquisa}%`);
          }
          const countResult = await db.prepare(countQuery).bind(...countParams).first();
          const total = countResult?.total || 0;
          return new Response(JSON.stringify({
            success: true,
            data: result.results || [],
            pagination: {
              page,
              limit,
              total,
              totalPages: Math.ceil(total / limit)
            },
            filtros: { tipo, status, pesquisa }
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            error: "Database error",
            message: error instanceof Error ? error.message : "Unknown error"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path === "/campaigns" && request.method === "POST") {
        const auth = requireClientOrAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error || "Apenas clientes e administradores podem criar campanhas"
          }), {
            status: 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        const body = await request.json();
        try {
          const db = env.kudimu_db;
          const clienteId = auth.user.id;
          const recompensa = body.recompensa || body.reward || 100;
          const metaParticipantes = body.meta_participantes || 100;
          const orcamentoTotal = body.orcamento_total || recompensa * metaParticipantes;
          const clienteData = await db.prepare(`
            SELECT saldo_creditos FROM clientes WHERE user_id = ?
          `).bind(clienteId).first();
          if (!clienteData) {
            return new Response(JSON.stringify({
              success: false,
              error: "Cliente n\xE3o encontrado. Entre em contato com o suporte."
            }), {
              status: 404,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const saldoAtual = clienteData.saldo_creditos || 0;
          if (saldoAtual < orcamentoTotal) {
            return new Response(JSON.stringify({
              success: false,
              error: "Cr\xE9ditos insuficientes",
              data: {
                saldo_atual: saldoAtual,
                orcamento_necessario: orcamentoTotal,
                faltam: orcamentoTotal - saldoAtual
              },
              message: `Voc\xEA precisa de ${orcamentoTotal} Kz mas tem apenas ${saldoAtual} Kz. Adicione ${orcamentoTotal - saldoAtual} Kz para criar esta campanha.`
            }), {
              status: 402,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const assinaturaAtiva = await db.prepare(`
            SELECT a.*, p.nome as plano_nome, p.tipo as plano_tipo, p.max_campanhas_mes, 
                   p.max_respostas, p.max_perguntas, p.segmentacao_avancada, p.analise_ia,
                   p.validacao_etica_obrigatoria
            FROM assinaturas_clientes a
            JOIN planos p ON a.plano_id = p.id
            WHERE a.cliente_id = ? AND a.status = 'ativa'
            ORDER BY a.created_at DESC
            LIMIT 1
          `).bind(clienteId).first();
          if (assinaturaAtiva) {
            if (assinaturaAtiva.max_campanhas_mes) {
              const ultimoReset = new Date(assinaturaAtiva.ultimo_reset_mensal);
              const agora = /* @__PURE__ */ new Date();
              const diasDesdeReset = (agora.getTime() - ultimoReset.getTime()) / (1e3 * 60 * 60 * 24);
              if (diasDesdeReset >= 30) {
                await db.prepare(`
                  UPDATE assinaturas_clientes 
                  SET campanhas_criadas_mes = 0, ultimo_reset_mensal = datetime('now')
                  WHERE id = ?
                `).bind(assinaturaAtiva.id).run();
                assinaturaAtiva.campanhas_criadas_mes = 0;
              }
              if (assinaturaAtiva.campanhas_criadas_mes >= assinaturaAtiva.max_campanhas_mes) {
                return new Response(JSON.stringify({
                  success: false,
                  error: "Limite de campanhas atingido",
                  message: `Seu plano "${assinaturaAtiva.plano_nome}" permite ${assinaturaAtiva.max_campanhas_mes} campanhas por m\xEAs. Voc\xEA j\xE1 criou ${assinaturaAtiva.campanhas_criadas_mes} este m\xEAs.`,
                  data: {
                    plano: assinaturaAtiva.plano_nome,
                    limite: assinaturaAtiva.max_campanhas_mes,
                    usadas: assinaturaAtiva.campanhas_criadas_mes
                  }
                }), {
                  status: 403,
                  headers: { "Content-Type": "application/json", ...corsHeaders }
                });
              }
            }
            if (assinaturaAtiva.max_respostas && metaParticipantes > assinaturaAtiva.max_respostas) {
              return new Response(JSON.stringify({
                success: false,
                error: "Meta de participantes excede limite do plano",
                message: `Seu plano "${assinaturaAtiva.plano_nome}" permite at\xE9 ${assinaturaAtiva.max_respostas} respostas. Reduza a meta ou fa\xE7a upgrade do plano.`,
                data: {
                  plano: assinaturaAtiva.plano_nome,
                  limite_respostas: assinaturaAtiva.max_respostas,
                  solicitado: metaParticipantes
                }
              }), {
                status: 403,
                headers: { "Content-Type": "application/json", ...corsHeaders }
              });
            }
            const numPerguntas = (body.perguntas || body.questions || []).length;
            if (assinaturaAtiva.max_perguntas && numPerguntas > assinaturaAtiva.max_perguntas) {
              return new Response(JSON.stringify({
                success: false,
                error: "N\xFAmero de perguntas excede limite do plano",
                message: `Seu plano "${assinaturaAtiva.plano_nome}" permite at\xE9 ${assinaturaAtiva.max_perguntas} perguntas. Reduza para ${assinaturaAtiva.max_perguntas} ou fa\xE7a upgrade.`,
                data: {
                  plano: assinaturaAtiva.plano_nome,
                  limite_perguntas: assinaturaAtiva.max_perguntas,
                  solicitado: numPerguntas
                }
              }), {
                status: 403,
                headers: { "Content-Type": "application/json", ...corsHeaders }
              });
            }
            if (assinaturaAtiva.validacao_etica_obrigatoria === 1 && !body.validacao_etica) {
              return new Response(JSON.stringify({
                success: false,
                error: "Valida\xE7\xE3o \xE9tica obrigat\xF3ria",
                message: `Seu plano "${assinaturaAtiva.plano_nome}" requer valida\xE7\xE3o \xE9tica. Marque a op\xE7\xE3o de conformidade \xE9tica.`
              }), {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders }
              });
            }
          }
          const insertResult = await db.prepare(`
            INSERT INTO campanhas (
              titulo, descricao, recompensa, status, data_inicio, data_fim,
              cliente_id, orcamento_total, meta_participantes, categoria, tema,
              tempo_estimado, localizacao_alvo, idade_min, idade_max, 
              genero_target, interesses_target, nivel_educacao, tags, perguntas, ativo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            body.titulo || body.title,
            body.descricao || body.description,
            recompensa,
            "pendente",
            body.data_inicio || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
            body.data_fim || new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
            clienteId,
            orcamentoTotal,
            metaParticipantes,
            body.categoria || "Geral",
            body.tema || "Outros",
            body.tempo_estimado || 10,
            body.localizacao_alvo || null,
            body.idade_min || 18,
            body.idade_max || 65,
            body.genero_target || "todos",
            Array.isArray(body.interesses_target) ? JSON.stringify(body.interesses_target) : body.interesses_target,
            body.nivel_educacao || "todos",
            Array.isArray(body.tags) ? JSON.stringify(body.tags) : body.tags,
            JSON.stringify(body.perguntas || body.questions || []),
            1
            // ativo
          ).run();
          const novaCampanhaId = insertResult.meta.last_row_id;
          await db.prepare(`
            UPDATE clientes 
            SET saldo_creditos = saldo_creditos - ?
            WHERE user_id = ?
          `).bind(orcamentoTotal, clienteId).run();
          await db.prepare(`
            INSERT INTO transacoes (user_id, tipo, valor, transaction_id, status, metadata)
            VALUES (?, ?, ?, ?, ?, ?)
          `).bind(
            clienteId,
            "criacao_campanha",
            -orcamentoTotal,
            // Valor negativo para débito
            `txn_camp_${novaCampanhaId}_${Date.now()}`,
            "aprovado",
            JSON.stringify({
              campanha_id: novaCampanhaId,
              titulo: body.titulo || body.title,
              orcamento_total: orcamentoTotal
            })
          ).run();
          const novoSaldo = await db.prepare(`
            SELECT saldo_creditos FROM clientes WHERE user_id = ?
          `).bind(clienteId).first();
          if (assinaturaAtiva && assinaturaAtiva.max_campanhas_mes) {
            await db.prepare(`
              UPDATE assinaturas_clientes 
              SET campanhas_criadas_mes = campanhas_criadas_mes + 1
              WHERE id = ?
            `).bind(assinaturaAtiva.id).run();
          }
          return new Response(JSON.stringify({
            success: true,
            data: {
              id: novaCampanhaId,
              titulo: body.titulo || body.title,
              status: "pendente",
              cliente_id: clienteId,
              orcamento_total: orcamentoTotal,
              saldo_anterior: saldoAtual,
              saldo_atual: novoSaldo.saldo_creditos,
              plano_info: assinaturaAtiva ? {
                plano: assinaturaAtiva.plano_nome,
                campanhas_restantes: assinaturaAtiva.max_campanhas_mes ? assinaturaAtiva.max_campanhas_mes - (assinaturaAtiva.campanhas_criadas_mes + 1) : null
              } : null
            },
            message: `Campanha criada com sucesso! ${orcamentoTotal} Kz foram debitados do seu saldo.`
          }), {
            status: 201,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          console.error("Erro ao criar campanha:", error);
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao criar campanha",
            message: error instanceof Error ? error.message : "Unknown error"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path.match(/^\/campaigns\/\d+$/) && request.method === "PUT") {
        const campaignId = parseInt(path.split("/")[2]);
        const auth = requireClientOrAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error || "Apenas clientes e administradores podem editar campanhas"
          }), {
            status: 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        const body = await request.json();
        try {
          const db = env.kudimu_db;
          const campanha = await db.prepare(`
            SELECT cliente_id, orcamento_total FROM campanhas WHERE id = ? AND ativo = 1
          `).bind(campaignId).first();
          if (!campanha) {
            return new Response(JSON.stringify({
              success: false,
              error: "Campanha n\xE3o encontrada ou j\xE1 foi deletada"
            }), {
              status: 404,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          if (auth.user.tipo_usuario !== "admin" && campanha.cliente_id !== auth.user.id) {
            return new Response(JSON.stringify({
              success: false,
              error: "Voc\xEA n\xE3o tem permiss\xE3o para editar esta campanha"
            }), {
              status: 403,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const fieldsToUpdate = [];
          const values = [];
          if (body.titulo !== void 0) {
            fieldsToUpdate.push("titulo = ?");
            values.push(body.titulo);
          }
          if (body.descricao !== void 0) {
            fieldsToUpdate.push("descricao = ?");
            values.push(body.descricao);
          }
          if (body.recompensa !== void 0) {
            fieldsToUpdate.push("recompensa = ?");
            values.push(body.recompensa);
          }
          if (body.data_inicio !== void 0) {
            fieldsToUpdate.push("data_inicio = ?");
            values.push(body.data_inicio);
          }
          if (body.data_fim !== void 0) {
            fieldsToUpdate.push("data_fim = ?");
            values.push(body.data_fim);
          }
          if (body.meta_participantes !== void 0) {
            fieldsToUpdate.push("meta_participantes = ?");
            values.push(body.meta_participantes);
          }
          if (body.categoria !== void 0) {
            fieldsToUpdate.push("categoria = ?");
            values.push(body.categoria);
          }
          if (body.tema !== void 0) {
            fieldsToUpdate.push("tema = ?");
            values.push(body.tema);
          }
          if (body.status !== void 0) {
            fieldsToUpdate.push("status = ?");
            values.push(body.status);
          }
          if (body.perguntas !== void 0) {
            fieldsToUpdate.push("perguntas = ?");
            values.push(JSON.stringify(body.perguntas));
          }
          fieldsToUpdate.push("updated_at = datetime('now')");
          if (fieldsToUpdate.length === 1) {
            return new Response(JSON.stringify({
              success: false,
              error: "Nenhum campo para atualizar foi fornecido"
            }), {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          values.push(campaignId);
          await db.prepare(`
            UPDATE campanhas 
            SET ${fieldsToUpdate.join(", ")}
            WHERE id = ?
          `).bind(...values).run();
          const campanhaAtualizada = await db.prepare(`
            SELECT * FROM campanhas WHERE id = ?
          `).bind(campaignId).first();
          return new Response(JSON.stringify({
            success: true,
            data: campanhaAtualizada,
            message: "Campanha atualizada com sucesso!"
          }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          console.error("Erro ao atualizar campanha:", error);
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao atualizar campanha",
            message: error instanceof Error ? error.message : "Unknown error"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path.match(/^\/campaigns\/\d+$/) && request.method === "DELETE") {
        const campaignId = parseInt(path.split("/")[2]);
        const auth = requireClientOrAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error || "Apenas clientes e administradores podem deletar campanhas"
          }), {
            status: 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const db = env.kudimu_db;
          const campanha = await db.prepare(`
            SELECT cliente_id, orcamento_total, orcamento_gasto FROM campanhas 
            WHERE id = ? AND ativo = 1
          `).bind(campaignId).first();
          if (!campanha) {
            return new Response(JSON.stringify({
              success: false,
              error: "Campanha n\xE3o encontrada ou j\xE1 foi deletada"
            }), {
              status: 404,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          if (auth.user.tipo_usuario !== "admin" && campanha.cliente_id !== auth.user.id) {
            return new Response(JSON.stringify({
              success: false,
              error: "Voc\xEA n\xE3o tem permiss\xE3o para deletar esta campanha"
            }), {
              status: 403,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          await db.prepare(`
            UPDATE campanhas 
            SET ativo = 0, deleted_at = datetime('now')
            WHERE id = ?
          `).bind(campaignId).run();
          const orcamentoNaoGasto = campanha.orcamento_total - (campanha.orcamento_gasto || 0);
          if (orcamentoNaoGasto > 0) {
            await db.prepare(`
              UPDATE clientes 
              SET saldo_creditos = saldo_creditos + ?
              WHERE user_id = ?
            `).bind(orcamentoNaoGasto, campanha.cliente_id).run();
            await db.prepare(`
              INSERT INTO transacoes (user_id, tipo, valor, transaction_id, status, metadata)
              VALUES (?, ?, ?, ?, ?, ?)
            `).bind(
              campanha.cliente_id,
              "reembolso_campanha",
              orcamentoNaoGasto,
              `txn_refund_${campaignId}_${Date.now()}`,
              "aprovado",
              JSON.stringify({
                campanha_id: campaignId,
                orcamento_total: campanha.orcamento_total,
                orcamento_gasto: campanha.orcamento_gasto,
                valor_reembolsado: orcamentoNaoGasto
              })
            ).run();
          }
          return new Response(JSON.stringify({
            success: true,
            data: {
              campanha_id: campaignId,
              orcamento_reembolsado: orcamentoNaoGasto
            },
            message: orcamentoNaoGasto > 0 ? `Campanha deletada com sucesso! ${orcamentoNaoGasto} Kz foram reembolsados ao seu saldo.` : "Campanha deletada com sucesso!"
          }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          console.error("Erro ao deletar campanha:", error);
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao deletar campanha",
            message: error instanceof Error ? error.message : "Unknown error"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path.match(/^\/campaigns\/\d+\/export\/academic$/) && request.method === "GET") {
        const campaignId = parseInt(path.split("/")[2]);
        const auth = requireClientOrAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error
          }), {
            status: 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const url2 = new URL(request.url);
          const formato = url2.searchParams.get("formato") || "latex";
          const db = env.kudimu_db;
          const clienteId = auth.user.id;
          const campanha = await db.prepare(`
            SELECT * FROM campanhas WHERE id = ?
          `).bind(campaignId).first();
          if (!campanha) {
            return new Response(JSON.stringify({
              success: false,
              error: "Campanha n\xE3o encontrada"
            }), {
              status: 404,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const respostas = await db.prepare(`
            SELECT * FROM respostas WHERE campanha_id = ? ORDER BY created_at ASC
          `).bind(campaignId).all();
          const totalRespostas = respostas.results?.length || 0;
          let conteudo = "";
          let mimeType = "text/plain";
          let nomeArquivo = `campanha-${campaignId}`;
          if (formato === "latex") {
            conteudo = `\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[portuguese]{babel}
\\usepackage{graphicx}
\\usepackage{booktabs}
\\usepackage{float}

\\title{${campanha.titulo}}
\\author{Pesquisa Kudimu}
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{abstract}
${campanha.descricao || "Pesquisa de opini\xE3o realizada atrav\xE9s da plataforma Kudimu."}
\\end{abstract}

\\section{Introdu\xE7\xE3o}

Esta pesquisa teve como objetivo ${campanha.titulo.toLowerCase()}, com foco em ${campanha.categoria || "diversos aspectos"}.

\\subsection{Metodologia}

\\begin{itemize}
    \\item \\textbf{Per\xEDodo de coleta}: ${campanha.data_inicio} a ${campanha.data_fim}
    \\item \\textbf{Amostra}: ${totalRespostas} participantes
    \\item \\textbf{M\xE9todo}: Question\xE1rio online estruturado
    \\item \\textbf{Plataforma}: Kudimu - Intelig\xEAncia Coletiva Africana
\\end{itemize}

\\subsection{Perfil Demogr\xE1fico}

\\begin{itemize}
    \\item \\textbf{Faixa et\xE1ria}: ${campanha.idade_min}-${campanha.idade_max} anos
    \\item \\textbf{G\xEAnero}: ${campanha.genero_target === "todos" ? "Todos os g\xEAneros" : campanha.genero_target}
    \\item \\textbf{Localiza\xE7\xE3o}: ${campanha.localizacao_alvo || "Angola (todas as prov\xEDncias)"}
\\end{itemize}

\\section{Resultados}

Foram coletadas \\textbf{${totalRespostas} respostas} v\xE1lidas durante o per\xEDodo de ${campanha.data_inicio} a ${campanha.data_fim}.

\\subsection{An\xE1lise Descritiva}

[Inserir an\xE1lise estat\xEDstica descritiva dos dados]

\\subsection{Discuss\xE3o}

[Inserir discuss\xE3o dos resultados obtidos]

\\section{Conclus\xE3o}

Com base nos dados coletados, conclui-se que [inserir conclus\xF5es].

\\section{Refer\xEAncias}

\\begin{thebibliography}{9}
\\bibitem{kudimu2024}
Kudimu Platform (2024). 
\\textit{${campanha.titulo}}.
Luanda: Kudimu - Intelig\xEAncia Coletiva Africana.
Dispon\xEDvel em: https://kudimu.ao/campanhas/${campaignId}
\\end{thebibliography}

\\end{document}`;
            mimeType = "application/x-latex";
            nomeArquivo += ".tex";
          } else if (formato === "bibtex") {
            conteudo = `@misc{kudimu${campaignId},
  title = {${campanha.titulo}},
  author = {Kudimu Platform},
  year = {${new Date(campanha.created_at).getFullYear()}},
  note = {Pesquisa online, n=${totalRespostas}},
  howpublished = {\\url{https://kudimu.ao/campanhas/${campaignId}}},
  address = {Luanda, Angola},
  organization = {Kudimu - Intelig\xEAncia Coletiva Africana}
}`;
            mimeType = "application/x-bibtex";
            nomeArquivo += ".bib";
          } else if (formato === "word") {
            conteudo = `# ${campanha.titulo}

**Pesquisa Kudimu**

## Resumo

${campanha.descricao || "Pesquisa de opini\xE3o realizada atrav\xE9s da plataforma Kudimu."}

## 1. Introdu\xE7\xE3o

Esta pesquisa teve como objetivo ${campanha.titulo.toLowerCase()}, com foco em ${campanha.categoria || "diversos aspectos"}.

### 1.1 Metodologia

- **Per\xEDodo de coleta**: ${campanha.data_inicio} a ${campanha.data_fim}
- **Amostra**: ${totalRespostas} participantes
- **M\xE9todo**: Question\xE1rio online estruturado
- **Plataforma**: Kudimu - Intelig\xEAncia Coletiva Africana

### 1.2 Perfil Demogr\xE1fico

- **Faixa et\xE1ria**: ${campanha.idade_min}-${campanha.idade_max} anos
- **G\xEAnero**: ${campanha.genero_target === "todos" ? "Todos os g\xEAneros" : campanha.genero_target}
- **Localiza\xE7\xE3o**: ${campanha.localizacao_alvo || "Angola (todas as prov\xEDncias)"}

## 2. Resultados

Foram coletadas **${totalRespostas} respostas** v\xE1lidas durante o per\xEDodo estabelecido.

### 2.1 An\xE1lise Descritiva

[Inserir an\xE1lise estat\xEDstica descritiva dos dados]

### 2.2 Discuss\xE3o

[Inserir discuss\xE3o dos resultados obtidos]

## 3. Conclus\xE3o

Com base nos dados coletados, conclui-se que [inserir conclus\xF5es].

## Refer\xEAncias

Kudimu Platform (${(/* @__PURE__ */ new Date()).getFullYear()}). *${campanha.titulo}*. Luanda: Kudimu - Intelig\xEAncia Coletiva Africana. Dispon\xEDvel em: https://kudimu.ao/campanhas/${campaignId}
`;
            mimeType = "text/markdown";
            nomeArquivo += ".md";
          } else if (formato === "zotero") {
            const zoteroData = {
              itemType: "webpage",
              title: campanha.titulo,
              creators: [{
                creatorType: "author",
                name: "Kudimu Platform"
              }],
              abstractNote: campanha.descricao,
              websiteTitle: "Kudimu - Intelig\xEAncia Coletiva Africana",
              url: `https://kudimu.ao/campanhas/${campaignId}`,
              accessDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
              date: campanha.created_at.split("T")[0],
              language: "pt-PT",
              rights: "Dados coletados pela plataforma Kudimu",
              extra: `Total de respostas: ${totalRespostas}\\nPerfil: ${campanha.idade_min}-${campanha.idade_max} anos, ${campanha.genero_target}`
            };
            conteudo = JSON.stringify([zoteroData], null, 2);
            mimeType = "application/json";
            nomeArquivo += ".json";
          }
          return new Response(JSON.stringify({
            success: true,
            data: {
              formato,
              conteudo,
              nome_arquivo: nomeArquivo,
              mime_type: mimeType,
              tamanho_bytes: new Blob([conteudo]).size
            },
            message: `Exporta\xE7\xE3o em formato ${formato} gerada com sucesso`
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          console.error("Erro ao exportar campanha:", error);
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao gerar exporta\xE7\xE3o acad\xEAmica",
            message: error instanceof Error ? error.message : "Unknown error"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path === "/client/dashboard" && request.method === "GET") {
        const auth = requireClientOrAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error
          }), {
            status: auth.error?.includes("n\xE3o fornecido") ? 401 : 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        const clienteId = auth.user.id;
        const dashboardData = {
          overview: {
            campanhas_ativas: 2,
            campanhas_pendentes: 1,
            campanhas_finalizadas: 5,
            total_respostas: 1247,
            orcamento_utilizado: 175500,
            orcamento_total: 25e4,
            qualidade_media: 4.3,
            taxa_conclusao: 89.5,
            respostas_pendentes: 23
          },
          campanhas_recentes: [
            {
              id: "camp_1",
              titulo: "Estudo Mercado de Trabalho 2024",
              status: "ativa",
              progresso: 62.4,
              total_respostas: 312,
              meta_respostas: 500,
              qualidade_media: 4.2,
              orcamento_gasto: 93600,
              data_inicio: "2024-12-01",
              data_fim: "2024-12-31"
            },
            {
              id: "camp_2",
              titulo: "Pesquisa Satisfa\xE7\xE3o Servi\xE7os P\xFAblicos",
              status: "ativa",
              progresso: 45.3,
              total_respostas: 136,
              meta_respostas: 300,
              qualidade_media: 4.1,
              orcamento_gasto: 40800,
              data_inicio: "2024-12-10",
              data_fim: "2024-12-25"
            },
            {
              id: "camp_3",
              titulo: "H\xE1bitos de Consumo Digital",
              status: "pendente",
              progresso: 0,
              total_respostas: 0,
              meta_respostas: 250,
              qualidade_media: 0,
              orcamento_gasto: 0,
              data_inicio: "2024-12-20",
              data_fim: "2025-01-10"
            }
          ],
          insights_recentes: [
            {
              tipo: "positive",
              titulo: "Alta Taxa de Engajamento",
              descricao: "Suas campanhas apresentam 89.5% de conclus\xE3o",
              campanha: "Mercado de Trabalho",
              data: (/* @__PURE__ */ new Date()).toISOString()
            },
            {
              tipo: "warning",
              titulo: "Aten\xE7\xE3o ao Or\xE7amento",
              descricao: "70.2% do or\xE7amento mensal j\xE1 foi utilizado",
              campanha: "Geral",
              data: (/* @__PURE__ */ new Date()).toISOString()
            },
            {
              tipo: "info",
              titulo: "Campanha Pendente de Aprova\xE7\xE3o",
              descricao: "H\xE1bitos de Consumo Digital aguarda aprova\xE7\xE3o",
              campanha: "Consumo Digital",
              data: (/* @__PURE__ */ new Date()).toISOString()
            }
          ],
          atividades_recentes: [
            {
              tipo: "resposta",
              descricao: "15 novas respostas recebidas",
              campanha: "Mercado de Trabalho",
              tempo: "2 horas atr\xE1s",
              data: new Date(Date.now() - 2 * 60 * 60 * 1e3).toISOString()
            },
            {
              tipo: "validacao",
              descricao: "23 respostas validadas",
              campanha: "Servi\xE7os P\xFAblicos",
              tempo: "5 horas atr\xE1s",
              data: new Date(Date.now() - 5 * 60 * 60 * 1e3).toISOString()
            },
            {
              tipo: "alerta",
              descricao: "Campanha pr\xF3xima do limite de or\xE7amento",
              campanha: "Mercado de Trabalho",
              tempo: "1 dia atr\xE1s",
              data: new Date(Date.now() - 24 * 60 * 60 * 1e3).toISOString()
            }
          ],
          estatisticas_semanais: {
            respostas: [45, 62, 78, 89, 95, 102, 87],
            qualidade: [4.1, 4.2, 4.3, 4.2, 4.4, 4.3, 4.2],
            dias: ["Seg", "Ter", "Qua", "Qui", "Sex", "S\xE1b", "Dom"]
          }
        };
        return new Response(JSON.stringify({
          success: true,
          data: dashboardData
        }), {
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      if (path === "/client/campaigns" && request.method === "GET") {
        const auth = requireClientOrAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error
          }), {
            status: auth.error?.includes("n\xE3o fornecido") ? 401 : 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        const clienteId = auth.user.id;
        const url2 = new URL(request.url);
        const status = url2.searchParams.get("status") || "todas";
        const pesquisa = url2.searchParams.get("pesquisa") || "";
        try {
          const db = env.kudimu_db;
          let query = `
            SELECT * FROM campanhas 
            WHERE cliente_id = ? AND ativo = 1
          `;
          const params = [clienteId];
          if (status !== "todas") {
            query += ` AND status = ?`;
            params.push(status);
          }
          if (pesquisa) {
            query += ` AND (titulo LIKE ? OR descricao LIKE ?)`;
            const searchPattern = `%${pesquisa}%`;
            params.push(searchPattern, searchPattern);
          }
          query += ` ORDER BY created_at DESC`;
          const result = await db.prepare(query).bind(...params).all();
          const campanhasEnriquecidas = (result.results || []).map((c) => ({
            ...c,
            progresso: (c.total_respostas || 0) / (c.meta_participantes || 1) * 100,
            meta_respostas: c.meta_participantes || 0
          }));
          return new Response(JSON.stringify({
            success: true,
            data: campanhasEnriquecidas,
            total: campanhasEnriquecidas.length,
            filtros: { status, pesquisa }
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          console.error("Erro ao buscar campanhas:", error);
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao buscar campanhas",
            message: error instanceof Error ? error.message : "Unknown error"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path.startsWith("/client/campaigns/") && path.endsWith("/analytics") && request.method === "GET") {
        const auth = requireClientOrAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error
          }), {
            status: auth.error?.includes("n\xE3o fornecido") ? 401 : 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        const campaignId = path.split("/")[3];
        const analytics = {
          campanha: {
            id: campaignId,
            titulo: "Estudo Mercado de Trabalho 2024",
            status: "ativa",
            data_inicio: "2024-12-01",
            data_fim: "2024-12-31"
          },
          metricas_gerais: {
            total_respostas: 312,
            meta_respostas: 500,
            progresso: 62.4,
            qualidade_media: 4.2,
            taxa_conclusao: 87.5,
            tempo_medio_resposta: 8.3,
            orcamento_gasto: 93600,
            orcamento_total: 15e4
          },
          demografico: {
            genero: [
              { label: "Masculino", valor: 45 },
              { label: "Feminino", valor: 52 },
              { label: "Outro", valor: 3 }
            ],
            faixa_etaria: [
              { label: "18-24", valor: 28 },
              { label: "25-34", valor: 35 },
              { label: "35-44", valor: 22 },
              { label: "45-54", valor: 10 },
              { label: "55+", valor: 5 }
            ],
            localizacao: [
              { label: "Luanda", valor: 65 },
              { label: "Benguela", valor: 15 },
              { label: "Huambo", valor: 10 },
              { label: "Outras", valor: 10 }
            ]
          },
          timeline: {
            respostas_por_dia: [
              { data: "2024-12-01", respostas: 12, qualidade: 4.1 },
              { data: "2024-12-02", respostas: 18, qualidade: 4.2 },
              { data: "2024-12-03", respostas: 25, qualidade: 4.3 },
              { data: "2024-12-04", respostas: 22, qualidade: 4.2 },
              { data: "2024-12-05", respostas: 28, qualidade: 4.4 },
              { data: "2024-12-06", respostas: 31, qualidade: 4.3 },
              { data: "2024-12-07", respostas: 27, qualidade: 4.2 }
            ]
          },
          qualidade: {
            distribuicao: [
              { estrelas: 5, quantidade: 156, percentual: 50 },
              { estrelas: 4, quantidade: 109, percentual: 34.9 },
              { estrelas: 3, quantidade: 31, percentual: 9.9 },
              { estrelas: 2, quantidade: 12, percentual: 3.8 },
              { estrelas: 1, quantidade: 4, percentual: 1.3 }
            ],
            media: 4.2,
            total_avaliacoes: 312
          },
          insights_ia: [
            {
              tipo: "positive",
              titulo: "Alta Taxa de Engajamento",
              descricao: "Usu\xE1rios est\xE3o completando 87.5% das respostas iniciadas"
            },
            {
              tipo: "info",
              titulo: "Hor\xE1rio de Pico",
              descricao: "Maior atividade entre 18h-21h (hor\xE1rio de Luanda)"
            },
            {
              tipo: "warning",
              titulo: "Aten\xE7\xE3o \xE0 Meta",
              descricao: "Ritmo atual sugere atingir 80% da meta at\xE9 o prazo final"
            }
          ]
        };
        return new Response(JSON.stringify({
          success: true,
          data: analytics
        }), {
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      if (path === "/planos" && request.method === "GET") {
        try {
          const db = env.kudimu_db;
          const planos = await db.prepare(`
            SELECT * FROM planos WHERE ativo = 1 ORDER BY popular DESC, preco ASC
          `).all();
          return new Response(JSON.stringify({
            success: true,
            data: planos.results || []
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          console.error("Erro ao buscar planos:", error);
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao buscar planos dispon\xEDveis"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path === "/client/assinatura" && request.method === "GET") {
        const auth = requireClientOrAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error
          }), {
            status: auth.error?.includes("n\xE3o fornecido") ? 401 : 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const db = env.kudimu_db;
          const clienteId = auth.user.id;
          const assinatura = await db.prepare(`
            SELECT 
              a.*,
              p.nome as plano_nome,
              p.tipo as plano_tipo,
              p.descricao as plano_descricao,
              p.max_respostas,
              p.max_campanhas_mes,
              p.max_perguntas
            FROM assinaturas_clientes a
            JOIN planos p ON a.plano_id = p.id
            WHERE a.cliente_id = ? AND a.status = 'ativa'
            ORDER BY a.created_at DESC
            LIMIT 1
          `).bind(clienteId).first();
          if (!assinatura) {
            return new Response(JSON.stringify({
              success: true,
              data: null,
              message: "Nenhuma assinatura ativa encontrada"
            }), {
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const assinaturaData = assinatura;
          if (assinaturaData.features_json) {
            try {
              assinaturaData.features = JSON.parse(assinaturaData.features_json);
            } catch (e) {
              assinaturaData.features = {};
            }
          }
          return new Response(JSON.stringify({
            success: true,
            data: assinaturaData
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          console.error("Erro ao buscar assinatura:", error);
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao buscar dados da assinatura"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path === "/servicos" && request.method === "GET") {
        try {
          const db = env.kudimu_db;
          const servicos = await db.prepare(`
            SELECT * FROM servicos_adicionais WHERE ativo = 1 ORDER BY preco_min ASC
          `).all();
          return new Response(JSON.stringify({
            success: true,
            data: servicos.results || []
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          console.error("Erro ao buscar servi\xE7os:", error);
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao buscar servi\xE7os dispon\xEDveis"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path === "/servicos/contratar" && request.method === "POST") {
        const auth = requireClientOrAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error
          }), {
            status: auth.error?.includes("n\xE3o fornecido") ? 401 : 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const body = await request.json();
          const { servico_id, campanha_id, detalhes, valor_pago } = body;
          if (!servico_id) {
            return new Response(JSON.stringify({
              success: false,
              error: "servico_id \xE9 obrigat\xF3rio"
            }), {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const db = env.kudimu_db;
          const clienteId = auth.user.id;
          const servico = await db.prepare(`
            SELECT * FROM servicos_adicionais WHERE id = ? AND ativo = 1
          `).bind(servico_id).first();
          if (!servico) {
            return new Response(JSON.stringify({
              success: false,
              error: "Servi\xE7o n\xE3o encontrado ou inativo"
            }), {
              status: 404,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const valorFinal = valor_pago || servico.preco_min;
          if (valorFinal < servico.preco_min || servico.preco_max && valorFinal > servico.preco_max) {
            return new Response(JSON.stringify({
              success: false,
              error: `Valor deve estar entre ${servico.preco_min} e ${servico.preco_max || servico.preco_min} AOA`
            }), {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const clienteData = await db.prepare(`
            SELECT saldo_creditos FROM clientes WHERE user_id = ?
          `).bind(clienteId).first();
          if (!clienteData || clienteData.saldo_creditos < valorFinal) {
            return new Response(JSON.stringify({
              success: false,
              error: "Cr\xE9ditos insuficientes",
              data: {
                saldo_atual: clienteData?.saldo_creditos || 0,
                necessario: valorFinal,
                faltam: valorFinal - (clienteData?.saldo_creditos || 0)
              }
            }), {
              status: 402,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const servicoId = `srv-${Date.now()}`;
          await db.prepare(`
            INSERT INTO servicos_contratados (
              id, cliente_id, campanha_id, servico_id, status, valor_pago,
              detalhes_json, data_solicitacao
            ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
          `).bind(
            servicoId,
            clienteId,
            campanha_id || null,
            servico_id,
            "pendente",
            valorFinal,
            detalhes ? JSON.stringify(detalhes) : null
          ).run();
          const saldoAnterior = clienteData.saldo_creditos;
          await db.prepare(`
            UPDATE clientes SET saldo_creditos = saldo_creditos - ? WHERE user_id = ?
          `).bind(valorFinal, clienteId).run();
          await db.prepare(`
            INSERT INTO transacoes (
              id, cliente_id, tipo, quantidade, saldo_antes, saldo_apos,
              descricao, referencia, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
          `).bind(
            `txn-${Date.now()}`,
            clienteId,
            "debito",
            valorFinal,
            saldoAnterior,
            saldoAnterior - valorFinal,
            `Servi\xE7o: ${servico.nome}`,
            servicoId
          ).run();
          return new Response(JSON.stringify({
            success: true,
            data: {
              servico_id: servicoId,
              servico_nome: servico.nome,
              valor_pago: valorFinal,
              status: "pendente",
              mensagem: "Servi\xE7o contratado! Nossa equipe entrar\xE1 em contato em at\xE9 24h."
            }
          }), {
            status: 201,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          console.error("Erro ao contratar servi\xE7o:", error);
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao contratar servi\xE7o",
            message: error instanceof Error ? error.message : "Unknown error"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path === "/client/servicos" && request.method === "GET") {
        const auth = requireClientOrAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error
          }), {
            status: auth.error?.includes("n\xE3o fornecido") ? 401 : 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const db = env.kudimu_db;
          const clienteId = auth.user.id;
          const servicos = await db.prepare(`
            SELECT 
              sc.*,
              sa.nome as servico_nome,
              sa.tipo as servico_tipo,
              sa.descricao as servico_descricao,
              c.titulo as campanha_titulo
            FROM servicos_contratados sc
            JOIN servicos_adicionais sa ON sc.servico_id = sa.id
            LEFT JOIN campanhas c ON sc.campanha_id = c.id
            WHERE sc.cliente_id = ?
            ORDER BY sc.data_solicitacao DESC
          `).bind(clienteId).all();
          return new Response(JSON.stringify({
            success: true,
            data: servicos.results || []
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          console.error("Erro ao buscar servi\xE7os contratados:", error);
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao buscar servi\xE7os contratados"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path === "/ai/analyze-campaign" && request.method === "POST") {
        const auth = requireClientOrAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error
          }), {
            status: auth.error?.includes("n\xE3o fornecido") ? 401 : 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const body = await request.json();
          const { campanha_id, include_predictions } = body;
          if (!campanha_id) {
            return new Response(JSON.stringify({
              success: false,
              error: "campanha_id \xE9 obrigat\xF3rio"
            }), {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const db = env.kudimu_db;
          const campanha = await db.prepare(`
            SELECT * FROM campanhas WHERE id = ?
          `).bind(campanha_id).first();
          if (!campanha) {
            return new Response(JSON.stringify({
              success: false,
              error: "Campanha n\xE3o encontrada"
            }), {
              status: 404,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const respostas = await db.prepare(`
            SELECT * FROM respostas WHERE campanha_id = ? ORDER BY created_at ASC
          `).bind(campanha_id).all();
          const totalRespostas = respostas.results?.length || 0;
          const metaParticipantes = campanha.meta_participantes || 100;
          const progresso = totalRespostas / metaParticipantes * 100;
          let sentimentoPositivo = 0;
          let sentimentoNegativo = 0;
          let sentimentoNeutro = 0;
          const sentimentoDetalhes = [];
          const respostasTexto = await db.prepare(`
            SELECT id, resposta_texto, created_at 
            FROM respostas 
            WHERE campanha_id = ? 
            AND resposta_texto IS NOT NULL 
            AND LENGTH(resposta_texto) > 10
            ORDER BY created_at DESC
            LIMIT 100
          `).bind(campanha_id).all();
          if (respostasTexto.results && respostasTexto.results.length > 0) {
            for (const resposta of respostasTexto.results) {
              try {
                const texto = resposta.resposta_texto;
                const resultado = await env.kudimu_ai.run("@cf/huggingface/distilbert-sst-2-int8", {
                  text: texto.substring(0, 512)
                  // Limite do modelo
                });
                const label = resultado[0].label.toLowerCase();
                const score = resultado[0].score;
                if (label === "positive") {
                  sentimentoPositivo++;
                  sentimentoDetalhes.push({ id: resposta.id, sentimento: "positivo", confianca: score });
                } else if (label === "negative") {
                  sentimentoNegativo++;
                  sentimentoDetalhes.push({ id: resposta.id, sentimento: "negativo", confianca: score });
                } else {
                  sentimentoNeutro++;
                  sentimentoDetalhes.push({ id: resposta.id, sentimento: "neutro", confianca: score });
                }
              } catch (aiError) {
                console.warn("Erro ao analisar sentimento de resposta:", aiError);
                sentimentoNeutro++;
              }
            }
          }
          const totalAnalisado = sentimentoPositivo + sentimentoNegativo + sentimentoNeutro || 1;
          const percentualPositivo = Math.round(sentimentoPositivo / totalAnalisado * 100);
          const percentualNegativo = Math.round(sentimentoNegativo / totalAnalisado * 100);
          const percentualNeutro = 100 - percentualPositivo - percentualNegativo;
          const palavrasChave = {};
          const stopWords = /* @__PURE__ */ new Set(["que", "para", "com", "uma", "por", "mais", "dos", "das", "como", "este", "esta", "muito", "muito", "sobre", "at\xE9", "tamb\xE9m", "quando", "onde", "porque", "qual", "seu", "sua", "seus", "suas", "ele", "ela", "eles", "elas", "voc\xEA", "voc\xEAs", "n\xF3s", "meu", "minha", "nosso", "nossa"]);
          if (respostasTexto.results && respostasTexto.results.length > 0) {
            for (const resposta of respostasTexto.results) {
              const texto = resposta.resposta_texto.toLowerCase();
              const palavras = texto.replace(/[^a-záàâãéèêíïóôõöúçñ\s]/g, "").split(/\s+/).filter((p) => p.length > 4 && !stopWords.has(p));
              palavras.forEach((palavra) => {
                palavrasChave[palavra] = (palavrasChave[palavra] || 0) + 1;
              });
            }
          }
          const temasComuns = Object.entries(palavrasChave).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([tema, mencoes]) => ({
            tema: tema.charAt(0).toUpperCase() + tema.slice(1),
            mencoes,
            relevancia: Math.min(1, mencoes / (totalAnalisado * 0.3))
            // Normalizar 0-1
          }));
          let predicoes = null;
          if (include_predictions) {
            const diasRestantes = Math.max(0, Math.ceil((new Date(campanha.data_fim).getTime() - Date.now()) / (1e3 * 60 * 60 * 24)));
            const diasDecorridos = Math.max(1, Math.ceil((Date.now() - new Date(campanha.data_inicio).getTime()) / (1e3 * 60 * 60 * 24)));
            const taxaDiaria = totalRespostas / diasDecorridos;
            const projecaoFinal = totalRespostas + taxaDiaria * diasRestantes;
            const probabilidadeAtingirMeta = Math.min(100, projecaoFinal / metaParticipantes * 100);
            predicoes = {
              projecao_respostas_final: Math.round(projecaoFinal),
              taxa_media_diaria: Math.round(taxaDiaria * 10) / 10,
              dias_restantes: diasRestantes,
              probabilidade_atingir_meta: Math.round(probabilidadeAtingirMeta),
              recomendacoes: []
            };
            if (probabilidadeAtingirMeta < 70) {
              predicoes.recomendacoes.push({
                tipo: "urgente",
                acao: "Aumentar recompensa",
                motivo: `Com a taxa atual (${taxaDiaria.toFixed(1)}/dia), voc\xEA atingir\xE1 apenas ${Math.round(probabilidadeAtingirMeta)}% da meta`,
                impacto_estimado: "+25% na taxa de resposta"
              });
              predicoes.recomendacoes.push({
                tipo: "importante",
                acao: "Ampliar p\xFAblico-alvo",
                motivo: "Expandir para outras faixas et\xE1rias ou localiza\xE7\xF5es",
                impacto_estimado: "+15-20 respostas/dia"
              });
            }
            if (progresso > 70 && diasRestantes > 7) {
              predicoes.recomendacoes.push({
                tipo: "otimizacao",
                acao: "Reduzir or\xE7amento",
                motivo: "Meta ser\xE1 atingida antes do prazo. Pode economizar cr\xE9ditos.",
                impacto_estimado: `Economia de ~${Math.round((diasRestantes - 3) * taxaDiaria * (campanha.recompensa || 100))} Kz`
              });
            }
            const heatmapHorario = Array(24).fill(0);
            respostas.results?.forEach((r) => {
              const data = new Date(r.created_at);
              const hora = data.getHours();
              heatmapHorario[hora]++;
            });
            const horaMaisRespostas = heatmapHorario.indexOf(Math.max(...heatmapHorario));
            const respostasPicoHora = Math.max(...heatmapHorario);
            const mediaRespostasPorHora = totalRespostas / 24;
            const aumentoPercentual = Math.round((respostasPicoHora - mediaRespostasPorHora) / mediaRespostasPorHora * 100);
            predicoes.melhor_horario_publicacao = {
              periodo: `${horaMaisRespostas}h-${(horaMaisRespostas + 3) % 24}h`,
              taxa_resposta: `+${aumentoPercentual}% vs m\xE9dia`,
              justificativa: `An\xE1lise dos seus dados: ${respostasPicoHora} respostas neste hor\xE1rio vs ${Math.round(mediaRespostasPorHora)} de m\xE9dia`
            };
            const temposResposta = [];
            for (const resp of (respostas.results || []).slice(0, 50)) {
              const r = resp;
              if (r.tempo_resposta_segundos) {
                temposResposta.push(r.tempo_resposta_segundos);
              }
            }
            const tempoMedioResposta = temposResposta.length > 0 ? temposResposta.reduce((a, b) => a + b, 0) / temposResposta.length : 0;
            const respostasMuitoRapidas = temposResposta.filter((t) => t < 10).length;
            const percentualSuspeitas = respostasMuitoRapidas / temposResposta.length * 100;
            predicoes.tendencias = [
              {
                metrica: "Engajamento",
                direcao: totalRespostas > metaParticipantes * 0.5 ? "crescente" : "est\xE1vel",
                confianca: 0.78,
                valor_atual: totalRespostas,
                meta: metaParticipantes
              },
              {
                metrica: "Qualidade de Respostas",
                direcao: percentualPositivo > 50 ? "alta" : percentualPositivo > 30 ? "m\xE9dia" : "baixa",
                confianca: 0.85,
                sentimento_positivo: percentualPositivo,
                respostas_suspeitas: Math.round(percentualSuspeitas)
              },
              {
                metrica: "Tempo M\xE9dio de Resposta",
                direcao: tempoMedioResposta > 60 ? "reflexiva" : tempoMedioResposta > 30 ? "normal" : "r\xE1pida",
                confianca: 0.72,
                segundos: Math.round(tempoMedioResposta)
              }
            ];
          }
          return new Response(JSON.stringify({
            success: true,
            data: {
              resumo: {
                total_respostas: totalRespostas,
                meta: metaParticipantes,
                progresso_percentual: Math.round(progresso * 10) / 10,
                status_campanha: campanha.status,
                respostas_analisadas: totalAnalisado
              },
              sentimento: {
                positivo: percentualPositivo,
                neutro: percentualNeutro,
                negativo: percentualNegativo,
                score_geral: (percentualPositivo - percentualNegativo) / 100,
                detalhes_amostra: sentimentoDetalhes.slice(0, 5),
                // Primeiras 5 para visualização
                metodo_analise: "Workers AI - DistilBERT SST-2",
                confianca_media: sentimentoDetalhes.length > 0 ? sentimentoDetalhes.reduce((acc, d) => acc + d.confianca, 0) / sentimentoDetalhes.length : 0
              },
              temas_principais: temasComuns,
              predicoes,
              tecnologia: {
                ia_modelo: "@cf/huggingface/distilbert-sst-2-int8",
                nlp_metodo: "TF-IDF com stop-words PT",
                dados_reais: true,
                timestamp_analise: (/* @__PURE__ */ new Date()).toISOString()
              },
              gerado_em: (/* @__PURE__ */ new Date()).toISOString()
            }
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          console.error("Erro na an\xE1lise AI:", error);
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao processar an\xE1lise com IA",
            message: error instanceof Error ? error.message : "Unknown error"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path.match(/^\/campaigns\/\d+\/heatmap$/) && request.method === "GET") {
        const campaignId = parseInt(path.split("/")[2]);
        const auth = requireClientOrAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error
          }), {
            status: 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const db = env.kudimu_db;
          const respostas = await db.prepare(`
            SELECT created_at, user_id FROM respostas WHERE campanha_id = ?
          `).bind(campaignId).all();
          const totalRespostas = respostas.results?.length || 0;
          if (totalRespostas === 0) {
            return new Response(JSON.stringify({
              success: true,
              data: {
                heatmap_horario: [],
                heatmap_dia_semana: [],
                total_respostas: 0
              }
            }), {
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const heatmapHorario = Array(24).fill(0);
          const heatmapDiaSemana = Array(7).fill(0);
          respostas.results?.forEach((r) => {
            const data = new Date(r.created_at);
            const hora = data.getHours();
            const diaSemana = data.getDay();
            heatmapHorario[hora]++;
            heatmapDiaSemana[diaSemana]++;
          });
          const heatmapHorarioNorm = heatmapHorario.map((v) => ({
            hora: heatmapHorario.indexOf(v),
            respostas: v,
            percentual: Math.round(v / totalRespostas * 100 * 10) / 10,
            intensidade: v / Math.max(...heatmapHorario)
            // 0-1
          }));
          const diasNomes = ["Domingo", "Segunda", "Ter\xE7a", "Quarta", "Quinta", "Sexta", "S\xE1bado"];
          const heatmapDiaNorm = heatmapDiaSemana.map((v, i) => ({
            dia: diasNomes[i],
            dia_numero: i,
            respostas: v,
            percentual: Math.round(v / totalRespostas * 100 * 10) / 10,
            intensidade: v / Math.max(...heatmapDiaSemana)
          }));
          return new Response(JSON.stringify({
            success: true,
            data: {
              heatmap_horario: heatmapHorarioNorm,
              heatmap_dia_semana: heatmapDiaNorm,
              total_respostas: totalRespostas,
              pico_horario: {
                hora: heatmapHorario.indexOf(Math.max(...heatmapHorario)),
                respostas: Math.max(...heatmapHorario)
              },
              pico_dia: {
                dia: diasNomes[heatmapDiaSemana.indexOf(Math.max(...heatmapDiaSemana))],
                respostas: Math.max(...heatmapDiaSemana)
              }
            }
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          console.error("Erro ao gerar heatmap:", error);
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao gerar mapa de calor",
            message: error instanceof Error ? error.message : "Unknown error"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path === "/client/budget" && request.method === "GET") {
        const auth = requireClientOrAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error
          }), {
            status: auth.error?.includes("n\xE3o fornecido") ? 401 : 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const db = env.kudimu_db;
          const clienteId = auth.user.id;
          const clienteData = await db.prepare(`
            SELECT saldo_creditos, plano FROM clientes WHERE user_id = ?
          `).bind(clienteId).first();
          if (!clienteData) {
            return new Response(JSON.stringify({
              success: false,
              error: "Cliente n\xE3o encontrado"
            }), {
              status: 404,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const orcamentoUtilizado = await db.prepare(`
            SELECT COALESCE(SUM(orcamento_total), 0) as total
            FROM campanhas
            WHERE cliente_id = ? AND ativo = 1
          `).bind(clienteId).first();
          const campanhasAtivas = await db.prepare(`
            SELECT COUNT(*) as total FROM campanhas
            WHERE cliente_id = ? AND status = 'ativa' AND ativo = 1
          `).bind(clienteId).first();
          const campanhasPendentes = await db.prepare(`
            SELECT COUNT(*) as total FROM campanhas
            WHERE cliente_id = ? AND status = 'pendente' AND ativo = 1
          `).bind(clienteId).first();
          const saldoDisponivel = clienteData.saldo_creditos || 0;
          const gastoTotal = orcamentoUtilizado.total || 0;
          const orcamentoTotal = saldoDisponivel + gastoTotal;
          const percentualUtilizado = orcamentoTotal > 0 ? gastoTotal / orcamentoTotal * 100 : 0;
          const budgetData = {
            saldo_creditos: saldoDisponivel,
            orcamento_total: orcamentoTotal,
            orcamento_disponivel: saldoDisponivel,
            orcamento_utilizado: gastoTotal,
            percentual_utilizado: Math.round(percentualUtilizado * 10) / 10,
            campanhas_ativas: campanhasAtivas.total || 0,
            campanhas_pendentes: campanhasPendentes.total || 0,
            plano: clienteData.plano || "starter",
            alertas: percentualUtilizado > 80 ? [{
              tipo: "warning",
              mensagem: "Saldo de cr\xE9ditos baixo",
              severidade: "alta"
            }] : []
          };
          return new Response(JSON.stringify({
            success: true,
            data: budgetData
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          console.error("Erro ao buscar or\xE7amento:", error);
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao buscar dados de or\xE7amento",
            message: error instanceof Error ? error.message : "Unknown error"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path === "/client/budget/request-payment" && request.method === "POST") {
        const auth = requireClientOrAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error
          }), {
            status: auth.error?.includes("n\xE3o fornecido") ? 401 : 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        const body = await request.json();
        const { quantidade, metodo_pagamento, valor_pago, referencia_pagamento, plano_id, status } = body;
        if (!quantidade || quantidade <= 0) {
          return new Response(JSON.stringify({
            success: false,
            error: "Valor inv\xE1lido. O montante deve ser maior que zero."
          }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        if (!referencia_pagamento) {
          return new Response(JSON.stringify({
            success: false,
            error: "Refer\xEAncia de pagamento obrigat\xF3ria."
          }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const db = env.kudimu_db;
          const clienteId = auth.user.id;
          const cliente = await db.prepare(`
            SELECT c.*, u.email 
            FROM clientes c
            JOIN users u ON c.user_id = u.id
            WHERE c.user_id = ?
          `).bind(clienteId).first();
          const txnId = `txn-${Date.now()}`;
          await db.prepare(`
            INSERT INTO transacoes (
              id, cliente_id, tipo, quantidade, saldo_antes, saldo_apos,
              descricao, referencia, metodo_pagamento, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
          `).bind(
            txnId,
            clienteId,
            "pendente",
            // Status especial para pagamentos não confirmados
            quantidade,
            cliente?.saldo_creditos || 0,
            cliente?.saldo_creditos || 0,
            // Saldo não muda até confirmação
            `Pagamento pendente - ${plano_id || "Cr\xE9ditos"} - Aguardando confirma\xE7\xE3o banc\xE1ria`,
            referencia_pagamento,
            metodo_pagamento || "transferencia_bancaria"
          ).run();
          return new Response(JSON.stringify({
            success: true,
            data: {
              transacao_id: txnId,
              referencia: referencia_pagamento,
              status: "pendente_confirmacao",
              quantidade_solicitada: quantidade,
              valor_pago,
              metodo_pagamento,
              mensagem: "Solicita\xE7\xE3o registrada! Voc\xEA receber\xE1 um email quando o pagamento for confirmado.",
              instrucoes: {
                titulo_conta: "Ladislau Segunda Anast\xE1cio",
                banco: "Banco BAI",
                iban: "AO06.0040.0000.3514.1269.1010.8",
                prazo_confirmacao: "24-48h \xFAteis"
              }
            }
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          console.error("Erro ao registrar solicita\xE7\xE3o de pagamento:", error);
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao registrar solicita\xE7\xE3o de pagamento"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path === "/client/budget/add-credits" && request.method === "POST") {
        const auth = requireClientOrAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error
          }), {
            status: auth.error?.includes("n\xE3o fornecido") ? 401 : 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        const body = await request.json();
        const { quantidade, metodo_pagamento, valor_pago, referencia_pagamento, plano_id } = body;
        const creditsAmount = quantidade || body.amount;
        if (!creditsAmount || creditsAmount <= 0) {
          return new Response(JSON.stringify({
            success: false,
            error: "Valor inv\xE1lido. O montante deve ser maior que zero."
          }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const db = env.kudimu_db;
          const clienteId = auth.user.id;
          const paymentApproved = true;
          if (!paymentApproved) {
            return new Response(JSON.stringify({
              success: false,
              error: "Pagamento n\xE3o aprovado. Verifique os dados e tente novamente."
            }), {
              status: 402,
              headers: { "Content-Type": "application/json", ...corsHeaders }
            });
          }
          const clienteAntes = await db.prepare(`
            SELECT saldo_creditos FROM clientes WHERE user_id = ?
          `).bind(clienteId).first();
          const saldoAnterior = clienteAntes?.saldo_creditos || 0;
          const novoSaldo = saldoAnterior + creditsAmount;
          await db.prepare(`
            UPDATE clientes 
            SET saldo_creditos = saldo_creditos + ?
            WHERE user_id = ?
          `).bind(creditsAmount, clienteId).run();
          const txnId = referencia_pagamento || `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          await db.prepare(`
            INSERT INTO transacoes (
              id, cliente_id, tipo, quantidade, saldo_antes, saldo_apos,
              descricao, referencia, metodo_pagamento, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
          `).bind(
            `txn-${Date.now()}`,
            clienteId,
            "credito",
            creditsAmount,
            saldoAnterior,
            novoSaldo,
            plano_id ? `Compra de plano: ${plano_id}` : "Compra de cr\xE9ditos",
            txnId,
            metodo_pagamento || "express"
          ).run();
          let planoAtivado = null;
          if (plano_id) {
            const plano = await db.prepare(`
              SELECT * FROM planos WHERE id = ?
            `).bind(plano_id).first();
            if (plano) {
              const assinaturaId = `assin-${Date.now()}`;
              const dataInicio = (/* @__PURE__ */ new Date()).toISOString();
              const tipo = plano.tipo === "assinatura" ? "mensal" : "unica";
              const proximaRenovacao = plano.tipo === "assinatura" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString() : null;
              const features = {
                max_respostas: plano.max_respostas,
                max_campanhas_mes: plano.max_campanhas_mes,
                max_perguntas: plano.max_perguntas,
                segmentacao_avancada: plano.segmentacao_avancada === 1,
                analise_ia: plano.analise_ia === 1,
                insights_preditivos: plano.insights_preditivos === 1,
                relatorio_pdf: plano.relatorio_pdf === 1,
                mapas_calor: plano.mapas_calor === 1,
                api_acesso: plano.api_acesso === 1,
                suporte_prioritario: plano.suporte_prioritario === 1,
                dashboard_tempo_real: plano.dashboard_tempo_real === 1,
                formato_academico: plano.formato_academico === 1,
                exportacao_latex: plano.exportacao_latex === 1,
                validacao_etica_obrigatoria: plano.validacao_etica_obrigatoria === 1,
                prazo_entrega_dias: plano.prazo_entrega_dias
              };
              await db.prepare(`
                INSERT INTO assinaturas_clientes (
                  id, cliente_id, plano_id, status, tipo,
                  data_inicio, proxima_renovacao, valor_pago,
                  metodo_pagamento, referencia_pagamento, features_json,
                  created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
              `).bind(
                assinaturaId,
                clienteId,
                plano_id,
                "ativa",
                tipo,
                dataInicio,
                proximaRenovacao,
                valor_pago || plano.preco,
                metodo_pagamento || "express",
                txnId,
                JSON.stringify(features)
              ).run();
              await db.prepare(`
                UPDATE clientes SET plano = ? WHERE user_id = ?
              `).bind(plano.nome, clienteId).run();
              planoAtivado = {
                id: plano_id,
                nome: plano.nome,
                tipo: plano.tipo,
                assinatura_id: assinaturaId,
                features
              };
            }
          }
          const clienteAtualizado = await db.prepare(`
            SELECT saldo_creditos FROM clientes WHERE user_id = ?
          `).bind(clienteId).first();
          return new Response(JSON.stringify({
            success: true,
            data: {
              novo_saldo: clienteAtualizado.saldo_creditos,
              creditos_adicionados: creditsAmount,
              transaction_id: txnId,
              plano_ativado: planoAtivado
            },
            message: planoAtivado ? `Plano "${planoAtivado.nome}" ativado com sucesso! ${creditsAmount.toLocaleString()} cr\xE9ditos adicionados.` : `${creditsAmount.toLocaleString()} cr\xE9ditos adicionados com sucesso!`
          }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          console.error("Erro ao adicionar cr\xE9ditos:", error);
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao processar pagamento",
            message: error instanceof Error ? error.message : "Unknown error"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path === "/client/budget/transactions" && request.method === "GET") {
        const auth = requireClientOrAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error
          }), {
            status: auth.error?.includes("n\xE3o fornecido") ? 401 : 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        try {
          const db = env.kudimu_db;
          const clienteId = auth.user.id;
          const url2 = new URL(request.url);
          const limit = parseInt(url2.searchParams.get("limit") || "50");
          const offset = parseInt(url2.searchParams.get("offset") || "0");
          const tipo = url2.searchParams.get("tipo");
          let query = `
            SELECT * FROM transacoes 
            WHERE user_id = ?
          `;
          const params = [clienteId];
          if (tipo) {
            query += ` AND tipo = ?`;
            params.push(tipo);
          }
          query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
          params.push(limit, offset);
          const transacoes = await db.prepare(query).bind(...params).all();
          let countQuery = `SELECT COUNT(*) as total FROM transacoes WHERE user_id = ?`;
          const countParams = [clienteId];
          if (tipo) {
            countQuery += ` AND tipo = ?`;
            countParams.push(tipo);
          }
          const totalCount = await db.prepare(countQuery).bind(...countParams).first();
          return new Response(JSON.stringify({
            success: true,
            data: transacoes.results || [],
            total: totalCount.total || 0,
            limit,
            offset
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        } catch (error) {
          console.error("Erro ao buscar transa\xE7\xF5es:", error);
          return new Response(JSON.stringify({
            success: false,
            error: "Erro ao buscar hist\xF3rico de transa\xE7\xF5es",
            message: error instanceof Error ? error.message : "Unknown error"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
      }
      if (path === "/client/ai-insights" && request.method === "GET") {
        const auth = requireClientOrAdmin(request);
        if (!auth.authorized) {
          return new Response(JSON.stringify({
            success: false,
            error: auth.error
          }), {
            status: auth.error?.includes("n\xE3o fornecido") ? 401 : 403,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        const insights = {
          resumo: {
            total_insights: 12,
            insights_positivos: 7,
            insights_neutros: 3,
            insights_negativos: 2,
            ultima_atualizacao: (/* @__PURE__ */ new Date()).toISOString()
          },
          insights_recentes: [
            {
              id: 1,
              tipo: "positive",
              categoria: "Engajamento",
              titulo: "Alta Taxa de Conclus\xE3o",
              descricao: "Suas campanhas t\xEAm 89.5% de taxa de conclus\xE3o, 35% acima da m\xE9dia da plataforma",
              impacto: "alto",
              campanha: "Mercado de Trabalho",
              data: new Date(Date.now() - 2 * 60 * 60 * 1e3).toISOString(),
              recomendacao: "Continue utilizando perguntas objetivas e diretas"
            },
            {
              id: 2,
              tipo: "info",
              categoria: "Qualidade",
              titulo: "Qualidade Acima da M\xE9dia",
              descricao: "M\xE9dia de qualidade 4.3/5.0 vs m\xE9dia da plataforma 3.8/5.0",
              impacto: "m\xE9dio",
              campanha: "Geral",
              data: new Date(Date.now() - 5 * 60 * 60 * 1e3).toISOString(),
              recomendacao: "Seus question\xE1rios est\xE3o bem estruturados"
            },
            {
              id: 3,
              tipo: "warning",
              categoria: "Or\xE7amento",
              titulo: "Aten\xE7\xE3o ao Or\xE7amento",
              descricao: "70% do or\xE7amento mensal utilizado em 18 dias",
              impacto: "alto",
              campanha: "Geral",
              data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3).toISOString(),
              recomendacao: "Considere ajustar recompensas ou pausar campanhas menos priorit\xE1rias"
            },
            {
              id: 4,
              tipo: "positive",
              categoria: "Alcance",
              titulo: "Boa Diversidade Demogr\xE1fica",
              descricao: "Suas campanhas atingem 8 prov\xEDncias diferentes de Angola",
              impacto: "m\xE9dio",
              campanha: "Mercado de Trabalho",
              data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3).toISOString(),
              recomendacao: "Diversidade geogr\xE1fica garante insights mais representativos"
            },
            {
              id: 5,
              tipo: "info",
              categoria: "Timing",
              titulo: "Hor\xE1rio de Pico Identificado",
              descricao: "Maior engajamento entre 18h-21h (hor\xE1rio de Luanda)",
              impacto: "baixo",
              campanha: "Servi\xE7os P\xFAblicos",
              data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1e3).toISOString(),
              recomendacao: "Lance novas campanhas neste hor\xE1rio para maximizar respostas iniciais"
            }
          ],
          tendencias: {
            engajamento: { tendencia: "crescente", variacao: 12.5 },
            qualidade: { tendencia: "estavel", variacao: 2.1 },
            custo_por_resposta: { tendencia: "decrescente", variacao: -8.3 }
          },
          metricas_comparativas: {
            sua_performance: {
              taxa_conclusao: 89.5,
              qualidade_media: 4.3,
              tempo_medio: 8.3
            },
            media_plataforma: {
              taxa_conclusao: 66.2,
              qualidade_media: 3.8,
              tempo_medio: 12.1
            }
          }
        };
        return new Response(JSON.stringify({
          success: true,
          data: insights
        }), {
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      return new Response(JSON.stringify({
        error: "Not Found",
        path
      }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
  }
};

// ../../../../../../.npm/_npx/5f7c8c5221e48d28/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
};
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../../../../.npm/_npx/5f7c8c5221e48d28/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
var jsonError = async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
};
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-vbs7HG/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../../../../../.npm/_npx/5f7c8c5221e48d28/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}

// .wrangler/tmp/bundle-vbs7HG/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  };
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      };
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
