// js/page-logic.js

// --- FUNÇÕES AUXILIARES GLOBAIS ---
FSLaudosApp.formatDateInput = (inputElement) => {
    if (!inputElement) return;
    let value = inputElement.value.replace(/\D/g, '');
    if (value.length > 2) { value = `${value.slice(0, 2)}/${value.slice(2)}`; }
    if (value.length > 5) { value = `${value.slice(0, 5)}/${value.slice(5)}`; }
    inputElement.value = value.slice(0, 10);
};

FSLaudosApp.calculateAgeInYearsAndMonths = (dobString, appDateString) => {
    if (!dobString || !appDateString || !/^\d{2}\/\d{2}\/\d{4}$/.test(dobString) || !/^\d{2}\/\d{2}\/\d{4}$/.test(appDateString)) return '';
    const [dobDay, dobMonth, dobYear] = dobString.split('/').map(Number);
    const [appDay, appMonth, appYear] = appDateString.split('/').map(Number);
    const birthDate = new Date(dobYear, dobMonth - 1, dobDay);
    const applicationDate = new Date(appYear, appMonth - 1, appDay);
    if (isNaN(birthDate.getTime()) || isNaN(applicationDate.getTime()) || applicationDate < birthDate) return 'Data inválida';
    let years = applicationDate.getFullYear() - birthDate.getFullYear();
    let months = applicationDate.getMonth() - birthDate.getMonth();
    if (months < 0 || (months === 0 && applicationDate.getDate() < birthDate.getDate())) {
        years--;
        months += 12;
    }
    if (applicationDate.getDate() < birthDate.getDate()) {
        months--;
        if (months < 0) {
            months = 11;
            years--;
        }
    }
    return `${years} anos e ${months} meses`;
};

FSLaudosApp.calculatePreciseAge = (dobString, appDateString) => {
    if (!dobString || !appDateString || !/^\d{2}\/\d{2}\/\d{4}$/.test(dobString) || !/^\d{2}\/\d{2}\/\d{4}$/.test(appDateString)) {
        return null;
    }
    const [dobDay, dobMonth, dobYear] = dobString.split('/').map(Number);
    const [appDay, appMonth, appYear] = appDateString.split('/').map(Number);
    let birthDate = new Date(dobYear, dobMonth - 1, dobDay);
    let applicationDate = new Date(appYear, appMonth - 1, appDay);
    if (isNaN(birthDate.getTime()) || isNaN(applicationDate.getTime()) || applicationDate < birthDate) { return null; }
    let years = applicationDate.getFullYear() - birthDate.getFullYear();
    let months = applicationDate.getMonth() - birthDate.getMonth();
    let days = applicationDate.getDate() - birthDate.getDate();
    if (days < 0) {
        months--;
        const lastDayOfPreviousMonth = new Date(applicationDate.getFullYear(), applicationDate.getMonth(), 0).getDate();
        days += lastDayOfPreviousMonth;
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    return { years, months, days };
};


FSLaudosApp.calculateAgeInYearsAtDate = (dobString, appDateString) => {
    if (!dobString || !appDateString || !/^\d{2}\/\d{2}\/\d{4}$/.test(dobString) || !/^\d{2}\/\d{2}\/\d{4}$/.test(appDateString)) return null;
    const [dobDay, dobMonth, dobYear] = dobString.split('/').map(Number);
    const [appDay, appMonth, appYear] = appDateString.split('/').map(Number);
    const birthDate = new Date(dobYear, dobMonth - 1, dobDay);
    const applicationDate = new Date(appYear, appMonth - 1, appDay);
    if (isNaN(birthDate.getTime()) || isNaN(applicationDate.getTime())) return null;
    let age = applicationDate.getFullYear() - birthDate.getFullYear();
    const m = applicationDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && applicationDate.getDate() < birthDate.getDate())) { age--; }
    return age;
};

