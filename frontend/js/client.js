class ClientApp {
    constructor() {
        this.socket = io();
        this.form = document.getElementById('customizationForm');
        this.resultDiv = document.getElementById('ticketResult');
        this.qrCodeImage = document.getElementById('qrCodeImage');
        this.ticketIdSpan = document.getElementById('ticketId');
        this.statusSpan = document.getElementById('ticketStatus');
        this.errorDiv = document.getElementById('errorMessage');
        
        this.setupEventListeners();
        this.setupSocketListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitTicket();
        });
    }

    setupSocketListeners() {
        this.socket.on('ticket-updated', (ticket) => {
            this.updateTicketStatus(ticket);
        });

        this.socket.on('ticket-processed', (ticket) => {
            this.updateTicketStatus(ticket);
            this.showSuccess('Seu ticket foi processado com sucesso!');
        });

        this.socket.on('ticket-error', (ticket) => {
            this.updateTicketStatus(ticket);
            this.showError('Erro ao processar seu ticket. Tente novamente.');
        });
    }

    async submitTicket() {
        const name = document.getElementById('name').value.trim();
        const font = document.getElementById('font').value;
        const icon = document.getElementById('icon').value;

        if (!name) {
            this.showError('Por favor, digite seu nome.');
            return;
        }

        this.hideError();
        this.showLoading();

        try {
            const response = await fetch('/api/client/create-ticket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, font, icon })
            });

            const data = await response.json();

            if (data.success) {
                this.displayTicket(data);
                this.socket.emit('register-client', data.ticketId);
            } else {
                this.showError('Erro ao criar ticket: ' + (data.error || 'Tente novamente'));
            }
        } catch (error) {
            console.error('Error:', error);
            this.showError('Erro ao conectar ao servidor. Tente novamente.');
        } finally {
            this.hideLoading();
        }
    }

    displayTicket(data) {
        this.form.style.display = 'none';
        this.resultDiv.style.display = 'block';
        
        this.qrCodeImage.src = data.qrCode;
        this.ticketIdSpan.textContent = data.ticketId;
        this.statusSpan.textContent = 'Aguardando processamento...';
        this.statusSpan.className = 'status pending';
    }

    updateTicketStatus(ticket) {
        if (!ticket || ticket.id !== this.ticketIdSpan.textContent) return;

        const statusMap = {
            'pending': 'Aguardando processamento...',
            'processing': 'Processando...',
            'processed': '✅ Processado com sucesso!',
            'error': '❌ Erro no processamento'
        };

        this.statusSpan.textContent = statusMap[ticket.status] || ticket.status;
        this.statusSpan.className = `status ${ticket.status}`;
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        // Add to UI
    }

    showError(message) {
        this.errorDiv.textContent = message;
        this.errorDiv.style.display = 'block';
        setTimeout(() => {
            this.errorDiv.style.display = 'none';
        }, 5000);
    }

    hideError() {
        this.errorDiv.style.display = 'none';
    }

    showLoading() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
    }

    hideLoading() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar para Gravação';
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ClientApp();
});
