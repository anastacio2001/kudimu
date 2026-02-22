// ========================================
// DADOS MOCK PARA DESENVOLVIMENTO
// ========================================
// Use estes dados quando DEV_MODE=true
// ========================================

export const MOCK_USERS = {
  'admin@kudimu.ao': {
    id: 'admin-001',
    nome: 'Admin Kudimu',
    email: 'admin@kudimu.ao',
    telefone: '+244900000001',
    localizacao: 'Luanda',
    perfil: 'administrador',
    tipo_usuario: 'admin',
    reputacao: 1000,
    saldo_pontos: 5000,
    nivel: 'Master',
    verificado: true,
    senha: 'admin123',
    senha_hash: 'mock_hash_admin123',
    ativo: true,
    data_cadastro: '2025-01-01'
  },
  'joao@empresaxyz.ao': {
    id: 'cliente-001',
    nome: 'João Silva',
    email: 'joao@empresaxyz.ao',
    telefone: '+244900000002',
    localizacao: 'Luanda',
    perfil: 'empresario',
    tipo_usuario: 'cliente',
    saldo_creditos: 50000, // Créditos em Kwanzas (não pontos)
    nivel: 'Premium',
    verificado: true,
    senha: 'cliente123',
    senha_hash: 'mock_hash_cliente123',
    ativo: true,
    data_cadastro: '2025-02-15',
    plano: 'business'
  },
  'maria@gmail.com': {
    id: 'respondente-001',
    nome: 'Maria Santos',
    email: 'maria@gmail.com',
    telefone: '+244900000003',
    localizacao: 'Benguela',
    perfil: 'profissional',
    tipo_usuario: 'respondente',
    reputacao: 150,
    saldo_pontos: 750,
    nivel: 'Bronze',
    verificado: false,
    senha: 'usuario123',
    senha_hash: 'mock_hash_usuario123',
    ativo: true,
    data_cadastro: '2025-03-10'
  },
  'cliente@teste.ao': {
    id: 'cliente-002',
    nome: 'Cliente Teste',
    email: 'cliente@teste.ao',
    telefone: '+244900000004',
    localizacao: 'Luanda',
    perfil: 'empresario',
    tipo_usuario: 'cliente',
    saldo_creditos: 25000,
    nivel: 'Standard',
    verificado: true,
    senha: 'cliente123',
    senha_hash: 'mock_hash_cliente123',
    ativo: true,
    data_cadastro: '2025-01-20',
    plano: 'starter'
  },
  'usuario@teste.ao': {
    id: 'respondente-002',
    nome: 'Usuário Regular',
    email: 'usuario@teste.ao',
    telefone: '+244900000005',
    localizacao: 'Luanda',
    perfil: 'estudante',
    tipo_usuario: 'respondente',
    reputacao: 150,
    saldo_pontos: 750,
    nivel: 'Bronze',
    verificado: false,
    senha: 'usuario123',
    senha_hash: 'mock_hash_usuario123',
    ativo: true,
    data_cadastro: '2025-02-05'
  }
};

// Simula um "banco de dados" em memória para registros durante testes
export const MOCK_REGISTERED_USERS: any = {};

// Simula um banco de dados global para campanhas, respostas, etc
export const MOCK_DATA: any = {
  campanhas: [
    {
      id: 1,
      titulo: 'Estudo Mercado de Trabalho 2024',
      descricao: 'Análise completa do mercado de trabalho em Angola',
      status: 'ativa',
      progresso: 62.4,
      total_respostas: 312,
      meta_participantes: 500,
      meta_respostas: 500,
      qualidade_media: 4.2,
      recompensa: 300,
      orcamento_total: 150000,
      orcamento_gasto: 93600,
      data_inicio: '2024-12-01T00:00:00Z',
      data_fim: '2024-12-31T23:59:59Z',
      categoria: 'Emprego',
      tema: 'Mercado de Trabalho',
      cliente_id: 'cliente-001',
      ativo: 1,
      created_at: '2024-11-20T10:00:00Z'
    },
    {
      id: 2,
      titulo: 'Pesquisa Satisfação Serviços Públicos',
      descricao: 'Avaliação da satisfação com serviços públicos em Luanda',
      status: 'ativa',
      progresso: 45.3,
      total_respostas: 136,
      meta_participantes: 300,
      meta_respostas: 300,
      qualidade_media: 4.1,
      recompensa: 300,
      orcamento_total: 90000,
      orcamento_gasto: 40800,
      data_inicio: '2024-12-10T00:00:00Z',
      data_fim: '2024-12-25T23:59:59Z',
      categoria: 'Governo',
      tema: 'Serviços Públicos',
      cliente_id: 'cliente-001',
      ativo: 1,
      created_at: '2024-12-05T14:00:00Z'
    }
  ],
  clientes: [
    {
      id: 'cliente-001',
      nome: 'João Silva',
      email: 'joao@empresaxyz.ao',
      saldo_creditos: 50000,
      plano: 'business'
    },
    {
      id: 'cliente-002',
      nome: 'Cliente Teste',
      email: 'cliente@teste.ao',
      saldo_creditos: 25000,
      plano: 'starter'
    }
  ]
};
