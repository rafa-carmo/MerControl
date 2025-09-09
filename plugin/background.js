// Background Service Worker para Web Scraper Pro

// Configurações padrão
const DEFAULT_CONFIG = {
    apiUrl: '',
    apiToken: '',
    requestMethod: 'POST',
    targetUrl: '',
    cssSelector: ''
};

// Inicialização da extensão
chrome.runtime.onInstalled.addListener(async () => {
    console.log('Web Scraper Pro instalado');

    // Configurar valores padrão se não existirem
    const config = await chrome.storage.sync.get(DEFAULT_CONFIG);
    if (!config.apiUrl) {
        await chrome.storage.sync.set(DEFAULT_CONFIG);
    }
});

// Listener para mensagens do popup e content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Mensagem recebida:', request);

    switch (request.action) {
        case 'scrapeCurrentPage':
            handleScrapeCurrentPage(request, sender, sendResponse);
            return true; // Indica resposta assíncrona

        case 'scrapeTargetUrl':
            handleScrapeTargetUrl(request, sendResponse);
            return true;

        case 'sendToApi':
            handleSendToApi(request, sendResponse);
            return true;

        case 'testConnection':
            handleTestConnection(request, sendResponse);
            return true;

        default:
            sendResponse({ success: false, error: 'Ação não reconhecida' });
    }
});

