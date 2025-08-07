// js/test-data/wisc-iv-data.js

FSLaudosApp.testData = FSLaudosApp.testData || {};

/**
 * Helper function to convert score ranges (e.g., "10-12") into a direct lookup object.
 * @param {object} ranges - An object with range strings as keys and scores as values.
 * @returns {object} A lookup object where each individual score is a key.
 */
const _generateLookup = (ranges) => {
    const lookup = {};
    for (const key in ranges) {
        const score = ranges[key];
        if (key.includes('-')) {
            const [start, end] = key.split('-').map(Number);
            for (let i = start; i <= end; i++) {
                lookup[i] = score;
            }
        } else {
            lookup[Number(key)] = score;
        }
    }
    return lookup;
};

FSLaudosApp.testData.WiscIV = {
    data: {
        /**
         * Tabelas de conversão de Pontos Brutos para Pontos Ponderados.
         * Cada chave de primeiro nível representa uma faixa etária (ex: "6_8-6_11").
         */
        weightedScoreTables: {
            // [NOVO] Dados da Tabela A.1.3 (Idades 6:8-6:11)
            "6_8-6_11": {
                cubos: _generateLookup({ "1-2": 5, "3-4": 6, "5-6": 7, "7-9": 8, "10-12": 9, "13-15": 10, "16-18": 11, "19-21": 12, "22-25": 13, "26-28": 14, "29-31": 15, "32-35": 16, "36-39": 17, "40-43": 18, "44-68": 19 }),
                semelhancas: _generateLookup({ "0": 4, "1": 5, "2": 6, "3-4": 8, "5-6": 9, "7": 10, "8-10": 11, "11-13": 12, "14-15": 13, "16-18": 14, "19-20": 15, "21-23": 16, "24-26": 17, "27-29": 18, "30-44": 19 }),
                digitos: _generateLookup({ "0-2": 1, "3": 2, "4": 4, "5": 6, "6": 7, "7-8": 8, "9": 9, "10": 10, "11": 11, "12-13": 12, "14": 13, "15": 14, "16": 15, "17": 16, "18-19": 17, "20-21": 18, "22-32": 19 }),
                conceitosFigurativos: _generateLookup({ "0-3": 1, "4": 2, "5": 3, "6": 4, "7-10": 5, "11-14": 6, "15-18": 7, "19-23": 8, "24-27": 9, "28-35": 10, "36-39": 11, "40-43": 12, "44-47": 13, "48-52": 14, "53-56": 15, "57-59": 16, "60-62": 17, "63-64": 18, "65": 19 }),
                codigo: _generateLookup({ "0-3": 1, "4-6": 2, "7-10": 3, "11-14": 4, "15-18": 5, "19-23": 6, "24-27": 7, "28-31": 8, "32-35": 9, "36-39": 10, "40-43": 11, "44-47": 12, "48-52": 13, "53-56": 14, "57-59": 15, "60-62": 16, "63-64": 17, "65": 18, "66-119": 19 }),
                vocabulario: _generateLookup({ "0-4": 1, "5": 2, "6": 3, "7-8": 4, "9": 5, "10-11": 6, "12-13": 7, "14-15": 8, "16-17": 9, "18-19": 10, "20-21": 11, "22-24": 12, "25-26": 13, "27-29": 14, "30-31": 15, "32-34": 16, "35-36": 17, "37-39": 18, "40-68": 19 }),
                sequenciaNumerosLetras: _generateLookup({ "1": 5, "2-3": 6, "4-5": 7, "6-7": 8, "8-9": 9, "10": 10, "11": 12, "12-13": 13, "14": 14, "15-16": 15, "17": 16, "18": 17, "19-20": 18, "21-30": 19 }),
                raciocinioMatricial: _generateLookup({ "0": 1, "1": 2, "2": 3, "3": 4, "4": 5, "5": 6, "6": 7, "7": 8, "8": 9, "9-10": 10, "11-12": 11, "13-14": 12, "15-16": 13, "17": 14, "18-20": 15, "21-22": 16, "23-24": 17, "25-27": 18, "28-35": 19 }),
                compreensao: _generateLookup({ "0": 1, "1": 2, "2": 3, "3-4": 5, "5": 6, "6": 7, "7-8": 9, "9-10": 10, "11-12": 11, "12-13": 12, "14": 13, "15-16": 14, "17-18": 15, "19-20": 16, "21-22": 17, "23": 18, "24-42": 19 }),
                procurarSimbolos: _generateLookup({ "1": 3, "2-3": 4, "4-5": 5, "6-7": 6, "8": 7, "9-10": 8, "11-13": 9, "14-15": 10, "16-17": 11, "18-20": 12, "21-22": 13, "23-25": 14, "26-27": 15, "28-30": 16, "31-32": 17, "33-35": 18, "36-45": 19 }),
                completarFiguras: _generateLookup({ "1": 2, "2": 3, "3": 4, "4-5": 5, "6-8": 6, "9-10": 7, "11-12": 8, "13-15": 9, "16-17": 10, "18-19": 11, "20-21": 12, "22-23": 13, "24-25": 14, "26-27": 15, "28-30": 16, "31-32": 17, "33-34": 18, "35-38": 19 }),
                cancelamento: _generateLookup({ "0-7": 1, "8-10": 2, "11-14": 3, "15-18": 4, "19-23": 5, "24-27": 6, "28-32": 7, "33-37": 8, "38-43": 9, "44-49": 10, "50-54": 11, "55-60": 12, "61-67": 13, "68-73": 14, "74-79": 15, "80-86": 16, "87-92": 17, "93-99": 18, "100-136": 19 }),
                informacao: _generateLookup({ "0-2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7-8": 7, "9": 8, "10": 9, "11": 10, "12": 11, "13": 12, "14": 13, "15": 14, "16": 15, "17-18": 16, "19": 17, "20-21": 18, "22-33": 19 }),
                aritmetica: _generateLookup({ "0-1": 2, "2": 3, "3-4": 5, "5": 6, "6": 7, "7-8": 8, "9": 10, "10": 11, "11": 12, "12": 13, "13": 15, "14": 16, "15": 17, "16": 18, "17-34": 19 }),
                raciocinioPalavras: _generateLookup({ "0": 2, "1": 3, "2": 5, "3": 6, "4": 7, "5": 9, "6": 10, "7": 11, "8": 12, "9": 13, "10": 14, "11": 15, "12": 16, "13": 17, "14": 18, "15-24": 19 })
            },
            // [NOVO] Dados da Tabela A.1.4 (Idades 7:0-7:3)
            "7_0-7_3": {
                cubos: _generateLookup({ "1": 4, "2": 5, "3-5": 6, "6-7": 7, "8-10": 8, "11-13": 9, "14-16": 10, "17-19": 11, "20-23": 12, "24-26": 13, "27-29": 14, "30-33": 15, "34-36": 16, "37-40": 17, "41-44": 18, "45-68": 19 }),
                semelhancas: _generateLookup({ "0": 3, "1": 4, "2": 5, "3-4": 7, "5-6": 8, "7-8": 9, "9-11": 10, "12-13": 11, "14-16": 12, "17-19": 13, "20-21": 14, "22-24": 15, "25-27": 16, "28-30": 17, "31-32": 18, "33-44": 19 }),
                digitos: _generateLookup({ "0-2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "10": 9, "11": 10, "12-13": 11, "14": 12, "15-16": 13, "17-19": 14, "20-21": 15, "22": 16, "23-24": 17, "25-27": 18, "28-32": 19 }),
                conceitosFigurativos: _generateLookup({ "0-2": 1, "3": 2, "4": 3, "5-6": 4, "7-8": 5, "9-12": 6, "13-14": 7, "15-16": 8, "17-20": 9, "21-23": 10, "24-25": 11, "26-27": 12, "28-30": 13, "31-32": 14, "33-35": 15, "36-37": 16, "38-40": 17, "41-68": 18, "41-68": 19 }), // Nota: A tabela repete 41-68 para 18 e 19, mantido conforme imagem.
                codigo: _generateLookup({ "0-4": 1, "5-8": 2, "9-11": 3, "12-15": 4, "16-19": 5, "20-24": 6, "25-28": 7, "29-32": 8, "33-36": 9, "37-41": 10, "42-45": 11, "46-49": 12, "50-54": 13, "55-58": 14, "59-61": 15, "62-63": 16, "64-65": 17, "66-68": 18, "69-119": 19 }),
                vocabulario: _generateLookup({ "0-4": 1, "5": 2, "6-7": 3, "8-9": 4, "10": 5, "11-12": 6, "13-14": 7, "15-16": 8, "17-18": 9, "19-20": 10, "21-23": 11, "24-25": 12, "26-27": 13, "28-30": 14, "31-32": 15, "33-35": 16, "36-37": 17, "38-40": 18, "41-68": 19 }),
                sequenciaNumerosLetras: _generateLookup({ "0": 2, "1": 3, "2-3": 5, "4": 6, "5-6": 7, "7-9": 8, "10": 9, "11-12": 10, "13-14": 11, "15": 12, "16-17": 13, "18-19": 14, "20-21": 15, "22": 16, "23-24": 17, "25": 18, "26-30": 19 }),
                raciocinioMatricial: _generateLookup({ "0-1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8-9": 8, "10": 9, "11-12": 10, "13-14": 11, "15-16": 12, "17-18": 13, "19-20": 14, "21-22": 15, "23-24": 16, "25-26": 17, "27-28": 18, "29-35": 19 }),
                compreensao: _generateLookup({ "0": 1, "1-2": 3, "3": 4, "4": 5, "5-6": 6, "7": 7, "8-9": 8, "9": 9, "10-11": 10, "12-13": 11, "14-15": 12, "16-17": 13, "18-19": 14, "20-21": 15, "22": 16, "23-25": 17, "26-27": 18, "28-42": 19 }),
                procurarSimbolos: _generateLookup({ "1": 2, "2": 3, "3-4": 4, "5-7": 5, "8-9": 6, "10-12": 7, "13-14": 8, "15-17": 9, "18-19": 10, "20-22": 11, "23-24": 12, "25-27": 13, "28-30": 14, "31-32": 15, "33-34": 16, "35-37": 17, "38-40": 18, "41-45": 19 }),
                completarFiguras: _generateLookup({ "0": 1, "1": 2, "2": 3, "3-4": 4, "5-6": 5, "7-8": 6, "9-10": 7, "11-12": 8, "13-14": 9, "15-16": 10, "17-18": 11, "19-20": 12, "21-22": 13, "23-25": 14, "26": 15, "27-28": 16, "29-31": 17, "32": 18, "33-38": 19 }),
                cancelamento: _generateLookup({ "0-9": 1, "10-13": 2, "14-16": 3, "17-21": 4, "22-25": 5, "26-30": 6, "31-35": 7, "36-40": 8, "41-46": 9, "47-51": 10, "52-57": 11, "58-63": 12, "64-69": 13, "70-76": 14, "77-82": 15, "83-89": 16, "90-95": 17, "96-102": 18, "103-136": 19 }),
                informacao: _generateLookup({ "0-2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "10-11": 9, "12": 10, "13": 11, "14": 12, "15-16": 13, "17": 14, "18-19": 15, "20-21": 16, "22": 17, "23": 18, "24-34": 19 }),
                aritmetica: _generateLookup({ "2-3": 1, "4": 2, "5": 3, "6-7": 4, "8": 5, "9": 6, "10-11": 7, "12": 8, "13": 9, "14": 10, "15-16": 11, "17": 12, "18-19": 13, "20-21": 14, "22": 15, "23": 16, "24-26": 17, "27-42": 18, "27-42": 19 }), // Nota: A tabela repete 27-42 para 18 e 19, mantido conforme imagem.
                raciocinioPalavras: _generateLookup({ "0": 1, "1": 2, "2": 3, "3": 4, "4": 5, "5": 6, "7": 7, "8": 8, "9": 9, "10": 10, "11-12": 11, "13": 12, "14": 13, "15": 14, "16-24": 15, "16-24": 16, "16-24": 17, "16-24": 18, "16-24": 19 }) // Nota: A tabela repete 16-24 para 15-19, mantido conforme imagem.
            }
            // ... Adicione outras tabelas de faixas etárias aqui quando as tiver ...
        },
        // As tabelas de scores compostos permanecem as mesmas
        compositeScoreTables: {
            // ... Mantenha suas tabelas de scores compostos aqui ...
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
     * [ATUALIZADO] Retorna a chave do grupo de idade para o barema do WISC-IV.
     */
    _getAgeGroupKey: function(age) {
        if (!age || typeof age.years !== 'number' || typeof age.months !== 'number') return null;

        // Idade 6 anos, 8 meses, 0 dias a 6 anos, 11 meses, 30 dias
        if (age.years === 6 && age.months >= 8) {
            return "6_8-6_11";
        }

        // Idade 7 anos, 0 meses, 0 dias a 7 anos, 3 meses, 30 dias
        if (age.years === 7 && age.months <= 3) {
            return "7_0-7_3";
        }

        // Adicione outras faixas etárias aqui, em ordem decrescente de idade
        // Ex: if (age.years === 7 && age.months >= 4 && age.months <= 7) return "7_4-7_7";

        return null; // Retorna nulo se nenhuma faixa etária corresponder
    },

    /**
     * Converte o ponto bruto de um subteste em ponto ponderado.
     */
    getWeightedScore: function(subtestId, rawScore, age) {
        const ageKey = this._getAgeGroupKey(age);
        const score = parseInt(rawScore, 10);

        if (!ageKey || isNaN(score) || !this.data.weightedScoreTables[ageKey]?.[subtestId]) {
            return { weighted: '', classification: '' };
        }
        
        const table = this.data.weightedScoreTables[ageKey][subtestId];
        const weighted = table[score] || '';
        
        let classification = '';
        if (weighted >= 14) classification = 'Ponto Forte';
        else if (weighted <= 6) classification = 'Ponto Fraco';

        return { weighted, classification };
    },
    
    /**
     * Converte a soma dos pontos ponderados em score composto.
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