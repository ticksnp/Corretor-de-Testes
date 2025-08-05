// js/export.js

/**
 * [NOVO] Gera um gráfico do Chart.js e o converte para uma imagem Base64.
 * @param {object} bpaData - Dados contendo os scores obtidos e a média.
 * @returns {Promise<string|null>} - A string Base64 da imagem do gráfico ou null.
 */
async function generateChartAsBase64(bpaData) {
    if (!bpaData || !bpaData.average || !bpaData.obtained || bpaData.obtained.length === 0) {
        return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 650;
    canvas.height = 350;
    canvas.style.position = 'absolute';
    canvas.style.left = '-9999px';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let chart;

    try {
        // [CORREÇÃO] Garante que o plugin está registrado neste contexto
        if (window.ChartDataLabels) {
            Chart.register(window.ChartDataLabels);
        } else {
             console.warn('ChartDataLabels não encontrado. O gráfico será gerado sem rótulos de dados.');
        }

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['AC', 'AD', 'AA', 'AG'],
                datasets: [
                    { label: 'Obtido', data: bpaData.obtained, backgroundColor: '#4A80D5' },
                    { label: 'Média', data: bpaData.average, backgroundColor: '#8BC34A' }
                ]
            },
            options: {
                responsive: false,
                animation: { duration: 0 },
                scales: { y: { beginAtZero: true } },
                plugins: {
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        font: { weight: 'bold' },
                        color: '#444',
                        formatter: function(value) { return value > 0 ? value : null; }
                    }
                }
            }
        });

        await new Promise(resolve => setTimeout(resolve, 150));
        return chart.toBase64Image();

    } catch(e) {
        console.error("Erro ao gerar imagem do gráfico:", e);
        return null;
    } finally {
        if (chart) chart.destroy();
        document.body.removeChild(canvas);
    }
}


FSLaudosApp.handleExportClick = async (laudoRef) => {
    const exportButton = document.getElementById('export-laudo-btn');
    if (!exportButton) return;

    try {
        exportButton.disabled = true;
        exportButton.innerHTML = `<img src="https://img.icons8.com/ios-glyphs/20/000000/download.png" alt="Download" style="opacity: 0.7;"/> Gerando...`;

        const response = await fetch('template/laudo-base.docx');
        if (!response.ok) throw new Error("Template 'laudo-base.docx' não encontrado.");
        const content = await response.arrayBuffer();

        const configData = JSON.parse(localStorage.getItem('configuracoesLaudoGlobal')) || {};
        
        const laudoDoc = await laudoRef.get();
        if (!laudoDoc.exists) throw new Error("Dados do laudo não encontrados no Firestore.");
        const laudoData = laudoDoc.data();

        const templateData = await prepareTemplateData(laudoData, configData);

        const imageModule = new window.ImageModule({
            centered: false,
            getImage: (tagValue) => {
                if (tagValue === 'bpa2_chart') {
                    const bpaTest = templateData.testes.find(t => t.key === 'BPA2');
                    if (bpaTest && bpaTest.chartBase64) {
                        return bpaTest.chartBase64.split(',')[1];
                    }
                }
                if (tagValue === 'logo' && configData.logoBase64) {
                    return configData.logoBase64.split(',')[1];
                }
                return null;
            },
            getSize: (tagValue) => {
                if (tagValue === 'bpa2_chart') return [520, 280]; 
                return [120, 120]; 
            },
        });

        const zip = new PizZip(content);
        const doc = new window.docxtemplater(zip, {
            modules: [imageModule],
            paragraphLoop: true,
            linebreaks: true,
            nullGetter: () => "" 
        });

        doc.setData(templateData);
        doc.render();

        const out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        const pacienteNomeNormalizado = laudoData.pacienteNome.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        saveAs(out, `laudo_${pacienteNomeNormalizado}.docx`);

    } catch (error) {
        console.error("ERRO DETALHADO NA GERAÇÃO DO DOCX:", error);
        alert(`Ocorreu um erro ao gerar o laudo: ${error.message || 'Multi error'}`);
    } finally {
        exportButton.disabled = false;
        exportButton.innerHTML = `<img src="https://img.icons8.com/ios-glyphs/20/000000/download.png" alt="Download" style="opacity: 0.7;"/> Exportar Laudo`;
    }
};

async function prepareTemplateData(laudoData, configData) {
    const { testForms, baremos } = FSLaudosApp;
    
    const dataAplicacao = laudoData.dataAplicacao || '';
    const nomePaciente = laudoData.pacienteNome || '';
    const nascimentoPaciente = laudoData.pacienteNascimento || '';
    const idadeAnosMeses = FSLaudosApp.calculateAgeInYearsAndMonths(nascimentoPaciente, dataAplicacao);
    const idadeApenasAnos = FSLaudosApp.calculateAgeInYearsAtDate(nascimentoPaciente, dataAplicacao);
    
    const testesProcessados = await Promise.all((laudoData.testes || []).map(async (chaveTeste) => {
        const configTeste = testForms[chaveTeste];
        if (!configTeste) return null;

        const pontos = laudoData.resultados?.[chaveTeste]?.pontos || {};
        let isBPA2 = (chaveTeste === 'BPA2');
        let resultados = [];
        let hasData = false;
        let chartBase64 = null;

        if (isBPA2 && idadeApenasAnos !== null) {
            const ageGroupKey = baremos.getAgeGroupKeyBPA2(idadeApenasAnos);
            if (ageGroupKey && pontos.ac !== undefined && pontos.ad !== undefined && pontos.aa !== undefined) {
                 hasData = true;
                 const ac = parseInt(pontos.ac, 10) || 0;
                 const ad = parseInt(pontos.ad, 10) || 0;
                 const aa = parseInt(pontos.aa, 10) || 0;
                 const ag = ac + ad + aa;
                 
                 const bpaResultados = [
                     { id: 'ac', label: 'Atenção Concentrada (AC)', score: ac },
                     { id: 'ad', label: 'Atenção Dividida (AD)', score: ad },
                     { id: 'aa', label: 'Atenção Alternada (AA)', score: aa },
                     { id: 'ag', label: 'Atenção Geral (AG)', score: ag }
                 ];

                 resultados = bpaResultados.map(item => {
                     const classif = baremos.getBpa2Classification(ageGroupKey, item.id, item.score);
                     return {
                         instrumento: item.label,
                         pontos: item.score,
                         percentil: classif.percentile,
                         classificacao: classif.classification
                     };
                 });

                 const chartData = {
                    obtained: bpaResultados.map(item => item.score),
                    average: bpaResultados.map(item => baremos.getBpa2AverageScore(ageGroupKey, item.id))
                 };
                 chartBase64 = await generateChartAsBase64(chartData);
            }
        }
        
        return {
            key: chaveTeste, 
            nome: configTeste.nomeExibicao,
            resultados: resultados, 
            has_data: hasData,
            chartBase64: chartBase64, 
            has_chart: !!chartBase64, 
        };

    }));

    return {
        nome_profissional: configData.nomeProfissional || '',
        crp: configData.mostrarCrp && configData.crp ? `CRP: ${configData.crp}` : '',
        data_aplicacao: dataAplicacao,
        nome_paciente: nomePaciente,
        nascimento_paciente: nascimentoPaciente,
        idade_paciente: idadeAnosMeses,
        testes: testesProcessados.filter(t => t), // Filtra testes nulos
        email_rodape: configData.email || '',
        telefone_rodape: configData.telefone || ''
    };
}