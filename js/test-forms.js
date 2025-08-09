// js/test-forms.js

FSLaudosApp.testForms = {
    'BPA2': {
        nomeExibicao: 'BPA-2',
        type: 'table', 
        instrumentos: [
            { id: 'ac', label: 'Atenção Concentrada - AC' },
            { id: 'ad', label: 'Atenção Dividida - AD' },
            { id: 'aa', label: 'Atenção Alternada - AA' },
            { id: 'ag', label: 'Atenção Geral - AG' }
        ],
        resultadosHtml: `
            <div class="main-card" style="padding: 0;">
                <div class="results-header">
                    <div class="results-toggle">
                        <button class="btn btn-toggle active" id="toggle-tabela">Tabela</button>
                        <button class="btn btn-toggle" id="toggle-grafico">Gráfico</button>
                    </div>
                </div>
                <div id="results-content-area">
                    <!-- O conteúdo do gráfico ou da tabela será inserido aqui pelo JavaScript -->
                </div>
            </div>`,
        detalhesHtml: `<div class="main-card"><p>Área para exibir detalhes técnicos ou observações sobre a aplicação do BPA-2.</p></div>`
    },
    'WiscIV': {
        nomeExibicao: 'Wisc IV',
        type: 'wisc',
        compositeScales: [
            { id: 'compreensaoVerbal', label: 'Compreensão Verbal' },
            { id: 'organizacaoPerceptual', label: 'Organização Perceptual' },
            { id: 'memoriaOperacional', label: 'Memória Operacional' },
            { id: 'velocidadeProcessamento', label: 'Velocidade de Processamento' },
            { id: 'qiTotal', label: 'QI Total' }
        ],
        subtests: [
            { id: 'cubos', label: 'Cubos (CB)' },
            { id: 'semelhancas', label: 'Semelhanças (SM)' },
            { id: 'digitos', label: 'Dígitos (DG)' },
            { id: 'conceitosFigurativos', label: 'Conceitos Figurativos (CN)' },
            { id: 'codigo', label: 'Código (CD)' },
            { id: 'vocabulario', label: 'Vocabulário (VC)' },
            { id: 'sequenciaNumerosLetras', label: 'Seq. Núm. & Letras (SNL)' },
            { id: 'raciocinioMatricial', label: 'Raciocínio Matricial (RM)' },
            { id: 'compreensao', label: 'Compreensão (CO)' },
            { id: 'procurarSimbolos', label: 'Procurar Símbolos (PS)' },
            { id: 'completarFiguras', label: '(Completar Figuras) (CF)' },
            { id: 'cancelamento', label: '(Cancelamento) (CA)' },
            { id: 'informacao', label: '(Informação) (IN)' },
            { id: 'aritmetica', label: '(Aritmética) (AR)' },
            { id: 'raciocinioPalavras', label: '(Raciocínio Palavras) (RP)' }
        ],
        resultadosHtml: `
            <div class="main-card" style="padding: 0; border-radius: 8px;">
                <div class="results-header" style="justify-content: space-between; padding: 15px 25px; border-bottom: 1px solid #e9ecef;">
                    <div class="results-toggle">
                        <button class="btn btn-toggle active" id="wisc-toggle-tabela">Tabela</button>
                        <button class="btn btn-toggle" id="wisc-toggle-grafico">Gráfico</button>
                    </div>
                    <div class="results-actions" style="display: flex; gap: 10px;">
                         <button class="btn btn-secondary" id="wisc-download-word" disabled>
                            <img src="https://img.icons8.com/material-outlined/20/000000/word.png" alt="Word" style="margin-right: 5px; opacity: 0.6;"/> Word
                         </button>
                         <button class="btn btn-secondary" id="wisc-download-figure" disabled>
                            <img src="https://img.icons8.com/ios/20/000000/image.png" alt="Figura" style="margin-right: 5px; opacity: 0.6;"/> Figura
                         </button>
                    </div>
                </div>
                <div id="wisc-results-content-area" style="padding: 25px;">
                    <!-- O conteúdo da tabela ou do gráfico será inserido aqui -->
                </div>
            </div>`,
        detalhesHtml: `<div class="main-card"><p>Área para exibir detalhes técnicos ou observações sobre a aplicação do Wisc IV.</p></div>`
    },
    'SRS2EscolarMasc': {
        nomeExibicao: 'SRS-2 (Idade Escolar - M)',
        type: 'srs2',
        subscales: [
            { id: 'percepcaoSocial', label: 'Percepção Social' },
            { id: 'cognicaoSocial', label: 'Cognição Social' },
            { id: 'comunicacaoSocial', label: 'Comunicação Social' },
            { id: 'motivacaoSocial', label: 'Motivação Social' },
            { id: 'padroesRepetitivos', label: 'Padrões Restritos e Repetitivos' },
            { id: 'comunicacaoInteracao', label: 'Comunicação e Interação' },
            { id: 'total', label: 'Total' }
        ],
        resultadosHtml: `
            <div class="main-card" style="padding: 0;">
                <div class="results-header">
                    <div class="results-toggle">
                        <button class="btn btn-toggle active" id="srs2-toggle-tabela">Tabela</button>
                        <button class="btn btn-toggle" id="srs2-toggle-grafico">Gráfico</button>
                    </div>
                </div>
                <div id="srs2-results-content-area" style="padding: 20px;">
                    <!-- O conteúdo de resultados do SRS-2 será inserido aqui -->
                </div>
            </div>`,
        detalhesHtml: `<div class="main-card"><p>Área para exibir detalhes técnicos ou observações sobre a aplicação do SRS-2 (Idade Escolar - Masculino).</p></div>`
    },
    'SRS2EscolarFem': {
        nomeExibicao: 'SRS-2 (Idade Escolar - F)',
        type: 'srs2',
        subscales: [
            { id: 'percepcaoSocial', label: 'Percepção Social' },
            { id: 'cognicaoSocial', label: 'Cognição Social' },
            { id: 'comunicacaoSocial', label: 'Comunicação Social' },
            { id: 'motivacaoSocial', label: 'Motivação Social' },
            { id: 'padroesRepetitivos', label: 'Padrões Restritos e Repetitivos' },
            { id: 'comunicacaoInteracao', label: 'Comunicação e Interação' },
            { id: 'total', label: 'Total' }
        ],
        resultadosHtml: `
            <div class="main-card" style="padding: 0;">
                <div class="results-header">
                    <div class="results-toggle">
                        <button class="btn btn-toggle active" id="srs2-toggle-tabela">Tabela</button>
                        <button class="btn btn-toggle" id="srs2-toggle-grafico">Gráfico</button>
                    </div>
                </div>
                <div id="srs2-results-content-area" style="padding: 20px;">
                    <!-- O conteúdo de resultados do SRS-2 será inserido aqui -->
                </div>
            </div>`,
        detalhesHtml: `<div class="main-card"><p>Área para exibir detalhes técnicos ou observações sobre a aplicação do SRS-2 (Idade Escolar - Feminino).</p></div>`
    },
    'TDEII': {
        nomeExibicao: 'TDE II', type: 'simple', campos: [ { id: 'leitura', label: 'Leitura', tipo: 'number' }, { id: 'escrita', label: 'Escrita', tipo: 'number' }, { id: 'aritmetica', label: 'Aritmética', tipo: 'number' } ],
        resultadosHtml: `<div class="main-card"><p>Resultados para TDE II.</p></div>`,
        detalhesHtml: `<div class="main-card"><p>Detalhes para TDE II.</p></div>`
    },
    'BFP': {
        nomeExibicao: 'BFP', type: 'simple', campos: [ { id: 'extroversao', label: 'Extroversão', tipo: 'number' }, { id: 'socializacao', label: 'Socialização', tipo: 'number' }, { id: 'realizacao', label: 'Realização', tipo: 'number' }, { id: 'neuroticismo', label: 'Neuroticismo', tipo: 'number' }, { id: 'abertura', label: 'Abertura', tipo: 'number' } ],
        resultadosHtml: `<div class="main-card"><p>Resultados para BFP.</p></div>`,
        detalhesHtml: `<div class="main-card"><p>Detalhes para BFP.</p></div>`
    },
    'BPA': { nomeExibicao: 'BPA', type: 'simple', campos: [] },
    'Columbia3': { nomeExibicao: 'Colúmbia 3', type: 'simple', campos: [] },
    'ETDAHAD': { 
        nomeExibicao: 'ETDAH-AD', 
        type: 'etdah-ad',
        fatores: [
            { id: 'D', label: 'Desatenção (D)' },
            { id: 'I', label: 'Impulsividade (I)' },
            { id: 'AE', label: 'Aspectos Emocionais (AE)' },
            { id: 'AAMA', label: 'Autorregulação da Atenção, da Motivação e da Ação (AAMA)' },
            { id: 'H', label: 'Hiperatividade (H)' }
        ],
        niveisEscolaridade: ['Amostra Geral', 'Ensino Fundamental', 'Ensino Médio', 'Ensino Superior'],
        resultadosHtml: `<div class="main-card" style="padding: 0; border: none; box-shadow: none;"><div class="results-header" style="background: white; border-radius: 8px 8px 0 0; border: 1px solid #e9ecef;"><div class="results-toggle"><button class="btn btn-toggle active" id="etdah-toggle-tabela">Tabela</button><button class="btn btn-toggle" id="etdah-toggle-grafico">Gráfico</button></div></div><div id="etdah-results-content-area" style="background: white; padding: 25px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef; border-top: none;"></div></div>`,
        detalhesHtml: `<div class="main-card"><p>Área para exibir detalhes técnicos ou observações sobre a aplicação do ETDAH-AD.</p></div>`
    },
    'ETDAHCRIAD': { nomeExibicao: 'ETDAH-CRIAD', type: 'simple', campos: [] },
    'ETDAHPAIS': { nomeExibicao: 'ETDAH-PAIS', type: 'simple', campos: [] },
    'FDT': { nomeExibicao: 'FDT', type: 'simple', campos: [] },
    'FiguraReyA': { nomeExibicao: 'Figura Rey A', type: 'simple', campos: [] },
    'FiguraReyB': { nomeExibicao: 'Figura Rey B', type: 'simple', campos: [] },
    'Neupsilin': { nomeExibicao: 'Neupsilin', type: 'simple', campos: [] },
    'NeupsilinInf': { nomeExibicao: 'Neupsilin-Inf', type: 'simple', campos: [] },
    'QUATI': { nomeExibicao: 'QUATI', type: 'simple', campos: [] },
    'RAVLT': { 
        nomeExibicao: 'RAVLT', 
        type: 'ravlt',
        resultadosHtml: `<div class="main-card" style="padding: 0;"><div class="results-header"><div class="results-toggle"><button class="btn btn-toggle active" id="ravlt-toggle-tabela">Tabela</button><button class="btn btn-toggle" id="ravlt-toggle-grafico">Gráfico</button></div></div><div id="ravlt-results-content-area" style="padding: 20px;"></div></div>`,
        detalhesHtml: `<div class="main-card"><p>Área para exibir detalhes técnicos ou observações sobre a aplicação do RAVLT.</p></div>`
    },
    'SONR': { nomeExibicao: 'SON-R 2½-7 [a]', type: 'simple', campos: [] },
    'SRS2AdultoAuto': { nomeExibicao: 'SRS 2 (Adulto Autorelato)', type: 'simple', campos: [] },
    'SRS2AdultoHetero': { nomeExibicao: 'SRS 2 (Adulto Heterorrelato)', type: 'simple', campos: [] },
    'SRS2PreEscolar': { nomeExibicao: 'SRS 2 (Pré-Escolar)', type: 'simple', campos: [] },
    'WaisIII': { nomeExibicao: 'Wais III', type: 'simple', campos: [] },
    'WASI': { nomeExibicao: 'WASI', type: 'simple', campos: [] }
};