FSLaudosApp.pageLogic = (() => {
    let activeChart = null;
    const destroyActiveChart = () => {
        if (activeChart) {
            activeChart.destroy();
            activeChart = null;
        }
    };
    
    return {
        laudos: () => {
            const db = FSLaudosApp.db;
            if (!db) { console.error("DB não está definido na página de Laudos."); return; }

            const { testForms } = FSLaudosApp;
            const appContent = document.getElementById('app-content');
            let selectedTestKeys = []; // Variável para guardar os testes selecionados
            
            const renderLaudosTable = () => {
                const tableBody = document.getElementById('laudos-table-body');
                if (!tableBody) return;
                tableBody.innerHTML = '<tr><td colspan="4">Carregando laudos...</td></tr>';
                db.collection('laudos').orderBy('dataCadastro', 'desc').get().then(snapshot => {
                    if (snapshot.empty) {
                        tableBody.innerHTML = `<tr><td colspan="4">Nenhum laudo encontrado</td></tr>`;
                        return;
                    }
                    tableBody.innerHTML = '';
                    snapshot.forEach(doc => {
                        const laudo = doc.data();
                        const laudoId = doc.id;
                        const testesHtml = (laudo.testes || []).map(chave => testForms[chave]?.nomeExibicao || chave).map(nome => `<span class="test-tag">${nome}</span>`).join('');
                        const acao = `<a href="#laudo/${laudoId}" class="details-link">Detalhes</a> <button data-id="${laudoId}" class="details-link edit-laudo-btn" style="background:none; border:none; cursor:pointer; padding:0; font-family: inherit; font-size: inherit;">Editar</button>`;
                        const tr = document.createElement('tr');
                        tr.innerHTML = `<td>${laudo.dataAplicacao || ''}</td><td>${laudo.pacienteNome || ''}</td><td><div class="test-tags-container">${testesHtml}</div></td><td class="options-cell">${acao}</td>`;
                        tableBody.appendChild(tr);
                    });
                }).catch(err => {
                    console.error("Erro ao buscar laudos: ", err);
                    tableBody.innerHTML = '<tr><td colspan="4">Erro ao carregar os laudos.</td></tr>';
                });
            };

            const handleModal = async (laudoId = null) => {
                const modalOverlay = document.getElementById('novo-laudo-modal-overlay');
                if (!modalOverlay) return;

                const laudoForm = document.getElementById('novo-laudo-form');
                const modalTitle = document.getElementById('modal-title');
                
                const freshForm = laudoForm.cloneNode(true);
                laudoForm.parentNode.replaceChild(freshForm, laudoForm);
                freshForm.reset();
                selectedTestKeys = []; // Limpa os testes selecionados ao abrir o modal
                delete freshForm.dataset.editingId;

                const pacienteSelect = freshForm.querySelector('#selecionar-paciente');
                const campoNome = freshForm.querySelector('#paciente-nome');
                const campoNascimento = freshForm.querySelector('#paciente-nascimento');
                const campoAplicacao = freshForm.querySelector('#data-aplicacao');
                const testesInputDisplay = freshForm.querySelector('#testes-input-display');
                
                const pacientes = [];
                try {
                    const snapshot = await db.collection('pacientes').orderBy('nome').get();
                    pacienteSelect.innerHTML = '<option value="" selected>Selecione um Paciente</option>';
                    snapshot.forEach(doc => {
                        const paciente = doc.data();
                        pacientes.push({ id: doc.id, ...paciente });
                        const option = document.createElement('option');
                        option.value = doc.id;
                        option.textContent = paciente.nome;
                        pacienteSelect.appendChild(option);
                    });
                } catch(err) { console.error("Erro ao carregar pacientes:", err) }
                
                pacienteSelect.addEventListener('change', (e) => {
                    const selectedId = e.target.value;
                    const selectedPaciente = pacientes.find(p => p.id === selectedId);
                    if (selectedPaciente) {
                        campoNome.value = selectedPaciente.nome;
                        campoNascimento.value = selectedPaciente.nascimento || '';
                        campoNome.disabled = true;
                        campoNascimento.disabled = true;
                    } else {
                        campoNome.value = '';
                        campoNascimento.value = '';
                        campoNome.disabled = false;
                        campoNascimento.disabled = false;
                    }
                });

                const manualInputHandler = () => {
                    if (pacienteSelect.value !== '') {
                        pacienteSelect.value = '';
                        campoNome.disabled = false;
                        campoNascimento.disabled = false;
                    }
                };
                campoNome.addEventListener('input', manualInputHandler);
                campoNascimento.addEventListener('input', () => { FSLaudosApp.formatDateInput(campoNascimento); manualInputHandler(); });
                campoAplicacao.addEventListener('input', () => FSLaudosApp.formatDateInput(campoAplicacao));

                if (laudoId) {
                    modalTitle.textContent = "Editar Laudo";
                    const docSnap = await db.collection('laudos').doc(laudoId).get();
                    if (docSnap.exists) {
                        const data = docSnap.data();
                        campoNome.value = data.pacienteNome || '';
                        campoNascimento.value = data.pacienteNascimento || '';
                        campoAplicacao.value = data.dataAplicacao || '';
                        selectedTestKeys = data.testes || [];
                        updateSelectedTestsText(testesInputDisplay, selectedTestKeys);
                        if(data.pacienteId) {
                           setTimeout(() => {
                               pacienteSelect.value = data.pacienteId;
                               if(pacienteSelect.value === data.pacienteId) {
                                   pacienteSelect.dispatchEvent(new Event('change'));
                               }
                           }, 200);
                        }
                        freshForm.dataset.editingId = laudoId;
                    }
                } else {
                    modalTitle.textContent = "Novo Laudo";
                    updateSelectedTestsText(testesInputDisplay, []);
                }
                
                testesInputDisplay.addEventListener('click', () => openTestSelectionModal(selectedTestKeys, testesInputDisplay));

                freshForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    if (selectedTestKeys.length === 0) {
                        alert('Por favor, selecione pelo menos um teste.');
                        return;
                    }
                    campoNome.disabled = false;
                    campoNascimento.disabled = false;
                    const laudoData = {
                        pacienteNome: campoNome.value,
                        pacienteNascimento: campoNascimento.value,
                        dataAplicacao: campoAplicacao.value,
                        testes: selectedTestKeys,
                        pacienteId: pacienteSelect.value || null
                    };
                    const editingId = freshForm.dataset.editingId;
                    const promise = editingId ? db.collection('laudos').doc(editingId).update(laudoData) : db.collection('laudos').add({ ...laudoData, status: 'em_preenchimento', dataCadastro: firebase.firestore.FieldValue.serverTimestamp() });
                    promise.then(() => {
                        modalOverlay.classList.add('hidden');
                        renderLaudosTable();
                    }).catch(err => {
                        console.error("Erro ao salvar laudo: ", err);
                        alert('Erro ao salvar o laudo.');
                    });
                });
                modalOverlay.classList.remove('hidden');
            };

            const updateSelectedTestsText = (displayElement, keys) => {
                if (!displayElement) return;
                if (keys.length === 0) {
                    displayElement.value = 'Selecione Todos os Testes para o laudo';
                } else if (keys.length === 1) {
                    displayElement.value = testForms[keys[0]]?.nomeExibicao || 'Teste desconhecido';
                } else {
                    displayElement.value = `${keys.length} testes selecionados`;
                }
            };

            const openTestSelectionModal = (currentlySelectedKeys, displayElement) => {
                const testesModalOverlay = document.getElementById('selecionar-testes-modal-overlay');
                const checkboxList = document.getElementById('testes-checkbox-list');
                const confirmBtn = document.getElementById('confirm-testes-btn');
                const closeBtn = document.getElementById('close-testes-modal-btn');
                if (!testesModalOverlay || !checkboxList || !confirmBtn || !closeBtn) return;
                
                const testesData = Object.entries(testForms).map(([id, teste]) => ({ id, name: teste.nomeExibicao })).sort((a, b) => a.name.localeCompare(b.name));
                checkboxList.innerHTML = '<ul>' + testesData.map(teste => {
                    const isChecked = currentlySelectedKeys.includes(teste.id) ? 'checked' : '';
                    return `<li style="padding: 5px 0;"><label style="display: flex; align-items: center; cursor: pointer;"><input type="checkbox" value="${teste.id}" ${isChecked} style="margin-right: 10px;">${teste.name}</label></li>`;
                }).join('') + '</ul>';

                const newConfirmBtn = confirmBtn.cloneNode(true);
                confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
                newConfirmBtn.addEventListener('click', () => {
                    const checkedInputs = checkboxList.querySelectorAll('input[type="checkbox"]:checked');
                    selectedTestKeys = Array.from(checkedInputs).map(input => input.value);
                    updateSelectedTestsText(displayElement, selectedTestKeys);
                    testesModalOverlay.classList.add('hidden');
                });

                const newCloseBtn = closeBtn.cloneNode(true);
                closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
                newCloseBtn.addEventListener('click', () => testesModalOverlay.classList.add('hidden'));

                testesModalOverlay.classList.remove('hidden');
            };

            renderLaudosTable();

            appContent.addEventListener('click', (event) => {
                const target = event.target;
                if (target.id === 'novo-laudo-btn' || target.closest('#novo-laudo-btn')) {
                    handleModal();
                }
                const editBtn = target.closest('.edit-laudo-btn');
                if (editBtn) {
                    handleModal(editBtn.dataset.id);
                }
                if (target.id === 'close-modal-btn' || target.id === 'cancel-btn' || target.closest('#close-modal-btn')) {
                    const modalOverlay = document.getElementById('novo-laudo-modal-overlay');
                    if (modalOverlay) modalOverlay.classList.add('hidden');
                }
            });
        },
        pacientes: () => {
            const db = FSLaudosApp.db;
            if (!db) { console.error("DB não está definido na página de Pacientes."); return; }
            const modalOverlay = document.getElementById('novo-paciente-modal-overlay');
            const form = document.getElementById('novo-paciente-form');
            const tableBody = document.getElementById('pacientes-table-body');
            const renderTable = () => {
                if (!tableBody) return;
                tableBody.innerHTML = '<tr><td colspan="3">Carregando...</td></tr>';
                db.collection('pacientes').orderBy('nome').get().then(snapshot => {
                    if (snapshot.empty) {
                        tableBody.innerHTML = '<tr><td colspan="3">Nenhum paciente cadastrado.</td></tr>';
                        return;
                    }
                    tableBody.innerHTML = '';
                    snapshot.forEach(doc => {
                        const paciente = doc.data();
                        const tr = document.createElement('tr');
                        tr.innerHTML = `<td>${paciente.nome || 'N/A'}</td><td>${paciente.telefone || 'N/A'}</td><td class="options-cell"><a href="#paciente/${doc.id}" class="details-link">Ver Detalhes</a></td>`;
                        tableBody.appendChild(tr);
                    });
                }).catch(err => {
                    console.error("Erro ao carregar pacientes: ", err);
                    tableBody.innerHTML = '<tr><td colspan="3">Erro ao carregar pacientes.</td></tr>';
                });
            };
            const openModal = () => modalOverlay.classList.remove('hidden');
            const closeModal = () => modalOverlay.classList.add('hidden');
            document.getElementById('novo-paciente-btn').addEventListener('click', openModal);
            document.getElementById('close-paciente-modal-btn').addEventListener('click', closeModal);
            document.getElementById('cancel-paciente-btn').addEventListener('click', closeModal);
            const campoNascimento = document.getElementById('paciente-form-nascimento');
            if (campoNascimento) {
                campoNascimento.addEventListener('input', () => FSLaudosApp.formatDateInput(campoNascimento));
            }
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const pacienteData = {
                    nome: document.getElementById('paciente-form-nome').value,
                    nascimento: document.getElementById('paciente-form-nascimento').value,
                    cpf: document.getElementById('paciente-form-cpf').value,
                    email: document.getElementById('paciente-form-email').value,
                    telefone: document.getElementById('paciente-form-telefone').value,
                    dataCadastro: firebase.firestore.FieldValue.serverTimestamp()
                };
                db.collection('pacientes').add(pacienteData).then(() => {
                    form.reset();
                    closeModal();
                    renderTable();
                }).catch(err => {
                    console.error("Erro ao adicionar paciente: ", err);
                    alert("Erro ao salvar o paciente.");
                });
            });
            renderTable();
        },
        'chat-ia': () => {
            const chatContainer = document.querySelector('.chat-container');
            const chatForm = document.getElementById('chat-form');
            const chatInput = document.getElementById('chat-input');
            const chatSendBtn = document.getElementById('chat-send-btn');
            const messagesContainer = document.getElementById('chat-messages');
            const newChatBtn = document.getElementById('new-chat-btn');
            const attachBtn = document.getElementById('chat-attach-btn');
            const fileInput = document.getElementById('chat-file-input');
            const filePreviewContainer = document.getElementById('chat-file-preview-container');

            let conversationHistory = JSON.parse(sessionStorage.getItem('chatHistory')) || [];
            let currentFiles = [];

            const renderMessage = (sender, content) => {
                 const messageDiv = document.createElement('div');
                messageDiv.classList.add('chat-message', sender);
                
                const avatar = document.createElement('div');
                avatar.classList.add('avatar');
                avatar.textContent = sender === 'user' ? 'Você' : 'IA';
                
                const contentDiv = document.createElement('div');
                contentDiv.classList.add('message-content');
                contentDiv.innerHTML = content;
                
                messageDiv.appendChild(avatar);
                messageDiv.appendChild(contentDiv);
                messagesContainer.appendChild(messageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            };

            const appendMessage = (sender, content) => {
                renderMessage(sender, content);

                const role = (sender === 'user') ? 'user' : 'model';
                conversationHistory.push({ role, parts: [{ text: content.replace(/<br>/g, '\n') }] });
                sessionStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
            };
            
            const renderHistory = () => {
                messagesContainer.innerHTML = ''; 
                if (conversationHistory.length === 0) {
                    renderMessage('ai', 'Olá! Sou seu assistente de IA. Faça uma pergunta ou arraste uma imagem para cá para que eu possa analisá-la.');
                } else {
                    conversationHistory.forEach(msg => {
                        const sender = msg.role === 'user' ? 'user' : 'ai';
                        const content = msg.parts[0].text.replace(/\n/g, '<br>');
                        renderMessage(sender, content);
                    });
                }
            };

            const startNewChat = () => {
                conversationHistory = [];
                currentFiles = [];
                sessionStorage.removeItem('chatHistory');
                updateFilePreview();
                renderHistory();
                chatInput.focus();
            };

            const updateFilePreview = () => {
                filePreviewContainer.innerHTML = '';
                currentFiles.forEach((file, index) => {
                    const item = document.createElement('div');
                    item.classList.add('file-preview-item');
                    let preview = document.createElement('span');
                    if (file.type.startsWith('image/')) {
                        preview = document.createElement('img');
                        preview.src = URL.createObjectURL(file);
                        preview.onload = () => URL.revokeObjectURL(preview.src);
                    } else { preview.textContent = '📄'; }
                    const name = document.createElement('span');
                    name.textContent = file.name;
                    const removeBtn = document.createElement('button');
                    removeBtn.classList.add('remove-file-btn');
                    removeBtn.innerHTML = '&times;';
                    removeBtn.onclick = () => { currentFiles.splice(index, 1); updateFilePreview(); };
                    item.append(preview, name, removeBtn);
                    filePreviewContainer.appendChild(item);
                });
            };

            const handleFiles = (files) => {
                currentFiles.push(...Array.from(files));
                updateFilePreview();
            };

            attachBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', () => handleFiles(fileInput.files));
            chatContainer.addEventListener('dragover', (e) => { e.preventDefault(); chatContainer.classList.add('drag-over'); });
            chatContainer.addEventListener('dragleave', () => { chatContainer.classList.remove('drag-over'); });
            chatContainer.addEventListener('drop', (e) => { e.preventDefault(); chatContainer.classList.remove('drag-over'); handleFiles(e.dataTransfer.files); });
            newChatBtn.addEventListener('click', startNewChat);

            const showTypingIndicator = () => {
                const typingDiv = document.createElement('div');
                typingDiv.classList.add('chat-message', 'ai', 'typing-indicator');
                typingDiv.innerHTML = '<div class="avatar">IA</div><div class="message-content"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
                messagesContainer.appendChild(typingDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            };
            const removeTypingIndicator = () => {
                const indicator = messagesContainer.querySelector('.typing-indicator');
                if (indicator) indicator.remove();
            };
            const fileToBase64 = (file) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.onerror = error => reject(error);
            });

            chatForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const userMessage = chatInput.value.trim();
                if (!userMessage && currentFiles.length === 0) return;

                appendMessage('user', userMessage || 'Analisar anexo(s)');
                
                const currentQuery = chatInput.value.trim();
                chatInput.value = '';
                chatSendBtn.disabled = true;

                let imagePayload = null;
                if (currentFiles.length > 0) {
                    const imageFile = currentFiles.find(f => f.type.startsWith('image/'));
                    if (imageFile) {
                        imagePayload = { mimeType: imageFile.type, data: await fileToBase64(imageFile) };
                    }
                }
                currentFiles = [];
                updateFilePreview();
                showTypingIndicator();

                try {
                    const historyForApi = conversationHistory.slice(0, -1);
                    
                    const response = await fetch('/.netlify/functions/chat-ia-handler', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            history: historyForApi,
                            query: currentQuery,
                            image: imagePayload
                        }),
                    });

                    removeTypingIndicator();
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Falha na comunicação.');
                    }
                    
                    const data = await response.json();
                    appendMessage('ai', data.reply.replace(/\n/g, '<br>'));
                } catch (error) {
                    removeTypingIndicator();
                    renderMessage('ai', `Desculpe, ocorreu um erro: ${error.message}`);
                } finally {
                    chatSendBtn.disabled = false;
                    chatInput.focus();
                }
            });
            
            renderHistory();
        },
        'detalhes-paciente': (pacienteId) => {
            const db = FSLaudosApp.db;
            if (!db) { console.error("DB não está definido em Detalhes do Paciente."); return; }
            if (!pacienteId) return;

            const pacienteRef = db.collection('pacientes').doc(pacienteId);

            const renderLaudosDoPaciente = (nomePaciente) => {
                const tableBody = document.getElementById('paciente-laudos-table-body');
                if (!tableBody) return;

                tableBody.innerHTML = '<tr><td colspan="3">Carregando laudos...</td></tr>';
                
                db.collection('laudos').where('pacienteNome', '==', nomePaciente)
                  .get()
                  .then(snapshot => {
                    if (snapshot.empty) {
                        tableBody.innerHTML = '<tr><td colspan="3">Nenhum laudo encontrado para este paciente.</td></tr>';
                        return;
                    }

                    const { testForms } = FSLaudosApp;
                    
                    const laudosList = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
                    laudosList.sort((a, b) => {
                        const dateA = a.dataAplicacao.split('/').reverse().join('');
                        const dateB = b.dataAplicacao.split('/').reverse().join('');
                        return dateB.localeCompare(dateA);
                    });

                    tableBody.innerHTML = '';
                    laudosList.forEach(laudo => {
                        const testesHtml = (laudo.testes || [])
                            .map(chave => testForms[chave]?.nomeExibicao || chave)
                            .map(nome => `<span class="test-tag">${nome}</span>`)
                            .join('');

                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${laudo.dataAplicacao || 'N/A'}</td>
                            <td><div class="test-tags-container">${testesHtml}</div></td>
                            <td class="options-cell">
                                <a href="#laudo/${laudo.id}" class="details-link">Ver Laudo</a>
                            </td>
                        `;
                        tableBody.appendChild(tr);
                    });
                  })
                  .catch(err => {
                      console.error("Erro ao buscar laudos do paciente: ", err);
                      tableBody.innerHTML = '<tr><td colspan="3">Erro ao carregar os laudos.</td></tr>';
                  });
            };

            pacienteRef.get().then(doc => {
                if (!doc.exists) {
                    document.getElementById('app-content').innerHTML = '<h1>Paciente não encontrado.</h1>';
                    return;
                }
                const data = doc.data();
                
                document.getElementById('patient-name-header').textContent = data.nome || 'Nome não encontrado';
                const idade = data.nascimento ? FSLaudosApp.calculateAgeInYearsAndMonths(data.nascimento, new Date().toLocaleDateString('pt-BR')) : 'Idade não informada';
                document.getElementById('patient-age-header').textContent = idade;

                document.getElementById('pd-nome').value = data.nome || '';
                document.getElementById('pd-nascimento').value = data.nascimento || '';
                document.getElementById('pd-cpf').value = data.cpf || '';
                document.getElementById('pd-email').value = data.email || '';
                document.getElementById('pd-telefone').value = data.telefone || '';
                document.getElementById('pd-rg').value = data.rg || '';
                document.getElementById('pd-lateralidade').value = data.lateralidade || '';
                document.getElementById('pd-escolaridade').value = data.escolaridade || '';
                document.getElementById('pd-genero').value = data.genero || '';
                document.getElementById('pd-tipo-escola').value = data.tipoEscola || '';
                document.getElementById('pd-plano-saude').value = data.planoSaude || '';
                document.getElementById('pd-responsavel1').value = data.responsavel1 || '';
                document.getElementById('pd-responsavel1-tel').value = data.responsavel1_tel || '';
                document.getElementById('pd-responsavel2').value = data.responsavel2 || '';
                document.getElementById('pd-responsavel2-tel').value = data.responsavel2_tel || '';

                const endereco = data.endereco || {};
                document.getElementById('pd-cep').value = endereco.cep || '';
                document.getElementById('pd-rua').value = endereco.rua || '';
                document.getElementById('pd-numero').value = endereco.numero || '';
                document.getElementById('pd-bairro').value = endereco.bairro || '';
                document.getElementById('pd-cidade').value = endereco.cidade || '';
                document.getElementById('pd-estado').value = endereco.estado || '';
                
                renderLaudosDoPaciente(data.nome);

            }).catch(error => {
                console.error("Erro ao buscar detalhes do paciente:", error);
                document.getElementById('app-content').innerHTML = '<h1>Erro ao carregar dados do paciente.</h1>';
            });

            const sidebar = document.querySelector('.patient-details-sidebar');
            const contentArea = document.querySelector('.patient-details-content');
            if (sidebar && contentArea) {
                sidebar.addEventListener('click', (e) => {
                    const link = e.target.closest('.tab-link');
                    if (!link || link.classList.contains('active')) return;
                    e.preventDefault();

                    sidebar.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');

                    const tabId = link.dataset.tab;
                    contentArea.querySelectorAll('.tab-pane').forEach(pane => {
                        pane.classList.add('hidden');
                    });
                    const activePane = document.getElementById(`tab-${tabId}`);
                    if(activePane) activePane.classList.remove('hidden');
                });
            }

            const formDados = document.getElementById('form-detalhes-paciente');
            formDados.addEventListener('submit', (e) => {
                e.preventDefault();
                const updatedData = {
                    nome: document.getElementById('pd-nome').value,
                    nascimento: document.getElementById('pd-nascimento').value,
                    cpf: document.getElementById('pd-cpf').value,
                    email: document.getElementById('pd-email').value,
                    telefone: document.getElementById('pd-telefone').value,
                    rg: document.getElementById('pd-rg').value,
                    lateralidade: document.getElementById('pd-lateralidade').value,
                    escolaridade: document.getElementById('pd-escolaridade').value,
                    genero: document.getElementById('pd-genero').value,
                    tipoEscola: document.getElementById('pd-tipo-escola').value,
                    planoSaude: document.getElementById('pd-plano-saude').value,
                    responsavel1: document.getElementById('pd-responsavel1').value,
                    responsavel1_tel: document.getElementById('pd-responsavel1-tel').value,
                    responsavel2: document.getElementById('pd-responsavel2').value,
                    responsavel2_tel: document.getElementById('pd-responsavel2-tel').value,
                };
                pacienteRef.update(updatedData)
                    .then(() => alert("Dados do paciente atualizados com sucesso!"))
                    .catch(err => alert("Erro ao atualizar dados: " + err.message));
            });
            
            const formEndereco = document.getElementById('form-endereco-paciente');
            formEndereco.addEventListener('submit', (e) => {
                e.preventDefault();
                const enderecoData = {
                    cep: document.getElementById('pd-cep').value,
                    rua: document.getElementById('pd-rua').value,
                    numero: document.getElementById('pd-numero').value,
                    bairro: document.getElementById('pd-bairro').value,
                    cidade: document.getElementById('pd-cidade').value,
                    estado: document.getElementById('pd-estado').value,
                };
                 pacienteRef.set({ endereco: enderecoData }, { merge: true })
                    .then(() => alert("Endereço atualizado com sucesso!"))
                    .catch(err => alert("Erro ao atualizar endereço: " + err.message));
            });
            
            const cepInput = document.getElementById('pd-cep');
            if (cepInput) {
                cepInput.addEventListener('input', async (e) => {
                    let cepValue = e.target.value.replace(/\D/g, ''); 
                     if (cepValue.length > 5) {
                        cepValue = cepValue.slice(0, 5) + '-' + cepValue.slice(5, 8);
                    }
                    e.target.value = cepValue;

                    const cleanCep = cepValue.replace('-', '');
                    if (cleanCep.length === 8) {
                        try {
                            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                            if (!response.ok) throw new Error('Falha na requisição');
                            const data = await response.json();
                            
                            const ruaInput = document.getElementById('pd-rua');
                            const bairroInput = document.getElementById('pd-bairro');
                            const cidadeInput = document.getElementById('pd-cidade');
                            const estadoInput = document.getElementById('pd-estado');
                            const numeroInput = document.getElementById('pd-numero');
                            
                            if (data.erro) {
                                console.warn('CEP não encontrado.');
                                ruaInput.value = '';
                                bairroInput.value = '';
                                cidadeInput.value = '';
                                estadoInput.value = '';
                            } else {
                                ruaInput.value = data.logouro || '';
                                bairroInput.value = data.bairro || '';
                                cidadeInput.value = data.localidade || '';
                                estadoInput.value = data.uf || '';
                                numeroInput.focus(); 
                            }
                        } catch (error) {
                            console.error("Erro ao buscar CEP:", error);
                        }
                    }
                });
            }
        },
        'configuracoes-laudo': () => {
            const saveButton = document.getElementById('save-config-btn');
            const logoUploadInput = document.getElementById('logo-upload-input');
            const logoPreviewContainer = document.getElementById('logo-preview-container');
            const logoInitials = document.getElementById('logo-initials');

            const CONFIG_KEY = 'configuracoesLaudoGlobal';
            let configData = {}; 

            const loadConfig = () => {
                const storedConfig = localStorage.getItem(CONFIG_KEY);
                if (storedConfig) {
                    configData = JSON.parse(storedConfig);
                } else {
                    configData = {
                        logoBase64: null,
                        nomeProfissional: '',
                        crp: '',
                        mostrarCrp: true,
                        email: '',
                        telefone: ''
                    };
                }

                document.getElementById('prof-name').value = configData.nomeProfissional || '';
                document.getElementById('prof-crp').value = configData.crp || '';
                document.getElementById('show-crp').checked = configData.mostrarCrp;
                document.getElementById('prof-email').value = configData.email || '';
                document.getElementById('prof-phone').value = configData.telefone || '';

                if (configData.logoBase64) {
                    logoInitials.style.display = 'none';
                    logoPreviewContainer.innerHTML = `<img src="${configData.logoBase64}" alt="Logo Preview">`;
                } else {
                    logoInitials.style.display = 'flex';
                    logoPreviewContainer.innerHTML = '';
                    logoPreviewContainer.appendChild(logoInitials);
                }
            };
            
            const saveConfig = () => {
                configData.nomeProfissional = document.getElementById('prof-name').value;
                configData.crp = document.getElementById('prof-crp').value;
                configData.mostrarCrp = document.getElementById('show-crp').checked;
                configData.email = document.getElementById('prof-email').value;
                configData.telefone = document.getElementById('prof-phone').value;
                
                localStorage.setItem(CONFIG_KEY, JSON.stringify(configData));
                alert("Configurações salvas com sucesso!");
            };

            logoUploadInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        configData.logoBase64 = e.target.result;
                        logoInitials.style.display = 'none';
                        logoPreviewContainer.innerHTML = `<img src="${configData.logoBase64}" alt="Logo Preview">`;
                    };
                    reader.readAsDataURL(file);
                }
            });

            saveButton.addEventListener('click', saveConfig);
            
            loadConfig();
        },
        'preenchimento-laudo': (laudoId) => {
            const db = FSLaudosApp.db;
            if (!db) { console.error("DB não está definido no Preenchimento de Laudo."); return; }
            
            const { testForms, baremos } = FSLaudosApp;

            if (!laudoId) {
                document.getElementById('app-content').innerHTML = '<h1>ID do laudo não fornecido.</h1>';
                return;
            }

            const laudoRef = db.collection('laudos').doc(laudoId);
            const appContent = document.getElementById('app-content');
            let laudoDataAtual = {};
            let chaveTesteAtiva = '';

            const renderContentPane = (tabName) => {
                destroyActiveChart(); 
                const content = document.getElementById('preenchimento-content');
                if (!content) return;
                
                if (!chaveTesteAtiva) {
                    content.innerHTML = '<div class="main-card"><p>Selecione um teste na barra lateral para começar.</p></div>';
                    return;
                }
                const formConfig = testForms[chaveTesteAtiva];
                if (!formConfig) {
                    content.innerHTML = `<div class="main-card"><p>Configuração para ${chaveTesteAtiva} não encontrada.</p></div>`;
                    return;
                }
                
                if (tabName === 'teste') {
                    content.innerHTML = FSLaudosApp.gerarHtmlDoFormulario(chaveTesteAtiva);
                    
                    if (chaveTesteAtiva === 'SRS2EscolarMasc' || chaveTesteAtiva === 'SRS2EscolarFem') {
                        const { SRS2Data } = FSLaudosApp.testData;
                        
                        const updateSrs2Calculations = () => {
                             const pontos = {};
                             const valores = {};

                             for(let i = 1; i <= 65; i++) {
                                const valorInput = document.getElementById(`srs2-q${i}-valor`);
                                const pontosInput = document.getElementById(`srs2-q${i}-pontos`);
                                const valor = parseInt(valorInput.value, 10);
                                
                                valores[`q${i}_valor`] = valorInput.value;

                                if (valor >= 1 && valor <= 4) {
                                    const isReverse = SRS2Data.reverseScoredItems.includes(i);
                                    const srsScore = isReverse ? (4 - valor) : (valor - 1);
                                    pontos[`q${i}_pontos`] = srsScore;
                                    if (pontosInput) pontosInput.value = srsScore;
                                } else {
                                    pontos[`q${i}_pontos`] = '';
                                    if (pontosInput) pontosInput.value = '';
                                }
                             }
                             
                             const rawScores = {};
                             for (const subscale in SRS2Data.subscaleItems) {
                                rawScores[subscale] = SRS2Data.subscaleItems[subscale].reduce((sum, itemNum) => sum + (parseInt(pontos[`q${itemNum}_pontos`],10) || 0), 0);
                             }

                             rawScores.comunicacaoInteracao = rawScores.percepcaoSocial + rawScores.cognicaoSocial + rawScores.comunicacaoSocial + rawScores.motivacaoSocial;
                             rawScores.total = rawScores.comunicacaoInteracao + rawScores.padroesRepetitivos;

                             formConfig.subscales.forEach(sub => {
                                const rawScore = rawScores[sub.id] || 0;
                                const tScore = baremos.getSrs2TScore(sub.id, rawScore);
                                const classification = baremos.getSrs2Classification(tScore);

                                document.getElementById(`srs2-raw-${sub.id}`).textContent = rawScore;
                                document.getElementById(`srs2-tscore-${sub.id}`).textContent = tScore;
                                document.getElementById(`srs2-class-${sub.id}`).textContent = classification;
                             });
                        };
                        
                        content.querySelector('.srs2-questions-grid').addEventListener('input', (e) => {
                            if (e.target.classList.contains('srs2-item-valor')) {
                                updateSrs2Calculations();
                            }
                        });

                        const testData = laudoDataAtual.resultados?.[chaveTesteAtiva]?.pontos || {};
                        for (let i = 1; i <= 65; i++) {
                            const input = content.querySelector(`#srs2-q${i}-valor`);
                            if (input && testData[`q${i}_valor`] !== undefined) {
                                input.value = testData[`q${i}_valor`];
                            }
                        }
                        updateSrs2Calculations();

                    } else if (chaveTesteAtiva === 'BPA2') {
                        const updateAgScoreAndClassification = () => {
                            const acScore = parseInt(document.getElementById(`${chaveTesteAtiva}-ac`).value, 10) || 0;
                            const adScore = parseInt(document.getElementById(`${chaveTesteAtiva}-ad`).value, 10) || 0;
                            const aaScore = parseInt(document.getElementById(`${chaveTesteAtiva}-aa`).value, 10) || 0;
                            const totalAgScore = acScore + adScore + aaScore;
                            const agScoreInput = document.getElementById(`${chaveTesteAtiva}-ag`);
                            const agPercentilCell = document.getElementById(`percentil-${chaveTesteAtiva}-ag`);
                            const agClassifCell = document.getElementById(`classificacao-${chaveTesteAtiva}-ag`);
                            if (agScoreInput) {
                                agScoreInput.value = totalAgScore;
                            }
                            const ageInYears = FSLaudosApp.calculateAgeInYearsAtDate(laudoDataAtual.pacienteNascimento, laudoDataAtual.dataAplicacao);
                            if (ageInYears !== null && agPercentilCell && agClassifCell) {
                                const ageGroupKey = baremos.getAgeGroupKeyBPA2(ageInYears);
                                if (ageGroupKey) {
                                    const result = baremos.getBpa2Classification(ageGroupKey, 'ag', totalAgScore);
                                    agPercentilCell.textContent = result.percentile;
                                    agClassifCell.textContent = result.classification;
                                } else {
                                    agPercentilCell.textContent = '-';
                                    agClassifCell.textContent = 'Idade fora da faixa';
                                }
                            }
                        };
                        ['ac', 'ad', 'aa'].forEach(subtestId => {
                            const inputElement = document.getElementById(`${chaveTesteAtiva}-${subtestId}`);
                            if (inputElement) {
                                inputElement.addEventListener('input', updateAgScoreAndClassification);
                            }
                        });
                        content.querySelectorAll('.test-input').forEach(input => {
                            const field = input.dataset.field;
                            if (field === 'ag') return;
                            input.addEventListener('input', (e) => {
                                const score = e.target.value;
                                const ageInYears = FSLaudosApp.calculateAgeInYearsAtDate(laudoDataAtual.pacienteNascimento, laudoDataAtual.dataAplicacao);
                                const percentilCell = document.getElementById(`percentil-${chaveTesteAtiva}-${field}`);
                                const classifCell = document.getElementById(`classificacao-${chaveTesteAtiva}-${field}`);
                                if (ageInYears !== null && score.trim() !== '' && percentilCell && classifCell) {
                                    const ageGroupKey = baremos.getAgeGroupKeyBPA2(ageInYears);
                                    if (ageGroupKey) {
                                        const result = baremos.getBpa2Classification(ageGroupKey, field, score);
                                        percentilCell.textContent = result.percentile;
                                        classifCell.textContent = result.classification;
                                    } else if (percentilCell && classifCell) {
                                        percentilCell.textContent = '-';
                                        classifCell.textContent = 'Idade fora da faixa';
                                    }
                                } else if (percentilCell && classifCell) {
                                    percentilCell.textContent = '-';
                                    classifCell.textContent = '-';
                                }
                            });
                        });
                        const testData = laudoDataAtual.resultados?.[chaveTesteAtiva]?.pontos;
                        if (testData) {
                            content.querySelectorAll('.test-input').forEach(input => {
                                const field = input.dataset.field;
                                if (field !== 'ag' && testData[field] !== undefined && testData[field] !== null) {
                                    input.value = testData[field];
                                    input.dispatchEvent(new Event('input', { bubbles: true }));
                                }
                            });
                            updateAgScoreAndClassification(); 
                        }
                    } else if (chaveTesteAtiva === 'WiscIV') {
                        const updateWiscCalculations = () => {
                            const patientAge = FSLaudosApp.calculatePreciseAge(laudoDataAtual.pacienteNascimento, laudoDataAtual.dataAplicacao);
                            const weightedScores = {};
                            
                            formConfig.subtests.forEach(sub => {
                                const rawInput = document.getElementById(`wisc-raw-${sub.id}`);
                                const rawScore = rawInput ? rawInput.value : '';
                                const result = baremos.getWiscWeightedScore(sub.id, rawScore, patientAge);
                                
                                const pondCell = document.getElementById(`wisc-pond-${sub.id}`);
                                const classCell = document.getElementById(`wisc-subclass-${sub.id}`);
                                if (pondCell) pondCell.textContent = result.weighted;
                                if (classCell) classCell.textContent = result.classification;

                                if (result.weighted !== '') {
                                    weightedScores[sub.id] = parseInt(result.weighted, 10);
                                }
                            });

                            const mainSubtestsForSum = {
                                compreensaoVerbal: ['semelhancas', 'vocabulario', 'compreensao'],
                                organizacaoPerceptual: ['cubos', 'conceitosFigurativos', 'raciocinioMatricial'],
                                memoriaOperacional: ['digitos', 'sequenciaNumerosLetras'],
                                velocidadeProcessamento: ['codigo', 'procurarSimbolos']
                            };
                            
                            let qiTotalSum = 0;
                            formConfig.compositeScales.forEach(scale => {
                                if (scale.id === 'qiTotal') return;

                                const sum = (mainSubtestsForSum[scale.id] || [])
                                    .reduce((acc, subId) => acc + (weightedScores[subId] || 0), 0);
                                
                                if (scale.id !== 'qiTotal') {
                                    qiTotalSum += sum;
                                }

                                const sumCell = document.getElementById(`wisc-sum-${scale.id}`);
                                if (sumCell) sumCell.textContent = sum > 0 ? sum : '';

                                const result = baremos.getWiscCompositeScore(scale.id, sum);
                                document.getElementById(`wisc-comp-${scale.id}`).textContent = result.composite;
                                document.getElementById(`wisc-perc-${scale.id}`).textContent = result.percentile;
                                document.getElementById(`wisc-ci90-${scale.id}`).textContent = result.ci_90;
                                document.getElementById(`wisc-ci95-${scale.id}`).textContent = result.ci_95;
                                document.getElementById(`wisc-class-${scale.id}`).textContent = result.classification;
                            });

                            const qiSumCell = document.getElementById('wisc-sum-qiTotal');
                            if (qiSumCell) qiSumCell.textContent = qiTotalSum > 0 ? qiTotalSum : '';
                            const qiResult = baremos.getWiscCompositeScore('qiTotal', qiTotalSum);
                            document.getElementById('wisc-comp-qiTotal').textContent = qiResult.composite;
                            document.getElementById('wisc-perc-qiTotal').textContent = qiResult.percentile;
                            document.getElementById('wisc-ci90-qiTotal').textContent = qiResult.ci_90;
                            document.getElementById('wisc-ci95-qiTotal').textContent = qiResult.ci_95;
                            document.getElementById('wisc-class-qiTotal').textContent = qiResult.classification;
                        };

                        const testData = laudoDataAtual.resultados?.[chaveTesteAtiva]?.pontos || {};
                        content.querySelectorAll('.wisc-raw-score').forEach(input => {
                            const field = input.dataset.field;
                            if (testData[field] !== undefined && testData[field] !== null) {
                                input.value = testData[field];
                            }
                            input.addEventListener('input', updateWiscCalculations);
                        });
                        updateWiscCalculations(); 
                    } else if (chaveTesteAtiva === 'RAVLT') {
                        const updateRavltCalculations = () => {
                            const get = (id) => parseFloat(document.getElementById(`ravlt-${id}`)?.value) || 0;
                            const set = (id, val, baremType = 'default') => {
                                const field = document.getElementById(`ravlt-${id}`);
                                const percCell = document.getElementById(`percentil-ravlt-${id}`);
                                const classCell = document.getElementById(`classificacao-ravlt-${id}`);

                                if(field) field.value = isNaN(val) ? '' : (val % 1 !== 0 ? val.toFixed(2) : val);
                                
                                if (percCell && classCell) {
                                    const result = baremos.getRavltClassification(baremType, val);
                                    percCell.textContent = result.percentile;
                                    classCell.textContent = result.classification;
                                }
                            };

                            const a1 = get('A1'), a2 = get('A2'), a3 = get('A3'), a4 = get('A4'), a5 = get('A5');
                            const b1 = get('B1'), a6 = get('A6'), a7 = get('A7'), acertos = get('acertos');

                            const scoreTotal = a1 + a2 + a3 + a4 + a5;
                            const reconhecimento = acertos - 35;
                            const alt = scoreTotal - (5 * a1);
                            const velEsq = a6 !== 0 ? a7 / a6 : 0;
                            const intPro = a1 !== 0 ? b1 / a1 : 0;
                            const intRetro = a5 !== 0 ? a6 / a5 : 0;
                            
                            ['A1','A2','A3','A4','A5','B1','A6','A7'].forEach(id => set(id, get(id)));
                            set('acertos', acertos);

                            set('reconhecimento', reconhecimento, 'reconhecimento');
                            set('scoreTotal', scoreTotal);
                            set('alt', alt);
                            set('velEsq', velEsq, 'indices');
                            set('intPro', intPro, 'indices');
                            set('intRetro', intRetro, 'indices');
                        };

                        content.querySelectorAll('.ravlt-input-field').forEach(input => {
                            input.addEventListener('input', updateRavltCalculations);
                        });

                        const testData = laudoDataAtual.resultados?.[chaveTesteAtiva]?.pontos;
                        if (testData) {
                             content.querySelectorAll('.ravlt-input-field').forEach(input => {
                                const field = input.dataset.field;
                                if (testData[field] !== undefined && testData[field] !== null) {
                                    input.value = testData[field];
                                }
                            });
                        }
                        updateRavltCalculations();

                    } else if (chaveTesteAtiva === 'ETDAHAD') {
                        const FATOR_MAP = {
                            D: { start: 1, end: 18 },
                            I: { start: 19, end: 27 },
                            AE: { start: 28, end: 36 },
                            AAMA: { start: 37, end: 54 },
                            H: { start: 55, end: 69 }
                        };

                        const updateEtdahAdCalculations = () => {
                            const escolaridade = document.getElementById('etdah-escolaridade').value;
                            
                            formConfig.fatores.forEach(fator => {
                                const map = FATOR_MAP[fator.id];
                                let resultadoBruto = 0;
                                for (let i = map.start; i <= map.end; i++) {
                                    resultadoBruto += parseInt(document.getElementById(`etdah-q-${i}`).value, 10) || 0;
                                }

                                document.getElementById(`etdah-bruto-${fator.id}`).textContent = resultadoBruto;

                                const result = baremos.getEtdahAdClassification(escolaridade, fator.id, resultadoBruto);
                                document.getElementById(`etdah-percentil-${fator.id}`).textContent = result.percentile;
                                document.getElementById(`etdah-classificacao-${fator.id}`).textContent = result.classification;
                            });
                        };

                        content.querySelector('#etdah-perguntas-grid').addEventListener('input', updateEtdahAdCalculations);
                        content.querySelector('#etdah-escolaridade').addEventListener('change', updateEtdahAdCalculations);

                        const testData = laudoDataAtual.resultados?.[chaveTesteAtiva]?.pontos || {};
                        if (testData.escolaridade) {
                            content.querySelector('#etdah-escolaridade').value = testData.escolaridade;
                        }
                        for (let i = 1; i <= 69; i++) {
                            const input = content.querySelector(`#etdah-q-${i}`);
                            if (input && testData[`q${i}`] !== undefined) {
                                input.value = testData[`q${i}`];
                            }
                        }
                        updateEtdahAdCalculations();

                    } else { 
                        const testData = laudoDataAtual.resultados?.[chaveTesteAtiva]?.pontos;
                        if (testData) {
                             content.querySelectorAll('.test-input').forEach(input => {
                                const field = input.dataset.field;
                                if (testData[field] !== undefined) {
                                    input.value = testData[field];
                                }
                            });
                        }
                    }
                    
                    const saveButton = content.querySelector(`#salvar-parcial-${chaveTeste}`);
                    if (saveButton) {
                        saveButton.addEventListener('click', () => {
                            const dataToSave = {};
                            
                            const inputs = content.querySelectorAll('.test-input');
                            inputs.forEach(input => {
                                if (!input.disabled) {
                                    dataToSave[input.dataset.field] = input.type === 'number' ? (input.valueAsNumber || null) : input.value;
                                }
                            });
                            
                            const updatePath = `resultados.${chaveTesteAtiva}.pontos`;
                            laudoRef.update({ [updatePath]: dataToSave })
                                .then(() => {
                                    alert(`${formConfig.nomeExibicao}: Dados salvos com sucesso!`);
                                    // [CORREÇÃO] Força a recarga dos dados após salvar para garantir consistência
                                    laudoRef.get().then(doc => { laudoDataAtual = doc.data(); });
                                })
                                .catch(err => {
                                    console.error("Erro ao salvar dados parciais:", err);
                                    alert("Erro ao salvar os dados. Por favor, tente novamente.");
                                });
                        });
                    }
                } else if (tabName === 'resultados') {
                    if (chaveTesteAtiva === 'SRS2EscolarMasc' || chaveTesteAtiva === 'SRS2EscolarFem') {
                        content.innerHTML = testForms[chaveTesteAtiva].resultadosHtml;
                        const resultsContentArea = content.querySelector('#srs2-results-content-area');
                        
                        const getSrs2ResultsData = () => {
                             const pontos = laudoDataAtual.resultados?.[chaveTesteAtiva]?.pontos || {};
                             if (Object.keys(pontos).length === 0) return null;

                             const { SRS2Data } = baremos;
                             const srsPontos = {};
                             for(let i = 1; i <= 65; i++) {
                                srsPontos[`q${i}`] = parseInt(pontos[`q${i}_pontos`], 10) || 0;
                             }
                             
                             const rawScores = {};
                             for (const subscale in SRS2Data.subscaleItems) {
                                rawScores[subscale] = SRS2Data.subscaleItems[subscale].reduce((sum, itemNum) => sum + (srsPontos[`q${itemNum}`] || 0), 0);
                             }

                             rawScores.comunicacaoInteracao = rawScores.percepcaoSocial + rawScores.cognicaoSocial + rawScores.comunicacaoSocial + rawScores.motivacaoSocial;
                             rawScores.total = rawScores.comunicacaoInteracao + rawScores.padroesRepetitivos;
                             
                             const finalResults = formConfig.subscales.map(sub => {
                                const rawScore = rawScores[sub.id] || 0;
                                const tScore = baremos.getSrs2TScore(sub.id, rawScore);
                                const classification = baremos.getSrs2Classification(tScore);
                                return {
                                    label: sub.label,
                                    rawScore: rawScore,
                                    tScore: tScore,
                                    classification: classification
                                };
                            });

                            return finalResults;
                        };

                        const setupTabela = () => {
                            destroyActiveChart();
                            const data = getSrs2ResultsData();
                            if (!data) {
                                resultsContentArea.innerHTML = '<p style="text-align: center;">Preencha os pontos na aba "Teste" para gerar a tabela de resultados.</p>';
                                return;
                            }
                            const tableRows = data.map(d => `
                                <tr>
                                    <td>${d.label}</td>
                                    <td>${d.rawScore}</td>
                                    <td>${d.tScore}</td>
                                    <td>${d.classification}</td>
                                </tr>
                            `).join('');
                            resultsContentArea.innerHTML = `
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>Subescala</th><th>Pontos Brutos</th><th>Escore T</th><th>Classificação</th>
                                        </tr>
                                    </thead>
                                    <tbody>${tableRows}</tbody>
                                </table>`;
                        };
                        
                        const setupGrafico = () => {
                            destroyActiveChart();
                            const data = getSrs2ResultsData();
                             if (!data) {
                                resultsContentArea.innerHTML = '<p style="text-align: center;">Preencha os pontos na aba "Teste" para gerar o gráfico.</p>';
                                return;
                            }
                            
                            const chartLabels = data.map(d => d.label);
                            const chartData = data.map(d => d.tScore);
                            
                            resultsContentArea.innerHTML = `<div class="chart-wrapper">
                                <div class="chart-header">
                                    <h3>SRS-2<br><small style="font-weight: normal; color: #555;">Normal: < 59</small></h3>
                                    <button class="btn-icon" id="download-srs2-chart"><img src="https://img.icons8.com/ios-glyphs/24/000000/download.png" alt="Download"/></button>
                                </div>
                                <canvas id="srs2-chart"></canvas>
                            </div>`;

                            Chart.register(ChartDataLabels);
                            const ctx = document.getElementById('srs2-chart').getContext('2d');
                            activeChart = new Chart(ctx, {
                                type: 'bar',
                                data: {
                                    labels: chartLabels,
                                    datasets: [{
                                        label: 'Escore T',
                                        data: chartData,
                                        backgroundColor: '#5865F2'
                                    }]
                                },
                                options: {
                                    responsive: true,
                                    maintainAspectRatio: true,
                                    scales: { y: { beginAtZero: false, min: 20, max: 200 } },
                                    plugins: {
                                        legend: { display: false },
                                        datalabels: {
                                            anchor: 'end', align: 'top',
                                            font: { weight: 'bold', size: 14 },
                                            color: '#333'
                                        }
                                    }
                                }
                            });
                            document.getElementById('download-srs2-chart').onclick = () => {
                                const a = document.createElement('a');
                                a.href = activeChart.toBase64Image();
                                a.download = `grafico_srs2_${laudoDataAtual.pacienteNome.replace(/ /g, '_')}.png`;
                                a.click();
                            };
                        };

                        content.querySelector('#srs2-toggle-tabela').addEventListener('click', (e) => {
                            document.querySelectorAll('.btn-toggle').forEach(btn => btn.classList.remove('active'));
                            e.currentTarget.classList.add('active');
                            setupTabela();
                        });
                        content.querySelector('#srs2-toggle-grafico').addEventListener('click', (e) => {
                             document.querySelectorAll('.btn-toggle').forEach(btn => btn.classList.remove('active'));
                            e.currentTarget.classList.add('active');
                            setupGrafico();
                        });
                        setupTabela();
                    } else if (chaveTesteAtiva === 'WiscIV') {
                        content.innerHTML = testForms.WiscIV.resultadosHtml;
                        const resultsContentArea = content.querySelector('#wisc-results-content-area');
                        
                        const getWiscResultsData = () => {
                            const pontosBrutos = laudoDataAtual.resultados?.WiscIV?.pontos || {};
                            if (Object.keys(pontosBrutos).length === 0) return null;

                            const formConfig = testForms.WiscIV;
                             const patientAge = FSLaudosApp.calculatePreciseAge(laudoDataAtual.pacienteNascimento, laudoDataAtual.dataAplicacao);

                            const weightedScores = {};
                            formConfig.subtests.forEach(sub => {
                                const rawScore = pontosBrutos[sub.id];
                                const result = baremos.getWiscWeightedScore(sub.id, rawScore, patientAge);
                                if (result.weighted) {
                                    weightedScores[sub.id] = parseInt(result.weighted, 10);
                                }
                            });

                            const mainSubtestsForSum = {
                                compreensaoVerbal: ['semelhancas', 'vocabulario', 'compreensao'],
                                organizacaoPerceptual: ['cubos', 'conceitosFigurativos', 'raciocinioMatricial'],
                                memoriaOperacional: ['digitos', 'sequenciaNumerosLetras'],
                                velocidadeProcessamento: ['codigo', 'procurarSimbolos']
                            };

                            let qiTotalSum = 0;
                            const finalResults = formConfig.compositeScales.map(scale => {
                                if (scale.id === 'qiTotal') return null;
                                const sum = (mainSubtestsForSum[scale.id] || [])
                                    .reduce((acc, subId) => acc + (weightedScores[subId] || 0), 0);
                                qiTotalSum += sum;
                                const compositeResult = baremos.getWiscCompositeScore(scale.id, sum);
                                return { label: scale.label, id: scale.id, sum, ...compositeResult };
                            }).filter(r => r);

                            const qiResult = baremos.getWiscCompositeScore('qiTotal', qiTotalSum);
                            finalResults.push({ label: 'QI Total', id: 'qiTotal', sum: qiTotalSum, ...qiResult });

                            return finalResults;
                        };

                        const setupTabela = () => {
                            destroyActiveChart();
                            const data = getWiscResultsData();
                            if (!data) {
                                resultsContentArea.innerHTML = '<p style="text-align: center;">Preencha os pontos na aba "Teste" para gerar a tabela de resultados.</p>';
                                return;
                            }
                            const tableRows = data.map(d => `
                                <tr>
                                    <td>${d.label}</td>
                                    <td>${d.sum || ''}</td>
                                    <td>${d.composite || ''}</td>
                                    <td>${d.percentile || ''}</td>
                                    <td>${d.ci_90 || ''}</td>
                                    <td>${d.ci_95 || ''}</td>
                                    <td>${d.classification || ''}</td>
                                </tr>
                            `).join('');
                            resultsContentArea.innerHTML = `
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>Escala</th><th>Soma Pontos Ponderados</th><th>Ponto Composto</th>
                                            <th>Rank Percentil</th><th>IC 90%</th><th>IC 95%</th><th>Classificação</th>
                                        </tr>
                                    </thead>
                                    <tbody>${tableRows}</tbody>
                                </table>`;
                        };
                        
                        const setupGrafico = () => {
                            destroyActiveChart();
                            const data = getWiscResultsData();
                             if (!data) {
                                resultsContentArea.innerHTML = '<p style="text-align: center;">Preencha os pontos na aba "Teste" para gerar o gráfico.</p>';
                                return;
                            }
                            
                            const chartLabels = data.map(d => FSLaudosApp.testData.WiscIV.data.scaleAbbreviations[d.id]);
                            const chartData = data.map(d => d.composite);
                            
                            resultsContentArea.innerHTML = `<div class="chart-wrapper">
                                <div class="chart-header">
                                    <h3>Índices e QI - WISC IV</h3>
                                    <button class="btn-icon" id="download-wisc-chart"><img src="https://img.icons8.com/ios-glyphs/24/000000/download.png" alt="Download"/></button>
                                </div>
                                <canvas id="wisc-chart"></canvas>
                            </div>`;

                            Chart.register(ChartDataLabels);

                            const ctx = document.getElementById('wisc-chart').getContext('2d');
                            activeChart = new Chart(ctx, {
                                type: 'bar',
                                data: {
                                    labels: chartLabels,
                                    datasets: [{
                                        label: 'Pontos Compostos',
                                        data: chartData,
                                        backgroundColor: '#3b5998'
                                    }]
                                },
                                options: {
                                    responsive: true,
                                    maintainAspectRatio: true,
                                    scales: { y: { beginAtZero: false, min: 40, max: 160 } },
                                    plugins: {
                                        legend: { display: false },
                                        title: { display: false },
                                        datalabels: {
                                            anchor: 'end', align: 'top',
                                            font: { weight: 'bold', size: 14 },
                                            color: '#333'
                                        }
                                    }
                                }
                            });
                            document.getElementById('download-wisc-chart').onclick = () => {
                                const a = document.createElement('a');
                                a.href = activeChart.toBase64Image();
                                a.download = `grafico_wisciv_${laudoDataAtual.pacienteNome.replace(/ /g, '_')}.png`;
                                a.click();
                            };
                        };

                        content.querySelector('#wisc-toggle-tabela').addEventListener('click', (e) => {
                            document.querySelectorAll('.btn-toggle').forEach(btn => btn.classList.remove('active'));
                            e.currentTarget.classList.add('active');
                            setupTabela();
                        });
                        content.querySelector('#wisc-toggle-grafico').addEventListener('click', (e) => {
                             document.querySelectorAll('.btn-toggle').forEach(btn => btn.classList.remove('active'));
                            e.currentTarget.classList.add('active');
                            setupGrafico();
                        });

                        setupTabela();

                    } else if (chaveTesteAtiva === 'BPA2') {
                        content.innerHTML = testForms.BPA2.resultadosHtml;
                        const resultsContentArea = content.querySelector('#results-content-area');
                        const setupChart = () => {
                            destroyActiveChart();
                            resultsContentArea.innerHTML = `<div class="chart-wrapper"><div class="chart-header"><h3>BPA-2</h3></div><canvas id="bpa2-chart"></canvas></div>`;
                            
                            const ctx = document.getElementById('bpa2-chart');
                            if (!ctx) return;
                            const ageInYears = FSLaudosApp.calculateAgeInYearsAtDate(laudoDataAtual.pacienteNascimento, laudoDataAtual.dataAplicacao);
                            const ageGroupKey = baremos.getAgeGroupKeyBPA2(ageInYears);
                            const pontos = laudoDataAtual.resultados?.BPA2?.pontos;
                            if (!pontos || !ageGroupKey) {
                                resultsContentArea.innerHTML = '<div class="main-card" style="padding: 40px;"><p style="text-align: center;">Pontuações ou idade do paciente não são válidas para gerar o gráfico.</p></div>';
                                return;
                            }
                            const acScore = parseInt(pontos.ac) || 0;
                            const adScore = parseInt(pontos.ad) || 0;
                            const aaScore = parseInt(pontos.aa) || 0;
                            const agScore = acScore + adScore + aaScore;
                            const obtainedData = [ acScore, adScore, aaScore, agScore ];
                            const averageData = [ baremos.getBpa2AverageScore(ageGroupKey, 'ac'), baremos.getBpa2AverageScore(ageGroupKey, 'ad'), baremos.getBpa2AverageScore(ageGroupKey, 'aa'), baremos.getBpa2AverageScore(ageGroupKey, 'ag') ];
                            Chart.register(ChartDataLabels);
                            activeChart = new Chart(ctx.getContext('2d'), {
                                type: 'bar',
                                data: {
                                    labels: ['AC', 'AD', 'AA', 'AG'],
                                    datasets: [
                                        { label: 'Obtido', data: obtainedData, backgroundColor: '#4A80D5' }, 
                                        { label: 'Média', data: averageData, backgroundColor: '#8BC34A' }
                                    ]
                                },
                                options: {
                                    scales: { y: { beginAtZero: true } },
                                    responsive: true,
                                    maintainAspectRatio: true,
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
                        };
                        const setupTabela = () => {
                            destroyActiveChart();
                            if (!resultsContentArea) return;
                            const ageInYears = FSLaudosApp.calculateAgeInYearsAtDate(laudoDataAtual.pacienteNascimento, laudoDataAtual.dataAplicacao);
                            const ageGroupKey = ageInYears !== null ? baremos.getAgeGroupKeyBPA2(ageInYears) : null;
                            const pontos = laudoDataAtual.resultados?.BPA2?.pontos;
                            if (!pontos || !ageGroupKey) {
                                resultsContentArea.innerHTML = '<div class="main-card" style="padding: 40px;"><p style="text-align: center;">Preencha os pontos na aba "Teste" para gerar a tabela de resultados.</p></div>';
                                return;
                            }
                            const acScore = parseInt(pontos.ac, 10) || 0;
                            const adScore = parseInt(pontos.ad, 10) || 0;
                            const aaScore = parseInt(pontos.aa, 10) || 0;
                            const agScore = acScore + adScore + aaScore;
                            const resultsData = [
                                { id: 'ac', label: 'Atenção Concentrada - AC', score: acScore },
                                { id: 'ad', label: 'Atenção Dividida - AD', score: adScore },
                                { id: 'aa', label: 'Atenção Alternada - AA', score: aaScore },
                                { id: 'ag', label: 'Atenção Geral - AG', score: agScore }
                            ];
                            const tableRowsHtml = resultsData.map(item => {
                                const result = baremos.getBpa2Classification(ageGroupKey, item.id, item.score);
                                return `<tr><td>${item.label}</td><td>${item.score}</td><td>${result.percentile}</td><td>${result.classification}</td></tr>`;
                            }).join('');
                            const tableHtml = `<div class="main-card" style="padding: 0;"><table class="data-table"><thead><tr><th>Instrumento Utilizado</th><th>Pontos</th><th>Percentil</th><th>Classificação</th></tr></thead><tbody>${tableRowsHtml}</tbody></table></div>`;
                            resultsContentArea.innerHTML = tableHtml;
                        };
                        content.querySelector('#toggle-tabela').addEventListener('click', (e) => {
                            document.querySelectorAll('.btn-toggle').forEach(btn => btn.classList.remove('active'));
                            e.currentTarget.classList.add('active');
                            setupTabela();
                        });
                        content.querySelector('#toggle-grafico').addEventListener('click', (e) => {
                            document.querySelectorAll('.btn-toggle').forEach(btn => btn.classList.remove('active'));
                            e.currentTarget.classList.add('active');
                            setupChart();
                        });
                        setupTabela();
                    } else if (chaveTesteAtiva === 'RAVLT') {
                        content.innerHTML = testForms.RAVLT.resultadosHtml;
                        const resultsContentArea = content.querySelector('#ravlt-results-content-area');
                        
                        const getRavltCalculatedData = () => {
                            const pontos = laudoDataAtual.resultados?.RAVLT?.pontos || {};
                            const get = (id) => parseFloat(pontos[id]) || 0;
                            const a1=get('A1'), a2=get('A2'), a3=get('A3'), a4=get('A4'), a5=get('A5');
                            const b1=get('B1'), a6=get('A6'), a7=get('A7'), acertos=get('acertos');

                            const scoreTotal = a1+a2+a3+a4+a5;
                            return {
                                A1: a1, A2: a2, A3: a3, A4: a4, A5: a5, B1: b1, A6: a6, A7: a7,
                                Reconhecimento: acertos - 35,
                                ALT: scoreTotal - (5 * a1),
                                'Vel. Esquecimento': a6 !== 0 ? a7 / a6 : 0,
                                'Int. Proativa': a1 !== 0 ? b1 / a1 : 0,
                                'Int. Retroativa': a5 !== 0 ? a6 / a5 : 0,
                            };
                        };

                        const setupTabela = () => {
                             destroyActiveChart();
                             const pontos = laudoDataAtual.resultados?.RAVLT?.pontos;
                             if (!pontos || Object.keys(pontos).length === 0) {
                                resultsContentArea.innerHTML = '<p style="text-align: center;">Preencha os pontos na aba "Teste" para gerar a tabela de resultados.</p>';
                                return;
                             }
                            resultsContentArea.innerHTML = FSLaudosApp.gerarHtmlDoFormulario('RAVLT').replace(/<button.*<\/button>/g, '');
                            
                            document.querySelectorAll('#ravlt-results-content-area input').forEach(input => {
                                input.disabled = true;
                                input.style.background = 'transparent';
                                input.style.border = 'none';
                                input.style.fontWeight = 'bold';
                            });

                             const testData = laudoDataAtual.resultados?.RAVLT?.pontos || {};
                             Object.keys(testData).forEach(field => {
                                const input = document.querySelector(`#ravlt-results-content-area #ravlt-${field}`);
                                if (input) input.value = testData[field];
                             });

                            const get = (id) => parseFloat(testData[id]) || 0;
                            const set = (id, val, baremType = 'default') => {
                                const field = document.querySelector(`#ravlt-results-content-area #ravlt-${id}`);
                                const percCell = document.querySelector(`#ravlt-results-content-area #percentil-ravlt-${id}`);
                                const classCell = document.querySelector(`#ravlt-results-content-area #classificacao-ravlt-${id}`);
                                if(field) field.value = isNaN(val) ? '' : (val % 1 !== 0 ? val.toFixed(2) : val);
                                if (percCell && classCell) {
                                    const result = baremos.getRavltClassification(baremType, val);
                                    percCell.textContent = result.percentile;
                                    classCell.textContent = result.classification;
                                }
                            };
                            const a1=get('A1'), a2=get('A2'), a3=get('A3'), a4=get('A4'), a5=get('A5');
                            const b1=get('B1'), a6=get('A6'), a7=get('A7'), acertos=get('acertos');
                            ['A1','A2','A3','A4','A5','B1','A6','A7'].forEach(id => set(id, get(id)));
                            set('acertos', acertos);
                            const scoreTotal = a1+a2+a3+a4+a5;
                            set('reconhecimento', acertos - 35, 'reconhecimento');
                            set('scoreTotal', scoreTotal);
                            set('alt', scoreTotal - (5 * a1));
                            set('velEsq', a6 !== 0 ? a7 / a6 : 0, 'indices');
                            set('intPro', a1 !== 0 ? b1 / a1 : 0, 'indices');
                            set('intRetro', a5 !== 0 ? a6 / a5 : 0, 'indices');
                        };

                        const setupGrafico = () => {
                            destroyActiveChart();
                            const pontos = laudoDataAtual.resultados?.RAVLT?.pontos;
                             if (!pontos || Object.keys(pontos).length === 0) {
                                resultsContentArea.innerHTML = '<p style="text-align: center;">Preencha os pontos na aba "Teste" para gerar o gráfico.</p>';
                                return;
                             }
                            
                            const obtainedDataFull = getRavltCalculatedData();
                            const obtainedDataForChart = baremos.RAVLTData.graphData.labels.map(label => {
                                const value = obtainedDataFull[label];
                                return value % 1 !== 0 ? parseFloat(value.toFixed(2)) : value;
                            });

                            resultsContentArea.innerHTML = `<div class="chart-wrapper"><div class="chart-header"><h3>RAVLT</h3></div><canvas id="ravlt-chart"></canvas></div>`;

                            const ctx = document.getElementById('ravlt-chart').getContext('2d');
                            activeChart = new Chart(ctx, {
                                type: 'line',
                                data: {
                                    labels: baremos.RAVLTData.graphData.labels,
                                    datasets: [
                                        { label: 'Mínimo', data: baremos.RAVLTData.graphData.minimo, borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.5)', tension: 0.1, fill: false },
                                        { label: 'Esperado', data: baremos.RAVLTData.graphData.esperado, borderColor: 'rgb(54, 162, 235)', backgroundColor: 'rgba(54, 162, 235, 0.5)', tension: 0.1, fill: false },
                                        { label: 'Obtido', data: obtainedDataForChart, borderColor: 'rgb(255, 205, 86)', backgroundColor: 'rgba(255, 205, 86, 0.5)', tension: 0.1, fill: false }
                                    ]
                                },
                                options: {
                                    responsive: true,
                                    maintainAspectRatio: true,
                                    scales: { y: { suggestedMin: -40, suggestedMax: 20 } },
                                    plugins: { legend: { position: 'top' } }
                                }
                            });
                        };

                        content.querySelector('#ravlt-toggle-tabela').addEventListener('click', (e) => {
                            document.querySelectorAll('.btn-toggle').forEach(btn => btn.classList.remove('active'));
                            e.currentTarget.classList.add('active');
                            setupTabela();
                        });
                        content.querySelector('#ravlt-toggle-grafico').addEventListener('click', (e) => {
                             document.querySelectorAll('.btn-toggle').forEach(btn => btn.classList.remove('active'));
                            e.currentTarget.classList.add('active');
                            setupGrafico();
                        });

                        setupTabela();

                    } else if (chaveTesteAtiva === 'ETDAHAD') {
                        content.innerHTML = testForms.ETDAHAD.resultadosHtml;
                        const resultsContentArea = content.querySelector('#etdah-results-content-area');
                        
                        const getEtdahResultsData = () => {
                            const pontos = laudoDataAtual.resultados?.ETDAHAD?.pontos;
                            if (!pontos) return null;
                            
                            const FATOR_MAP = { D: { s: 1, e: 18 }, I: { s: 19, e: 27 }, AE: { s: 28, e: 36 }, AAMA: { s: 37, e: 54 }, H: { s: 55, e: 69 } };
                            const calculatedScores = {};

                            Object.keys(FATOR_MAP).forEach(fatorId => {
                                let score = 0;
                                for (let i = FATOR_MAP[fatorId].s; i <= FATOR_MAP[fatorId].e; i++) {
                                    score += parseInt(pontos[`q${i}`], 10) || 0;
                                }
                                const classification = baremos.getEtdahAdClassification(pontos.escolaridade, fatorId, score);
                                calculatedScores[fatorId] = { score, ...classification };
                            });
                            return calculatedScores;
                        };
                        
                        const setupTabela = () => {
                            destroyActiveChart();
                            const data = getEtdahResultsData();
                            if (!data) {
                                resultsContentArea.innerHTML = '<p style="text-align: center;">Preencha os pontos na aba "Teste" para gerar a tabela de resultados.</p>';
                                return;
                            }
                            const tableRows = formConfig.fatores.map(fator => {
                                const result = data[fator.id] || {};
                                return `<tr><td>${fator.label}</td><td>${result.score ?? '-'}</td><td>${result.percentile ?? '-'}</td><td>${result.classification ?? '-'}</td></tr>`;
                            }).join('');
                            resultsContentArea.innerHTML = `<table class="data-table"><thead><tr><th>Fator</th><th>Resultado Bruto</th><th>Percentil</th><th>Classificação</th></tr></thead><tbody>${tableRows}</tbody></table>`;
                        };

                        const setupGrafico = () => {
                            destroyActiveChart();
                            const data = getEtdahResultsData();
                            if (!data) {
                                resultsContentArea.innerHTML = '<p style="text-align: center;">Preencha os pontos na aba "Teste" para gerar o gráfico.</p>';
                                return;
                            }
                            
                            const chartLabels = formConfig.fatores.map(f => f.id);
                            const chartData = chartLabels.map(id => data[id]?.score || 0);

                            resultsContentArea.innerHTML = `<div class="chart-wrapper"><div class="chart-header"><h3>ETDAH-AD</h3><button class="btn-icon" id="download-etdah-chart"><img src="https://img.icons8.com/ios-glyphs/24/000000/download.png" alt="Download"/></button></div><canvas id="etdah-ad-chart"></canvas></div>`;

                            const ctx = document.getElementById('etdah-ad-chart').getContext('2d');
                            activeChart = new Chart(ctx, {
                                type: 'bar',
                                data: {
                                    labels: chartLabels,
                                    datasets: [{
                                        label: 'Resultado Bruto',
                                        data: chartData,
                                        backgroundColor: '#3b5998'
                                    }]
                                },
                                options: {
                                    responsive: true, 
                                    maintainAspectRatio: true,
                                    scales: { y: { beginAtZero: true, suggestedMax: 70 } },
                                    plugins: { legend: { display: false }, datalabels: { anchor: 'end', align: 'top', font: { weight: 'bold' }, color: '#333' } }
                                }
                            });
                             document.getElementById('download-etdah-chart').onclick = () => {
                                const a = document.createElement('a');
                                a.href = activeChart.toBase64Image();
                                a.download = `grafico_etdah-ad_${laudoDataAtual.pacienteNome.replace(/ /g, '_')}.png`;
                                a.click();
                            };
                        };
                        
                        content.querySelector('#etdah-toggle-tabela').addEventListener('click', (e) => {
                            document.querySelectorAll('.btn-toggle').forEach(btn => btn.classList.remove('active'));
                            e.currentTarget.classList.add('active');
                            setupTabela();
                        });
                        content.querySelector('#etdah-toggle-grafico').addEventListener('click', (e) => {
                             document.querySelectorAll('.btn-toggle').forEach(btn => btn.classList.remove('active'));
                            e.currentTarget.classList.add('active');
                            setupGrafico();
                        });

                        setupTabela();

                    } else {
                        content.innerHTML = formConfig.resultadosHtml || '<div class="main-card"><p>Nenhum resultado para exibir.</p></div>';
                    }
                } else if (tabName === 'detalhes') {
                    content.innerHTML = formConfig.detalhesHtml || '<div class="main-card"><p>Nenhum detalhe adicional.</p></div>';
                }
            };

            const setActiveTest = (chave) => {
                chaveTesteAtiva = chave;
                document.querySelectorAll('#page-tabs-container .test-tab-link').forEach(l => l.classList.remove('active'));
                document.querySelector('#page-tabs-container [data-tab-content="teste"]').classList.add('active');
                document.querySelectorAll('#testes-sidebar .tab-link').forEach(l => l.classList.remove('active'));
                const sidebarLink = document.querySelector(`#testes-sidebar [data-testid="${chave}"]`);
                if (sidebarLink) sidebarLink.classList.add('active');
                renderContentPane('teste');
            };
            
            laudoRef.onSnapshot((doc) => {
                if (!doc.exists) {
                    appContent.innerHTML = '<h1>Laudo não encontrado.</h1>';
                    return;
                }
                laudoDataAtual = doc.data();
                const headerNome = document.getElementById('header-nome-paciente');
                const headerIdade = document.getElementById('header-idade-paciente');
                const sidebar = document.getElementById('testes-sidebar');
                const exportBtn = document.getElementById('export-laudo-btn');
                if (headerNome) headerNome.textContent = laudoDataAtual.pacienteNome || "Paciente sem nome";
                if (headerIdade) {
                     const idadeString = FSLaudosApp.calculateAgeInYearsAndMonths(laudoDataAtual.pacienteNascimento, laudoDataAtual.dataAplicacao) || 'inválida';
                     const preciseAge = FSLaudosApp.calculatePreciseAge(laudoDataAtual.pacienteNascimento, laudoDataAtual.dataAplicacao);
                     const preciseAgeString = preciseAge ? `(${preciseAge.years}a, ${preciseAge.months}m, ${preciseAge.days}d)` : '';
                     headerIdade.textContent = `Idade na Aplicação: ${idadeString} ${preciseAgeString}`;
                }
                if (sidebar) {
                    sidebar.innerHTML = `<ul>${(laudoDataAtual.testes || []).map(ch => `<li><a href="#" class="tab-link" data-testid="${ch}">${testForms[ch]?.nomeExibicao || 'Desconhecido'}</a></li>`).join('')}</ul><button id="open-add-test-modal" class="btn btn-secondary btn-add-test">+ Adicionar teste</button>`;
                }
                if (exportBtn) {
                    const newExportBtn = exportBtn.cloneNode(true);
                    exportBtn.parentNode.replaceChild(newExportBtn, exportBtn);
                    newExportBtn.addEventListener('click', () => FSLaudosApp.handleExportClick(laudoRef));
                    newExportBtn.disabled = false;
                    newExportBtn.innerHTML = `<img src="https://img.icons8.com/ios-glyphs/20/000000/download.png" alt="Download" style="opacity: 0.7;"/> Exportar Laudo`;
                }
                if (laudoDataAtual.testes && laudoDataAtual.testes.length > 0) {
                    if (!chaveTesteAtiva || !laudoDataAtual.testes.includes(chaveTesteAtiva)) {
                        setActiveTest(laudoDataAtual.testes[0]);
                    } else {
                        const activeTabName = document.querySelector('#page-tabs-container .active')?.dataset.tabContent || 'teste';
                        renderContentPane(activeTabName);
                    }
                } else {
                    chaveTesteAtiva = '';
                    renderContentPane('teste');
                }
            }, (error) => {
                console.error("Erro ao buscar laudo: ", error);
                appContent.innerHTML = '<h1>Erro ao carregar o laudo.</h1>';
            });

            appContent.addEventListener('click', e => {
                const sidebarLink = e.target.closest('#testes-sidebar .tab-link');
                const tabLink = e.target.closest('#page-tabs-container .test-tab-link');

                if (sidebarLink && !sidebarLink.classList.contains('active')) {
                    e.preventDefault();
                    setActiveTest(sidebarLink.dataset.testid);
                }
                if (tabLink && !tabLink.classList.contains('active')) {
                    e.preventDefault();
                    document.querySelectorAll('#page-tabs-container .test-tab-link').forEach(l => l.classList.remove('active'));
                    tabLink.classList.add('active');
                    renderContentPane(tabLink.dataset.tabContent);
                }
            });
        },
    };
})();