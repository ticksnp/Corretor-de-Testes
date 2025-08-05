// Importa o 'fetch' que não é nativo em ambientes Node.js mais antigos
const fetch = require('node-fetch');

// [NOVO] Adicione o ID do seu projeto do Google Cloud aqui
// Pegue o ID do projeto "Gemini API": gen-lang-client-0473216662
const GOOGLE_PROJECT_ID = 'gen-lang-client-0473216662';

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

        // Linha de depuração que pode ser removida depois
        console.log('RESPOSTA COMPLETA DA GOOGLE SEARCH API:', JSON.stringify(searchData, null, 2));

        const searchSnippets = searchData.items?.slice(0, 3).map(item => item.snippet).join('\n\n');
        
        if (!searchSnippets || searchSnippets.length === 0) {
            return { 
                statusCode: 404, 
                headers, 
                body: JSON.stringify({ error: 'Não consegui encontrar informações sobre isso na web. Tente uma pergunta mais específica.' })
            };
        }

        // [MODIFICADO] URL da API Vertex AI (Gemini Pro)
        const geminiUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${GOOGLE_PROJECT_ID}/locations/us-central1/publishers/google/models/gemini-1.0-pro-vision:streamGenerateContent`;

        // [MODIFICADO] O prompt é um pouco diferente para a Vertex AI
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

        // [MODIFICADO] Precisamos de um token de autenticação para a Vertex AI
        // A Netlify não suporta isso diretamente. Vamos simplificar a chamada para a API original do Gemini e adicionar log de erro.
        // Revertendo a URL e adicionando log de erro na chamada do Gemini para diagnóstico final.

        const originalGeminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const geminiResponse = await fetch(originalGeminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        const geminiData = await geminiResponse.json();
        
        // [NOVO] Log de depuração para a resposta do Gemini
        console.log('RESPOSTA COMPLETA DA GEMINI API:', JSON.stringify(geminiData, null, 2));

        if (geminiData.error || !geminiData.candidates || geminiData.candidates.length === 0) {
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