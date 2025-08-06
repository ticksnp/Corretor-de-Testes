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
        
        // [CORREÇÃO] A instrução de sistema agora é um objeto separado.
        // O campo 'role' foi removido, pois será uma propriedade de nível superior.
        const systemInstruction = {
            parts: [{ text: "Você é um assistente prestativo e conciso, especialista em psicologia e neurodesenvolvimento. Responda às perguntas do usuário com base no histórico da conversa." }]
        };

        if (image) {
            const userPrompt = query || "Descreva esta imagem em detalhes, focando em qualquer texto ou dado que possa ser relevante para um laudo psicológico.";
            
            // [CORREÇÃO] 'systemInstruction' é agora uma propriedade de nível superior no corpo da requisição.
            geminiRequestBody = {
                contents: [
                    ...history, // O histórico de mensagens
                    {
                        role: 'user', // A nova mensagem do usuário
                        parts: [
                            { text: userPrompt },
                            { inline_data: { mime_type: image.mimeType, data: image.data } }
                        ]
                    }
                ],
                systemInstruction: systemInstruction
            };
        } else {
            const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.SEARCH_API_KEY}&cx=${process.env.SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;
            const searchResponse = await fetch(searchUrl);
            const searchData = await searchResponse.json();
            const searchSnippets = searchData.items?.slice(0, 3).map(item => `Trecho: ${item.snippet}`).join('\n');
            
            const finalPrompt = `Pergunta do usuário: "${query}".\n\nSe o contexto da web a seguir for útil, use-o para refinar sua resposta. Senão, ignore-o.\nContexto da Web:\n${searchSnippets || 'Nenhum'}`;
            
            // [CORREÇÃO] 'systemInstruction' também é uma propriedade de nível superior aqui.
            geminiRequestBody = {
                contents: [
                    ...history, 
                    { role: 'user', parts: [{ text: finalPrompt }] }
                ],
                systemInstruction: systemInstruction
            };
        }

        let geminiData = await callGeminiAPI(geminiRequestBody, process.env.GEMINI_API_KEY, 'gemini-1.5-flash-latest');
        
        if (geminiData.error || !geminiData.candidates || geminiData.candidates.length === 0) {
            console.error('Erro ou resposta vazia da API Gemini:', JSON.stringify(geminiData, null, 2));
            const errorMessage = geminiData.error ? geminiData.error.message : 'A IA não forneceu uma resposta.';
            
            // Tentativa de fallback, caso o modelo principal falhe
            if (geminiData.error?.status === 'UNAVAILABLE' || geminiData.error?.code === 503 || errorMessage.includes('system role is not supported')) {
                 console.warn('Modelo principal falhou ou não suporta a instrução de sistema, tentando fallback...');
                 geminiData = await callGeminiAPI(geminiRequestBody, process.env.GEMINI_API_KEY, 'gemini-1.0-pro');
            } else {
                return { 
                    statusCode: 500,
                    headers, 
                    body: JSON.stringify({ error: `A IA retornou um erro: ${errorMessage}` })
                };
            }
        }
        
        // Verifica novamente se o fallback também deu erro.
        if (geminiData.error || !geminiData.candidates || geminiData.candidates.length === 0) {
             console.error('Erro na API Gemini mesmo após o fallback:', JSON.stringify(geminiData, null, 2));
             const fallbackErrorMessage = geminiData.error ? geminiData.error.message : 'A IA não forneceu uma resposta.';
             return { 
                statusCode: 500,
                headers, 
                body: JSON.stringify({ error: `Erro na IA após fallback: ${fallbackErrorMessage}` })
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