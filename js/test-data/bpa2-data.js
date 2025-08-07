// js/test-data/bpa2-data.js

FSLaudosApp.testData.BPA2 = {
    // Dados brutos do barema
    data: {
        barem: {
            '18-24': { ac: [131, 126, 121, 116, 111, 106, 101, 96, 91, 86, 81, 76, 71, 66, 61, 56, 51], ad: [98, 95, 92, 89, 86, 83, 80, 77, 74, 71, 68, 65, 62, 59, 56, 53, 50], aa: [46, 44, 42, 40, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20, 18, 16, 14], ag: [270, 261, 252, 243, 234, 225, 216, 207, 198, 189, 180, 171, 162, 153, 144, 135, 126] },
            '25-34': { ac: [134, 130, 126, 122, 118, 114, 110, 106, 102, 98, 94, 90, 86, 82, 78, 74, 70], ad: [96, 93, 90, 87, 84, 81, 78, 75, 72, 69, 66, 63, 60, 57, 54, 51, 48], aa: [47, 45, 43, 41, 39, 37, 35, 33, 31, 29, 27, 25, 23, 21, 19, 17, 15], ag: [273, 264, 255, 246, 237, 228, 219, 210, 201, 192, 183, 174, 165, 156, 147, 138, 129] },
            '35-44': { ac: [133, 129, 125, 121, 117, 113, 109, 105, 101, 97, 93, 89, 85, 81, 77, 73, 69], ad: [95, 92, 89, 86, 83, 80, 77, 74, 71, 68, 65, 62, 59, 56, 53, 50, 47], aa: [46, 44, 42, 40, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20, 18, 16, 14], ag: [268, 259, 250, 241, 232, 223, 214, 205, 196, 187, 178, 169, 160, 151, 142, 133, 124] },
            '45-54': { ac: [132, 128, 124, 120, 116, 112, 108, 104, 100, 96, 92, 88, 84, 80, 76, 72, 68], ad: [93, 90, 87, 84, 81, 78, 75, 72, 69, 66, 63, 60, 57, 54, 51, 48, 45], aa: [45, 43, 41, 39, 37, 35, 33, 31, 29, 27, 25, 23, 21, 19, 17, 15, 13], ag: [264, 255, 246, 237, 228, 219, 210, 201, 192, 183, 174, 165, 156, 147, 138, 129, 120] },
            '55-60': { ac: [131, 127, 123, 119, 115, 111, 107, 103, 99, 95, 91, 87, 83, 79, 75, 71, 67], ad: [90, 87, 84, 81, 78, 75, 72, 69, 66, 63, 60, 57, 54, 51, 48, 45, 42], aa: [44, 42, 40, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12], ag: [259, 250, 241, 232, 223, 214, 205, 196, 187, 178, 169, 160, 151, 142, 133, 124, 115] },
        },
        percentiles: [99, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20],
        classifications: ['Muito Superior', 'Superior', 'Médio Superior', 'Médio', 'Médio Inferior', 'Inferior'],
        classificationRanges: [95, 75, 25, 5]
    },

    /**
     * Retorna a chave do grupo de idade para o barema do BPA-2.
     * @param {number} age - A idade em anos.
     * @returns {string|null} A chave do grupo de idade ou null se fora da faixa.
     */
    getAgeGroupKey: function(age) {
        if (age >= 18 && age <= 24) return '18-24';
        if (age >= 25 && age <= 34) return '25-34';
        if (age >= 35 && age <= 44) return '35-44';
        if (age >= 45 && age <= 54) return '45-54';
        if (age >= 55 && age <= 60) return '55-60';
        return null;
    },

    /**
     * Calcula o percentil e a classificação para um score do BPA-2.
     * @param {string} ageGroupKey - A chave do grupo de idade.
     * @param {string} subtest - A chave do subteste ('ac', 'ad', 'aa', 'ag').
     * @param {number} score - O score obtido.
     * @returns {object} Objeto com { percentile, classification }.
     */
    getClassification: function(ageGroupKey, subtest, score) {
        const scoreNumber = parseInt(score, 10);
        if (!ageGroupKey || !this.data.barem[ageGroupKey] || isNaN(scoreNumber)) {
            return { percentile: '-', classification: '-' };
        }
        const baremPoints = this.data.barem[ageGroupKey][subtest];
        const percentiles = this.data.percentiles;
        if (!baremPoints) return { percentile: '-', classification: 'Subteste inválido' };

        let percentile = 5;
        for (let i = 0; i < baremPoints.length; i++) {
            if (scoreNumber >= baremPoints[i]) {
                percentile = percentiles[i];
                break;
            }
        }

        let classification = this.data.classifications[this.data.classifications.length - 1]; // Default to 'Inferior'
        const ranges = this.data.classificationRanges;
        const classifications = this.data.classifications;
        if (percentile >= ranges[0]) classification = classifications[0];
        else if (percentile >= ranges[1]) classification = classifications[1];
        else if (percentile >= ranges[2]) classification = classifications[2];
        else if (percentile > ranges[3]) classification = classifications[3];
        else if (percentile === ranges[3]) classification = classifications[4];
        
        return { percentile: percentile.toString(), classification };
    },
    
    /**
     * Retorna a pontuação média (percentil 50) para um subteste e faixa etária.
     * @param {string} ageGroupKey - A chave do grupo de idade.
     * @param {string} subtest - A chave do subteste.
     * @returns {number|null} A pontuação média ou null.
     */
    getAverageScore: function(ageGroupKey, subtest) {
        const p50Index = this.data.percentiles.indexOf(50);
        if (p50Index === -1 || !this.data.barem[ageGroupKey] || !this.data.barem[ageGroupKey][subtest]) return null;
        return this.data.barem[ageGroupKey][subtest][p50Index];
    }
};