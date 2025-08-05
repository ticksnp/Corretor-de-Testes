// js/app.js

// [CORREÇÃO DEFINITIVA] Trocamos 'DOMContentLoaded' por 'load'.
// O evento 'load' só é disparado depois que TODOS os recursos da página,
// incluindo os scripts da CDN (PizZip, docxtemplater), foram completamente carregados.
// Isso resolve a condição de corrida de uma vez por todas.
window.addEventListener('load', () => {
    try {
        const appContent = document.getElementById('app-content');
        const { views, pageLogic } = FSLaudosApp;

        if (!appContent || !views || !pageLogic) {
            console.error("ERRO CRÍTICO: Componentes essenciais da aplicação (app-content, views, pageLogic) não foram encontrados.");
            document.body.innerHTML = "<h1>Erro Crítico na Aplicação. Verifique o console (F12).</h1>";
            return;
        }

        const router = () => {
            try {
                document.querySelectorAll('#nav-menu .nav-link').forEach(l => l.classList.remove('active'));

                const hash = window.location.hash.slice(1) || 'laudos';
                let [page, param] = hash.split('/'); 

                // --- LÓGICA DE ROTEAMENTO CORRIGIDA ---
                if (page === 'laudo' && param) {
                    page = 'preenchimento-laudo';
                }
                
                // [CORREÇÃO] Adicionada a regra para a rota de detalhes do paciente.
                // Agora, a URL #paciente/ID_DO_PACIENTE será direcionada para a view 'detalhes-paciente'.
                if (page === 'paciente' && param) {
                    page = 'detalhes-paciente';
                }
                // --- FIM DA CORREÇÃO ---

                console.log(`Roteando para a página: '${page}' com o parâmetro: '${param}'`);

                const activeLink = document.querySelector(`#nav-menu a[data-page="${page}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    const parentSubmenu = activeLink.closest('.submenu');
                    if(parentSubmenu){
                        parentSubmenu.style.display = 'block';
                    }
                } else if (page === 'preenchimento-laudo') {
                    document.querySelector(`#nav-menu a[data-page="laudos"]`)?.classList.add('active');
                } else if (page === 'detalhes-paciente') {
                    // Mantém o menu "Pacientes" ativo ao ver detalhes de um
                    document.querySelector(`#nav-menu a[data-page="pacientes"]`)?.classList.add('active');
                }


                const viewHtml = views[page] || views.laudos;
                appContent.innerHTML = viewHtml;

                const logicFunction = pageLogic[page] || pageLogic.laudos;
                if (typeof logicFunction === 'function') {
                    logicFunction(param);
                } else {
                    console.warn(`Nenhuma função de lógica encontrada para a página: ${page}`);
                }
            } catch (routeError) {
                console.error("Erro durante o roteamento da página:", routeError);
                appContent.innerHTML = `<h1>Ocorreu um erro ao carregar esta página.</h1>`;
            }
        };

        window.addEventListener('hashchange', router);
        router(); 

        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            navMenu.addEventListener('click', (e) => {
                const link = e.target.closest('.nav-link');
                if (link && link.classList.contains('config-parent-link')) {
                    e.preventDefault();
                    const submenu = link.nextElementSibling;
                    if (submenu && submenu.classList.contains('submenu')) {
                        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                    }
                }
            });
        }

    } catch (initError) {
        console.error("ERRO FATAL na inicialização do app.js:", initError);
        document.body.innerHTML = "<h1>Erro Fatal na Aplicação. Verifique o console (F12).</h1>";
    }
});