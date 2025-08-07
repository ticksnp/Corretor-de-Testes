// js/baremos.js

// Inicializa o namespace para os dados dos testes, caso ainda não exista
FSLaudosApp.testData = FSLaudosApp.testData || {};

FSLaudosApp.baremos = {
    // --- BPA-2 ---
    getAgeGroupKeyBPA2: function(age) {
        return FSLaudosApp.testData.BPA2.getAgeGroupKey(age);
    },
    getBpa2Classification: function(ageGroupKey, subtest, score) {
        return FSLaudosApp.testData.BPA2.getClassification(ageGroupKey, subtest, score);
    },
    getBpa2AverageScore: function(ageGroupKey, subtest) {
        return FSLaudosApp.testData.BPA2.getAverageScore(ageGroupKey, subtest);
    },

    // --- WISC-IV ---
    getWiscWeightedScore: function(subtestId, rawScore, age) {
        // Adiciona a propriedade 'WiscIVData' para manter a compatibilidade com o código existente, se necessário
        this.WiscIVData = FSLaudosApp.testData.WiscIV.data;
        return FSLaudosApp.testData.WiscIV.getWeightedScore(subtestId, rawScore, age);
    },
    getWiscCompositeScore: function(scaleId, sum) {
        return FSLaudosApp.testData.WiscIV.getCompositeScore(scaleId, sum);
    },

    // --- SRS-2 ---
    getSrs2TScore: function(subscaleId, rawScore) {
        // Adiciona a propriedade 'SRS2Data' para manter compatibilidade
        this.SRS2Data = FSLaudosApp.testData.SRS2.data;
        return FSLaudosApp.testData.SRS2.getTScore(subscaleId, rawScore);
    },
    getSrs2Classification: function(tScore) {
        return FSLaudosApp.testData.SRS2.getClassification(tScore);
    },
    
    // --- ETDAH-AD ---
    getEtdahAdClassification: function(escolaridade, fatorId, resultadoBruto) {
        // Supondo que você crie o arquivo etdah-ad-data.js
        if (FSLaudosApp.testData.ETDAHAD) {
            return FSLaudosApp.testData.ETDAHAD.getClassification(escolaridade, fatorId, resultadoBruto);
        }
        return { percentile: '-', classification: 'Dados não carregados' };
    },

    // --- RAVLT ---
    getRavltClassification: function(baremType, score) {
        // Supondo que você crie o arquivo ravlt-data.js
        if (FSLaudosApp.testData.RAVLT) {
            // Adiciona a propriedade 'RAVLTData' para manter compatibilidade
            this.RAVLTData = FSLaudosApp.testData.RAVLT.data;
            return FSLaudosApp.testData.RAVLT.getClassification(baremType, score);
        }
        return { percentile: '-', classification: 'Dados não carregados' };
    }
    
    // Remova TODOS os objetos de dados grandes (BPA2Data, WiscIVData, etc.) deste arquivo.
};