// js/baremos.js

// Garante que o namespace global para os dados dos testes exista.
// Os arquivos individuais (ex: bpa2-data.js) irão popular este objeto.
FSLaudosApp.testData = FSLaudosApp.testData || {};

/**
 * Objeto principal para acessar os cálculos dos baremos.
 * Este objeto age como uma "fachada" ou "orquestrador", delegando as chamadas
 * para as implementações específicas de cada teste, que estão localizadas
 * na pasta /js/test-data/.
 */
FSLaudosApp.baremos = {

    // ==========================================================================
    // MÉTODOS PARA O TESTE BPA-2
    // ==========================================================================

    /**
     * Delega a busca da chave de faixa etária para o arquivo de dados do BPA-2.
     */
    getAgeGroupKeyBPA2: function(age) {
        if (FSLaudosApp.testData.BPA2) {
            return FSLaudosApp.testData.BPA2.getAgeGroupKey(age);
        }
        console.error("Dados do BPA-2 não foram carregados.");
        return null;
    },

    /**
     * Delega o cálculo de classificação e percentil para o arquivo de dados do BPA-2.
     */
    getBpa2Classification: function(ageGroupKey, subtest, score) {
        if (FSLaudosApp.testData.BPA2) {
            return FSLaudosApp.testData.BPA2.getClassification(ageGroupKey, subtest, score);
        }
        console.error("Dados do BPA-2 não foram carregados.");
        return { percentile: '-', classification: 'Erro' };
    },

    /**
     * Delega o cálculo da pontuação média para o arquivo de dados do BPA-2.
     */
    getBpa2AverageScore: function(ageGroupKey, subtest) {
        if (FSLaudosApp.testData.BPA2) {
            return FSLaudosApp.testData.BPA2.getAverageScore(ageGroupKey, subtest);
        }
        console.error("Dados do BPA-2 não foram carregados.");
        return null;
    },

    // ==========================================================================
    // MÉTODOS PARA O TESTE WISC-IV
    // ==========================================================================

    /**
     * Delega a conversão de ponto bruto para ponderado para o arquivo de dados do WISC-IV.
     */
    getWiscWeightedScore: function(subtestId, rawScore, age) {
        if (FSLaudosApp.testData.WiscIV) {
            // Garante compatibilidade com código antigo que possa acessar baremos.WiscIVData
            this.WiscIVData = FSLaudosApp.testData.WiscIV.data;
            return FSLaudosApp.testData.WiscIV.getWeightedScore(subtestId, rawScore, age);
        }
        console.error("Dados do WISC-IV não foram carregados.");
        return { weighted: '', classification: '' };
    },

    /**
     * Delega a conversão de soma de pontos para score composto para o arquivo de dados do WISC-IV.
     */
    getWiscCompositeScore: function(scaleId, sum) {
        if (FSLaudosApp.testData.WiscIV) {
            return FSLaudosApp.testData.WiscIV.getCompositeScore(scaleId, sum);
        }
        console.error("Dados do WISC-IV não foram carregados.");
        return { composite: '', percentile: '', ci_90: '', ci_95: '', classification: '' };
    },

    // ==========================================================================
    // MÉTODOS PARA O TESTE SRS-2
    // ==========================================================================

    /**
     * Delega a busca do Escore T para o arquivo de dados do SRS-2.
     */
    getSrs2TScore: function(subscaleId, rawScore) {
        if (FSLaudosApp.testData.SRS2) {
            // Garante compatibilidade com código antigo que possa acessar baremos.SRS2Data
            this.SRS2Data = FSLaudosApp.testData.SRS2.data;
            return FSLaudosApp.testData.SRS2.getTScore(subscaleId, rawScore);
        }
        console.error("Dados do SRS-2 não foram carregados.");
        return '';
    },

    /**
     * Delega a busca da classificação pelo Escore T para o arquivo de dados do SRS-2.
     */
    getSrs2Classification: function(tScore) {
        if (FSLaudosApp.testData.SRS2) {
            return FSLaudosApp.testData.SRS2.getClassification(tScore);
        }
        console.error("Dados do SRS-2 não foram carregados.");
        return 'Erro';
    },
    
    // ==========================================================================
    // MÉTODOS PARA O TESTE ETDAH-AD
    // ==========================================================================

    /**
     * Delega o cálculo de classificação para o arquivo de dados do ETDAH-AD.
     */
    getEtdahAdClassification: function(escolaridade, fatorId, resultadoBruto) {
        if (FSLaudosApp.testData.ETDAHAD) {
            return FSLaudosApp.testData.ETDAHAD.getClassification(escolaridade, fatorId, resultadoBruto);
        }
        console.error("Dados do ETDAH-AD não foram carregados.");
        return { percentile: '-', classification: 'Erro' };
    },

    // ==========================================================================
    // MÉTODOS PARA O TESTE RAVLT
    // ==========================================================================

    /**
     * Delega o cálculo de classificação para o arquivo de dados do RAVLT.
     */
    getRavltClassification: function(baremType, score) {
        if (FSLaudosApp.testData.RAVLT) {
            // Garante compatibilidade com código antigo que possa acessar baremos.RAVLTData
            this.RAVLTData = FSLaudosApp.testData.RAVLT.data;
            return FSLaudosApp.testData.RAVLT.getClassification(baremType, score);
        }
        console.error("Dados do RAVLT não foram carregados.");
        return { percentile: '-', classification: 'Erro' };
    }
};