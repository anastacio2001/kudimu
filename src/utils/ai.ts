/**
 * Utilitários para Workers AI e Vectorize
 * Funções para gerar embeddings e busca semântica
 */

/**
 * Gera embedding de um texto usando Workers AI
 * @param ai - Binding do Workers AI
 * @param texto - Texto para gerar embedding
 * @returns Array de números representando o embedding
 */
export async function gerarEmbedding(ai: any, texto: string): Promise<number[]> {
  try {
    // Remove espaços extras e limita tamanho
    const textoLimpo = texto.trim().substring(0, 5000);

    if (!textoLimpo || textoLimpo.length < 10) {
      throw new Error('Texto muito curto para gerar embedding');
    }

    // Gera embedding usando o modelo bge-large-en-v1.5
    const response = await ai.run('@cf/baai/bge-large-en-v1.5', {
      text: textoLimpo
    });

    // O modelo retorna um array de embeddings (1024 dimensões)
    if (!response || !response.data || !response.data[0]) {
      throw new Error('Resposta inválida do modelo de AI');
    }

    return response.data[0];
  } catch (error) {
    console.error('Erro ao gerar embedding:', error);
    throw error;
  }
}

/**
 * Gera embeddings para múltiplos textos em batch
 * @param ai - Binding do Workers AI
 * @param textos - Array de textos
 * @returns Array de embeddings
 */
export async function gerarEmbeddingsBatch(ai: any, textos: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];

  for (const texto of textos) {
    try {
      const embedding = await gerarEmbedding(ai, texto);
      embeddings.push(embedding);
    } catch (error) {
      console.error(`Erro ao processar texto: ${texto.substring(0, 50)}...`, error);
      // Adiciona embedding vazio em caso de erro
      embeddings.push([]);
    }
  }

  return embeddings;
}

/**
 * Insere embedding no Vectorize para busca semântica
 * @param vectorize - Binding do Vectorize
 * @param id - ID único do documento
 * @param embedding - Array de números do embedding
 * @param metadata - Metadados adicionais
 */
export async function inserirVectorize(
  vectorize: any,
  id: string,
  embedding: number[],
  metadata: Record<string, any>
): Promise<void> {
  try {
    await vectorize.insert([
      {
        id: id,
        values: embedding,
        metadata: metadata
      }
    ]);
  } catch (error) {
    console.error('Erro ao inserir no Vectorize:', error);
    throw error;
  }
}

/**
 * Busca semântica no Vectorize
 * @param vectorize - Binding do Vectorize
 * @param embedding - Embedding da query
 * @param topK - Número de resultados a retornar
 * @param filter - Filtros de metadata
 * @returns Resultados da busca ordenados por similaridade
 */
export async function buscaSemantica(
  vectorize: any,
  embedding: number[],
  topK: number = 10,
  filter?: Record<string, any>
): Promise<any[]> {
  try {
    const results = await vectorize.query(embedding, {
      topK: topK,
      filter: filter,
      returnMetadata: true
    });

    return results.matches || [];
  } catch (error) {
    console.error('Erro na busca semântica:', error);
    return [];
  }
}

/**
 * Calcula similaridade de cosseno entre dois vetores
 * @param vec1 - Primeiro vetor
 * @param vec2 - Segundo vetor
 * @returns Valor de similaridade entre -1 e 1
 */
export function calcularSimilaridade(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vetores devem ter o mesmo tamanho');
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }

  norm1 = Math.sqrt(norm1);
  norm2 = Math.sqrt(norm2);

  if (norm1 === 0 || norm2 === 0) {
    return 0;
  }

  return dotProduct / (norm1 * norm2);
}

/**
 * Agrupa respostas similares usando embeddings
 * @param respostas - Array de respostas com embeddings
 * @param threshold - Limiar de similaridade (0-1)
 * @returns Grupos de respostas similares
 */
