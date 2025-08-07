// js/app.js

// [CORREÇÃO] A inicialização agora é direta, pois o 'defer' no index.html
// garante que este script só roda quando o DOM está pronto.
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase inicializado na aplicação principal.");
    }
    FSLaudosApp.auth = firebase.auth();
    FSLaudosApp.db = firebase.firestore();
    
    checkAuthenticationAndRunApp();
} catch (error) {
    console.error("ERRO CRÍTICO AO INICIALIZAR O FIREBASE NA APLICAÇÃO:", error);
    const appContent = document.getElementById('app-content');
    if (appContent) {
        appContent.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: .25rem;">
                <h2>Erro Crítico de Conexão</h2>
                <p>A aplicação não conseguiu se conectar aos serviços em nuvem.</p>
                <p>Por favor, verifique sua conexão com a internet e <strong>recarregue a página</strong>.</p>
            </div>
        `;
    }
}

function checkAuthenticationAndRunApp() {
    const auth = FSLaudosApp.auth;

    auth.onAuthStateChanged(user => {
        const appContent = document.getElementById('app-content');
        if (!appContent) {
            console.error("CRÍTICO: Elemento 'app-content' não foi encontrado. A aplicação não pode ser renderizada.");
            return;
        }

        if (user) {
            initializeAppLogic();
        } else {
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
            throw new Error("Componentes essenciais (views, pageLogic) não foram encontrados.");
        }

        const router = () => {
            try {
                document.querySelectorAll('.sidebar .nav-link, .sidebar .submenu a').forEach(l => l.classList.remove('active'));
                const hash = window.location.hash.slice(1) || 'laudos';
                let [page, param] = hash.split('/');

                if (page === 'laudo' && param) page = 'preenchimento-laudo';
                if (page === 'paciente' && param) page = 'detalhes-paciente';

                let activeLink = document.querySelector(`.sidebar a[data-page="${page}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    const parentLi = activeLink.closest('.has-submenu');
                    if (parentLi) {
                        parentLi.classList.add('open');
                        parentLi.querySelector('.submenu').style.display = 'block';
                    }
                } else if (page === 'preenchimento-laudo') {
                    document.querySelector(`.sidebar a[data-page="laudos"]`)?.classList.add('active');
                } else if (page === 'detalhes-paciente') {
                    document.querySelector(`.sidebar a[data-page="pacientes"]`)?.classList.add('active');
                }
                
                appContent.innerHTML = views[page] || views.laudos;

                const logicFunction = pageLogic[page] || pageLogic.laudos;
                if (typeof logicFunction === 'function') {
                    logicFunction(param);
                } else {
                    console.warn(`Nenhuma função de lógica encontrada para a página: ${page}`);
                }
            } catch (routeError) {
                console.error("Erro durante o roteamento:", routeError);
                appContent.innerHTML = `<h1>Ocorreu um erro ao carregar esta página.</h1>`;
            }
        };

        window.addEventListener('hashchange', router);
        router(); // Executa o roteador na primeira carga

        // Lógica para abrir/fechar o submenu de configurações
        const sidebar = document.querySelector('.sidebar');
        if(sidebar) {
            sidebar.addEventListener('click', (e) => {
                const configLink = e.target.closest('.config-parent-link');
                if (configLink) {
                    e.preventDefault();
                    const parentLi = configLink.parentElement;
                    parentLi.classList.toggle('open');
                    const submenu = parentLi.querySelector('.submenu');
                    if (submenu) {
                        submenu.style.display = parentLi.classList.contains('open') ? 'block' : 'none';
                    }
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
        console.error("ERRO FATAL na inicialização da lógica da aplicação:", initError);
        document.body.innerHTML = "<h1>Erro Fatal na Aplicação. Verifique o console (F12).</h1>";
    }
}