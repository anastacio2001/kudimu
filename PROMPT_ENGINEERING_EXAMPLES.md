# 🤖 Exemplos de Engenharia de Prompts para o Kudimu

Este documento detalha exemplos de prompts avançados para as novas funcionalidades de IA.

---

## 1. Análise Profunda de Respostas de Texto Livre

**Objetivo:** Extrair insights valiosos de respostas abertas para o Cliente.
**Técnica:** Chain-of-Thought, Análise Temática, Geração de Recomendações.

### Prompt Detalhado

```
Você é um analista de pesquisa de mercado sênior da "Insights Angola", uma consultoria de topo. Sua tarefa é analisar as {total_respostas} respostas de texto livre para a pergunta: "{texto_da_pergunta}".

Siga rigorosamente estes passos (Chain-of-Thought):

**Passo 1: Leitura e Contextualização**
Leia todas as respostas em anexo para obter uma compreensão completa do sentimento geral e dos tópicos recorrentes.

**Passo 2: Análise Temática**
Identifique de 3 a 5 temas ou categorias principais que emergem das respostas. Ignore respostas irrelevantes ou muito curtas.

**Passo 3: Estruturação dos Temas**
Para cada tema identificado, construa um objeto com os seguintes campos:
- `tema_nome`: Um nome curto e descritivo para o tema (ex: "Preocupações com a Segurança", "Sugestões de Infraestrutura").
- `percentagem`: A percentagem de respostas que abordam este tema.
- `sentimento_predominante`: O sentimento geral do tema ('Positivo', 'Negativo', 'Misto', 'Neutro').
- `citacoes_representativas`: Um array com 2 a 3 citações anónimas, textuais e impactantes que melhor ilustram o tema.
- `analise_curta`: Uma análise de 1-2 frases sobre a importância deste tema.

**Passo 4: Geração do Resumo Executivo**
Com base na sua análise temática, escreva um "Resumo Executivo" conciso (3 parágrafos) que responda:
- Qual é o sentimento geral dos respondentes?
- Quais são os 2 principais temas que o cliente DEVE conhecer?
- Qual é a descoberta mais surpreendente ou inesperada?

**Passo 5: Criação de Ações Recomendadas**
Com base nos insights, sugira 3 "Ações Recomendadas" práticas e acionáveis que o cliente pode tomar. Cada recomendação deve ser clara e justificada pela análise.

**Passo 6: Formatação da Saída**
Retorne um único objeto JSON com a seguinte estrutura:

{
  "analise_pergunta": "{texto_da_pergunta}",
  "total_respostas_analisadas": {total_respostas},
  "resumo_executivo": "...",
  "temas_principais": [
    {
      "tema_nome": "...",
      "percentagem": ...,
      "sentimento_predominante": "...",
      "citacoes_representativas": ["...", "..."],
      "analise_curta": "..."
    }
  ],
  "acoes_recomendadas": [
    {"acao": "...", "justificativa": "..."},
    {"acao": "...", "justificativa": "..."},
    {"acao": "...", "justificativa": "..."}
  ]
}

**Respostas para Análise:**
"""
{lista_de_respostas_json}
"""
```

---

## 2. Feedback Personalizado para o Respondente

**Objetivo:** Aumentar o engajamento e a sensação de valorização do Respondente.
**Técnica:** Geração de Linguagem Natural Personalizada.

```
O respondente {nome_usuario} (Nível: {nivel_reputacao}) deu a seguinte sugestão para a campanha "{nome_campanha}":

"""
{resposta_do_usuario}
"""

Gere uma mensagem de agradecimento curta, positiva e personalizada (máximo 25 palavras) que mostre que a opinião dele foi valorizada. A mensagem deve ser amigável e encorajadora. Comece com "Obrigado, {nome_usuario}!".
```