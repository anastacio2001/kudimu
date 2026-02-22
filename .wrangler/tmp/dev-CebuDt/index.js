var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.ts
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
        return new Response(JSON.stringify({
          status: "ok",
          message: "Kudimu Insights API - Local Development",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          environment: "development"
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
      if (path === "/campaigns") {
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
        if (campaignId === "camp_3-1") recompensa = 300;
        if (campaignId === "camp_2-1") recompensa = 400;
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
      if (path.startsWith("/campaigns/")) {
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
          const testUsers = {
            "admin@kudimu.ao": {
              id: "admin-001",
              nome: "Admin Kudimu",
              email: "admin@kudimu.ao",
              telefone: "+244900000001",
              localizacao: "Luanda",
              perfil: "administrador",
              tipo_conta: "admin",
              reputacao: 1e3,
              saldo_pontos: 5e3,
              nivel: "Master",
              verificado: true,
              senha: "admin123",
              ativo: true
            },
            "joao@empresaxyz.ao": {
              id: "cliente-001",
              nome: "Jo\xE3o Silva",
              email: "joao@empresaxyz.ao",
              telefone: "+244900000002",
              localizacao: "Luanda",
              perfil: "empresario",
              tipo_conta: "cliente",
              reputacao: 500,
              saldo_pontos: 2e3,
              nivel: "Gold",
              verificado: true,
              senha: "cliente123",
              ativo: true
            },
            "maria@gmail.com": {
              id: "usuario-001",
              nome: "Maria Santos",
              email: "maria@gmail.com",
              telefone: "+244900000003",
              localizacao: "Benguela",
              perfil: "profissional",
              tipo_conta: "usuario",
              reputacao: 150,
              saldo_pontos: 750,
              nivel: "Bronze",
              verificado: false,
              senha: "usuario123",
              ativo: true
            },
            // Mantendo os usuários antigos para compatibilidade
            "cliente@teste.ao": {
              id: "cliente-002",
              nome: "Cliente Teste",
              email: "cliente@teste.ao",
              telefone: "+244900000004",
              localizacao: "Luanda",
              perfil: "empresario",
              tipo_conta: "cliente",
              reputacao: 500,
              saldo_pontos: 2e3,
              nivel: "Gold",
              verificado: true,
              senha: "cliente123",
              ativo: true
            },
            "usuario@teste.ao": {
              id: "usuario-002",
              nome: "Usu\xE1rio Regular",
              email: "usuario@teste.ao",
              telefone: "+244900000005",
              localizacao: "Luanda",
              perfil: "estudante",
              tipo_conta: "usuario",
              reputacao: 150,
              saldo_pontos: 750,
              nivel: "Bronze",
              verificado: false,
              senha: "usuario123",
              ativo: true
            }
          };
          const user = testUsers[email];
          if (!user || !user.ativo) {
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
          if (user.senha !== senha) {
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
          const token = `jwt-${user.id}-${Date.now()}`;
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
                tipo_usuario: user.tipo_conta,
                // Corrigindo para tipo_usuario
                tipo_conta: user.tipo_conta,
                reputacao: user.reputacao,
                saldo_pontos: user.saldo_pontos,
                nivel: user.nivel,
                verificado: user.verificado,
                data_cadastro: "2025-10-22"
              }
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
      if (path === "/auth/me" && request.method === "GET") {
        try {
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
          const tokenParts = token.split("-");
          if (tokenParts.length < 3 || tokenParts[0] !== "jwt") {
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
          const userId = tokenParts.slice(1, -1).join("-");
          const testUsers = {
            "admin-001": {
              id: "admin-001",
              nome: "Admin Kudimu",
              email: "admin@kudimu.ao",
              telefone: "+244900000001",
              localizacao: "Luanda",
              perfil: "administrador",
              tipo_conta: "admin",
              reputacao: 1e3,
              saldo_pontos: 5e3,
              nivel: "Master",
              verificado: true,
              data_cadastro: "2025-01-01"
            },
            "cliente-001": {
              id: "cliente-001",
              nome: "Jo\xE3o Silva",
              email: "joao@empresaxyz.ao",
              telefone: "+244900000002",
              localizacao: "Luanda",
              perfil: "empresario",
              tipo_conta: "cliente",
              reputacao: 500,
              saldo_pontos: 2e3,
              nivel: "Gold",
              verificado: true,
              data_cadastro: "2025-01-01"
            },
            "usuario-001": {
              id: "usuario-001",
              nome: "Maria Santos",
              email: "maria@gmail.com",
              telefone: "+244900000003",
              localizacao: "Benguela",
              perfil: "profissional",
              tipo_conta: "usuario",
              reputacao: 150,
              saldo_pontos: 750,
              nivel: "Bronze",
              verificado: false,
              data_cadastro: "2025-01-01"
            },
            // Usuários antigos para compatibilidade
            "cliente-002": {
              id: "cliente-002",
              nome: "Cliente Teste",
              email: "cliente@teste.ao",
              telefone: "+244900000004",
              localizacao: "Luanda",
              perfil: "empresario",
              tipo_conta: "cliente",
              reputacao: 500,
              saldo_pontos: 2e3,
              nivel: "Gold",
              verificado: true,
              data_cadastro: "2025-01-01"
            },
            "usuario-002": {
              id: "usuario-002",
              nome: "Usu\xE1rio Regular",
              email: "usuario@teste.ao",
              telefone: "+244900000005",
              localizacao: "Luanda",
              perfil: "estudante",
              tipo_conta: "usuario",
              reputacao: 150,
              saldo_pontos: 750,
              nivel: "Bronze",
              verificado: false,
              data_cadastro: "2025-01-01"
            }
          };
          const user = testUsers[userId];
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
              tipo_usuario: user.tipo_conta,
              // Corrigindo para tipo_usuario
              tipo_conta: user.tipo_conta,
              reputacao: user.reputacao,
              saldo_pontos: user.saldo_pontos,
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
          const { nome, email, senha, telefone, localizacao, perfil, tipo_conta } = body;
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
          const userId = `user-${Date.now()}`;
          const senhaHash = "$2b$10$N9qo8uLOickgx2ZMRitAv.Hg9fUFOsKLhE7R2QE0iOe6H8bOqPJU.";
          const stmt = env.kudimu_db.prepare(`
            INSERT INTO users (
              id, nome, email, telefone, senha_hash, localizacao, perfil, 
              reputacao, saldo_pontos, nivel, verificado, tipo_conta, 
              data_cadastro, ativo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          await stmt.bind(
            userId,
            nome,
            email,
            telefone || "+244 900 000 000",
            senhaHash,
            localizacao || "Luanda",
            perfil || "usuario",
            tipo_conta === "admin" ? 100 : 50,
            // reputacao
            0,
            // saldo_pontos
            tipo_conta === "admin" ? "Embaixador" : "Iniciante",
            // nivel
            tipo_conta === "admin" ? 1 : 0,
            // verificado
            tipo_conta || "usuario",
            (/* @__PURE__ */ new Date()).toISOString(),
            1
            // ativo
          ).run();
          const token = `jwt-${userId}-${Date.now()}`;
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
                tipo_conta: tipo_conta || "usuario",
                reputacao: tipo_conta === "admin" ? 100 : 50,
                saldo_pontos: 0,
                nivel: tipo_conta === "admin" ? "Embaixador" : "Iniciante",
                verificado: tipo_conta === "admin" ? 1 : 0,
                data_cadastro: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
              }
            },
            message: "Conta criada com sucesso!"
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
        const authHeader = request.headers.get("Authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
          return new Response(JSON.stringify({
            success: true,
            data: {
              id: 1,
              nome: "Usu\xE1rio Demo",
              email: "demo@kudimu.com",
              telefone: "+244 900 000 000",
              localizacao: "Luanda",
              reputacao: 145,
              saldo_pontos: 2450,
              nivel: "Confi\xE1vel",
              data_cadastro: "2025-09-15",
              campanhas_respondidas: 23,
              total_ganho: 5800
            }
          }), {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        } else {
          return new Response(JSON.stringify({
            success: false,
            error: "Token de autentica\xE7\xE3o necess\xE1rio"
          }), {
            status: 401,
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
        const tokenParts = token.split("-");
        if (tokenParts.length < 3 || tokenParts[0] !== "jwt") {
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
        const tokenParts = token.split("-");
        if (tokenParts.length < 3 || tokenParts[0] !== "jwt") {
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
        const tokenParts = token.split("-");
        if (tokenParts.length < 3 || tokenParts[0] !== "jwt") {
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
        const tokenParts = token.split("-");
        if (tokenParts.length < 3 || tokenParts[0] !== "jwt") {
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

// ../../../../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
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
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-gu9o8n/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../../../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
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
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-gu9o8n/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
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
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
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
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
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