export function agruparRespostasSimilares(
  respostas: Array<{ id: string; embedding: number[]; texto: string }>,
  threshold: number = 0.8
): Array<Array<{ id: string; texto: string; similaridade: number }>> {
  const grupos: Array<Array<{ id: string; texto: string; similaridade: number }>> = [];
  const processados = new Set<string>();

  for (let i = 0; i < respostas.length; i++) {
    if (processados.has(respostas[i].id)) continue;

    const grupo: Array<{ id: string; texto: string; similaridade: number }> = [
      {
        id: respostas[i].id,
        texto: respostas[i].texto,
        similaridade: 1.0
      }
    ];

    processados.add(respostas[i].id);

    for (let j = i + 1; j < respostas.length; j++) {
      if (processados.has(respostas[j].id)) continue;

      const similaridade = calcularSimilaridade(
        respostas[i].embedding,
        respostas[j].embedding
      );

      if (similaridade >= threshold) {
        grupo.push({
          id: respostas[j].id,
          texto: respostas[j].texto,
          similaridade: similaridade
        });
        processados.add(respostas[j].id);
      }
    }

    // Só adiciona grupos com mais de 1 item
    if (grupo.length > 1) {
      grupos.push(grupo);
    }
  }

  return grupos;
}

/**
 * Detecta temas principais em respostas usando embeddings
 * @param respostas - Array de respostas
 * @param ai - Binding do Workers AI
 * @returns Temas identificados
 */
export async function detectarTemas(
  respostas: Array<{ texto: string }>,
  ai: any
): Promise<Array<{ tema: string; frequencia: number; respostas_ids: string[] }>> {
  // Esta é uma implementação simplificada
  // Em produção, seria melhor usar clustering mais sofisticado
  const temas: Array<{ tema: string; frequencia: number; respostas_ids: string[] }> = [];

  // TODO: Implementar análise de temas usando LLM
  // Por agora, retorna vazio
  return temas;
}

/**
 * Analisa sentimento de uma resposta usando AI
 * @param ai - Binding do Workers AI
 * @param texto - Texto para análise
 * @returns Sentimento (positivo, negativo, neutro) e score
 */
export async function analisarSentimento(
  ai: any,
  texto: string
): Promise<{ sentimento: string; score: number; confianca: number }> {
  try {
    // Remove espaços extras
    const textoLimpo = texto.trim();

    if (!textoLimpo || textoLimpo.length < 10) {
      return {
        sentimento: 'neutro',
        score: 0.5,
        confianca: 0
      };
    }

    // Usa modelo de análise de sentimento
    const response = await ai.run('@cf/huggingface/distilbert-sst-2-int8', {
      text: textoLimpo
    });

    if (!response || !response[0]) {
      throw new Error('Resposta inválida do modelo de sentimento');
    }

    // Processa resultado
    const result = response[0];
    const sentimento = result.label.toLowerCase();
    const score = result.score;

    return {
      sentimento: sentimento === 'positive' ? 'positivo' :
                  sentimento === 'negative' ? 'negativo' : 'neutro',
      score: score,
      confianca: score
    };
  } catch (error) {
    console.error('Erro ao analisar sentimento:', error);
    return {
      sentimento: 'neutro',
      score: 0.5,
      confianca: 0
    };
  }
}

/**
 * Detecta spam em respostas usando heurísticas e AI
 * @param texto - Texto da resposta
 * @param ai - Binding do Workers AI
 * @returns Boolean indicando se é spam e score de confiança
 */
export async function detectarSpam(
  texto: string,
  ai?: any
): Promise<{ isSpam: boolean; score: number; razoes: string[] }> {
  const razoes: string[] = [];
  let spamScore = 0;

  // Heurísticas básicas
  if (texto.length < 10) {
    spamScore += 0.4;
    razoes.push('Texto muito curto');
  }

  if (texto.length > 10000) {
    spamScore += 0.3;
    razoes.push('Texto muito longo');
  }

  // Detecta repetição de caracteres
  const repeticao = /(.)\1{10,}/;
  if (repeticao.test(texto)) {
    spamScore += 0.5;
    razoes.push('Repetição excessiva de caracteres');
  }

  // Detecta texto todo em maiúsculas
  if (texto.length > 20 && texto === texto.toUpperCase()) {
    spamScore += 0.3;
    razoes.push('Texto todo em maiúsculas');
  }

  // Detecta muitos números/símbolos
  const numeros = texto.match(/\d/g) || [];
  if (numeros.length / texto.length > 0.5) {
    spamScore += 0.4;
    razoes.push('Muitos números');
  }

  // Palavras suspeitas
  const palavrasSuspeitas = ['xxx', 'viagra', 'casino', 'grátis!!!'];
  const temSuspeitas = palavrasSuspeitas.some(p =>
    texto.toLowerCase().includes(p)
  );
  if (temSuspeitas) {
    spamScore += 0.6;
    razoes.push('Contém palavras suspeitas');
  }

  return {
    isSpam: spamScore >= 0.5,
    score: Math.min(spamScore, 1.0),
    razoes: razoes
  };
}
