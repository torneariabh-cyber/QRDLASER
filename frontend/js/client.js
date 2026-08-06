// ===== LISTA DE 40+ FONTES =====
const FONT_LIST = [
    // Sans-serif
    { name: 'Arial', sample: 'Arial', category: 'Sans-serif' },
    { name: 'Helvetica', sample: 'Helvetica', category: 'Sans-serif' },
    { name: 'Verdana', sample: 'Verdana', category: 'Sans-serif' },
    { name: 'Tahoma', sample: 'Tahoma', category: 'Sans-serif' },
    { name: 'Trebuchet MS', sample: 'Trebuchet', category: 'Sans-serif' },
    { name: 'Open Sans', sample: 'Open Sans', category: 'Sans-serif' },
    { name: 'Roboto', sample: 'Roboto', category: 'Sans-serif' },
    { name: 'Montserrat', sample: 'Montserrat', category: 'Sans-serif' },
    { name: 'Raleway', sample: 'Raleway', category: 'Sans-serif' },
    { name: 'Poppins', sample: 'Poppins', category: 'Sans-serif' },
    { name: 'Nunito', sample: 'Nunito', category: 'Sans-serif' },
    { name: 'Quicksand', sample: 'Quicksand', category: 'Sans-serif' },
    { name: 'Inter', sample: 'Inter', category: 'Sans-serif' },
    { name: 'Manrope', sample: 'Manrope', category: 'Sans-serif' },
    { name: 'Josefin Sans', sample: 'Josefin', category: 'Sans-serif' },
    
    // Serif
    { name: 'Georgia', sample: 'Georgia', category: 'Serif' },
    { name: 'Times New Roman', sample: 'Times', category: 'Serif' },
    { name: 'Garamond', sample: 'Garamond', category: 'Serif' },
    { name: 'Palatino', sample: 'Palatino', category: 'Serif' },
    { name: 'Merriweather', sample: 'Merriweather', category: 'Serif' },
    { name: 'Playfair Display', sample: 'Playfair', category: 'Serif' },
    { name: 'Lora', sample: 'Lora', category: 'Serif' },
    { name: 'Cormorant Garamond', sample: 'Cormorant', category: 'Serif' },
    { name: 'Abril Fatface', sample: 'Abril', category: 'Serif' },
    
    // Display/Decorative
    { name: 'Impact', sample: 'Impact', category: 'Display' },
    { name: 'Comic Sans MS', sample: 'Comic Sans', category: 'Display' },
    { name: 'Pacifico', sample: 'Pacifico', category: 'Display' },
    { name: 'Lobster', sample: 'Lobster', category: 'Display' },
    { name: 'Bangers', sample: 'Bangers', category: 'Display' },
    { name: 'Fredoka One', sample: 'Fredoka', category: 'Display' },
    { name: 'Righteous', sample: 'Righteous', category: 'Display' },
    { name: 'Bebas Neue', sample: 'Bebas Neue', category: 'Display' },
    { name: 'Oswald', sample: 'Oswald', category: 'Display' },
    { name: 'Anton', sample: 'Anton', category: 'Display' },
    { name: 'Alfa Slab One', sample: 'Alfa Slab', category: 'Display' },
    { name: 'Audiowide', sample: 'Audiowide', category: 'Display' },
    { name: 'Orbitron', sample: 'Orbitron', category: 'Display' },
    { name: 'Exo 2', sample: 'Exo 2', category: 'Display' },
    
    // Script/Cursive
    { name: 'Dancing Script', sample: 'Dancing Script', category: 'Script' },
    { name: 'Great Vibes', sample: 'Great Vibes', category: 'Script' },
    { name: 'Satisfy', sample: 'Satisfy', category: 'Script' },
    { name: 'Cookie', sample: 'Cookie', category: 'Script' },
    { name: 'Alex Brush', sample: 'Alex Brush', category: 'Script' },
    { name: 'Cedarville Cursive', sample: 'Cedarville', category: 'Script' },
];

