// Importa o 'fetch' que não é nativo em ambientes Node.js mais antigos
const fetch = require('node-fetch');

// Handler principal da nossa função serverless
exports.handler = async function (event, context) {
    // Permite que a função seja chamada de qualquer domínio (para desenvolvimento)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Responde a requisições OPTIONS (necessário para o navegador verificar a permissão)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Successful preflight call.' }),
        };
    }
    
    // Pega a pergunta do usuário do corpo da requisição
    const { query } = JSON.parse(event.body);
    if (!query) {
        return { statusCode: 400, headers, body: 'Pergunta não fornecida.' };
    }

    try {
        // --- ETAPA 1: BUSCAR DADOS NA WEB ---
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.SEARCH_API_KEY}&cx=${process.env.SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        // Extrai os trechos (snippets) dos 3 principais resultados da busca
        const searchSnippets = searchData.items?.slice(0, 3).map(item => item.snippet).join('\n\n');
        
        // [CORREÇÃO AQUI]
        // Se a busca não retornar nada, agora retornamos um JSON de erro.
        if (!searchSnippets || searchSnippets.length === 0) {
            return { 
                statusCode: 404, // 404 Not Found é mais apropriado aqui
                headers, 
                body: JSON.stringify({ error: 'Não consegui encontrar informações sobre isso na web. Tente uma pergunta mais específica.' })
            };
        }

        // --- ETAPA 2: ENVIAR DADOS PARA O GEMINI GERAR UMA RESPOSTA ---
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;
        
        const prompt = `
            Você é um assistente especialista em psicologia e neurociências.
            Com base nos seguintes dados extraídos da web, responda à pergunta do usuário de forma clara, concisa e informativa.
            Não mencione que você está usando dados da web, apenas responda à pergunta diretamente.

            DADOS DA WEB:
            ---
            ${searchSnippets}
            ---

            PERGUNTA DO USUÁRIO:
            "${query}"
        `;
        
        const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        const geminiData = await geminiResponse.json();
        
        // Adiciona uma verificação para o caso de a API Gemini não retornar um candidato
        if (!geminiData.candidates || geminiData.candidates.length === 0) {
             return { 
                statusCode: 500,
                headers, 
                body: JSON.stringify({ error: 'A IA não conseguiu gerar uma resposta com base nos dados encontrados.' })
            };
        }
        
        const aiResponseText = geminiData.candidates[0].content.parts[0].text;

        // --- ETAPA 3: RETORNAR A RESPOSTA PARA O FRONT-END ---
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply: aiResponseText }),
        };

    } catch (error) {
        console.error('Erro na função serverless:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Ocorreu um erro ao processar sua solicitação.' }),
        };
    }
};