// Função para fazer scraping da página atual
async function handleScrapeCurrentPage(request, sender, sendResponse) {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) {
            throw new Error('Nenhuma aba ativa encontrada');
        }
        const tabId = tab?.id;
        if (!tabId) {
            throw new Error('Tab ID não encontrado');
        }

        // Injetar e executar script de scraping
        const results = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: extractPageData,
            args: [request.cssSelector]
        });

        const scrapedData = results[0]?.result;
        if (!scrapedData) {
            throw new Error('Nenhum dado extraído');
        }

        sendResponse({
            success: true,
            data: scrapedData,
            url: tab.url
        });
    } catch (error) {
        console.error('Erro no scraping:', error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

// Função para fazer scraping de URL específica
async function handleScrapeTargetUrl(request, sendResponse) {
    try {
        const { targetUrl, cssSelector } = request;

        if (!targetUrl) {
            throw new Error('URL alvo não especificada');
        }

        // Criar nova aba para scraping
        const tab = await chrome.tabs.create({
            url: targetUrl,
            active: false
        });

        // Aguardar carregamento da página
        await new Promise((resolve) => {
            const listener = (tabId, changeInfo) => {
                if (tabId === tab.id && changeInfo.status === 'complete') {
                    chrome.tabs.onUpdated.removeListener(listener);
                    resolve();
                }
            };
            chrome.tabs.onUpdated.addListener(listener);
        });

        // Executar scraping
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: extractPageData,
            args: [cssSelector]
        });

        // Fechar aba
        await chrome.tabs.remove(tab.id);

        const scrapedData = results[0]?.result;
        if (!scrapedData) {
            throw new Error('Nenhum dado extraído da URL alvo');
        }

        sendResponse({
            success: true,
            data: scrapedData,
            url: targetUrl
        });
    } catch (error) {
        console.error('Erro no scraping da URL alvo:', error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

// Função para enviar dados para API
async function handleSendToApi(request, sendResponse) {
    try {
        const config = await chrome.storage.sync.get(['apiUrl', 'apiToken', 'requestMethod']);

        if (!config.apiUrl) {
            throw new Error('URL da API não configurada');
        }

        if (!config.apiToken) {
            throw new Error('Token de acesso não configurado');
        }
        const url = config.apiUrl.endsWith('/') ? config.apiUrl.slice(0, -1) : config.apiUrl;

        const response = await fetch(url + '/api/v1/purchases/store', {
            method: config.requestMethod || 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiToken}`
            },
            body: JSON.stringify(
                request.data
            //     {
            //     data: request.data,
            //     url: request.url,
            //     timestamp: new Date().toISOString(),
            //     selector: request.cssSelector || null
            // }
        )
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();

        sendResponse({
            success: true,
            response: result,
            status: response.status
        });
    } catch (error) {
        console.error('Erro ao enviar para API:', error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

// Função para testar conexão com API
async function handleTestConnection(request, sendResponse) {
    try {
        const { apiUrl, apiToken } = request;

        if (!apiUrl) {
            throw new Error('URL da API não especificada');
        }

        const response = await fetch(apiUrl, {
            method: 'HEAD',
            headers: {
                'Authorization': `Bearer ${apiToken}`
            }
        });

        sendResponse({
            success: response.ok,
            status: response.status,
            statusText: response.statusText
        });
    } catch (error) {
        console.error('Erro no teste de conexão:', error);
        sendResponse({
            success: false,
            error: error.message
        });
    }
}

// Função injetada para extrair dados da página
function extractPageData() {
    try {
        let data = {};

        const placeElement = document.querySelector("div.txtTopo");
        const place = placeElement ? placeElement.textContent.trim() : null;
        let cnpj = null;
        const total_tax = document.getElementsByClassName("totalNumb txtObs")[0]?.textContent.replace("Tributos R$:", "").trim() || "0";
        const key = document.getElementsByClassName("chave")[0]?.textContent.replaceAll(" ", "").trim() || null;
        let total_discount = "0";

        Array.from(document.getElementsByClassName("txtRight")).forEach(element => {

            if (element?.textContent?.includes("Descontos")) {
                Array.from(document.getElementsByTagName("div")).forEach(div => {
                    if (div?.textContent?.includes("Descontos")) {
                        total_discount = div.getElementsByClassName("totalNumb")[0]?.textContent
                    }
                })

            }
        })

        Array.from(document.getElementsByClassName("text")).forEach(element => {
            if (element?.textContent?.includes("CNPJ")) {
                cnpj = element.textContent.replace("CNPJ:", "").trim();
            }
        })

        // Extrair data (date)
        const dateElement = document.querySelector("ul.ui-listview");
        let date = dateElement ? dateElement.textContent : null;
        let dateMatch = date ? date.match(/Emissão:\s*(\d{2}\/\d{2}\/\d{4})\s*(\d{2}:\d{2}:\d{2})/) : null;
        if (dateMatch) {
            // Formatar para ISO (yyyy-mm-dd hh:mm:ss)
            const [_, d, t] = dateMatch;
            const [day, month, year] = d.split('/');
            date = `${year}-${month}-${day} ${t}`;
        } else {
            date = null;
        }

        // Regex para extrair produtos
        const pattern = /^(.*?)\(Código:(\d+)\)Qtde\.:(\d+(?:,\d+)?)([A-Z]+): (UNVl|KGVl)\. Unit\.: (\d+(?:,\d+)?)Vl\. Total(\d+(?:,\d+)?)/;

        // Extrair produtos
        const items = [];
        const rows = document.querySelectorAll("tr");
        rows.forEach(node => {
            let text = node.textContent.replace(/\u00A0/g, " ").replace(/\n/g, "").replace(/\t/g, "").trim();
            const matches = text.match(pattern);
            if (matches) {
            items.push({
                name: matches[1].trim(),
                description: matches[1].trim(),
                quantity: parseFloat(matches[3].replace(",", ".")),
                unit: matches[4].toLowerCase(),
                unit_price: parseFloat(matches[6].replace(",", ".")),
                total_price: parseFloat(matches[7].replace(",", "."))
            });
            }
        });

        // Adicionar ao objeto data
        data.place = place;
        data.date = date;
        data.tags = ["Mercado"];
        data.products = items;
        data.cnpj = cnpj;
        data.total_tax = parseFloat(total_tax.replace(",", "."));
        data.total_discount = parseFloat(total_discount.replace(",", "."));
        data.key = key;
        return data;
    } catch (error) {
        console.error('Erro na extração de dados:', error);
        return {
            error: error.message,
            extractedAt: new Date().toISOString()
        };
    }
}

