<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
    <title>D Laser Premium - Cliente</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container" id="app">
        <!-- Header -->
        <div class="header">
            <h1>⚡ D Laser Premium</h1>
            <p class="subtitulo">Escolha sua fonte e personalize</p>
        </div>

        <!-- Formulário -->
        <div class="form-group">
            <label for="nome">Seu nome</label>
            <input type="text" id="nome" placeholder="Digite seu nome" maxlength="20" autofocus>
        </div>

        <div class="form-group">
            <label>Escolha sua fonte</label>
            <div class="opcoes" id="opcoesFonte">
                <div class="opcao" data-fonte="Arial" style="font-family: Arial, sans-serif;">Arial</div>
                <div class="opcao" data-fonte="Script" style="font-family: 'Brush Script MT', cursive;">Script</div>
                <div class="opcao" data-fonte="Modern" style="font-family: 'Helvetica Neue', sans-serif;">Modern</div>
                <div class="opcao" data-fonte="Stanley" style="font-family: 'Times New Roman', serif;">Stanley</div>
            </div>
        </div>

        <!-- Prévia -->
        <div class="previa" id="previa">JOÃO</div>

        <!-- Botão Enviar -->
        <button class="btn btn-primary" id="btnEnviar">
            <span class="btn-icon">📤</span> Enviar Pedido
        </button>

        <!-- Resultado (QR Code) -->
        <div id="resultado" style="display: none;">
            <div class="card-success">
                <div class="success-icon">✅</div>
                <h2>Pedido Recebido!</h2>
                <p class="pedido-id" id="pedidoId">#001</p>
                <div class="qr-code" id="qrCodeContainer"></div>
                <p class="qr-instrucao">Aproxime este QR Code na máquina</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>© 2026 D Laser Premium</p>
        </div>
    </div>

    <script src="app.js"></script>
</body>
</html>
