/**
 * Sistema de Reputação e Gamificação - Kudimu Insights
 * Gerencia níveis, pontuação, medalhas e ranking
 */

// NÍVEIS DE USUÁRIO
export const NIVEIS = {
  INICIANTE: {
    nome: 'Iniciante',
    minReputacao: 0,
    maxReputacao: 99,
    cor: '#9E9E9E',
    icone: '🌱',
    beneficios: ['Acesso a campanhas básicas', 'Recompensas padrão']
  },
  CONFIAVEL: {
    nome: 'Confiável',
    minReputacao: 100,
    maxReputacao: 299,
    cor: '#2196F3',
    icone: '⭐',
    beneficios: ['Acesso a todas as campanhas', 'Recompensas padrão', '+5% bônus']
  },
  LIDER: {
    nome: 'Líder',
    minReputacao: 300,
    maxReputacao: 499,
    cor: '#FF9800',
    icone: '👑',
    beneficios: ['Campanhas exclusivas', '+10% bônus', 'Convites antecipados']
  },
  EMBAIXADOR: {
    nome: 'Embaixador',
    minReputacao: 500,
    maxReputacao: Infinity,
    cor: '#9C27B0',
    icone: '💎',
    beneficios: ['Todas as campanhas', '+20% bônus', 'Moderação', 'Recompensas premium']
  }
};

// AÇÕES QUE GERAM PONTOS
export const ACOES_REPUTACAO = {
  RESPOSTA_VALIDADA: { pontos: 10, descricao: 'Resposta validada' },
  RESPOSTA_REJEITADA: { pontos: -5, descricao: 'Resposta rejeitada' },
  PRIMEIRA_CAMPANHA: { pontos: 20, descricao: 'Primeira campanha completa' },
  CAMPANHA_COMPLETA: { pontos: 15, descricao: 'Campanha completa' },
  RESPOSTA_RAPIDA: { pontos: 5, descricao: 'Resposta rápida (<2min)' },
  RESPOSTA_DETALHADA: { pontos: 8, descricao: 'Resposta detalhada (>100 chars)' },
  CONVITE_ACEITO: { pontos: 25, descricao: 'Amigo convidado participou' },
  COMPARTILHAMENTO: { pontos: 5, descricao: 'Compartilhou campanha' },
  LOGIN_DIARIO: { pontos: 2, descricao: 'Login diário' },
  PERFIL_COMPLETO: { pontos: 30, descricao: 'Perfil 100% completo' },
  AVALIACAO_POSITIVA: { pontos: 15, descricao: 'Avaliação positiva de cliente' },
  DENUNCIA_PROCEDENTE: { pontos: 10, descricao: 'Denúncia procedente' },
  SPAM_DETECTADO: { pontos: -20, descricao: 'Spam detectado' },
  INATIVIDADE_30_DIAS: { pontos: -10, descricao: 'Inatividade >30 dias' }
};

// MEDALHAS
export const MEDALHAS = {
  PIONEIRO: {
    id: 'pioneiro',
    nome: 'Pioneiro',
    descricao: 'Um dos primeiros 1000 usuários',
    icone: '🚀',
    raridade: 'lendária',
    criterio: (usuario) => usuario.id <= 1000
  },
  MARATONISTA: {
    id: 'maratonista',
    nome: 'Maratonista',
    descricao: '100 campanhas completas',
    icone: '🏃',
    raridade: 'épica',
    criterio: (usuario) => usuario.campanhas_completas >= 100
  },
  INFLUENCER: {
    id: 'influencer',
    nome: 'Influencer',
    descricao: '50 convites aceitos',
    icone: '📢',
    raridade: 'rara',
    criterio: (usuario) => usuario.convites_aceitos >= 50
  },
  DETALHISTA: {
    id: 'detalhista',
    nome: 'Detalhista',
    descricao: '500 respostas detalhadas',
    icone: '📝',
    raridade: 'comum',
    criterio: (usuario) => usuario.respostas_detalhadas >= 500
  },
  RELAMPAGO: {
    id: 'relampago',
    nome: 'Relâmpago',
    descricao: '100 respostas em <2min',
    icone: '⚡',
    raridade: 'comum',
    criterio: (usuario) => usuario.respostas_rapidas >= 100
  },
  CONSTANTE: {
    id: 'constante',
    nome: 'Constante',
    descricao: '30 dias consecutivos',
    icone: '🔥',
    raridade: 'rara',
    criterio: (usuario) => usuario.streak_dias >= 30
  },
  PERFEITO: {
    id: 'perfeito',
    nome: 'Perfeito',
    descricao: '100% de aprovação em 50 campanhas',
    icone: '💯',
    raridade: 'épica',
    criterio: (usuario) => usuario.taxa_aprovacao === 100 && usuario.campanhas_completas >= 50
  },
  GUARDIAO: {
    id: 'guardiao',
    nome: 'Guardião',
    descricao: '20 denúncias procedentes',
    icone: '🛡️',
    raridade: 'rara',
    criterio: (usuario) => usuario.denuncias_procedentes >= 20
  }
};

