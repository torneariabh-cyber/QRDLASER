<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
    <title>D Laser Premium</title>
    
    <!-- Meta tags para melhor experiência no celular -->
    <meta name="theme-color" content="#007aff">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    
    <link rel="stylesheet" href="style.css">
    
    <!-- Fontes premium -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Overlay de carregamento -->
    <div id="loadingOverlay">
        <div class="loader">
            <div class="loader-ring"></div>
            <p>Carregando...</p>
        </div>
    </div>

    <div class="container" id="app">
        <!-- Header com animação -->
        <header class="header">
            <div class="header-top">
                <div class="logo-container">
                    <div class="logo-icon">⚡</div>
                    <h1 class="logo-text">D Laser</h1>
                </div>
                <span class="header-badge">Premium</span>
            </div>
            <p class="header-subtitle">Personalize sua gravação em segundos</p>
        </header>

        <!-- Cards de passo a passo -->
        <div class="steps-indicator">
            <div class="step active">
                <span class="step-number">1</span>
                <span class="step-label">Nome</span>
            </div>
            <div class="step-line"></div>
            <div class="step">
                <span class="step-number">2</span>
                <span class="step-label">Fonte</span>
            </div>
            <div class="step-line"></div>
            <div class="step">
                <span class="step-number">3</span>
                <span class="step-label">Enviar</span>
            </div>
        </div>

        <!-- Formulário -->
        <div class="form-card">
            <!-- Campo Nome com animação -->
            <div class="form-group">
                <label for="nome" class="form-label">
                    <span class="label-icon">👤</span>
                    Digite seu nome
                </label>
                <div class="input-wrapper">
                    <input 
                        type="text" 
                        id="nome" 
                        placeholder="Ex: João" 
                        maxlength="20" 
                        autocomplete="off"
                        spellcheck="false"
                    >
                    <button class="clear-btn" id="clearBtn" aria-label="Limpar">✕</button>
                </div>
                <div class="input-hint">
                    <span id="charCount">0</span> / 20 caracteres
                </div>
            </div>

            <!-- Seleção de Fonte -->
            <div class="form-group">
                <label class="form-label">
                    <span class="label-icon">✏️</span>
                    Escolha sua fonte
                </label>
                <div class="font-grid" id="opcoesFonte">
                    <div class="font-card" data-fonte="Arial">
                        <div class="font-preview" style="font-family: Arial, sans-serif;">Aa</div>
                        <span class="font-name">Arial</span>
                        <div class="font-check">✓</div>
                    </div>
                    <div class="font-card" data-fonte="Script">
                        <div class="font-preview" style="font-family: 'Brush Script MT', cursive;">Aa</div>
                        <span class="font-name">Script</span>
                        <div class="font-check">✓</div>
                    </div>
                    <div class="font-card" data-fonte="Modern">
                        <div class="font-preview" style="font-family: 'Helvetica Neue', sans-serif;">Aa</div>
                        <span class="font-name">Modern</span>
                        <div class="font-check">✓</div>
                    </div>
                    <div class="font-card" data-fonte="Stanley">
                        <div class="font-preview" style="font-family: 'Times New Roman', serif;">Aa</div>
                        <span class="font-name">Stanley</span>
                        <div class="font-check">✓</div>
                    </div>
                </div>
            </div>

            <!-- Prévia ao vivo -->
            <div class="preview-section">
                <div class="preview-label">Pré-visualização</div>
                <div class="preview-container" id="previaContainer">
                    <div class="preview-text" id="previa">JOÃO</div>
                    <div class="preview-badge">AO VIVO</div>
                </div>
            </div>

            <!-- Botão Enviar -->
            <button class="btn-submit" id="btnEnviar">
                <span class="btn-content">
                    <span class="btn-icon">✨</span>
                    <span class="btn-text">Enviar Pedido</span>
                </span>
                <span class="btn-ripple"></span>
            </button>
        </div>

        <!-- Resultado (QR Code) -->
        <div id="resultado" style="display: none;">
            <div class="result-card">
                <div class="result-animation">
                    <div class="checkmark">✅</div>
                </div>
                <h2 class="result-title">Pedido Recebido!</h2>
                <p class="result-subtitle">Seu pedido foi enviado com sucesso</p>
                
                <div class="result-id">
                    <span class="id-label">Pedido</span>
                    <span class="id-number" id="pedidoId">#001</span>
                </div>

                <div class="qr-container">
                    <div class="qr-wrapper" id="qrCodeContainer">
                        <!-- QR Code será inserido aqui -->
                    </div>
                    <div class="qr-shine"></div>
                </div>

                <p class="qr-instruction">
                    <span class="instruction-icon">📱</span>
                    Aproxime este QR Code na máquina
                </p>

                <button class="btn-new-order" id="btnNovoPedido">
                    <span class="btn-icon">🔄</span>
                    Novo Pedido
                </button>
            </div>
        </div>

        <!-- Footer -->
        <footer class="footer">
            <p>© 2026 D Laser Premium • Todos os direitos reservados</p>
        </footer>
    </div>

    <!-- Toast de notificação -->
    <div id="toast" class="toast">
        <span class="toast-icon">✅</span>
        <span class="toast-message">Pedido enviado com sucesso!</span>
    </div>

    <script src="app.js"></script>
</body>
</html>
