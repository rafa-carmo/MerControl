# Web Scraper Pro - Extensão Chrome

Uma extensão Chrome moderna e intuitiva para web scraping com integração API personalizada.

## 🚀 Funcionalidades

- **Interface Amigável**: Design moderno com navegação por abas
- **Web Scraping Inteligente**: Extração de dados da página atual ou URLs específicas
- **Integração API**: Envio automático de dados para sua API
- **Configuração Flexível**: Suporte a diferentes métodos HTTP e autenticação Bearer
- **Feedback Visual**: Notificações claras de sucesso e erro
- **Validação em Tempo Real**: Verificação automática de configurações

## 📦 Instalação

### 1. Baixar a Extensão
Baixe todos os arquivos da extensão para uma pasta local.

### 2. Instalar no Chrome
1. Abra o Chrome e vá para `chrome://extensions/`
2. Ative o "Modo do desenvolvedor" no canto superior direito
3. Clique em "Carregar sem compactação"
4. Selecione a pasta da extensão
5. A extensão aparecerá na barra de ferramentas

## ⚙️ Configuração

### 1. Configurar API
1. Clique no ícone da extensão
2. Vá para a aba "Configurações"
3. Preencha:
   - **URL da API**: Endpoint onde os dados serão enviados
   - **Token de Acesso**: Token Bearer para autenticação
4. Clique em "Testar Conexão" para verificar
5. Clique em "Salvar" para armazenar as configurações

### 2. Configurar Scraping
1. Na aba "Scraper":
   - **URL Alvo**: URL específica para scraping (opcional)
   - **Seletor CSS**: Elementos específicos a extrair (opcional)

## 🔧 Como Usar

### Scraping da Página Atual
1. Navegue até a página desejada
2. Abra a extensão
3. Clique em "Página Atual"
4. Revise os dados extraídos
5. Clique em "Enviar para API"


## 🔒 Segurança

- Tokens são armazenados localmente no Chrome
- Comunicação HTTPS recomendada
- Validação de URLs e tokens
- Sem coleta de dados pessoais

## 🛠️ Desenvolvimento

### Estrutura do Projeto
```
chrome-web-scraper-extension/
├── manifest.json          # Configuração da extensão
├── popup.html             # Interface principal
├── popup.js               # Lógica da interface
├── styles.css             # Estilos da interface
├── background.js          # Service worker
├── content.js             # Script injetado nas páginas
└── README.md              # Este arquivo
```

### Permissões Utilizadas
- `storage`: Armazenar configurações
- `activeTab`: Acessar página atual
- `scripting`: Injetar scripts
- `tabs`: Gerenciar abas
- `host_permissions`: Acessar todas as URLs

## 📄 Licença

Este projeto é fornecido como exemplo educacional. Use por sua própria conta e risco.

## 🤝 Contribuições

Sugestões e melhorias são bem-vindas! Abra uma issue ou envie um pull request.

---

**Scraper NFC Pro** - Desenvolvido com ❤️ para facilitar o web scraping

