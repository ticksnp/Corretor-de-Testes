// js/app.js

// [REESCRITO] O evento 'load' agora aciona o verificador de autenticação.
window.addEventListener('load', () => {
    // Espera o firebase-config.js carregar e inicializar o `auth`
    const checkAuthReady = setInterval(() => {
        if (FSLaudosApp.auth) {
            clearInterval(checkAuthReady);
            const auth = FSLaudosApp.auth;

            // O onAuthStateChanged é o "portão" da sua aplicação.
            auth.onAuthStateChanged(user => {
                const appContent = document.getElementById('app-content');
                if (!appContent) {
                    console.error("Elemento 'app-content' não encontrado.");
                    return;
                }

                if (user) {
                    // --- USUÁRIO LOGADO ---
                    // Se o usuário está logado, inicializa a aplicação principal.
                    initializeApp();
                } else {
                    // --- USUÁRIO DESLOGADO ---
                    // Se não há usuário, redireciona para a página de login.
                    console.log('Nenhum usuário logado. Redirecionando para a página de login...');
                    // Garante que não estamos já na página de login para evitar loops
                    if (!window.location.pathname.includes('login.html')) {
                        window.location.href = '/login.html';
                    }
                }
            });
        }
    }, 100);
});

// [NOVO] Função que contém toda a lógica da aplicação principal.
// Só será chamada se o usuário estiver autenticado.
function initializeApp() {
    try {
        const appContent = document.getElementById('app-content');
        const { views, pageLogic } = FSLaudosApp;

        if (!appContent || !views || !pageLogic) {
            console.error("ERRO CRÍTICO: Componentes essenciais da aplicação (app-content, views, pageLogic) não foram encontrados.");
            document.body.innerHTML = "<h1>Erro Crítico na Aplicação. Verifique o console (F12).</h1>";
            return;
        }

        const router = () => {
            // (O conteúdo original da função router permanece o mesmo)
            try {
                document.querySelectorAll('.sidebar .nav-link, .sidebar .submenu a').forEach(l => l.classList.remove('active'));

                const hash = window.location.hash.slice(1) || 'laudos';
                let [page, param] = hash.split('/');

                if (page === 'laudo' && param) {
                    page = 'preenchimento-laudo';
                }
                
                if (page === 'paciente' && param) {
                    page = 'detalhes-paciente';
                }

                console.log(`Roteando para a página: '${page}' com o parâmetro: '${param}'`);

                // Lógica de ativação do link no menu
                let activeLink = document.querySelector(`.sidebar a[data-page="${page}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    const parentSubmenu = activeLink.closest('.submenu');
                    if(parentSubmenu){
                        parentSubmenu.style.display = 'block';
                        parentSubmenu.previousElementSibling.classList.add('active');
                    }
                } else if (page === 'preenchimento-laudo') {
                    document.querySelector(`.sidebar a[data-page="laudos"]`)?.classList.add('active');
                } else if (page === 'detalhes-paciente') {
                    document.querySelector(`.sidebar a[data-page="pacientes"]`)?.classList.add('active');
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
        router(); // Executa o roteador pela primeira vez

        // Lógica de menu dropdown
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            navMenu.addEventListener('click', (e) => {
                const link = e.target.closest('.config-parent-link');
                if (link) {
                    e.preventDefault();
                    const submenu = link.nextElementSibling;
                    if (submenu && submenu.classList.contains('submenu')) {
                        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                    }
                }
            });
        }

        // [NOVO] Lógica de Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                FSLaudosApp.auth.signOut().then(() => {
                    console.log('Usuário deslogado com sucesso.');
                    // O listener onAuthStateChanged cuidará do redirecionamento.
                }).catch(error => {
                    console.error('Erro ao fazer logout:', error);
                });
            });
        }

    } catch (initError) {
        console.error("ERRO FATAL na inicialização do app.js:", initError);
        document.body.innerHTML = "<h1>Erro Fatal na Aplicação. Verifique o console (F12).</h1>";
    }
}