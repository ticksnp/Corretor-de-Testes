// js/login.js
window.addEventListener('load', () => {
    // Espera o firebase-config.js carregar e inicializar o `auth`
    const checkAuthReady = setInterval(() => {
        if (FSLaudosApp.auth) {
            clearInterval(checkAuthReady);
            initializeLogin();
        }
    }, 100);

    function initializeLogin() {
        const auth = FSLaudosApp.auth;

        // Elementos do DOM
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const resetForm = document.getElementById('reset-form');
        const messageEl = document.getElementById('auth-message');

        // Links de navegação
        const forgotPasswordLink = document.getElementById('forgot-password-link');
        const signupLink = document.getElementById('signup-link');
        const backToLoginFromSignup = document.getElementById('back-to-login-from-signup');
        const backToLoginFromReset = document.getElementById('back-to-login-from-reset');
        
        // Redireciona se o usuário já estiver logado
        auth.onAuthStateChanged(user => {
            if (user) {
                window.location.href = '/index.html';
            }
        });

        // --- Funções para alternar entre os formulários ---
        function showForm(formToShow) {
            loginForm.classList.add('hidden');
            signupForm.classList.add('hidden');
            resetForm.classList.add('hidden');
            formToShow.classList.remove('hidden');
            messageEl.textContent = ''; // Limpa mensagens de erro
        }

        signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            showForm(signupForm);
        });

        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            showForm(resetForm);
        });

        backToLoginFromSignup.addEventListener('click', (e) => {
            e.preventDefault();
            showForm(loginForm);
        });
        
        backToLoginFromReset.addEventListener('click', (e) => {
            e.preventDefault();
            showForm(loginForm);
        });

        // --- Lógica de Autenticação ---

        // Login
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            auth.signInWithEmailAndPassword(email, password)
                .then(userCredential => {
                    // O onAuthStateChanged vai lidar com o redirecionamento
                    console.log('Login bem-sucedido:', userCredential.user);
                })
                .catch(error => {
                    messageEl.textContent = 'E-mail ou senha inválidos. Por favor, tente novamente.';
                    messageEl.className = 'error';
                });
        });

        // Cadastro
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;

            if (password !== confirmPassword) {
                messageEl.textContent = 'As senhas não coincidem.';
                messageEl.className = 'error';
                return;
            }

            auth.createUserWithEmailAndPassword(email, password)
                .then(userCredential => {
                    messageEl.textContent = 'Cadastro realizado com sucesso! Você já pode fazer o login.';
                    messageEl.className = 'success';
                    showForm(loginForm);
                    signupForm.reset();
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        messageEl.textContent = 'Este e-mail já está cadastrado.';
                    } else if (error.code === 'auth/weak-password') {
                        messageEl.textContent = 'A senha é muito fraca. Use pelo menos 6 caracteres.';
                    } else {
                        messageEl.textContent = 'Ocorreu um erro ao cadastrar. Tente novamente.';
                    }
                     messageEl.className = 'error';
                });
        });

        // Redefinição de Senha
        resetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('reset-email').value;

            auth.sendPasswordResetEmail(email)
                .then(() => {
                    messageEl.textContent = 'Link de redefinição enviado! Verifique seu e-mail.';
                    messageEl.className = 'success';
                })
                .catch(error => {
                     messageEl.textContent = 'Não foi possível enviar o e-mail. Verifique o endereço digitado.';
                     messageEl.className = 'error';
                });
        });
    }
});