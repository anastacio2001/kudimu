export const campaignTemplates = [
  {
    id: 1,
    nome: 'Satisfação do Cliente',
    categoria: 'Serviços',
    descricao: 'Avalie o nível de satisfação dos seus clientes com produtos ou serviços',
    icone: '⭐',
    taxa_sucesso: 94,
    tempo_medio: '8 dias',
    total_usos: 1247,
    perguntas_exemplo: [
      {
        tipo: 'escala',
        pergunta: 'De 1 a 5, qual o seu nível de satisfação geral?',
        escala_min: 1,
        escala_max: 5,
        label_min: 'Muito Insatisfeito',
        label_max: 'Muito Satisfeito'
      },
      {
        tipo: 'multipla_escolha',
        pergunta: 'Qual aspecto mais te agrada?',
        opcoes: ['Qualidade', 'Preço', 'Atendimento', 'Rapidez']
      },
      {
        tipo: 'texto_livre',
        pergunta: 'O que podemos melhorar?'
      },
      {
        tipo: 'sim_nao',
        pergunta: 'Recomendaria nosso serviço a amigos?'
      }
    ],
    configuracao_otima: {
      meta_respostas: 120,
      recompensa_por_resposta: 600,
      duracao_dias: 10,
      publico_alvo: {
        idade_min: 18,
        idade_max: 55,
        educacao: ['Ensino Médio', 'Superior']
      }
    },
    insights: [
      'Template mais usado na plataforma',
      'Taxa de conclusão 94%',
      'ROI médio: 3.8x'
    ]
  },
  {
    id: 2,
    nome: 'Lançamento de Produto',
    categoria: 'Tecnologia',
    descricao: 'Teste a aceitação de um novo produto antes de lançar no mercado',
    icone: '🚀',
    taxa_sucesso: 89,
    tempo_medio: '12 dias',
    total_usos: 823,
    perguntas_exemplo: [
      {
        tipo: 'multipla_escolha',
        pergunta: 'Conhece produtos similares no mercado?',
        opcoes: ['Sim, uso regularmente', 'Sim, mas não uso', 'Não conheço', 'Já ouvi falar']
      },
      {
        tipo: 'escala',
        pergunta: 'Qual a probabilidade de comprar este produto?',
        escala_min: 1,
        escala_max: 10,
        label_min: 'Muito improvável',
        label_max: 'Muito provável'
      },
      {
        tipo: 'numero',
        pergunta: 'Quanto pagaria por este produto? (Kz)'
      },
      {
        tipo: 'multipla_escolha',
        pergunta: 'Qual funcionalidade é mais importante?',
        opcoes: ['Velocidade', 'Facilidade de uso', 'Preço', 'Durabilidade', 'Design']
      },
      {
        tipo: 'texto_livre',
        pergunta: 'Que funcionalidades adicionais gostaria?'
      }
    ],
    configuracao_otima: {
      meta_respostas: 200,
      recompensa_por_resposta: 700,
      duracao_dias: 14,
      publico_alvo: {
        idade_min: 20,
        idade_max: 45,
        educacao: ['Superior'],
        interesses: ['Tecnologia', 'Inovação']
      }
    },
    insights: [
      'Ideal para startups e inovação',
      'Insights valiosos sobre precificação',
      'Identifica early adopters'
    ]
  },
  {
    id: 3,
    nome: 'Hábitos de Consumo',
    categoria: 'Alimentação',
    descricao: 'Entenda os padrões de consumo e preferências alimentares',
    icone: '🍔',
    taxa_sucesso: 91,
    tempo_medio: '9 dias',
    total_usos: 654,
    perguntas_exemplo: [
      {
        tipo: 'multipla_escolha',
        pergunta: 'Com que frequência come fora de casa?',
        opcoes: ['Diariamente', '3-4x por semana', '1-2x por semana', 'Raramente']
      },
      {
        tipo: 'multipla_escolha',
        pergunta: 'Qual tipo de comida prefere?',
        opcoes: ['Tradicional Angolana', 'Portuguesa', 'Brasileira', 'Chinesa', 'Fast Food', 'Italiana']
      },
      {
        tipo: 'numero',
        pergunta: 'Gasto médio por refeição? (Kz)'
      },
      {
        tipo: 'multipla_escolha',
        pergunta: 'O que mais valoriza ao escolher restaurante?',
        opcoes: ['Preço', 'Qualidade', 'Localização', 'Ambiente', 'Rapidez']
      },
      {
        tipo: 'sim_nao',
        pergunta: 'Utiliza apps de delivery?'
      }
    ],
    configuracao_otima: {
      meta_respostas: 150,
      recompensa_por_resposta: 550,
      duracao_dias: 10,
      publico_alvo: {
        idade_min: 18,
        idade_max: 60,
        localizacao: 'Luanda',
        educacao: ['Ensino Médio', 'Superior']
      }
    },
    insights: [
      'Perfeito para setor de restauração',
      'Identifica tendências de consumo',
      'Dados geográficos valiosos'
    ]
  },
  {
    id: 4,
    nome: 'Pesquisa de Mercado Geral',
    categoria: 'Geral',
    descricao: 'Template versátil para qualquer tipo de pesquisa de mercado',
    icone: '📊',
    taxa_sucesso: 87,
    tempo_medio: '11 dias',
    total_usos: 1534,
    perguntas_exemplo: [
      {
        tipo: 'multipla_escolha',
        pergunta: 'Conhece nossa marca/produto?',
        opcoes: ['Sim, já usei', 'Sim, mas nunca usei', 'Não conheço']
      },
      {
        tipo: 'escala',
        pergunta: 'Qual a importância deste produto/serviço?',
        escala_min: 1,
        escala_max: 5,
        label_min: 'Nada importante',
        label_max: 'Muito importante'
      },
      {
        tipo: 'multipla_escolha',
        pergunta: 'Onde costuma comprar produtos similares?',
        opcoes: ['Lojas físicas', 'Online', 'Mercados', 'Vendedores ambulantes']
      },
      {
        tipo: 'texto_livre',
        pergunta: 'O que mais influencia sua decisão de compra?'
      }
    ],
    configuracao_otima: {
      meta_respostas: 100,
      recompensa_por_resposta: 500,
      duracao_dias: 12,
      publico_alvo: {
        idade_min: 18,
        idade_max: 65,
        genero: 'todos',
        educacao: ['todos']
      }
    },
    insights: [
      'Template flexível e adaptável',
      'Boa taxa de conclusão',
      'Baixo custo por resposta'
    ]
  },
  {
    id: 5,
    nome: 'Avaliação de Marca',
    categoria: 'Moda',
    descricao: 'Meça o reconhecimento e percepção da sua marca no mercado',
    icone: '👔',
    taxa_sucesso: 92,
    tempo_medio: '10 dias',
    total_usos: 412,
    perguntas_exemplo: [
      {
        tipo: 'multipla_escolha',
        pergunta: 'Qual destas marcas conhece?',
        opcoes: ['Marca A', 'Marca B', 'Marca C', 'Nenhuma']
      },
      {
        tipo: 'escala',
        pergunta: 'Como avalia a qualidade da nossa marca?',
        escala_min: 1,
        escala_max: 5,
        label_min: 'Péssima',
        label_max: 'Excelente'
      },
      {
        tipo: 'multipla_escolha',
        pergunta: 'Que palavra melhor descreve nossa marca?',
        opcoes: ['Moderna', 'Clássica', 'Acessível', 'Premium', 'Inovadora']
      },
      {
        tipo: 'sim_nao',
        pergunta: 'Já comprou algum produto desta marca?'
      },
      {
        tipo: 'texto_livre',
        pergunta: 'O que mudaria na marca?'
      }
    ],
    configuracao_otima: {
      meta_respostas: 180,
      recompensa_por_resposta: 650,
      duracao_dias: 12,
      publico_alvo: {
        idade_min: 18,
        idade_max: 40,
        educacao: ['Ensino Médio', 'Superior'],
        interesses: ['Moda', 'Estilo']
      }
    },
    insights: [
      'Identifica posicionamento de marca',
      'Excelente para rebranding',
      'Alta taxa de engajamento'
    ]
  },
  {
    id: 6,
    nome: 'Transporte e Mobilidade',
    categoria: 'Transporte',
    descricao: 'Compreenda os hábitos de deslocamento da população',
    icone: '🚗',
    taxa_sucesso: 88,
    tempo_medio: '13 dias',
    total_usos: 567,
    perguntas_exemplo: [
      {
        tipo: 'multipla_escolha',
        pergunta: 'Principal meio de transporte usado?',
        opcoes: ['Carro próprio', 'Táxi/Uber', 'Candongueiro', 'Moto', 'A pé', 'Transporte público']
      },
      {
        tipo: 'numero',
        pergunta: 'Gasto mensal com transporte? (Kz)'
      },
      {
        tipo: 'escala',
        pergunta: 'Satisfação com transporte público em Luanda?',
        escala_min: 1,
        escala_max: 10,
        label_min: 'Muito insatisfeito',
        label_max: 'Muito satisfeito'
      },
      {
        tipo: 'multipla_escolha',
        pergunta: 'Maior problema no transporte?',
        opcoes: ['Trânsito', 'Preço', 'Segurança', 'Disponibilidade', 'Conforto']
      },
      {
        tipo: 'sim_nao',
        pergunta: 'Usaria aplicativo de carona compartilhada?'
      }
    ],
    configuracao_otima: {
      meta_respostas: 250,
      recompensa_por_resposta: 600,
      duracao_dias: 15,
      publico_alvo: {
        idade_min: 18,
        idade_max: 55,
        localizacao: 'Luanda',
        educacao: ['Ensino Médio', 'Superior']
      }
    },
    insights: [
      'Dados valiosos para startups de mobilidade',
      'Identifica pain points do setor',
      'Boa representatividade geográfica'
    ]
  }
];

