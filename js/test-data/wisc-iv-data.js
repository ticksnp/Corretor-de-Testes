// js/test-data/wisc-iv-data.js

FSLaudosApp.testData.WiscIV = {
    // Dados brutos (Tabelas de conversão, etc.)
    data: {
        // As tabelas são muito grandes para incluir aqui, mas você deve
        // MOVER o conteúdo de 'WiscIVData' do seu arquivo 'baremos.js' para cá.
        // Exemplo da estrutura que deve ser movida:
        weightedScoreTables: {
            '6:0-6:3': { // Tabela A.1.1
                cubos: { 1: [[0,2]], 2: [3], 3: [4], 4: [5], 5: [[6,7]], 6: [[8,9]], 7: [10], 8: [[11,12]], 9: [13], 10: [[14,16]], 11: [[17,19]], 12: [[20,23]], 13: [[24,26]], 14: [[27,28]], 15: [[29,32]], 16: [[33,36]], 17: [[37,39]], 18: [[40,44]], 19: [[45,68]] },
                semelhancas: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [[5,6]], 7: [7], 8: [[8,9]], 9: [10], 10: [11], 11: [12], 12: [13], 13: [14], 14: [15], 15: [[16,17]], 16: [[18,19]], 17: [[20,21]], 18: [[22,24]], 19: [[25,28]] },
                digitos: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7], 9: [[8,9]], 10: [[10,12]], 11: [13], 12: [[14,15]], 13: [16], 14: [[17,18]], 15: [[19,21]], 16: [[22,24]], 17: [25], 18: [[26,27]], 19: [[28,32]] },
                conceitosFigurativos: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7], 9: [[8,9]], 10: [10], 11: [11], 12: [12], 13: [13], 14: [[14,15]], 15: [[16,17]], 16: [[18,19]], 17: [20], 18: [21], 19: [[22,28]] },
                codigo: { 1: [[0,20]], 2: [[21,23]], 3: [[24,26]], 4: [[27,29]], 5: [[30,31]], 6: [[32,35]], 7: [[36,40]], 8: [[41,44]], 9: [[45,49]], 10: [[50,53]], 11: [[54,57]], 12: [[58,60]], 13: [[61,62]], 14: [63], 15: [64], 16: [65], 17: [66], 18: [67], 19: [[68,119]] },
                vocabulario: { 1: [0], 2: [1], 3: [[2,3]], 4: [4], 5: [[5,6]], 6: [7], 7: [[8,9]], 8: [10], 9: [[11,12]], 10: [13], 11: [14], 12: [15], 13: [16], 14: [[17,19]], 15: [[20,22]], 16: [[23,24]], 17: [[25,27]], 18: [[28,30]], 19: [[31,66]] },
                sequenciaNumerosLetras: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [[5,6]], 7: [7], 8: [8], 9: [9], 10: [10], 11: [11], 12: [12], 13: [13], 14: [14], 15: [15], 16: [16], 17: [[17,21]], 18: [22], 19: [[23,30]] },
                raciocinioMatricial: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7], 9: [8], 10: [[9,10]], 11: [11], 12: [[12,13]], 13: [14], 14: [15], 15: [16], 16: [17], 17: [[18,20]], 18: [[21,22]], 19: [[23,35]] },
                compreensao: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7], 9: [[8,9]], 10: [10], 11: [[11,12]], 12: [13], 13: [14], 14: [15], 15: [[16,17]], 16: [[18,19]], 17: [[20,21]], 18: [22], 19: [[23,42]] },
                procurarSimbolos: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7], 9: [8], 10: [9], 11: [10], 12: [11], 13: [[12,13]], 14: [[14,16]], 15: [17], 16: [[18,20]], 17: [[21,23]], 18: [[24,26]], 19: [[27,60]] },
                completarFiguras: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [[4,5]], 6: [[6,7]], 7: [8], 8: [9], 9: [10], 10: [[11,12]], 11: [13], 12: [14], 13: [[15,16]], 14: [17], 15: [[18,19]], 16: [20], 17: [21], 18: [22], 19: [[23,38]] },
                cancelamento: { 1: [0], 2: [[1,12]], 3: [[13,23]], 4: [[24,32]], 5: [[33,37]], 6: [[38,43]], 7: [[44,48]], 8: [[49,54]], 9: [[55,60]], 10: [[61,67]], 11: [[68,73]], 12: [[74,79]], 13: [[80,86]], 14: [[87,93]], 15: [[94,101]], 16: [[102,108]], 17: [109], 18: [[110,111]], 19: [[112,136]] },
                informacao: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7], 9: [8], 10: [9], 11: [10], 12: [11], 13: [12], 14: [13], 15: [14], 16: [15], 17: [16], 18: [17], 19: [[18,33]] },
                aritmetica: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7], 9: [8], 10: [9], 11: [10], 12: [11], 13: [12], 14: [13], 15: [14], 16: [15], 17: [16], 18: [[17,18]], 19: [[19,34]] },
                raciocinioPalavras: { 1: [[0,1]], 2: [2], 3: [3], 4: [4], 5: [5], 6: [6], 7: [7], 8: [8], 9: [9], 10: [10], 11: [11], 12: [12], 13: [13], 14: [14], 15: [15], 16: [16], 17: [17], 18: [18], 19: [[19,24]] }
            },
            '6:4-6:7': { // Tabela A.1.2
                cubos: { 1: [0], 2: [[1,2]], 3: [3], 4: [4], 5: [5], 6: [[6,7]], 7: [[8,10]], 8: [[11,13]], 9: [[14,15]], 10: [[16,18]], 11: [[19,20]], 12: [[21,23]], 13: [[24,26]], 14: [[27,30]], 15: [[31,33]], 16: [[34,37]], 17: [[38,41]], 18: [[42,47]], 19: [[48,68]] },
                semelhancas: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7], 9: [[8,9]], 10: [10], 11: [11], 12: [12], 13: [13], 14: [[14,15]], 15: [[16,17]], 16: [[18,19]], 17: [[20,22]], 18: [[23,25]], 19: [[26,28]] },
                digitos: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7], 9: [[8,9]], 10: [10], 11: [[11,12]], 12: [13], 13: [14], 14: [[15,16]], 15: [17], 16: [[18,19]], 17: [[20,22]], 18: [[23,24]], 19: [[25,32]] },
                conceitosFigurativos: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [[7,8]], 9: [9], 10: [10], 11: [11], 12: [12], 13: [13], 14: [14], 15: [15], 16: [16], 17: [[17,19]], 18: [[20,21]], 19: [[22,28]] },
                codigo: { 1: [[0,1]], 2: [2], 3: [[3,4]], 4: [5], 5: [[6,7]], 6: [[8,9]], 7: [[10,11]], 8: [[12,14]], 9: [[15,16]], 10: [17], 11: [18], 12: [19], 13: [20], 14: [21], 15: [22], 16: [23], 17: [24], 18: [25], 19: [26] },
                vocabulario: { 1: [[0,1]], 2: [2], 3: [3], 4: [4], 5: [5], 6: [6], 7: [[7,8]], 8: [9], 9: [10], 10: [[11,12]], 11: [13], 12: [14], 13: [15], 14: [16], 15: [[17,18]], 16: [[19,20]], 17: [[21,24]], 18: [[25,28]], 19: [[29,44]] },
                sequenciaNumerosLetras: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7], 9: [8], 10: [9], 11: [10], 12: [11], 13: [12], 14: [13], 15: [14], 16: [15], 17: [[16,17]], 18: [[18,19]], 19: [[20,30]] },
                raciocinioMatricial: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7], 9: [8], 10: [9], 11: [[10,11]], 12: [12], 13: [13], 14: [14], 15: [15], 16: [[16,17]], 17: [[18,19]], 18: [20], 19: [[21,35]] },
                compreensao: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7], 9: [8], 10: [9], 11: [10], 12: [11], 13: [[12,13]], 14: [14], 15: [15], 16: [16], 17: [17], 18: [18], 19: [[19,42]] },
                procurarSimbolos: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7], 9: [8], 10: [9], 11: [10], 12: [11], 13: [12], 14: [13], 15: [14], 16: [15], 17: [16], 18: [17], 19: [[18,60]] },
                completarFiguras: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7], 9: [[8,9]], 10: [[10,11]], 11: [12], 12: [13], 13: [14], 14: [[15,16]], 15: [17], 16: [18], 17: [19], 18: [20], 19: [[21,38]] },
                cancelamento: { 1: [0], 2: [[1,11]], 3: [[12,16]], 4: [[17,20]], 5: [[21,25]], 6: [[26,30]], 7: [[31,35]], 8: [[36,40]], 9: [[41,46]], 10: [[47,51]], 11: [[52,57]], 12: [[58,64]], 13: [[65,70]], 14: [[71,76]], 15: [[77,83]], 16: [[84,89]], 17: [[90,96]], 18: [[97,106]], 19: [[107,136]] },
                informacao: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7], 9: [8], 10: [9], 11: [10], 12: [11], 13: [12], 14: [13], 15: [14], 16: [15], 17: [16], 18: [[17,18]], 19: [[19,33]] },
                aritmetica: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7], 9: [8], 10: [9], 11: [10], 12: [11], 13: [12], 14: [13], 15: [[14,15]], 16: [16], 17: [17], 18: [18], 19: [[19,34]] },
                raciocinioPalavras: { 1: [0], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7], 9: [8], 10: [9], 11: [10], 12: [11], 13: [12], 14: [13], 15: [14], 16: [15], 17: [16], 18: [17], 19: [[18,24]] }
            }
            // ... todos os outros grupos de idade
        },
        compositeScoreTables: {
            compreensaoVerbal: { /* ... dados ... */ },
            // ... todas as outras tabelas de scores compostos
        },
        scaleAbbreviations: {
            compreensaoVerbal: 'ICV',
            organizacaoPerceptual: 'IOP',
            memoriaOperacional: 'IMO',
            velocidadeProcessamento: 'IVP',
            qiTotal: 'QIT'
        },
        classification: [
            { limit: 130, desc: 'Muito Superior' },
            { limit: 120, desc: 'Superior' },
            { limit: 110, desc: 'Média Superior' },
            { limit: 90, desc: 'Médio' },
            { limit: 80, desc: 'Média Inferior' },
            { limit: 70, desc: 'Limítrofe' },
            { limit: 0, desc: 'Extremamente Baixo' }
        ]
    },

    /**
     * Retorna a chave do grupo de idade para o barema do WISC-IV.
     * @param {object} age - Objeto com { years, months }.
     * @returns {string|null} A chave do grupo de idade ou null.
     */
    _getAgeGroupKey: function(age) {
        if (!age || age.years === undefined) return null;
        const totalMonths = age.years * 12 + age.months;
        if (age.years >= 16 && totalMonths <= 203) return "16_0-16_11";
        if (age.years >= 14 && age.years < 16) return "14_0-15_11";
        // ... adicione todas as outras faixas etárias aqui, do mais velho para o mais novo
        if (age.years === 6 && age.months <= 3) return "6_0-6_3";
        return null;
    },

    /**
     * Converte o ponto bruto de um subteste em ponto ponderado.
     * @param {string} subtestId - O ID do subteste (ex: 'cubos').
     * @param {string|number} rawScore - O ponto bruto.
     * @param {object} age - Objeto de idade do paciente.
     * @returns {object} Objeto com { weighted, classification }.
     */
    getWeightedScore: function(subtestId, rawScore, age) {
        const ageKey = this._getAgeGroupKey(age);
        const score = parseInt(rawScore, 10);
        if (!ageKey || isNaN(score) || !this.data.weightedScoreTables[ageKey]?.[subtestId]) {
            return { weighted: '', classification: '' };
        }
        const weighted = this.data.weightedScoreTables[ageKey][subtestId][score] || '';
        let classification = '';
        if (weighted >= 14) classification = 'Ponto Forte';
        else if (weighted <= 6) classification = 'Ponto Fraco';
        return { weighted, classification };
    },
    
    /**
     * Converte a soma dos pontos ponderados em score composto.
     * @param {string} scaleId - O ID da escala (ex: 'compreensaoVerbal').
     * @param {number} sum - A soma dos pontos ponderados.
     * @returns {object} Objeto com todos os dados do score composto.
     */
    getCompositeScore: function(scaleId, sum) {
        if (sum === 0 || !this.data.compositeScoreTables[scaleId] || !this.data.compositeScoreTables[scaleId][sum]) {
            return { composite: '', percentile: '', ci_90: '', ci_95: '', classification: '' };
        }
        const result = this.data.compositeScoreTables[scaleId][sum];
        let classification = 'Inválido';
        for (const c of this.data.classification) {
            if (result.composite >= c.limit) {
                classification = c.desc;
                break;
            }
        }
        return { ...result, classification };
    }
};

// **IMPORTANTE**: Você precisa copiar as tabelas gigantes de 'WiscIVData' do seu
// arquivo 'baremos.js' original e colá-las dentro da propriedade 'data' acima.