// js/test-data/ravlt-data.js
FSLaudosApp.testData = FSLaudosApp.testData || {};

FSLaudosApp.testData.RAVLT = {
    data: {
        // Placeholder para os dados de barema do RAVLT.
        // Adicione aqui as tabelas de conversão conforme o manual.
        graphData: {
            labels: ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'A6', 'A7', 'Reconhecimento'],
            minimo: [4, 6, 7, 8, 9, 3, 7, 6, 13],
            esperado: [6, 8, 9, 10, 11, 5, 9, 9, 15]
        },
        barem: {
            "default": { /* Tabela padrão de classificação */ },
            "reconhecimento": { /* Tabela para o score de reconhecimento */ },
            "indices": { /* Tabela para os índices */ }
        }
    },
    getClassification: function(baremType = 'default', score) {
        // Lógica de placeholder. Preencha o objeto 'data' com
        // os baremos reais para que esta função retorne valores corretos.
        if (score > 10) {
            return { percentile: '90', classification: 'Superior' };
        }
        return { percentile: '50', classification: 'Médio' };
    }
};