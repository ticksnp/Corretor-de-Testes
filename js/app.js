// js/app.js

window.addEventListener('load', () => {
    // [CORREÇÃO] A lógica de inicialização do Firebase foi movida para cá.
    try {
        // Verifica se o Firebase já foi inicializado para evitar erros
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log("Firebase inicializado na aplicação principal.");
        }
        // Anexa os serviços ao objeto global da aplicação
        FSLaudosApp.auth = firebase.auth();
        FSLaudosApp.db = firebase.firestore();
        
        // Agora que o Firebase está pronto, verifica o estado do login
        checkAuthenticationAndRunApp();
    } catch (error) {
        console.error("ERRO CRÍTICO AO INICIALIZAR O FIREBASE NA APLICAÇÃO:", error);
        const appContent = document.getElementById('app-content');
        appContent.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: .25rem;">
                <h2>Erro Crítico de Conexão</h2>
                <p>A aplicação não conseguiu se conectar aos serviços em nuvem necessários para funcionar.</p>
                <p>Por favor, verifique sua conexão com a internet e <strong>recarregue a página</strong>.</p>
            </div>
        `;
    }
});

function checkAuthenticationAndRunApp() {
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
            // Se o usuário está logado, inicializa a lógica principal da aplicação.
            initializeAppLogic();
        } else {
            // --- USUÁRIO DESLOGADO ---
            // Se não há usuário, redireciona para a página de login.
            console.log('Nenhum usuário logado. Redirecionando para a página de login...');
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = '/login.html';
            }
        }
    });
}

function initializeAppLogic() {
    try {
        const appContent = document.getElementById('app-content');
        const { views, pageLogic } = FSLaudosApp;

        if (!views || !pageLogic) {
            throw new Error("Componentes essenciais da aplicação (views, pageLogic) não foram encontrados.");
        }

        const router = () => {
            try {
                document.querySelectorAll('.sidebar .nav-link, .sidebar .submenu a').forEach(l => l.classList.remove('active'));
                const hash = window.location.hash.slice(1) || 'laudos';
                let [page, param] = hash.split('/');

                if (page === 'laudo' && param) page = 'preenchimento-laudo';
                if (page === 'paciente' && param) page = 'detalhes-paciente';

                console.log(`Roteando para a página: '${page}' com o parâmetro: '${param}'`);

                let activeLink = document.querySelector(`.sidebar a[data-page="${page}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    const parentSubmenu = activeLink.closest('.submenu');
                    if (parentSubmenu) {
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

        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            navMenu.addEventListener('click', (e) => {
                if (e.target.closest('.config-parent-link')) {
                    e.preventDefault();
                    const submenu = e.target.closest('.config-parent-link').nextElementSibling;
                    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                }
            });
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                FSLaudosApp.auth.signOut().catch(error => console.error('Erro ao fazer logout:', error));
            });
        }
    } catch (initError) {
        console.error("ERRO FATAL na inicialização do app.js:", initError);
        document.body.innerHTML = "<h1>Erro Fatal na Aplicação. Verifique o console (F12).</h1>";
    }
}