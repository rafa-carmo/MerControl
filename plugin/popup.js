// Popup JavaScript para Web Scraper Pro

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Popup carregado');

    // Elementos do DOM
    const elements = {
        // Tabs
        tabButtons: document.querySelectorAll('.tab-button'),
        tabContents: document.querySelectorAll('.tab-content'),

        // Status
        statusIndicator: document.getElementById('status-indicator'),
        statusText: document.getElementById('status-text'),

        // Scraper tab
        // targetUrl: document.getElementById('target-url'),
        // cssSelector: document.getElementById('css-selector'),
        scrapeCurrentBtn: document.getElementById('scrape-current'),
        scrapeTargetBtn: document.getElementById('scrape-target'),
        resultsSection: document.getElementById('results-section'),
        resultsContent: document.getElementById('results-content'),
        sendToApiBtn: document.getElementById('send-to-api'),

        // Config tab
        apiUrl: document.getElementById('api-url'),
        apiToken: document.getElementById('api-token'),
        requestMethod: document.getElementById('request-method'),
        toggleToken: document.getElementById('toggle-token'),
        testConnectionBtn: document.getElementById('test-connection'),
        saveConfigBtn: document.getElementById('save-config'),

        // Notification
        notification: document.getElementById('notification'),
        notificationText: document.getElementById('notification-text'),
        closeNotification: document.getElementById('close-notification')
    };

    // Estado da aplicação
    let currentData = null;
    let currentUrl = null;

    // Inicializar interface
    await initializeInterface();

    // Event listeners
    setupEventListeners();

    // Funções de inicialização
    async function initializeInterface() {
        try {
            // Carregar configurações salvas
            const config = await chrome.storage.sync.get([
                'apiUrl', 'apiToken', 'requestMethod', 'targetUrl', 'cssSelector'
            ]);

            // Preencher campos de configuração
            if (config.apiUrl) elements.apiUrl.value = config.apiUrl;
            if (config.apiToken) elements.apiToken.value = config.apiToken;
            if (config.requestMethod) elements.requestMethod.value = config.requestMethod;
            // if (config.targetUrl) elements.targetUrl.value = config.targetUrl;
            // if (config.cssSelector) elements.cssSelector.value = config.cssSelector;

            // Verificar status da configuração
            updateStatus();

            console.log('Interface inicializada com configurações:', config);
        } catch (error) {
            console.error('Erro ao inicializar interface:', error);
            showNotification('Erro ao carregar configurações', 'error');
        }
    }

    function setupEventListeners() {
        // Tab navigation
        elements.tabButtons.forEach(button => {
            button.addEventListener('click', () => switchTab(button.dataset.tab));
        });

        // Toggle password visibility
        elements.toggleToken.addEventListener('click', togglePasswordVisibility);

        // Scraper actions
        elements.scrapeCurrentBtn.addEventListener('click', () => scrapeCurrentPage());
        elements.scrapeTargetBtn.addEventListener('click', () => scrapeTargetUrl());
        elements.sendToApiBtn.addEventListener('click', () => sendDataToApi());

        // Config actions
        elements.testConnectionBtn.addEventListener('click', () => testApiConnection());
        elements.saveConfigBtn.addEventListener('click', () => saveConfiguration());

        // Notification close
        elements.closeNotification.addEventListener('click', hideNotification);

        // Auto-save on input change (debounced)
        // const autoSaveInputs = [elements.targetUrl, elements.cssSelector];
        // autoSaveInputs.forEach(input => {
        //     let timeout;
        //     input.addEventListener('input', () => {
        //         clearTimeout(timeout);
        //         timeout = setTimeout(() => {
        //             saveFieldToStorage(input.id, input.value);
        //         }, 1000);
        //     });
        // });

        // Real-time validation
        elements.apiUrl.addEventListener('input', validateApiUrl);
        elements.apiToken.addEventListener('input', validateApiToken);
    }

    // Tab management
    function switchTab(tabName) {
        // Update tab buttons
        elements.tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab contents
        elements.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });

        console.log(`Switched to tab: ${tabName}`);
    }

    // Password visibility toggle
    function togglePasswordVisibility() {
        const isPassword = elements.apiToken.type === 'password';
        elements.apiToken.type = isPassword ? 'text' : 'password';

        // Update icon (simplified)
        const icon = elements.toggleToken.querySelector('svg');
        if (icon) {
            icon.style.opacity = isPassword ? '0.7' : '1';
        }
    }

    // Status management
    function updateStatus() {
        const hasApiUrl = elements.apiUrl.value.trim() !== '';
        const hasApiToken = elements.apiToken.value.trim() !== '';

        const statusCard = elements.statusIndicator.closest('.status-card');
        const statusDot = elements.statusIndicator.querySelector('.status-dot');

        if (hasApiUrl && hasApiToken) {
            statusCard.className = 'status-card';
            statusDot.style.background = '#28a745';
            elements.statusText.textContent = 'Configurado e pronto';
        } else if (hasApiUrl || hasApiToken) {
            statusCard.className = 'status-card warning';
            statusDot.style.background = '#ffc107';
            elements.statusText.textContent = 'Configuração incompleta';
        } else {
            statusCard.className = 'status-card error';
            statusDot.style.background = '#dc3545';
            elements.statusText.textContent = 'Não configurado';
        }
    }

    // Validation functions
    function validateApiUrl() {
        const url = elements.apiUrl.value.trim();
        const isValid = url === '' || isValidUrl(url);

        elements.apiUrl.style.borderColor = isValid ? '#e9ecef' : '#dc3545';
        updateStatus();

        return isValid;
    }

    function validateApiToken() {
        const token = elements.apiToken.value.trim();
        const isValid = token === '' || token.length >= 10;

        elements.apiToken.style.borderColor = isValid ? '#e9ecef' : '#dc3545';
        updateStatus();

        return isValid;
    }

    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Scraping functions
    async function scrapeCurrentPage() {
        try {
            setButtonLoading(elements.scrapeCurrentBtn, true);
            showNotification('Extraindo dados da página atual...', 'info');

            // const cssSelector = elements.cssSelector.value.trim();

            const response = await chrome.runtime.sendMessage({
                action: 'scrapeCurrentPage',
                cssSelector: null
            });

            if (response.success) {
                currentData = response.data;
                currentUrl = response.url;
                displayResults(response.data);
                showNotification('Dados extraídos com sucesso!', 'success');
            } else {
                throw new Error(response.error || 'Erro desconhecido');
            }
        } catch (error) {
            console.error('Erro no scraping:', error);
            showNotification(`Erro: ${error.message}`, 'error');
        } finally {
            setButtonLoading(elements.scrapeCurrentBtn, false);
        }
    }

    async function scrapeTargetUrl() {
        try {
            const targetUrl = elements.targetUrl.value.trim();
            if (!targetUrl) {
                showNotification('Por favor, insira uma URL alvo', 'warning');
                return;
            }

            if (!isValidUrl(targetUrl)) {
                showNotification('URL inválida', 'error');
                return;
            }

            setButtonLoading(elements.scrapeTargetBtn, true);
            showNotification('Acessando URL alvo e extraindo dados...', 'info');

            const cssSelector = elements.cssSelector.value.trim();

            const response = await chrome.runtime.sendMessage({
                action: 'scrapeTargetUrl',
                targetUrl: targetUrl,
                cssSelector: cssSelector
            });

            if (response.success) {
                currentData = response.data;
                currentUrl = response.url;
                displayResults(response.data);
                showNotification('Dados extraídos da URL alvo!', 'success');
            } else {
                throw new Error(response.error || 'Erro desconhecido');
            }
        } catch (error) {
            console.error('Erro no scraping da URL alvo:', error);
            showNotification(`Erro: ${error.message}`, 'error');
        } finally {
            setButtonLoading(elements.scrapeTargetBtn, false);
        }
    }

    async function sendDataToApi() {
        try {
            if (!currentData) {
                showNotification('Nenhum dado para enviar. Faça o scraping primeiro.', 'warning');
                return;
            }

            const config = await chrome.storage.sync.get(['apiUrl', 'apiToken']);
            if (!config.apiUrl || !config.apiToken) {
                showNotification('Configure a API antes de enviar dados', 'warning');
                switchTab('config');
                return;
            }

            setButtonLoading(elements.sendToApiBtn, true);
            showNotification('Enviando dados para a API...', 'info');

            const response = await chrome.runtime.sendMessage({
                action: 'sendToApi',
                data: currentData,
                url: currentUrl,
                // cssSelector: elements.cssSelector.value.trim()
            });

            if (response.success) {
                showNotification('Dados enviados com sucesso!', 'success');
                console.log('Resposta da API:', response.response);
            } else {
                throw new Error(response.error || 'Erro desconhecido');
            }
        } catch (error) {
            console.error('Erro ao enviar para API:', error);
            showNotification(`Erro: ${error.message}`, 'error');
        } finally {
            setButtonLoading(elements.sendToApiBtn, false);
        }
    }

    // Configuration functions
    async function testApiConnection() {
        try {
            const apiUrl = elements.apiUrl.value.trim();
            const apiToken = elements.apiToken.value.trim();

            if (!apiUrl) {
                showNotification('Insira a URL da API', 'warning');
                return;
            }

            if (!isValidUrl(apiUrl)) {
                showNotification('URL da API inválida', 'error');
                return;
            }

            setButtonLoading(elements.testConnectionBtn, true);
            showNotification('Testando conexão...', 'info');

            const response = await chrome.runtime.sendMessage({
                action: 'testConnection',
                apiUrl: apiUrl,
                apiToken: apiToken
            });

            if (response.success) {
                showNotification(`Conexão bem-sucedida! Status: ${response.status}`, 'success');
            } else {
                showNotification(`Falha na conexão: ${response.error}`, 'error');
            }
        } catch (error) {
            console.error('Erro no teste de conexão:', error);
            showNotification(`Erro: ${error.message}`, 'error');
        } finally {
            setButtonLoading(elements.testConnectionBtn, false);
        }
    }

    async function saveConfiguration() {
        try {
            if (!validateApiUrl() || !validateApiToken()) {
                showNotification('Corrija os erros de validação antes de salvar', 'error');
                return;
            }

            setButtonLoading(elements.saveConfigBtn, true);

            const config = {
                apiUrl: elements.apiUrl.value.trim(),
                apiToken: elements.apiToken.value.trim(),
                requestMethod: elements.requestMethod.value,
                // targetUrl: elements.targetUrl.value.trim(),
                // cssSelector: elements.cssSelector.value.trim()
            };

            await chrome.storage.sync.set(config);
            updateStatus();
            showNotification('Configurações salvas com sucesso!', 'success');

            console.log('Configurações salvas:', config);
        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
            showNotification(`Erro: ${error.message}`, 'error');
        } finally {
            setButtonLoading(elements.saveConfigBtn, false);
        }
    }

    async function saveFieldToStorage(fieldName, value) {
        try {
            await chrome.storage.sync.set({ [fieldName]: value });
            console.log(`Campo ${fieldName} salvo automaticamente`);
        } catch (error) {
            console.error('Erro no auto-save:', error);
        }
    }

    // UI helper functions
    function displayResults(data) {
        elements.resultsContent.textContent = JSON.stringify(data, null, 2);
        elements.resultsSection.classList.remove('hidden');

        // Scroll to results
        elements.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    function setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.classList.add('loading');
            button.style.opacity = '0.7';
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            button.style.opacity = '1';
        }
    }

    function showNotification(message, type = 'info') {
        elements.notificationText.textContent = message;
        elements.notification.className = `notification ${type}`;
        elements.notification.classList.remove('hidden');

        // Auto-hide after 5 seconds for success/info messages
        if (type === 'success' || type === 'info') {
            setTimeout(hideNotification, 5000);
        }

        console.log(`Notification [${type}]: ${message}`);
    }

    function hideNotification() {
        elements.notification.classList.add('hidden');
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + S to save config
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (!elements.saveConfigBtn.disabled) {
                saveConfiguration();
            }
        }

        // Escape to hide notification
        if (e.key === 'Escape') {
            hideNotification();
        }
    });

    console.log('Popup JavaScript inicializado completamente');
});

