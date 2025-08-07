// js/test-data/srs2-data.js

FSLaudosApp.testData.SRS2 = {
    // Dados brutos (Tabelas, itens, etc.)
    data: {
        // MOVER o conteúdo de 'SRS2Data' de 'baremos.js' para cá.
        // Exemplo da estrutura:
        tScoreTables: {
             percepcaoSocial: { /* ... dados ... */ },
             // ... outras tabelas
        },
        subscaleItems: {
            percepcaoSocial: [1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61],
            // ... outros
        },
        reverseScoredItems: [4, 15, 19, 28, 30, 31, 32, 34, 40, 47, 51, 60, 64],
        classification: [
            { limit: 76, desc: 'Grave' },
            { limit: 66, desc: 'Moderado' },
            { limit: 60, desc: 'Leve' },
            { limit: 0, desc: 'Normal' }
        ]
    },
    
    /**
     * Converte o ponto bruto de uma subescala em Escore T.
     * @param {string} subscaleId - O ID da subescala.
     * @param {number} rawScore - O ponto bruto.
     * @returns {string} O Escore T correspondente.
     */
    getTScore: function(subscaleId, rawScore) {
        if (!this.data.tScoreTables[subscaleId] || rawScore < 0) return '';
        const table = this.data.tScoreTables[subscaleId];
        return table[rawScore] || (rawScore > table.length - 1 ? table[table.length - 1] : '');
    },

    /**
     * Retorna a classificação baseada no Escore T.
     * @param {number} tScore - O Escore T.
     * @returns {string} A classificação.
     */
    getClassification: function(tScore) {
        if (tScore === '' || tScore === null) return '';
        const score = Number(tScore);
        for (const c of this.data.classification) {
            if (score >= c.limit) return c.desc;
        }
        return 'Inválido';
    }
};

// **IMPORTANTE**: Copie o objeto 'SRS2Data' de 'baremos.js' para a propriedade 'data' acima.