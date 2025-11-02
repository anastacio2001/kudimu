import { json } from 'itty-router';

export async function analyzeText(request) {
  try {
    const { text } = await request.json();
    console.log('Recebendo texto para análise:', text);

    // Simulação de análise semântica usando o modelo configurado
    const embedding = await env.kudimu_ai.embed({ text });
    if (!embedding) {
      throw new Error('O binding kudimu_ai não retornou um resultado válido.');
    }

    return new Response(JSON.stringify({ success: true, embedding }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Erro ao gerar embedding:', err);
    return new Response(JSON.stringify({ success: false, message: 'Erro interno no Worker', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function semanticSearch(request) {
  try {
    const { query } = await request.json();
    console.log('Recebendo query para busca:', query);

    // Simulação de busca semântica
    const results = await env.kudimu_ai.search({ query });
    if (!results) {
      throw new Error('O binding kudimu_ai não retornou resultados válidos.');
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Erro ao realizar busca semântica:', err);
    return new Response(JSON.stringify({ success: false, message: 'Erro interno no Worker', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}