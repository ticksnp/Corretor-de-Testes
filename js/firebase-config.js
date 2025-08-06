// js/firebase-config.js

const firebaseConfig = {
  apiKey: "AIzaSyClSSzGmV9dh1-EAx_0tJZeM2V7uyhcBuQ",
  authDomain: "corretor-de-testes.firebaseapp.com",
  projectId: "corretor-de-testes",
  storageBucket: "corretor-de-testes.firebasestorage.app",
  messagingSenderId: "762973938957",
  appId: "1:762973938957:web:3db51787f3e7ea98137c44",
  measurementId: "G-XPHXBSYGT8"
};

try {
  // Inicializa o Firebase
  firebase.initializeApp(firebaseConfig);

  // [MODIFICADO] Disponibiliza as instâncias dos serviços do Firebase para a aplicação.
  // Isso garante que tanto o login.js quanto o app.js usem as mesmas instâncias.
  FSLaudosApp.db = firebase.firestore();
  FSLaudosApp.auth = firebase.auth(); // Adiciona o serviço de autenticação

  console.log("Firebase (Auth e Firestore) inicializado com sucesso.");

} catch (error) {
  console.error("ERRO CRÍTICO AO INICIALIZAR O FIREBASE:", error);
  alert("Não foi possível carregar os serviços do Firebase. Verifique sua conexão com a internet e tente recarregar a página.");
  
  const appContent = document.getElementById('app-content') || document.body;
  appContent.innerHTML = `
    <div style="padding: 20px; text-align: center; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: .25rem;">
        <h2>Erro Crítico de Conexão</h2>
        <p>A aplicação não conseguiu se conectar aos serviços em nuvem necessários para funcionar.</p>
        <p>Por favor, verifique sua conexão com a internet e <strong>recarregue a página</strong>.</p>
    </div>
  `;
}