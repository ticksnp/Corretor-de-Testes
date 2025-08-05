// Importa o 'fetch' que não é nativo em ambientes Node.js mais antigos
const fetch = require('node-fetch');

// Handler principal da nossa função serverless
exports.handler = async function (event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: JSON.stringify({ message: 'Successful preflight call.' }) };
    }
    
    const { query } = JSON.parse(event.body);
    if (!query) {
        return { statusCode: 400, headers, body: 'Pergunta não fornecida.' };
    }

    try {
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.SEARCH_API_KEY}&cx=${process.env.SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        // ========================================================================
        // [NOVA LINHA DE DEPURAÇÃO] - A MUDANÇA MAIS IMPORTANTE ESTÁ AQUI
        console.log('RESPOSTA COMPLETA DA GOOGLE SEARCH API:', JSON.stringify(searchData, null, 2));
        // ========================================================================

        const searchSnippets = searchData.items?.slice(0, 3).map(item => item.snippet).join('\n\n');
        
        if (!searchSnippets || searchSnippets.length === 0) {
            return { 
                statusCode: 404, 
                headers, 
                body: JSON.stringify({ error: 'Não consegui encontrar informações sobre isso na web. Tente uma pergunta mais específica.' })
            };
        }

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
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        });

        const geminiData = await geminiResponse.json();
        
        if (!geminiData.candidates || geminiData.candidates.length === 0) {
             return { 
                statusCode: 500,
                headers, 
                body: JSON.stringify({ error: 'A IA não conseguiu gerar uma resposta com base nos dados encontrados.' })
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