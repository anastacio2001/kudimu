import { Router } from 'itty-router';
import { analyzeText, semanticSearch } from './ai';

const router = Router();

// Endpoint de autenticação
router.post('/auth/login', async (request) => {
  const { username, password } = await request.json();
  // Lógica de autenticação aqui
  return new Response(JSON.stringify({ success: true, token: 'fake-token' }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

// Endpoint de campanhas
router.get('/campaigns', async () => {
  // Lógica para listar campanhas
  const campaigns = [
    { id: 1, name: 'Campanha 1', description: 'Descrição da campanha 1' },
    { id: 2, name: 'Campanha 2', description: 'Descrição da campanha 2' },
  ];
  return new Response(JSON.stringify(campaigns), {
    headers: { 'Content-Type': 'application/json' },
  });
});

// Endpoint de respostas
router.post('/answers', async (request) => {
  const { campaignId, answer } = await request.json();
  // Lógica para salvar resposta
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

// Endpoint de análise semântica
router.post('/ai/analyze', analyzeText);

// Endpoint de busca semântica
router.post('/ai/search', semanticSearch);

export default router;