// ===== CLIENT APP =====
class ClientApp {
    constructor() {
        this.socket = io();
        this.selectedFont = 'Arial';
        this.selectedIcon = '';
        this.isSubmitting = false;
        
        // Elementos
        this.elements = {
            form: document.getElementById('customizationForm'),
            name: document.getElementById('name'),
            fontToggle: document.getElementById('fontToggleBtn'),
            fontDropdown: document.getElementById('fontDropdown'),
            fontGrid: document.getElementById('fontGrid'),
            fontSearch: document.getElementById('fontSearch'),
            selectedFontDisplay: document.getElementById('selectedFontDisplay'),
            previewText: document.getElementById('previewText'),
            resultDiv: document.getElementById('ticketResult'),
            qrCodeImage: document.getElementById('qrCodeImage'),
            ticketId: document.getElementById('ticketId'),
            ticketStatus: document.getElementById('ticketStatus'),
            errorMessage: document.getElementById('errorMessage'),
            successMessage: document.getElementById('successMessage'),
            iconOptions: document.querySelectorAll('.icon-option'),
        };

        this.init();
    }

    init() {
        this.setupFonts();
        this.setupEventListeners();
        this.setupSocketListeners();
        this.setupPreview();
    }

    // ===== FONTES =====
    setupFonts() {
        const grid = this.elements.fontGrid;
        grid.innerHTML = '';

        FONT_LIST.forEach(font => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'font-option';
            button.dataset.font = font.name;
            
            const isSelected = font.name === this.selectedFont;
            if (isSelected) button.classList.add('selected');

            button.innerHTML = `
                <span class="font-sample" style="font-family: '${font.name}', sans-serif;">
                    ${font.sample}
                </span>
                <span class="font-name">${font.category}</span>
            `;

            button.addEventListener('click', () => {
                this.selectFont(font.name);
            });

            // Touch feedback
            button.addEventListener('touchstart', () => {
                button.style.transform = 'scale(0.97)';
            });
            button.addEventListener('touchend', () => {
                button.style.transform = 'scale(1)';
            });

            grid.appendChild(button);
        });
    }

    selectFont(fontName) {
        this.selectedFont = fontName;
        
        // Update display
        this.elements.selectedFontDisplay.textContent = fontName;
        this.elements.selectedFontDisplay.style.fontFamily = `'${fontName}', sans-serif`;
        
        // Update grid selection
        document.querySelectorAll('.font-option').forEach(el => {
            el.classList.toggle('selected', el.dataset.font === fontName);
        });

        // Update preview
        this.updatePreview();

        // Close dropdown
        this.closeFontDropdown();
    }

    toggleFontDropdown() {
        const isOpen = this.elements.fontDropdown.classList.contains('open');
        if (isOpen) {
            this.closeFontDropdown();
        } else {
            this.openFontDropdown();
        }
    }

    openFontDropdown() {
        this.elements.fontDropdown.classList.add('open');
        this.elements.fontToggle.classList.add('active');
        this.elements.fontSearch.focus();
        
        // Filter to show selected
        this.filterFonts('');
    }

    closeFontDropdown() {
        this.elements.fontDropdown.classList.remove('open');
        this.elements.fontToggle.classList.remove('active');
    }

    filterFonts(query) {
        const options = document.querySelectorAll('.font-option');
        const search = query.toLowerCase().trim();
        
        options.forEach(option => {
            const fontName = option.dataset.font.toLowerCase();
            const isMatch = fontName.includes(search);
            option.style.display = isMatch ? 'flex' : 'none';
        });
    }

    // ===== ÍCONES =====
    setupIcons() {
        this.elements.iconOptions.forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectIcon(btn.dataset.icon);
            });

            // Touch feedback
            btn.addEventListener('touchstart', () => {
                btn.style.transform = 'scale(0.92)';
            });
            btn.addEventListener('touchend', () => {
                btn.style.transform = 'scale(1)';
            });
        });
    }

    selectIcon(icon) {
        this.selectedIcon = icon;
        
        this.elements.iconOptions.forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.icon === icon);
        });

        this.updatePreview();
    }

    // ===== PREVIEW =====
    setupPreview() {
        this.elements.name.addEventListener('input', () => this.updatePreview());
        this.updatePreview();
    }

    updatePreview() {
        const name = this.elements.name.value.trim() || 'Seu Nome';
        const preview = this.elements.previewText;
        
        preview.textContent = name;
        preview.style.fontFamily = `'${this.selectedFont}', sans-serif`;
        
        // Add icon if selected
        if (this.selectedIcon) {
            preview.textContent = `${this.selectedIcon} ${name}`;
        }
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Form submit
        this.elements.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitTicket();
        });

        // Font toggle
        this.elements.fontToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFontDropdown();
        });

        // Font search
        this.elements.fontSearch.addEventListener('input', (e) => {
            this.filterFonts(e.target.value);
        });

        // Close dropdown on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.font-selector-wrapper')) {
                this.closeFontDropdown();
            }
        });

        // Icons
        this.setupIcons();

        // Name max length counter
        this.elements.name.addEventListener('input', (e) => {
            const max = 30;
            if (e.target.value.length > max) {
                e.target.value = e.target.value.slice(0, max);
            }
        });
    }

    // ===== SOCKET =====
    setupSocketListeners() {
        this.socket.on('ticket-updated', (ticket) => {
            this.updateTicketStatus(ticket);
        });

        this.socket.on('ticket-processed', (ticket) => {
            this.updateTicketStatus(ticket);
            this.showSuccess('✅ Seu ticket foi processado com sucesso!');
        });

        this.socket.on('ticket-error', (ticket) => {
            this.updateTicketStatus(ticket);
            this.showError('❌ Erro ao processar seu ticket. Tente novamente.');
        });
    }

    // ===== SUBMIT =====
    async submitTicket() {
        if (this.isSubmitting) return;

        const name = this.elements.name.value.trim();
        if (!name) {
            this.showError('Por favor, digite seu nome.');
            this.elements.name.focus();
            return;
        }

        this.isSubmitting = true;
        this.hideMessages();

        const button = this.elements.form.querySelector('.btn-premium');
        const originalText = button.innerHTML;
        button.innerHTML = `
            <span class="btn-content">
                <span class="btn-icon">⏳</span>
                <span class="btn-text">Enviando...</span>
            </span>
        `;
        button.disabled = true;

        try {
            const response = await fetch('/api/client/create-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    font: this.selectedFont,
                    icon: this.selectedIcon
                })
            });

            const data = await response.json();

            if (data.success) {
                this.displayTicket(data);
                this.socket.emit('register-client', data.ticketId);
                this.elements.form.style.display = 'none';
            } else {
                this.showError('❌ ' + (data.error || 'Erro ao criar ticket. Tente novamente.'));
            }
        } catch (error) {
            console.error('Error:', error);
            this.showError('❌ Erro ao conectar ao servidor. Verifique sua internet.');
        } finally {
            this.isSubmitting = false;
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }

    displayTicket(data) {
        const result = this.elements.resultDiv;
        result.style.display = 'block';
        
        this.elements.qrCodeImage.src = data.qrCode + '?t=' + Date.now();
        this.elements.ticketId.textContent = data.ticketId.slice(0, 8);
        
        const statusIndicator = this.elements.ticketStatus;
        statusIndicator.innerHTML = `
            <span class="status-dot pending"></span>
            Aguardando processamento...
        `;

        // Scroll to result
        result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    updateTicketStatus(ticket) {
        const statusEl = this.elements.ticketStatus;
        const statusMap = {
            'pending': { text: 'Aguardando processamento...', dot: 'pending' },
            'processing': { text: '⏳ Processando...', dot: 'processing' },
            'processed': { text: '✅ Processado com sucesso!', dot: 'processed' },
            'error': { text: '❌ Erro no processamento', dot: 'error' }
        };

        const status = statusMap[ticket.status] || statusMap.pending;
        statusEl.innerHTML = `
            <span class="status-dot ${status.dot}"></span>
            ${status.text}
        `;
    }

    // ===== MENSAGENS =====
    showError(message) {
        const el = this.elements.errorMessage;
        el.textContent = message;
        el.style.display = 'flex';
        setTimeout(() => { el.style.display = 'none'; }, 5000);
    }

    showSuccess(message) {
        const el = this.elements.successMessage;
        el.textContent = message;
        el.style.display = 'flex';
        setTimeout(() => { el.style.display = 'none'; }, 5000);
    }

    hideMessages() {
        this.elements.errorMessage.style.display = 'none';
        this.elements.successMessage.style.display = 'none';
    }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    const app = new ClientApp();
});
