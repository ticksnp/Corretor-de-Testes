// js/baremos.js

FSLaudosApp.testData = FSLaudosApp.testData || {};

FSLaudosApp.baremos = {
    // --- BPA-2 ---
    getAgeGroupKeyBPA2: function(age) {
        if (FSLaudosApp.testData.BPA2) return FSLaudosApp.testData.BPA2.getAgeGroupKey(age);
        console.error("Dados do BPA-2 não carregados."); return null;
    },
    getBpa2Classification: function(ageGroupKey, subtest, score) {
        if (FSLaudosApp.testData.BPA2) return FSLaudosApp.testData.BPA2.getClassification(ageGroupKey, subtest, score);
        console.error("Dados do BPA-2 não carregados."); return { percentile: '-', classification: 'Erro' };
    },
    getBpa2AverageScore: function(ageGroupKey, subtest) {
        if (FSLaudosApp.testData.BPA2) return FSLaudosApp.testData.BPA2.getAverageScore(ageGroupKey, subtest);
        console.error("Dados do BPA-2 não carregados."); return null;
    },

    // --- WISC-IV ---
    getWiscWeightedScore: function(subtestId, rawScore, age) {
        if (FSLaudosApp.testData.WiscIV) {
            this.WiscIVData = FSLaudosApp.testData.WiscIV.data;
            return FSLaudosApp.testData.WiscIV.getWeightedScore(subtestId, rawScore, age);
        }
        console.error("Dados do WISC-IV não carregados."); return { weighted: '', classification: '' };
    },
    getWiscCompositeScore: function(scaleId, sum) {
        if (FSLaudosApp.testData.WiscIV) return FSLaudosApp.testData.WiscIV.getCompositeScore(scaleId, sum);
        console.error("Dados do WISC-IV não carregados."); return { composite: '', percentile: '', ci_90: '', ci_95: '', classification: '' };
    },

    // --- SRS-2 ---
    getSrs2TScore: function(subscaleId, rawScore) {
        if (FSLaudosApp.testData.SRS2) {
            this.SRS2Data = FSLaudosApp.testData.SRS2.data;
            return FSLaudosApp.testData.SRS2.getTScore(subscaleId, rawScore);
        }
        console.error("Dados do SRS-2 não carregados."); return '';
    },
    getSrs2Classification: function(tScore) {
        if (FSLaudosApp.testData.SRS2) return FSLaudosApp.testData.SRS2.getClassification(tScore);
        console.error("Dados do SRS-2 não carregados."); return 'Erro';
    },

    // --- ETDAH-AD ---
    getEtdahAdClassification: function(escolaridade, fatorId, resultadoBruto) {
        if (FSLaudosApp.testData.ETDAHAD) return FSLaudosApp.testData.ETDAHAD.getClassification(escolaridade, fatorId, resultadoBruto);
        console.error("Dados do ETDAH-AD não carregados."); return { percentile: '-', classification: 'Erro' };
    },

    // --- RAVLT ---
    getRavltClassification: function(baremType, score) {
        if (FSLaudosApp.testData.RAVLT) {
            this.RAVLTData = FSLaudosApp.testData.RAVLT.data;
            return FSLaudosApp.testData.RAVLT.getClassification(baremType, score);
        }
        console.error("Dados do RAVLT não carregados."); return { percentile: '-', classification: 'Erro' };
    }
};