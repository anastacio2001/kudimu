const fetch = require('node-fetch').default;

const BASE_URL = 'https://kudimu-worker.l-anastacio001.workers.dev';

(async () => {
  console.log('Testando endpoint de análise semântica...');
  try {
    const response = await fetch(`${BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Teste de análise semântica' }),
    });
    const data = await response.json();
    console.log('Resultado da análise semântica:', data);
    console.log('Status da resposta:', response.status);
    console.log('Cabeçalhos da resposta:', response.headers.raw());
  } catch (error) {
    console.error('Erro ao testar análise semântica:', error);
  }

  console.log('Testando endpoint de busca semântica...');
  try {
    const response = await fetch(`${BASE_URL}/ai/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Busca semântica' }),
    });
    const data = await response.json();
    console.log('Resultado da busca semântica:', data);
    console.log('Status da resposta:', response.status);
    console.log('Cabeçalhos da resposta:', response.headers.raw());
  } catch (error) {
    console.error('Erro ao testar busca semântica:', error);
  }
})();