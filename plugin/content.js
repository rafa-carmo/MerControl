// Content Script para Web Scraper Pro
// Este script é injetado em todas as páginas web

(function() {
    'use strict';
    
    // Evitar múltiplas injeções
    if (window.webScraperProInjected) {
        return;
    }
    window.webScraperProInjected = true;
    
    console.log('Web Scraper Pro content script carregado');
    
    // Listener para mensagens do background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log('Content script recebeu mensagem:', request);
        
        switch (request.action) {
            case 'extractData':
                handleExtractData(request, sendResponse);
                return true; // Indica resposta assíncrona
                
            case 'highlightElements':
                handleHighlightElements(request, sendResponse);
                return true;
                
            case 'removeHighlights':
                handleRemoveHighlights(sendResponse);
                return true;
                
            default:
                sendResponse({ success: false, error: 'Ação não reconhecida no content script' });
        }
    });
    
    // Função para extrair dados da página
    function handleExtractData(request, sendResponse) {
        try {
            const { cssSelector } = request;
            const data = extractPageData(cssSelector);
            
            sendResponse({
                success: true,
                data: data
            });
        } catch (error) {
            console.error('Erro na extração de dados:', error);
            sendResponse({
                success: false,
                error: error.message
            });
        }
    }
    
    // Função para destacar elementos na página
    function handleHighlightElements(request, sendResponse) {
        try {
            const { cssSelector } = request;
            
            if (!cssSelector || !cssSelector.trim()) {
                sendResponse({ success: false, error: 'Seletor CSS não fornecido' });
                return;
            }
            
            // Remover highlights anteriores
            removeHighlights();
            
            // Adicionar highlights aos elementos selecionados
            const elements = document.querySelectorAll(cssSelector);
            let count = 0;
            
            elements.forEach((element, index) => {
                if (element && element.style) {
                    element.style.outline = '2px solid #667eea';
                    element.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
                    element.setAttribute('data-webscraper-highlight', 'true');
                    
                    // Adicionar número do elemento
                    const badge = document.createElement('div');
                    badge.textContent = index + 1;
                    badge.style.cssText = `
                        position: absolute;
                        top: -10px;
                        left: -10px;
                        background: #667eea;
                        color: white;
                        border-radius: 50%;
                        width: 20px;
                        height: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                        font-weight: bold;
                        z-index: 10000;
                        pointer-events: none;
                    `;
                    badge.setAttribute('data-webscraper-badge', 'true');
                    
                    // Posicionar badge
                    if (element.style.position === '' || element.style.position === 'static') {
                        element.style.position = 'relative';
                    }
                    
                    element.appendChild(badge);
                    count++;
                }
            });
            
            sendResponse({
                success: true,
                count: count,
                message: `${count} elementos destacados`
            });
        } catch (error) {
            console.error('Erro ao destacar elementos:', error);
            sendResponse({
                success: false,
                error: error.message
            });
        }
    }
    
    // Função para remover highlights
    function handleRemoveHighlights(sendResponse) {
        try {
            const count = removeHighlights();
            sendResponse({
                success: true,
                count: count,
                message: `${count} highlights removidos`
            });
        } catch (error) {
            console.error('Erro ao remover highlights:', error);
            sendResponse({
                success: false,
                error: error.message
            });
        }
    }
    
    // Função auxiliar para remover todos os highlights
    function removeHighlights() {
        let count = 0;
        
        // Remover outlines e backgrounds
        const highlightedElements = document.querySelectorAll('[data-webscraper-highlight="true"]');
        highlightedElements.forEach(element => {
            element.style.outline = '';
            element.style.backgroundColor = '';
            element.removeAttribute('data-webscraper-highlight');
            count++;
        });
        
        // Remover badges
        const badges = document.querySelectorAll('[data-webscraper-badge="true"]');
        badges.forEach(badge => {
            badge.remove();
        });
        
        return count;
    }
    
    // Função principal para extrair dados
    function extractPageData(cssSelector) {
        const data = {
            url: window.location.href,
            title: document.title,
            extractedAt: new Date().toISOString(),
            selector: cssSelector || 'página completa'
        };
        
        if (cssSelector && cssSelector.trim()) {
            // Extrair elementos específicos
            const elements = document.querySelectorAll(cssSelector);
            data.selectedElements = Array.from(elements).map((element, index) => {
                const elementData = {
                    index: index,
                    tagName: element.tagName.toLowerCase(),
                    textContent: element.textContent?.trim() || '',
                    innerHTML: element.innerHTML?.substring(0, 500) || '', // Limitar HTML
                    attributes: {}
                };
                
                // Extrair atributos importantes
                const importantAttrs = ['id', 'class', 'href', 'src', 'alt', 'title', 'data-*'];
                Array.from(element.attributes).forEach(attr => {
                    if (importantAttrs.some(pattern => 
                        pattern === attr.name || 
                        (pattern.endsWith('*') && attr.name.startsWith(pattern.slice(0, -1)))
                    )) {
                        elementData.attributes[attr.name] = attr.value;
                    }
                });
                
                // Extrair posição do elemento
                const rect = element.getBoundingClientRect();
                elementData.position = {
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                };
                
                return elementData;
            });
            
            data.count = elements.length;
            data.summary = `${elements.length} elementos encontrados com o seletor "${cssSelector}"`;
        } else {
            // Extrair dados gerais da página
            data.meta = {
                description: document.querySelector('meta[name="description"]')?.content || '',
                keywords: document.querySelector('meta[name="keywords"]')?.content || '',
                author: document.querySelector('meta[name="author"]')?.content || '',
                viewport: document.querySelector('meta[name="viewport"]')?.content || ''
            };
            
            // Extrair headings
            data.headings = {};
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
                const elements = document.querySelectorAll(tag);
                if (elements.length > 0) {
                    data.headings[tag] = Array.from(elements).map(el => el.textContent.trim()).slice(0, 10);
                }
            });
            
            // Extrair links principais
            data.links = Array.from(document.querySelectorAll('a[href]'))
                .filter(link => link.textContent.trim().length > 0)
                .map(link => ({
                    text: link.textContent.trim().substring(0, 100),
                    href: link.href,
                    title: link.title || '',
                    isExternal: !link.href.startsWith(window.location.origin)
                }))
                .slice(0, 20);
            
            // Extrair imagens
            data.images = Array.from(document.querySelectorAll('img[src]'))
                .map(img => ({
                    src: img.src,
                    alt: img.alt || '',
                    title: img.title || '',
                    width: img.naturalWidth || img.width,
                    height: img.naturalHeight || img.height
                }))
                .slice(0, 15);
            
            // Extrair formulários
            const forms = document.querySelectorAll('form');
            if (forms.length > 0) {
                data.forms = Array.from(forms).map((form, index) => ({
                    index: index,
                    action: form.action || '',
                    method: form.method || 'GET',
                    inputs: Array.from(form.querySelectorAll('input, select, textarea')).map(input => ({
                        type: input.type || input.tagName.toLowerCase(),
                        name: input.name || '',
                        id: input.id || '',
                        placeholder: input.placeholder || '',
                        required: input.required || false
                    }))
                })).slice(0, 5);
            }
            
            // Extrair texto principal (tentativa de identificar conteúdo principal)
            const mainContent = document.querySelector('main, article, .content, .main-content, #content, #main') || document.body;
            const textContent = mainContent.textContent || '';
            data.mainText = textContent.trim().substring(0, 2000);
            
            // Estatísticas da página
            data.stats = {
                totalElements: document.querySelectorAll('*').length,
                totalLinks: document.querySelectorAll('a').length,
                totalImages: document.querySelectorAll('img').length,
                totalForms: document.querySelectorAll('form').length,
                totalScripts: document.querySelectorAll('script').length,
                totalStyles: document.querySelectorAll('style, link[rel="stylesheet"]').length
            };
            
            data.summary = `Página completa extraída: ${data.stats.totalElements} elementos totais`;
        }
        
        return data;
    }
    
    // Função para detectar mudanças na página (para SPAs)
    let lastUrl = window.location.href;
    const observer = new MutationObserver(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            console.log('URL mudou, Web Scraper Pro detectou navegação SPA');
            // Remover highlights quando a página muda
            removeHighlights();
        }
    });
    
    // Observar mudanças no DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Cleanup quando a página é descarregada
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
        removeHighlights();
    });
    
})();

