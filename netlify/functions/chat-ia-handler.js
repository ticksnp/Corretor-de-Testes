// functions/chat-ia-handler.js

const fetch = require('node-fetch');

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
    
    const { history, query, image } = JSON.parse(event.body);
    if (!query && !image) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Nenhuma pergunta ou imagem fornecida.' }) };
    }

    try {
        let geminiRequestBody;
        // [CORREÇÃO] Instrução de sistema para dar um papel claro à IA
        const systemInstruction = {
            role: "system",
            parts: [{ text: "Você é um assistente prestativo e conciso, especialista em psicologia e neurodesenvolvimento. Responda às perguntas do usuário com base no histórico da conversa." }]
        };

        if (image) {
            const userPrompt = query || "Descreva esta imagem em detalhes, focando em qualquer texto ou dado que possa ser relevante para um laudo psicológico.";
            geminiRequestBody = {
                contents: [
                    systemInstruction,
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
            const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.SEARCH_API_KEY}&cx=${process.env.SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;
            const searchResponse = await fetch(searchUrl);
            const searchData = await searchResponse.json();
            const searchSnippets = searchData.items?.slice(0, 3).map(item => `Trecho: ${item.snippet}`).join('\n');
            
            // [CORREÇÃO] O prompt agora é mais direto e o contexto web é opcional.
            const finalPrompt = `Pergunta do usuário: "${query}".\n\nSe o contexto da web a seguir for útil, use-o para refinar sua resposta. Senão, ignore-o.\nContexto da Web:\n${searchSnippets || 'Nenhum'}`;

            geminiRequestBody = {
                contents: [
                    systemInstruction,
                    ...history, // Envia o histórico completo
                    { role: 'user', parts: [{ text: finalPrompt }] } // Adiciona a nova pergunta
                ]
            };
        }

        let geminiData = await callGeminiAPI(geminiRequestBody, process.env.GEMINI_API_KEY, 'gemini-1.5-flash-latest');
        
        if (geminiData.error || !geminiData.candidates || geminiData.candidates.length === 0) {
            console.error('Erro ou resposta vazia da API Gemini:', JSON.stringify(geminiData, null, 2));
            const errorMessage = geminiData.error ? geminiData.error.message : 'A IA não forneceu uma resposta.';
            
            if (geminiData.error?.status === 'UNAVAILABLE' || geminiData.error?.code === 503) {
                 console.warn('Modelo principal sobrecarregado, tentando fallback...');
                 geminiData = await callGeminiAPI(geminiRequestBody, process.env.GEMINI_API_KEY, 'gemini-1.0-pro');
            } else {
                return { 
                    statusCode: 500,
                    headers, 
                    body: JSON.stringify({ error: `A IA retornou um erro: ${errorMessage}` })
                };
            }
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