// js/views.js

FSLaudosApp.views = {
    laudos: `
        <div class="header-container">
            <h1>Laudos</h1><button id="novo-laudo-btn" class="btn btn-primary">+ Novo Laudo</button>
        </div>
        <div class="main-card">
            <div class="filter-section"><label for="search-input">Buscar:</label><input type="text" id="search-input" placeholder="Por favor, insira o nome do paciente..."><button id="clear-btn" class="btn btn-secondary">Limpar</button><button id="filter-btn" class="btn btn-primary">Filtrar</button></div>
            <table class="data-table"><thead><tr><th>Data</th><th>Paciente</th><th>Testes</th><th>Opções</th></tr></thead><tbody id="laudos-table-body"></tbody></table>
        </div>
        <div id="novo-laudo-modal-overlay" class="modal-overlay hidden">
            <div class="modal-content">
                <div class="modal-header"><h2 id="modal-title">Novo Laudo</h2><button id="close-modal-btn" class="close-modal">×</button></div>
                <form id="novo-laudo-form" class="modal-body">
                    <div class="form-group"><label for="paciente-nome">* Nome do Paciente</label><input type="text" id="paciente-nome" placeholder="Insira um Nome para o Paciente" required></div>
                    <div class="form-row">
                        <div class="form-group"><label for="paciente-nascimento">* Data de Nascimento</label><input type="text" id="paciente-nascimento" placeholder="DD/MM/AAAA" required></div>
                        <div class="form-group"><label for="data-aplicacao">* Data de Aplicação do Teste</label><input type="text" id="data-aplicacao" placeholder="DD/MM/AAAA" required></div>
                    </div>
                    <p id="modal-patient-age" style="margin-top: -5px; margin-bottom: 15px; text-align: center; color: #555; font-size: 14px;"></p>
                    <div class="form-group">
                        <label>Testes</label>
                        <div id="testes-custom-select" class="custom-select-container">
                            <div class="select-box"><span class="select-text">Selecione os Testes</span><span class="select-arrow"></span></div>
                            <div id="checkbox-options" class="checkbox-options hidden"></div>
                        </div>
                    </div>
                    <div class="modal-footer"><button type="button" id="cancel-btn" class="btn btn-secondary">Cancelar</button><button type="submit" class="btn btn-primary">OK</button></div>
                </form>
            </div>
        </div>
    `,
    pacientes: `
        <div class="header-container"><h1>Pacientes</h1><button id="novo-paciente-btn" class="btn btn-primary">+ Novo Paciente</button></div>
        <div class="main-card">
            <div class="filter-section"><label for="search-input">Buscar:</label><input type="text" id="search-input" placeholder="Por favor, insira o nome do paciente..."><button class="btn btn-secondary">Limpar</button><button class="btn btn-primary">Filtrar</button></div>
            <table class="data-table"><thead><tr><th>Nome</th><th>Telefone</th><th>Opções</th></tr></thead><tbody id="pacientes-table-body"></tbody></table>
        </div>
        <div id="novo-paciente-modal-overlay" class="modal-overlay hidden">
            <div class="modal-content">
                <div class="modal-header"><h2>Novo Paciente</h2><button id="close-paciente-modal-btn" class="close-modal">×</button></div>
                <form id="novo-paciente-form" class="modal-body">
                    <div class="form-group"><label for="paciente-form-nome">* Nome</label><input type="text" id="paciente-form-nome" required></div>
                    <div class="form-group"><label for="paciente-form-nascimento">* Data de Nascimento</label><input type="text" id="paciente-form-nascimento" placeholder="DD/MM/AAAA" required></div>
                    <div class="form-group"><label for="paciente-form-cpf">CPF</label><input type="text" id="paciente-form-cpf"></div>
                    <div class="form-group"><label for="paciente-form-email">Email</label><input type="email" id="paciente-form-email"></div>
                    <div class="form-group"><label for="paciente-form-telefone">Telefone</label><input type="text" id="paciente-form-telefone"></div>
                    <div class="modal-footer"><button type="button" id="cancel-paciente-btn" class="btn btn-secondary">Cancelar</button><button type="submit" class="btn btn-primary">OK</button></div>
                </form>
            </div>
        </div>
    `,
    'chat-ia': `
        <div class="header-container">
            <h1>ChatIA</h1>
            <!-- [NOVO] Adicionado o botão de Novo Chat -->
            <button id="new-chat-btn" class="btn btn-secondary">Novo Chat</button>
        </div>
        <div class="chat-container">
            <div id="chat-messages">
                <div class="chat-message ai">
                    <div class="avatar">IA</div>
                    <div class="message-content">
                        Olá! Sou seu assistente de IA. Como posso ajudar a analisar os dados de um teste psicológico hoje?
                    </div>
                </div>
            </div>
            <div class="chat-input-area">
                <form id="chat-form">
                    <input type="text" id="chat-input" placeholder="Digite sua mensagem aqui..." autocomplete="off">
                    <button type="submit" id="chat-send-btn" title="Enviar">➤</button>
                </form>
            </div>
        </div>
    `,
    'preenchimento-laudo': `
    <div class="preenchimento-laudo-container">
        <div class="page-header-container">
            <div class="header-content">
                <a href="#laudos" class="back-link" style="text-decoration: none; color: #007bff; font-weight: 500;">← Voltar</a>
                <h2 id="header-nome-paciente" style="margin: 0;">Carregando...</h2>
                <p id="header-idade-paciente" style="color: #6c757d; margin: 0;"></p>
            </div>
            <div class="header-actions">
                <button id="export-laudo-btn" class="btn btn-secondary" disabled>
                    <img src="https://img.icons8.com/ios-glyphs/20/000000/download.png" alt="Download" style="opacity: 0.7;"/>
                    Preparando...
                </button>
            </div>
        </div>
        <div class="preenchimento-laudo-body">
            <aside id="testes-sidebar">
                <!-- A lista de testes será preenchida pelo page-logic.js -->
            </aside>
            <main class="main-content-area">
                <div id="page-tabs-container">
                    <a href="#" class="test-tab-link active" data-tab-content="teste">Teste</a>
                    <a href="#" class="test-tab-link" data-tab-content="resultados">Resultados</a>
                    <a href="#" class="test-tab-link" data-tab-content="detalhes">Detalhes</a>
                </div>
                <div id="preenchimento-content">
                    <p>Carregando dados do laudo...</p>
                </div>
            </main> 
        </div>
    </div>
    <!-- [NOVO] Modal para adicionar testes -->
    <div id="add-test-modal-overlay" class="modal-overlay hidden">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="add-test-modal-title">Adicionar Teste ao Laudo</h2>
                <button id="close-add-test-modal-btn" class="close-modal">×</button>
            </div>
            <form id="add-test-form" class="modal-body">
                <div class="form-group">
                    <label>Testes Disponíveis</label>
                    <div id="add-testes-custom-select" class="custom-select-container">
                        <div class="select-box">
                            <span class="select-text">Selecione os testes a adicionar</span>
                            <span class="select-arrow"></span>
                        </div>
                        <div id="add-test-checkbox-options" class="checkbox-options hidden">
                            <!-- Checkboxes serão inseridos aqui pelo JavaScript -->
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" id="cancel-add-test-btn" class="btn btn-secondary">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Adicionar</button>
                </div>
            </form>
        </div>
    </div>
`,
'detalhes-paciente': `
    <div class="patient-details-container">
        <div class="page-header-container" style="padding: 0 24px 16px;">
            <div class="header-content">
                <a href="#pacientes" class="back-link" style="text-decoration: none; color: #007bff; font-weight: 500; margin-bottom: 8px; display: inline-block;">← Voltar para Pacientes</a>
                <h2 id="patient-name-header">Carregando...</h2>
                <p id="patient-age-header" style="color: #6c757d; margin: 0;"></p>
            </div>
        </div>
        <div class="patient-details-body">
            <aside class="patient-details-sidebar">
                <ul>
                    <li><a href="#" class="tab-link active" data-tab="dados">Dados</a></li>
                    <li><a href="#" class="tab-link" data-tab="endereco">Endereço</a></li>
                    <li><a href="#" class="tab-link" data-tab="laudos">Laudos</a></li>
                    <li><a href="#" class="tab-link" data-tab="anotacoes">Anotações</a></li>
                </ul>
            </aside>
            <main class="patient-details-content">
                <div id="tab-dados" class="tab-pane">
                    <form id="form-detalhes-paciente" class="main-card">
                        <div class="form-grid-paciente">
                            <div class="form-group"><label for="pd-nome">* Nome</label><input type="text" id="pd-nome" required></div>
                            <div class="form-group"><label for="pd-email">Email</label><input type="email" id="pd-email"></div>

                            <div class="form-group"><label for="pd-nascimento">* Data de Nascimento</label><input type="text" id="pd-nascimento" placeholder="DD/MM/AAAA" required></div>
                            <div class="form-group"><label for="pd-rg">RG</label><input type="text" id="pd-rg"></div>

                            <div class="form-group"><label for="pd-cpf">CPF</label><input type="text" id="pd-cpf"></div>
                            <div class="form-group"><label for="pd-telefone">Telefone</label><input type="tel" id="pd-telefone" placeholder="(XX) X XXXX-XXXX"></div>
                            
                            <div class="form-group"><label for="pd-lateralidade">Lateralidade</label><input type="text" id="pd-lateralidade"></div>
                            <div class="form-group"><label for="pd-escolaridade">Escolaridade</label><input type="text" id="pd-escolaridade"></div>

                            <div class="form-group"><label for="pd-genero">Gênero</label><input type="text" id="pd-genero"></div>
                            <div class="form-group"><label for="pd-tipo-escola">Tipo de Escola</label><input type="text" id="pd-tipo-escola"></div>

                            <div class="form-group form-group-span-2"><label for="pd-plano-saude">Plano de Saúde</label><input type="text" id="pd-plano-saude"></div>
                            
                            <div class="form-group"><label for="pd-responsavel1">Responsável 1</label><input type="text" id="pd-responsavel1"></div>
                            <div class="form-group"><label for="pd-responsavel1-tel">Telefone Resp. 1</label><input type="tel" id="pd-responsavel1-tel" placeholder="(XX) X XXXX-XXXX"></div>
                            
                            <div class="form-group"><label for="pd-responsavel2">Responsável 2</label><input type="text" id="pd-responsavel2"></div>
                            <div class="form-group"><label for="pd-responsavel2-tel">Telefone Resp. 2</label><input type="tel" id="pd-responsavel2-tel" placeholder="(XX) X XXXX-XXXX"></div>
                        </div>
                        <div class="footer-actions" style="text-align: right; padding-top: 24px;"><button type="submit" class="btn btn-primary">Confirmar Alterações</button></div>
                    </form>
                </div>
                <div id="tab-endereco" class="tab-pane hidden">
                    <form id="form-endereco-paciente" class="main-card">
                        <div class="form-grid-endereco">
                             <div class="form-group">
                                <label for="pd-cidade">Cidade</label>
                                <input type="text" id="pd-cidade">
                            </div>
                            <div class="form-group">
                                <label for="pd-estado">Estado</label>
                                <input type="text" id="pd-estado">
                            </div>
                            <div class="form-group">
                                <label for="pd-cep">CEP</label>
                                <input type="text" id="pd-cep" placeholder="_____-___">
                            </div>
                            <div class="form-group">
                                <label for="pd-rua">Rua</label>
                                <input type="text" id="pd-rua">
                            </div>
                            <div class="form-group">
                                <label for="pd-bairro">Bairro</label>
                                <input type="text" id="pd-bairro">
                            </div>
                            <div class="form-group">
                                <label for="pd-numero">Número</label>
                                <input type="text" id="pd-numero">
                            </div>
                        </div>
                        <div class="footer-actions">
                            <button type="submit" class="btn btn-primary" style="background-color: #007bff;">Confirmar</button>
                        </div>
                    </form>
                </div>
                <div id="tab-laudos" class="tab-pane hidden">
                    <div class="main-card">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Data de Aplicação</th>
                                    <th>Testes Aplicados</th>
                                    <th>Opções</th>
                                </tr>
                            </thead>
                            <tbody id="paciente-laudos-table-body">
                                <!-- Laudos do paciente serão inseridos aqui pelo JavaScript -->
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="tab-anotacoes" class="tab-pane hidden"><div class="main-card"><p>Área de anotações a ser implementada.</p></div></div>
            </main>
        </div>
    </div>
    `,
    'configuracoes-laudo': `
        <div class="header-container">
             <h1>Configurações do Laudo</h1>
        </div>
        <div class="main-card form-layout-container">
            <div class="logo-section">
                <label for="logo-upload-input" class="logo-upload-circle" id="logo-preview-container">
                    <span id="logo-initials" style="font-family: serif; font-style: italic;">FS</span>
                </label>
                <input type="file" id="logo-upload-input" accept="image/png, image/jpeg" style="display: none;">
            </div>
            <div class="form-content-split">
                <div class="form-section">
                    <h3>Dados do Cabeçalho</h3>
                    <p class="section-description">Informações que aparecerão no topo do relatório.</p>
                    <div class="form-group">
                        <label for="prof-name">* Nome do Profissional</label>
                        <input type="text" id="prof-name">
                    </div>
                     <div class="form-group">
                        <label for="prof-crp">CRP</label>
                        <input type="text" id="prof-crp">
                    </div>
                    <div class="form-group toggle-group">
                        <label>Mostrar CRP no relatório</label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="show-crp">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
                <div class="form-section">
                    <h3>Rodapé</h3>
                    <p class="section-description">Dados que aparecerão ao final de cada página.</p>
                    <div class="form-group">
                        <label for="prof-email">* Email</label>
                        <input type="email" id="prof-email">
                    </div>
                    <div class="form-group">
                        <label for="prof-phone">Telefone</label>
                        <input type="tel" id="prof-phone">
                    </div>
                </div>
            </div>
            <div class="form-footer-actions">
                <button id="save-config-btn" class="btn btn-primary">Salvar Alterações</button>
            </div>
        </div>
    `
};