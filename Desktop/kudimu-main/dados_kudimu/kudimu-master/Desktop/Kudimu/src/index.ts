// Teste simples primeiro
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Rota principal
      if (path === '/') {
        return new Response(JSON.stringify({ 
          status: 'ok', 
          message: 'Kudimu Insights API - Local Development',
          timestamp: new Date().toISOString(),
          environment: 'development'
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Rota de teste
      if (path === '/test') {
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Backend funcionando!' 
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Rota de campanhas
      if (path === '/campaigns') {
        const mockCampaigns = [
          { 
            id: 1, 
            title: 'Pesquisa sobre Mobilidade Urbana em Luanda', 
            description: 'Queremos entender os hábitos de transporte dos cidadãos de Luanda',
            reward: 500,
            questions: 5,
            status: 'active',
            endDate: '2025-11-30'
          },
          { 
            id: 2, 
            title: 'Opinião sobre E-commerce em Angola', 
            description: 'Pesquisa sobre comportamento de compras online',
            reward: 750,
            questions: 8,
            status: 'active',
            endDate: '2025-12-15'
          }
        ];
        
        return new Response(JSON.stringify({ 
          success: true, 
          data: mockCampaigns 
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Rota para enviar respostas de campanha (deve vir ANTES da rota geral de campanhas)
      if (path.startsWith('/campaigns/') && path.includes('/answers') && request.method === 'POST') {
        const campaignId = path.split('/campaigns/')[1].split('/answers')[0];
        const body = await request.json();
        
        // Determinar recompensa baseada no campaignId
        let recompensa = 500;
        if (campaignId === 'camp_3-1') recompensa = 300;
        if (campaignId === 'camp_2-1') recompensa = 400;
        
        return new Response(JSON.stringify({
          success: true,
          data: {
            answer_id: Date.now(),
            campaign_id: campaignId,
            recompensa: recompensa,
            pontos: recompensa,
            validacao: 'approved',
            message: 'Respostas enviadas com sucesso!'
          }
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Rota para campanha individual
      if (path.startsWith('/campaigns/')) {
        const campaignId = path.split('/campaigns/')[1];
        
        // Mapeamento de IDs simples para IDs completos
        const idMapping: { [key: string]: string } = {
          '1': 'camp_1',
          '2': 'camp_3-1',
          'camp_1': 'camp_1',
          'camp_3-1': 'camp_3-1'
        };
        
        // Usar o ID mapeado ou o ID original se não houver mapeamento
        const mappedId = idMapping[campaignId] || campaignId;
        
        // Mock de dados da campanha individual
        const mockCampaignDetails = {
          'camp_3-1': {
            id: 'camp_3-1',
            title: 'Educação Digital nas Escolas',
            description: 'Pesquisa detalhada sobre o uso de tecnologia na educação em Angola',
            reward: 300,
            questions: [
              {
                id: 1,
                type: 'multiple_choice',
                question: 'Qual a frequência de uso de dispositivos digitais na sua escola?',
                options: ['Diariamente', 'Semanalmente', 'Mensalmente', 'Raramente', 'Nunca']
              },
              {
                id: 2,
                type: 'text',
                question: 'Quais são os principais desafios para implementar tecnologia na educação?'
              },
              {
                id: 3,
                type: 'rating',
                question: 'Como avalia a preparação dos professores para uso de tecnologia?',
                scale: 5
              }
            ],
            status: 'active',
            endDate: '2025-12-31',
            participantsCount: 145,
            targetParticipants: 500,
            category: 'educacao',
            tags: ['educacao', 'digital', 'escolas', 'tecnologia'],
            estimatedTime: '5-7 minutos'
          },
          // Adicionar mais campanhas conforme necessário
          'camp_1': {
            id: 'camp_1',
            title: 'Pesquisa sobre Mobilidade Urbana em Luanda',
            description: 'Queremos entender os hábitos de transporte dos cidadãos de Luanda',
            reward: 500,
            questions: [
              {
                id: 1,
                type: 'multiple_choice',
                question: 'Qual o seu principal meio de transporte?',
                options: ['Táxi', 'Candongueiro', 'Carro próprio', 'Moto', 'A pé']
              }
            ],
            status: 'active',
            endDate: '2025-11-30',
            participantsCount: 89,
            targetParticipants: 300,
            category: 'mobilidade',
            tags: ['transporte', 'luanda', 'mobilidade'],
            estimatedTime: '3-5 minutos'
          },
          'camp_2-1': {
            id: 'camp_2-1',
            title: 'Hábitos de Consumo Digital em Angola',
            description: 'Pesquisa sobre como os angolanos consomem conteúdo digital e usam plataformas online',
            reward: 400,
            questions: [
              {
                id: 1,
                type: 'multiple_choice',
                question: 'Quantas horas por dia passa nas redes sociais?',
                options: ['Menos de 1 hora', '1-3 horas', '3-5 horas', '5-8 horas', 'Mais de 8 horas']
              },
              {
                id: 2,
                type: 'multiple_choice',
                question: 'Qual a sua plataforma de vídeo preferida?',
                options: ['YouTube', 'TikTok', 'Instagram', 'Facebook', 'WhatsApp Status']
              },
              {
                id: 3,
                type: 'text',
                question: 'Que tipo de conteúdo mais gosta de consumir online?'
              }
            ],
            status: 'active',
            endDate: '2025-12-15',
            participantsCount: 67,
            targetParticipants: 400,
            category: 'digital',
            tags: ['redes sociais', 'digital', 'consumo', 'angola'],
            estimatedTime: '4-6 minutos'
          }
        };

        const campaign = mockCampaignDetails[mappedId as keyof typeof mockCampaignDetails];
        
        if (!campaign) {
          return new Response(JSON.stringify({ 
            error: 'Campaign not found',
            message: `Campanha ${campaignId} não encontrada`
          }), {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }

        return new Response(JSON.stringify({ 
          success: true, 
          data: campaign 
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // ===== REPUTATION ENDPOINTS =====
      
      // Rota para obter reputação do usuário
      if (path === '/reputation/me/1' && request.method === 'GET') {
        return new Response(JSON.stringify({
          success: true,
          data: {
            user_id: 1,
            total_score: 145,
            level: 'Confiável',
            badges: ['Iniciante', 'Participativo', 'Confiável'],
            recent_activities: [
              { action: 'survey_completed', points: 25, date: '2025-01-20' },
              { action: 'quality_response', points: 15, date: '2025-01-19' },
              { action: 'referral_bonus', points: 50, date: '2025-01-18' }
            ]
          }
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // ===== ANSWERS ENDPOINTS =====
      
      // Rota para obter respostas do usuário
      if (path === '/answers/me/1' && request.method === 'GET') {
        return new Response(JSON.stringify({
          success: true,
          data: {
            answers: [
              {
                id: 1,
                campaign_id: 'camp_1',
                campaign_title: 'Pesquisa sobre Mobilidade Urbana',
                completed_at: '2025-01-20T10:30:00Z',
                reward_earned: 500
              },
              {
                id: 2,
                campaign_id: 'camp_3-1',
                campaign_title: 'Educação Digital nas Escolas',
                completed_at: '2025-01-19T15:45:00Z',
                reward_earned: 300
              }
            ],
            total_answers: 2,
            total_earned: 800
          }
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Rota para verificar banco de dados
      if (path === '/db/status') {
        try {
          // Verificar se o binding D1 está disponível
          if (!env.kudimu_db) {
            return new Response(JSON.stringify({ 
              error: 'Database binding not available',
              message: 'kudimu_db binding is not configured'
            }), {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            });
          }

          // Tentar listar as tabelas
          const result = await env.kudimu_db.prepare(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name NOT LIKE 'sqlite_%'
            ORDER BY name
          `).all();

          return new Response(JSON.stringify({ 
            success: true,
            tables: result.results,
            tableCount: result.results.length,
            message: 'Database connection successful'
          }), {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });

        } catch (error) {
          return new Response(JSON.stringify({ 
            error: 'Database error',
            message: error instanceof Error ? error.message : 'Unknown error'
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
      }

      // Sistema de Recomendações Inteligentes
      if (path === '/recommendations' && request.method === 'GET') {
        try {
          const url = new URL(request.url);
          const userId = url.searchParams.get('userId') || '1';
          
          // Mock data do usuário para recomendações
          const userProfile = {
            id: userId,
            localizacao: 'Luanda',
            interesses: ['tecnologia', 'saude', 'educacao'],
            nivel_reputacao: 'Confiável',
            campanhas_completadas: 15,
            areas_preferidas: ['comercial', 'social'],
            tempo_medio_resposta: 180 // segundos
          };

          // Mock de campanhas disponíveis
          const availableCampaigns = [
            {
              id: 'camp_1',
              titulo: 'Pesquisa sobre Apps de Delivery em Luanda',
              tema: 'tecnologia',
              tipo: 'comercial',
              recompensa_por_resposta: 350,
              localizacao_alvo: 'Luanda',
              reputacao_minima: 0,
              tempo_estimado: 240,
              tags: ['delivery', 'apps', 'tecnologia'],
              urgencia: 'alta'
            },
            {
              id: 'camp_2',
              titulo: 'Impacto da Telemedicina em Angola',
              tema: 'saude',
              tipo: 'social',
              recompensa_por_resposta: 400,
              localizacao_alvo: 'Nacional',
              reputacao_minima: 100,
              tempo_estimado: 180,
              tags: ['saude', 'telemedicina', 'digital'],
              urgencia: 'media'
            },
            {
              id: 'camp_3',
              titulo: 'Educação Digital nas Escolas',
              tema: 'educacao',
              tipo: 'social',
              recompensa_por_resposta: 300,
              localizacao_alvo: 'Luanda',
              reputacao_minima: 50,
              tempo_estimado: 200,
              tags: ['educacao', 'digital', 'escolas'],
              urgencia: 'baixa'
            },
            {
              id: 'camp_4',
              titulo: 'Comportamento do Consumidor Angolano',
              tema: 'consumo',
              tipo: 'comercial',
              recompensa_por_resposta: 250,
              localizacao_alvo: 'Nacional',
              reputacao_minima: 0,
              tempo_estimado: 150,
              tags: ['consumo', 'comportamento', 'mercado'],
              urgencia: 'media'
            }
          ];

          // Algoritmo de recomendação
          const recommendations = availableCampaigns.map(campaign => {
            let score = 0;
            let reasons = [];

            // 1. Matching por interesse (30 pontos)
            if (userProfile.interesses.includes(campaign.tema)) {
              score += 30;
              reasons.push(`Interesse em ${campaign.tema}`);
            }

            // 2. Matching por localização (20 pontos)
            if (campaign.localizacao_alvo === userProfile.localizacao || campaign.localizacao_alvo === 'Nacional') {
              score += 20;
              reasons.push('Localização compatível');
            }

            // 3. Reputação suficiente (15 pontos)
            const nivelPontos: Record<string, number> = { 'Iniciante': 0, 'Confiável': 100, 'Líder': 300, 'Embaixador': 1000 };
            if ((nivelPontos[userProfile.nivel_reputacao] || 0) >= campaign.reputacao_minima) {
              score += 15;
              reasons.push('Reputação adequada');
            }

            // 4. Tipo de campanha preferido (10 pontos)
            if (userProfile.areas_preferidas.includes(campaign.tipo)) {
              score += 10;
              reasons.push(`Preferência por campanhas ${campaign.tipo}s`);
            }

            // 5. Tempo compatível (10 pontos)
            if (Math.abs(campaign.tempo_estimado - userProfile.tempo_medio_resposta) < 60) {
              score += 10;
              reasons.push('Tempo estimado compatível');
            }

            // 6. Recompensa atrativa (10 pontos)
            if (campaign.recompensa_por_resposta >= 300) {
              score += 10;
              reasons.push('Recompensa atrativa');
            }

            // 7. Urgência (5 pontos)
            const urgenciaPontos: Record<string, number> = { 'alta': 5, 'media': 3, 'baixa': 1 };
            score += urgenciaPontos[campaign.urgencia] || 0;
            if (campaign.urgencia === 'alta') {
              reasons.push('Campanha urgente');
            }

            return {
              ...campaign,
              recommendation_score: score,
              match_percentage: Math.min(Math.round((score / 100) * 100), 100),
              reasons: reasons,
              recommended: score >= 40 // Threshold para recomendação
            };
          });

          // Ordenar por score descendente
          recommendations.sort((a, b) => b.recommendation_score - a.recommendation_score);

          // Separar em categorias
          const highlyRecommended = recommendations.filter(r => r.recommendation_score >= 60);
          const recommended = recommendations.filter(r => r.recommendation_score >= 40 && r.recommendation_score < 60);
          const other = recommendations.filter(r => r.recommendation_score < 40);

          return new Response(JSON.stringify({
            success: true,
            data: {
              user_profile: userProfile,
              recommendations: {
                highly_recommended: highlyRecommended,
                recommended: recommended,
                other: other
              },
              total_campaigns: recommendations.length,
              algorithm_version: '1.0',
              generated_at: new Date().toISOString()
            }
          }), {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });

        } catch (error) {
          return new Response(JSON.stringify({
            error: 'Recommendation error',
            message: error instanceof Error ? error.message : 'Unknown error'
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
      }

      // Rota de login
      if (path === '/auth/login' && request.method === 'POST') {
        try {
          const body = await request.json();
          const { email, senha } = body;
          
          if (!email || !senha) {
            return new Response(JSON.stringify({ 
              success: false, 
              error: 'Email e senha são obrigatórios' 
            }), {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            });
          }

          // Buscar usuário no banco de dados
          const stmt = env.kudimu_db.prepare(`
            SELECT id, nome, email, telefone, localizacao, perfil, reputacao, 
                   saldo_pontos, nivel, verificado, tipo_conta, senha_hash, ativo
            FROM users 
            WHERE email = ? AND ativo = 1
          `);
          
          const user = await stmt.bind(email).first();
          
          if (!user) {
            return new Response(JSON.stringify({ 
              success: false, 
              error: 'Usuário não encontrado ou inativo' 
            }), {
              status: 401,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            });
          }

          // Verificar senha (em produção, usar bcrypt)
          // Por enquanto, verificação simples para teste
          const senhaCorreta = user.senha_hash === '$2b$10$N9qo8uLOickgx2ZMRitAv.Hg9fUFOsKLhE7R2QE0iOe6H8bOqPJU.' && 
            (senha === 'admin123' || senha === 'cliente123' || senha === 'usuario123');
          
          if (!senhaCorreta) {
            return new Response(JSON.stringify({ 
              success: false, 
              error: 'Senha incorreta' 
            }), {
              status: 401,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            });
          }

          // Gerar token JWT (simplificado para desenvolvimento)
          const token = `jwt-${user.id}-${Date.now()}`;
          
          return new Response(JSON.stringify({ 
            success: true, 
            data: {
              token: token,
              user: { 
                id: user.id, 
                nome: user.nome,
                email: user.email,
                telefone: user.telefone,
                localizacao: user.localizacao,
                perfil: user.perfil,
                tipo_conta: user.tipo_conta,
                reputacao: user.reputacao,
                saldo_pontos: user.saldo_pontos,
                nivel: user.nivel,
                verificado: user.verificado,
                data_cadastro: '2025-10-22'
              }
            }
          }), {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });

        } catch (error) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Erro interno do servidor: ' + (error as Error).message
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
      }

      // Rota para obter dados do usuário logado
      if (path === '/auth/me' && request.method === 'GET') {
        try {
          const authHeader = request.headers.get('Authorization');
          
          if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ 
              success: false, 
              error: 'Token de autorização necessário' 
            }), {
              status: 401,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            });
          }

          const token = authHeader.substring(7); // Remove 'Bearer '
          
          // Extrair ID do usuário do token (formato: jwt-{userId}-{timestamp})
          const tokenParts = token.split('-');
          if (tokenParts.length < 3 || tokenParts[0] !== 'jwt') {
            return new Response(JSON.stringify({ 
              success: false, 
              error: 'Token inválido' 
            }), {
              status: 401,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            });
          }

          // Reconstruir o userId (pode ter hífens no meio)
          const userId = tokenParts.slice(1, -1).join('-');
          
          // Buscar dados atualizados do usuário no banco
          const stmt = env.kudimu_db.prepare(`
            SELECT id, nome, email, telefone, localizacao, perfil, reputacao, 
                   saldo_pontos, nivel, verificado, tipo_conta, data_cadastro
            FROM users 
            WHERE id = ? AND ativo = 1
          `);
          
          const user = await stmt.bind(userId).first();
          
          if (!user) {
            return new Response(JSON.stringify({ 
              success: false, 
              error: 'Usuário não encontrado' 
            }), {
              status: 404,
              headers: {
                'Content-Type': 'application/json',
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
              tipo_conta: user.tipo_conta,
              reputacao: user.reputacao,
              saldo_pontos: user.saldo_pontos,
              nivel: user.nivel,
              verificado: user.verificado,
              data_cadastro: user.data_cadastro
            }
          }), {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });

        } catch (error) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Erro interno do servidor: ' + (error as Error).message
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
      }

      // Rota de registro
      if (path === '/auth/register' && request.method === 'POST') {
        try {
          const body = await request.json();
          const { nome, email, senha, telefone, localizacao, perfil, tipo_conta } = body;
          
          if (!nome || !email || !senha) {
            return new Response(JSON.stringify({ 
              success: false, 
              error: 'Nome, email e senha são obrigatórios' 
            }), {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            });
          }

          // Verificar se email já existe
          const existingUser = await env.kudimu_db.prepare(`
            SELECT id FROM users WHERE email = ?
          `).bind(email).first();

          if (existingUser) {
            return new Response(JSON.stringify({ 
              success: false, 
              error: 'Email já está em uso' 
            }), {
              status: 409,
              headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
              }
            });
          }

          // Gerar ID único
          const userId = `user-${Date.now()}`;
          
          // Hash da senha (simplificado para teste)
          const senhaHash = '$2b$10$N9qo8uLOickgx2ZMRitAv.Hg9fUFOsKLhE7R2QE0iOe6H8bOqPJU.';

          // Inserir usuário no banco
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
            telefone || '+244 900 000 000',
            senhaHash,
            localizacao || 'Luanda',
            perfil || 'usuario',
            tipo_conta === 'admin' ? 100 : 50, // reputacao
            0.0, // saldo_pontos
            tipo_conta === 'admin' ? 'Embaixador' : 'Iniciante', // nivel
            tipo_conta === 'admin' ? 1 : 0, // verificado
            tipo_conta || 'usuario',
            new Date().toISOString(),
            1 // ativo
          ).run();

          // Gerar token
          const token = `jwt-${userId}-${Date.now()}`;

          return new Response(JSON.stringify({ 
            success: true, 
            data: {
              token: token,
              user: { 
                id: userId,
                nome: nome,
                email: email,
                telefone: telefone || '+244 900 000 000',
                localizacao: localizacao || 'Luanda',
                perfil: perfil || 'usuario',
                tipo_conta: tipo_conta || 'usuario',
                reputacao: tipo_conta === 'admin' ? 100 : 50,
                saldo_pontos: 0.0,
                nivel: tipo_conta === 'admin' ? 'Embaixador' : 'Iniciante',
                verificado: tipo_conta === 'admin' ? 1 : 0,
                data_cadastro: new Date().toISOString().split('T')[0]
              }
            },
            message: 'Conta criada com sucesso!'
          }), {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });

        } catch (error) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Erro interno do servidor: ' + (error as Error).message
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
      }

      // Rota para obter dados do usuário logado
      if (path === '/auth/me' && request.method === 'GET') {
        const authHeader = request.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          return new Response(JSON.stringify({ 
            success: true, 
            data: {
              id: 1, 
              nome: 'Usuário Demo',
              email: 'demo@kudimu.com',
              telefone: '+244 900 000 000',
              localizacao: 'Luanda',
              reputacao: 145,
              saldo_pontos: 2450.0,
              nivel: 'Confiável',
              data_cadastro: '2025-09-15',
              campanhas_respondidas: 23,
              total_ganho: 5800.0
            }
          }), {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        } else {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Token de autenticação necessário' 
          }), {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
      }

      // Rota de logout
      if (path === '/auth/logout' && request.method === 'POST') {
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Logout realizado com sucesso'
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // ===== PUSH NOTIFICATIONS ENDPOINTS =====
      
      // Subscribe para push notifications
      if (path === '/push/subscribe' && request.method === 'POST') {
        try {
          const body = await request.json();
          const { subscription, userAgent } = body;
          
          // Mock response para desenvolvimento
          return new Response(JSON.stringify({
            success: true,
            message: 'Subscription salva com sucesso',
            data: {
              id: 'sub_' + Date.now(),
              endpoint: subscription.endpoint,
              created_at: new Date().toISOString()
            }
          }), {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Erro ao processar subscription'
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
      }

      // Unsubscribe de push notifications
      if (path === '/push/unsubscribe' && request.method === 'POST') {
        try {
          const body = await request.json();
          const { endpoint } = body;
          
          return new Response(JSON.stringify({
            success: true,
            message: 'Unsubscribe realizado com sucesso'
          }), {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Erro ao processar unsubscribe'
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
      }

      // Enviar notificação de teste
      if (path === '/push/test' && request.method === 'POST') {
        try {
          return new Response(JSON.stringify({
            success: true,
            message: 'Notificação de teste enviada!',
            data: {
              title: 'Teste - Kudimu Insights',
              body: 'Esta é uma notificação de teste. Sistema funcionando perfeitamente!',
              timestamp: new Date().toISOString()
            }
          }), {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Erro ao enviar notificação de teste'
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
      }

      // Buscar configurações de notificação
      if (path === '/push/settings' && request.method === 'GET') {
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
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Atualizar configurações de notificação
      if (path === '/push/settings' && request.method === 'PUT') {
        try {
          const body = await request.json();
          
          return new Response(JSON.stringify({
            success: true,
            message: 'Configurações atualizadas com sucesso',
            data: body
          }), {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Erro ao atualizar configurações'
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
      }

      // ===== END PUSH NOTIFICATIONS =====

      // ===== ANGOLA PAYMENTS API =====
      
      // Criar intenção de pagamento
      if (path === '/payments/create-intent' && request.method === 'POST') {
        try {
          const body = await request.json();
          const { amount, method, currency = 'AOA', metadata = {} } = body;

          // Validação básica
          if (!amount || amount <= 0) {
            return new Response(JSON.stringify({
              success: false,
              error: 'Valor do pagamento deve ser maior que zero'
            }), {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
          }

          const paymentMethods = ['bank_transfer', 'unitel_money', 'zap', 'card_local', 'cash'];
          if (!method || !paymentMethods.includes(method)) {
            return new Response(JSON.stringify({
              success: false,
              error: 'Método de pagamento não suportado'
            }), {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
          }

          // Gerar ID único para o pagamento
          const paymentId = 'pay_' + Date.now() + Math.random().toString(36).substr(2, 9);
          const reference = method.toUpperCase().substr(0, 3) + Date.now() + Math.floor(Math.random() * 1000);
          
          const paymentIntent: any = {
            id: paymentId,
            amount: amount,
            currency: currency,
            method: method,
            status: 'pending',
            created_at: new Date().toISOString(),
            metadata: metadata,
            reference: reference
          };

          // Adicionar detalhes específicos por método
          switch (method) {
            case 'bank_transfer':
              paymentIntent.bank_details = {
                account_number: '0000123456789',
                account_name: 'KUDIMU PLATFORM LDA',
                bank_name: 'Banco Angolano de Investimentos',
                bank_code: 'BAI',
                reference: reference,
                instructions: `Transferir ${amount} AOA para a conta indicada usando a referência ${reference}`
              };
              break;
            case 'unitel_money':
              paymentIntent.mobile_details = {
                operator: 'Unitel Money',
                number: '+244 923 456 789',
                reference: reference,
                instructions: `Enviar ${amount} AOA para +244 923 456 789 com referência ${reference}`
              };
              break;
            case 'zap':
              paymentIntent.mobile_details = {
                operator: 'Zap',
                number: '+244 936 123 456',
                reference: reference,
                instructions: `Enviar ${amount} AOA para +244 936 123 456 com referência ${reference}`
              };
              break;
            case 'card_local':
              paymentIntent.card_details = { 
                requires_confirmation: true,
                supported_cards: ['Visa', 'Mastercard', 'Multicaixa']
              };
              break;
            case 'cash':
              paymentIntent.cash_details = {
                locations: [
                  'Loja Kudimu - Luanda, Ilha do Cabo',
                  'Agente Kudimu - Talatona, Condomínio Kikuxi'
                ],
                reference: reference,
                instructions: `Apresente a referência ${reference} em um dos locais indicados`
              };
              break;
          }

          return new Response(JSON.stringify({
            success: true,
            data: paymentIntent
          }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });

        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Erro ao criar intenção de pagamento'
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }
      }

      // Confirmar pagamento
      if (path.match(/^\/payments\/(.+)\/confirm$/) && request.method === 'POST') {
        try {
          const pathParts = path.split('/');
          const paymentId = pathParts[2];
          const body = await request.json();

          const confirmation = {
            id: paymentId,
            status: 'confirmed',
            confirmed_at: new Date().toISOString(),
            transaction_id: 'txn_' + Date.now() + Math.random().toString(36).substr(2, 9),
            confirmation_data: body
          };

          return new Response(JSON.stringify({
            success: true,
            data: confirmation
          }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });

        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Erro ao confirmar pagamento'
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }
      }

      // Verificar status do pagamento
      if (path.match(/^\/payments\/(.+)\/status$/) && request.method === 'GET') {
        try {
          const pathParts = path.split('/');
          const paymentId = pathParts[2];

          // Simular consulta de status
          const status = {
            id: paymentId,
            status: Math.random() > 0.5 ? 'confirmed' : 'pending',
            last_updated: new Date().toISOString()
          };

          return new Response(JSON.stringify({
            success: true,
            data: status
          }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });

        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Erro ao verificar status do pagamento'
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }
      }

      // Cancelar pagamento
      if (path.match(/^\/payments\/(.+)\/cancel$/) && request.method === 'POST') {
        try {
          const pathParts = path.split('/');
          const paymentId = pathParts[2];

          const cancellation = {
            id: paymentId,
            status: 'cancelled',
            cancelled_at: new Date().toISOString()
          };

          return new Response(JSON.stringify({
            success: true,
            data: cancellation
          }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });

        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Erro ao cancelar pagamento'
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }
      }

      // Listar métodos de pagamento disponíveis
      if (path === '/payments/methods' && request.method === 'GET') {
        const paymentMethods = [
          {
            id: 'bank_transfer',
            name: 'Transferência Bancária',
            description: 'Transferência via banco angolano',
            supported_banks: [
              { code: 'BAI', name: 'Banco Angolano de Investimentos' },
              { code: 'BFA', name: 'Banco de Fomento Angola' },
              { code: 'BIC', name: 'Banco BIC' },
              { code: 'BPC', name: 'Banco de Poupança e Crédito' }
            ]
          },
          {
            id: 'unitel_money',
            name: 'Unitel Money',
            description: 'Pagamento via Unitel Money',
            operator: 'Unitel'
          },
          {
            id: 'zap',
            name: 'Zap',
            description: 'Pagamento via Zap',
            operator: 'Zap'
          },
          {
            id: 'card_local',
            name: 'Cartão de Crédito/Débito',
            description: 'Cartões emitidos em Angola',
            supported_cards: ['Visa', 'Mastercard', 'Multicaixa']
          },
          {
            id: 'cash',
            name: 'Pagamento Presencial',
            description: 'Pagamento em dinheiro em pontos físicos',
            locations: 2
          }
        ];

        return new Response(JSON.stringify({
          success: true,
          data: paymentMethods
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // ===== END ANGOLA PAYMENTS =====

      // 404 para outras rotas
      return new Response(JSON.stringify({ 
        error: 'Not Found',
        path: path 
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  },
};