FSLaudosApp.gerarHtmlDoFormulario = function(chaveTeste) {
    const formConfig = this.testForms[chaveTeste];
    if (!formConfig) {
        return `<div class="main-card"><p>O formulário de correção para o teste <strong>${chaveTeste}</strong> ainda não foi implementado.</p></div>`;
    }

    let formContentHtml;

    if (formConfig.type === 'table') {
        let tableRowsHtml = formConfig.instrumentos.map(instrumento => {
            const isDisabled = instrumento.id === 'ag';
            return `
                <tr>
                    <td>${instrumento.label}</td>
                    <td><input type="number" id="${chaveTeste}-${instrumento.id}" data-field="${instrumento.id}" class="test-input" ${isDisabled ? 'disabled style="background-color: #e9ecef;"' : ''}></td>
                    <td id="percentil-${chaveTeste}-${instrumento.id}">-</td>
                    <td id="classificacao-${chaveTeste}-${instrumento.id}">-</td>
                </tr>
            `;
        }).join('');

        formContentHtml = `
            <div class="main-card" style="border-radius: 8px 8px 0 0; padding: 0;">
                <table class="data-table correction-table">
                    <thead><tr><th>Instrumento Utilizado</th><th>Pontos</th><th>Percentil</th><th>Classificação</th></tr></thead>
                    <tbody>${tableRowsHtml}</tbody>
                </table>
            </div>
            <div class="footer-actions main-card" style="border-radius: 0 0 8px 8px; margin-top: 0; border-top: 1px solid #f0f0f0;">
                <button id="salvar-parcial-${chaveTeste}" class="btn btn-primary">Salvar</button>
            </div>`;
    
    } else if (formConfig.type === 'srs2') {
        const questionsGrid = Array.from({ length: 65 }, (_, i) => {
            const num = i + 1;
            return `
                <div class="srs2-item">
                    <label for="srs2-q${num}-valor">${num}</label>
                    <input type="number" id="srs2-q${num}-valor" class="srs2-item-valor test-input" data-field="q${num}_valor" min="1" max="4">
                    <input type="text" id="srs2-q${num}-pontos" class="srs2-item-pontos" data-field="q${num}_pontos" disabled>
                </div>`;
        }).join('');

        const summaryTableRows = formConfig.subscales.map(sub => `
            <tr class="${sub.id === 'total' ? 'total-row' : ''}">
                <td>${sub.label}</td>
                <td id="srs2-raw-${sub.id}">-</td>
                <td id="srs2-tscore-${sub.id}">-</td>
                <td id="srs2-class-${sub.id}">-</td>
            </tr>
        `).join('');

        formContentHtml = `
            <div class="main-card" style="padding: 20px 25px;">
                <div class="srs2-container">
                    <div class="srs2-questions-grid">${questionsGrid}</div>
                    <div class="srs2-summary-panel">
                        <h3>Resultados</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Subescala</th>
                                    <th>Pontos Brutos</th>
                                    <th>T. Score</th>
                                    <th>Classificação</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${summaryTableRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="footer-actions main-card" style="border-radius: 0 0 8px 8px; margin-top: 0; border-top: 1px solid #f0f0f0;">
                <button id="salvar-parcial-${chaveTeste}" class="btn btn-primary">Salvar</button>
            </div>
        `;

    } else if (formConfig.type === 'wisc') { 
        const compositeTableRows = formConfig.compositeScales.map(scale => `
            <tr>
                <td>${scale.label}</td>
                <td id="wisc-sum-${scale.id}" style="font-weight: 500;"></td>
                <td id="wisc-comp-${scale.id}" style="font-weight: 500;"></td>
                <td id="wisc-perc-${scale.id}"></td>
                <td id="wisc-ci90-${scale.id}"></td>
                <td id="wisc-ci95-${scale.id}"></td>
                <td id="wisc-class-${scale.id}" style="font-weight: 500;"></td>
            </tr>
        `).join('');

        const compositeTable = `
            <div class="main-card" style="padding: 0; margin-bottom: 24px;">
                 <h3 style="padding: 15px 20px 15px; margin: 0; font-size: 16px; color: #495057;">Conversão da Soma dos Pontos Ponderados em Pontos Composto</h3>
                <table class="data-table wisc-table" style="text-align: center;">
                    <thead>
                        <tr>
                            <th style="text-align: left;">Escala</th>
                            <th>Soma dos Pontos Ponderados</th>
                            <th>Ponto Composto</th>
                            <th>Rank Percentil</th>
                            <th colspan="2">Intervalo de Confiança</th>
                            <th>Classificação</th>
                        </tr>
                        <tr>
                           <th></th><th></th><th></th><th></th><th>90%</th><th>95%</th><th></th>
                        </tr>
                    </thead>
                    <tbody>${compositeTableRows}</tbody>
                </table>
            </div>
        `;

        const subtestsTableRows = formConfig.subtests.map(sub => `
            <tr>
                <td style="text-align: left;">${sub.label}</td>
                <td><input type="number" id="wisc-raw-${sub.id}" data-test="${chaveTeste}" data-field="${sub.id}" class="test-input wisc-raw-score" style="max-width: 100px; text-align: center;"></td>
                <td id="wisc-pond-${sub.id}" style="font-weight: 500;"></td>
                <td id="wisc-subclass-${sub.id}" style="font-weight: 500;"></td>
            </tr>
        `).join('');

        const subtestsTable = `
             <div class="main-card" style="padding: 0;">
                <h3 style="padding: 15px 20px 15px; margin: 0; font-size: 16px; color: #495057;">Conversão Pontos Brutos em Ponderados</h3>
                <table class="data-table wisc-table" style="text-align: center;">
                    <thead><tr><th style="text-align: left;">Sub-Teste</th><th>Pontos Brutos</th><th>Pontos Ponderados</th><th>Classificação</th></tr></thead>
                    <tbody>${subtestsTableRows}</tbody>
                </table>
            </div>
        `;

        formContentHtml = `
            ${compositeTable}
            ${subtestsTable}
            <div class="footer-actions">
                <button id="salvar-parcial-${chaveTeste}" class="btn btn-primary">Salvar Pontos Brutos</button>
            </div>
        `;

    } else if (formConfig.type === 'ravlt') {
        // ... (código existente para RAVLT)
    } else if (formConfig.type === 'etdah-ad') {
        // ... (código existente para ETDAH-AD)
    } else if (formConfig.type === 'simple' && formConfig.campos?.length) { 
        let fieldsHtml = formConfig.campos.map(campo => `
            <div class="form-group">
                <label for="${chaveTeste}-${campo.id}">${campo.label}</label>
                <input type="${campo.tipo || 'text'}" id="${chaveTeste}-${campo.id}" data-test="${chaveTeste}" data-field="${campo.id}" class="test-input">
            </div>
        `).join('');
        formContentHtml = `<div class="main-card"><div class="form-grid">${fieldsHtml}</div><div class="footer-actions"><button id="salvar-parcial-${chaveTeste}" class="btn btn-primary">Salvar</button></div></div>`;
    } else {
         return `<div class="main-card"><p>O formulário de correção para o teste <strong>${formConfig ? formConfig.nomeExibicao : chaveTeste}</strong> ainda não foi implementado.</p></div>`;
    }

    return formContentHtml;
};