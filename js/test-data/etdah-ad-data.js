// js/test-data/etdah-ad-data.js
FSLaudosApp.testData = FSLaudosApp.testData || {};

FSLaudosApp.testData.ETDAHAD = {
    data: {
        // Placeholder para os dados de barema do ETDAH-AD.
        // Adicione aqui as tabelas de conversão conforme o manual do teste.
        // Exemplo da estrutura esperada:
        barem: {
            "Amostra Geral": {
                "D": { /* Tabela de Desatenção para Amostra Geral */ },
                "I": { /* Tabela de Impulsividade para Amostra Geral */ },
                // ... outros fatores
            },
            "Ensino Fundamental": {
                "D": { /* ... */ },
                // ...
            }
        }
    },
    getClassification: function(escolaridade, fatorId, resultadoBruto) {
        // Esta é uma implementação de placeholder. Você precisará preencher
        // o objeto 'data' acima com os dados reais do manual do teste.
        if (resultadoBruto > 30) {
            return { percentile: '95', classification: 'Muito Elevado' };
        }
        if (resultadoBruto > 20) {
            return { percentile: '75', classification: 'Elevado' };
        }
        return { percentile: '50', classification: 'Médio' };
    }
};