export const getTemplateByCategory = (categoria) => {
  return campaignTemplates.filter(t => t.categoria === categoria);
};

export const getMostUsedTemplates = (limit = 3) => {
  return [...campaignTemplates].sort((a, b) => b.total_usos - a.total_usos).slice(0, limit);
};

export const getHighestSuccessRateTemplates = (limit = 3) => {
  return [...campaignTemplates].sort((a, b) => b.taxa_sucesso - a.taxa_sucesso).slice(0, limit);
};

export const applyTemplateToFormData = (template) => {
  return {
    titulo: `Pesquisa: ${template.nome}`,
    descricao: template.descricao,
    categoria: template.categoria,
    tags: [template.categoria.toLowerCase(), template.nome.toLowerCase()],
    meta_respostas: template.configuracao_otima.meta_respostas,
    recompensa_por_resposta: template.configuracao_otima.recompensa_por_resposta,
    orcamento_total: template.configuracao_otima.meta_respostas * template.configuracao_otima.recompensa_por_resposta,
    tempo_estimado: template.configuracao_otima.duracao_dias,
    localizacao_alvo: template.configuracao_otima.publico_alvo.localizacao || '',
    idade_min: template.configuracao_otima.publico_alvo.idade_min,
    idade_max: template.configuracao_otima.publico_alvo.idade_max,
    genero_target: template.configuracao_otima.publico_alvo.genero || 'todos',
    interesses_target: template.configuracao_otima.publico_alvo.interesses || [],
    nivel_educacao: Array.isArray(template.configuracao_otima.publico_alvo.educacao) 
      ? template.configuracao_otima.publico_alvo.educacao.join(',')
      : template.configuracao_otima.publico_alvo.educacao || 'todos',
    perguntas: template.perguntas_exemplo.map((p, idx) => ({
      id: Date.now() + idx,
      ...p,
      obrigatoria: true
    }))
  };
};
