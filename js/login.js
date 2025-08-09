// js/login.js

window.addEventListener('load', () => {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log("Firebase inicializado na página de login.");
        }
        FSLaudosApp.auth = firebase.auth();
        initializeLoginLogic(); // Chama a função principal da página
    } catch (error) {
        console.error("ERRO CRÍTICO AO INICIALIZAR O FIREBASE NA PÁGINA DE LOGIN:", error);
        alert("Não foi possível carregar os serviços do Firebase. Verifique sua conexão com a internet e tente recarregar a página.");
    }
});

function initializeLoginLogic() {
    const auth = FSLaudosApp.auth;

    // Elementos do DOM
    const loginForm = document.getElementById('login-form');
    const resetForm = document.getElementById('reset-form');
    const messageEl = document.getElementById('auth-message');
    // [REMOVIDO] A referência ao signupForm foi removida.

    // Links de navegação
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const backToLoginFromReset = document.getElementById('back-to-login-from-reset');
    // [REMOVIDO] As referências aos links de cadastro foram removidas.
    
    // Redireciona se o usuário já estiver logado
    auth.onAuthStateChanged(user => {
        if (user) {
            window.location.href = '/index.html';
        }
    });

    // Funções para alternar entre os formulários
    function showForm(formToShow) {
        loginForm.classList.add('hidden');
        resetForm.classList.add('hidden');
        // [REMOVIDO] A lógica para esconder o signupForm foi removida.
        formToShow.classList.remove('hidden');
        messageEl.textContent = '';
    }
    
    // [REMOVIDO] O event listener para o link de cadastro foi removido.
    forgotPasswordLink.addEventListener('click', (e) => { e.preventDefault(); showForm(resetForm); });
    backToLoginFromReset.addEventListener('click', (e) => { e.preventDefault(); showForm(loginForm); });

    // Lógica de Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        auth.signInWithEmailAndPassword(email, password)
            .catch(error => {
                messageEl.textContent = 'E-mail ou senha inválidos. Por favor, tente novamente.';
                messageEl.className = 'error';
            });
    });

    // [REMOVIDO] Toda a lógica de Cadastro foi removida desta seção.

    // Lógica de Redefinição de Senha
    resetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('reset-email').value;

        auth.sendPasswordResetEmail(email)
            .then(() => {
                messageEl.textContent = 'Link de redefinição enviado! Verifique seu e-mail.';
                messageEl.className = 'success';
            })
            .catch(() => {
                 messageEl.textContent = 'Não foi possível enviar o e-mail. Verifique o endereço digitado.';
                 messageEl.className = 'error';
            });
    });
}