/**
 * Calcula o nível atual do usuário
 */
export function calcularNivel(reputacao: number) {
  if (reputacao >= NIVEIS.EMBAIXADOR.minReputacao) return NIVEIS.EMBAIXADOR;
  if (reputacao >= NIVEIS.LIDER.minReputacao) return NIVEIS.LIDER;
  if (reputacao >= NIVEIS.CONFIAVEL.minReputacao) return NIVEIS.CONFIAVEL;
  return NIVEIS.INICIANTE;
}

/**
 * Calcula progresso até o próximo nível
 */
export function calcularProgressoNivel(reputacao: number) {
  const nivelAtual = calcularNivel(reputacao);
  
  if (nivelAtual === NIVEIS.EMBAIXADOR) {
    return { progresso: 100, proximoNivel: null, pontosNecessarios: 0 };
  }

  let proximoNivel;
  if (nivelAtual === NIVEIS.INICIANTE) proximoNivel = NIVEIS.CONFIAVEL;
  else if (nivelAtual === NIVEIS.CONFIAVEL) proximoNivel = NIVEIS.LIDER;
  else proximoNivel = NIVEIS.EMBAIXADOR;

  const pontosNivel = reputacao - nivelAtual.minReputacao;
  const pontosNecessarios = proximoNivel.minReputacao - nivelAtual.minReputacao;
  const progresso = Math.round((pontosNivel / pontosNecessarios) * 100);

  return {
    progresso,
    proximoNivel: proximoNivel.nome,
    pontosNecessarios: proximoNivel.minReputacao - reputacao
  };
}

/**
 * Calcula bônus de recompensa baseado no nível
 */
export function calcularBonusRecompensa(reputacao: number, valorBase: number) {
  const nivel = calcularNivel(reputacao);
  
  let multiplicador = 1.0;
  if (nivel === NIVEIS.CONFIAVEL) multiplicador = 1.05; // +5%
  else if (nivel === NIVEIS.LIDER) multiplicador = 1.10; // +10%
  else if (nivel === NIVEIS.EMBAIXADOR) multiplicador = 1.20; // +20%

  return Math.round(valorBase * multiplicador);
}

/**
 * Verifica quais medalhas o usuário conquistou
 */
export function verificarMedalhas(usuario: any) {
  const medalhasConquistadas = [];

  for (const [key, medalha] of Object.entries(MEDALHAS)) {
    if (medalha.criterio(usuario)) {
      medalhasConquistadas.push({
        id: medalha.id,
        nome: medalha.nome,
        descricao: medalha.descricao,
        icone: medalha.icone,
        raridade: medalha.raridade
      });
    }
  }

  return medalhasConquistadas;
}

/**
 * Valida qualidade da resposta
 */
export function validarQualidadeResposta(resposta: any, tempoResposta: number): {
  valida: boolean;
  motivo?: string;
  pontosAdicionais: number;
} {
  let pontosAdicionais = 0;

  // Resposta muito rápida (suspeita de spam)
  if (tempoResposta < 5) {
    return {
      valida: false,
      motivo: 'Resposta muito rápida (possível spam)',
      pontosAdicionais: 0
    };
  }

  // Resposta rápida mas não suspeita
  if (tempoResposta < 120) {
    pontosAdicionais += ACOES_REPUTACAO.RESPOSTA_RAPIDA.pontos;
  }

  // Resposta detalhada (se for texto)
  if (typeof resposta === 'string' && resposta.length > 100) {
    pontosAdicionais += ACOES_REPUTACAO.RESPOSTA_DETALHADA.pontos;
  }

  // Resposta vazia ou muito curta
  if (typeof resposta === 'string' && resposta.trim().length < 3) {
    return {
      valida: false,
      motivo: 'Resposta muito curta ou vazia',
      pontosAdicionais: 0
    };
  }

  // Detectar padrões de spam
  if (typeof resposta === 'string') {
    const textoLower = resposta.toLowerCase();
    const spamPatterns = ['asdfgh', '123456', 'aaaaaa', 'test', 'teste'];
    
    for (const pattern of spamPatterns) {
      if (textoLower.includes(pattern)) {
        return {
          valida: false,
          motivo: 'Padrão de spam detectado',
          pontosAdicionais: 0
        };
      }
    }
  }

  return {
    valida: true,
    pontosAdicionais
  };
}

/**
 * Gera ranking de usuários
 */
export async function gerarRanking(db: any, limite: number = 100) {
  const { results } = await db
    .prepare(`
      SELECT 
        id, nome, reputacao, saldo_pontos, nivel,
        (SELECT COUNT(*) FROM answers WHERE usuario_id = users.id AND validada = 1) as campanhas_completas
      FROM users 
      WHERE ativo = 1 
      ORDER BY reputacao DESC, saldo_pontos DESC 
      LIMIT ?
    `)
    .bind(limite)
    .all();

  return results.map((user: any, index: number) => ({
    posicao: index + 1,
    ...user,
    nivelInfo: calcularNivel(user.reputacao)
  }));
}
