// Importa o 'fetch' que não é nativo em ambientes Node.js mais antigos
const fetch = require('node-fetch');

// Função auxiliar para chamar a API Gemini, com tentativa de fallback
async function callGeminiAPI(requestBody, apiKey, modelName) {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    
    const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
    });

    return response.json();
}

exports.handler = async function (event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: JSON.stringify({ message: 'Successful preflight call.' }) };
    }
    
    const { history, query } = JSON.parse(event.body);
    if (!query) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Pergunta não fornecida.' }) };
    }

    try {
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.SEARCH_API_KEY}&cx=${process.env.SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        const searchSnippets = searchData.items?.slice(0, 3).map(item => item.snippet).join('\n\n');
        
        const webDataContext = searchSnippets ? `
            DADOS DA WEB PARA CONTEXTO ADICIONAL:
            ---
            ${searchSnippets}
            ---
        ` : 'Não foram encontrados dados relevantes na web para esta pergunta.';

        const prompt = `
            ${webDataContext}
            Com base no contexto acima e no histórico da conversa, responda à última pergunta do usuário.
        `;
        
        const geminiRequestBody = {
            contents: [
                ...history, 
                { role: 'user', parts: [{ text: query }] }, 
                { role: 'model', parts: [{ text: prompt }] } 
            ]
        };

        // [MODIFICADO] Tenta o modelo principal primeiro
        let geminiData = await callGeminiAPI(geminiRequestBody, process.env.GEMINI_API_KEY, 'gemini-1.5-flash-latest');

        // [NOVO] Se o modelo principal estiver sobrecarregado, tenta o modelo de fallback
        if (geminiData.error && (geminiData.error.status === 'UNAVAILABLE' || geminiData.error.code === 503)) {
            console.warn('Modelo principal sobrecarregado, tentando fallback para gemini-1.0-pro...');
            geminiData = await callGeminiAPI(geminiRequestBody, process.env.GEMINI_API_KEY, 'gemini-1.0-pro');
        }
        
        if (geminiData.error || !geminiData.candidates || geminiData.candidates.length === 0) {
            console.error('Erro retornado pela API Gemini:', JSON.stringify(geminiData, null, 2));
            return { 
                statusCode: 500,
                headers, 
                body: JSON.stringify({ error: 'A IA não conseguiu gerar uma resposta. Isso pode ser um erro temporário. Por favor, tente novamente.' })
            };
        }
        
        const aiResponseText = geminiData.candidates[0].content.parts[0].text;

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