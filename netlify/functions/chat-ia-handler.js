// Importa o 'fetch' que não é nativo em ambientes Node.js mais antigos
const fetch = require('node-fetch');

// Função auxiliar para chamar a API Gemini
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
    
    // [MODIFICADO] Recebe o histórico, a pergunta e a imagem (opcional)
    const { history, query, image } = JSON.parse(event.body);
    if (!query && !image) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Nenhuma pergunta ou imagem fornecida.' }) };
    }

    try {
        let geminiRequestBody;

        if (image) {
            // --- LÓGICA PARA ANÁLISE DE IMAGEM ---
            const userPrompt = query || "Descreva esta imagem em detalhes, focando em qualquer texto ou dado que possa ser relevante para um laudo psicológico.";
            
            geminiRequestBody = {
                contents: [
                    ...history,
                    {
                        role: 'user',
                        parts: [
                            { text: userPrompt },
                            { inline_data: { mime_type: image.mimeType, data: image.data } }
                        ]
                    }
                ]
            };
        } else {
            // --- LÓGICA PARA BUSCA NA WEB (EXISTENTE) ---
            const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.SEARCH_API_KEY}&cx=${process.env.SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;
            const searchResponse = await fetch(searchUrl);
            const searchData = await searchResponse.json();
            const searchSnippets = searchData.items?.slice(0, 3).map(item => item.snippet).join('\n\n');
            const webDataContext = searchSnippets ? `Dados da web para contexto: ${searchSnippets}` : 'Não foram encontrados dados na web.';

            const prompt = `${webDataContext}\nCom base no contexto acima e no histórico da conversa, responda à pergunta: "${query}"`;
            
            geminiRequestBody = {
                contents: [
                    ...history,
                    { role: 'user', parts: [{ text: prompt }] }
                ]
            };
        }

        let geminiData = await callGeminiAPI(geminiRequestBody, process.env.GEMINI_API_KEY, 'gemini-1.5-flash-latest');
        
        if (geminiData.error) {
            console.error('Erro retornado pela API Gemini:', JSON.stringify(geminiData, null, 2));
            return { 
                statusCode: 500,
                headers, 
                body: JSON.stringify({ error: `A IA retornou um erro: ${geminiData.error.message}` })
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