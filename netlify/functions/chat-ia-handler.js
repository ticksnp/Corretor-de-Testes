// Importa o 'fetch' que não é nativo em ambientes Node.js mais antigos
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: JSON.stringify({ message: 'Successful preflight call.' }) };
    }
    
    // [MODIFICADO] Recebe o histórico e a pergunta atual
    const { history, query } = JSON.parse(event.body);
    if (!query) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Pergunta não fornecida.' }) };
    }

    try {
        // A busca na web continua sendo feita apenas com a pergunta mais recente
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.SEARCH_API_KEY}&cx=${process.env.SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        const searchSnippets = searchData.items?.slice(0, 3).map(item => item.snippet).join('\n\n');
        
        // Se não encontrar nada na web, a IA ainda pode responder com base no contexto
        const webDataContext = searchSnippets ? `
            DADOS DA WEB PARA CONTEXTO ADICIONAL:
            ---
            ${searchSnippets}
            ---
        ` : 'Não foram encontrados dados relevantes na web para esta pergunta.';

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;
        
        // [MODIFICADO] O prompt agora inclui o contexto da busca na web
        const prompt = `
            ${webDataContext}
            Com base no contexto acima e no histórico da conversa, responda à última pergunta do usuário.
        `;
        
        // [MODIFICADO] A requisição para o Gemini agora inclui o histórico
        const geminiRequestBody = {
            contents: [
                ...history, // Inclui todas as mensagens anteriores
                { role: 'user', parts: [{ text: query }] }, // A pergunta atual
                { role: 'model', parts: [{ text: prompt }] } // A instrução final com dados da web
            ]
        };

        const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(geminiRequestBody),
        });

        const geminiData = await geminiResponse.json();
        
        if (geminiData.error || !geminiData.candidates || geminiData.candidates.length === 0) {
            console.error('Erro retornado pela API Gemini:', JSON.stringify(geminiData, null, 2));
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