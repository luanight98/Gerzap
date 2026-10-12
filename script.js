// Elementos do DOM
const generateBtn = document.getElementById('generateBtn');
const resultCard = document.getElementById('resultCard');
const mobileLinkInput = document.getElementById('mobileLink');
const webLinkInput = document.getElementById('webLink');
const qrCodeDiv = document.getElementById('qrCode');
const currentYearSpan = document.getElementById('currentYear');
const toast = document.getElementById('toast');

// Formatador de número de telefone
function formatPhoneNumber(phone) {
    const numbers = phone.replace(/\D/g, '');
    
    if (numbers.length <= 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
}

// Gerar link do WhatsApp
function generateWhatsAppLink() {
    // Obter valores dos inputs
    const countryCode = document.getElementById('countryCode').value;
    let phone = document.getElementById('phoneNumber').value.replace(/\D/g, '');
    const message = document.getElementById('message').value;
    
    // Validar número de telefone
    if (!phone || phone.length < 10) {
        showToast('Por favor, insira um número de telefone válido com DDD', 'error');
        return;
    }
    
    // Remover zero inicial se houver
    if (phone.startsWith('0')) {
        phone = phone.substring(1);
    }
    
    // Adicionar código do país se necessário
    if (!phone.startsWith(countryCode)) {
        phone = countryCode + phone;
    }
    
    // Codificar mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Gerar links
    const whatsappLink = `https://wa.me/${phone}?text=${encodedMessage}`;
    const whatsappWebLink = `https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;
    
    // Atualizar inputs
    mobileLinkInput.value = whatsappLink;
    webLinkInput.value = whatsappWebLink;
    
    // Gerar QR Code
    generateQRCode(whatsappLink);
    
    // Mostrar resultado
    resultCard.style.display = 'block';
    
    // Scroll para o resultado
    resultCard.scrollIntoView({ behavior: 'smooth' });
    
    showToast('Link gerado com sucesso!');
}

// Gerar QR Code
function generateQRCode(text) {
    // Limpar QR Code anterior
    qrCodeDiv.innerHTML = '';
    
    // Usar API externa para gerar QR Code
    const qrSize = 200;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(text)}`;
    
    const qrImg = document.createElement('img');
    qrImg.src = qrUrl;
    qrImg.alt = 'QR Code WhatsApp';
    qrImg.style.width = '100%';
    qrImg.style.height = '100%';
    qrImg.style.borderRadius = '5px';
    
    qrCodeDiv.appendChild(qrImg);
}

// Copiar para área de transferência
function copyToClipboard(inputId) {
    const input = document.getElementById(inputId);
    
    // Selecionar texto
    input.select();
    input.setSelectionRange(0, 99999); // Para mobile
    
    // Copiar
    try {
        navigator.clipboard.writeText(input.value).then(() => {
            showToast('Link copiado para a área de transferência!');
        }).catch(err => {
            // Fallback para navegadores antigos
            document.execCommand('copy');
            showToast('Link copiado para a área de transferência!');
        });
    } catch (err) {
        // Fallback final
        document.execCommand('copy');
        showToast('Link copiado para a área de transferência!');
    }
    
    // Desselecionar
    input.blur();
}

// Abrir WhatsApp
function openWhatsApp(type) {
    const link = type === 'mobile' ? mobileLinkInput.value : webLinkInput.value;
    
    if (link) {
        window.open(link, '_blank');
    }
}

// Mostrar toast notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    
    // Cor baseada no tipo
    if (type === 'error') {
        toast.style.background = '#f44336';
    } else {
        toast.style.background = '#25d366';
    }
    
    // Mostrar toast
    toast.classList.add('show');
    
    // Esconder após 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Event Listeners
generateBtn.addEventListener('click', generateWhatsAppLink);

// Formatar número enquanto digita
document.getElementById('phoneNumber').addEventListener('input', function(e) {
    const formatted = formatPhoneNumber(e.target.value);
    e.target.value = formatted;
});

// Mensagens pré-definidas
document.querySelectorAll('.msg-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.getElementById('message').value = this.getAttribute('data-message');
        showToast('Mensagem pré-definida aplicada!');
    });
});

// Definir ano atual no footer
currentYearSpan.textContent = new Date().getFullYear();

// Gerar exemplo inicial
window.addEventListener('DOMContentLoaded', function() {
    // Preencher com exemplo
    document.getElementById('phoneNumber').value = '(11) 99999-9999';
    
    // Gerar link de exemplo
    setTimeout(() => {
        generateWhatsAppLink();
    }, 500);
});

// Permitir Enter para gerar link
document.getElementById('message').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        generateWhatsAppLink();
    }
});

// Adicionar máscara de telefone
function phoneMask(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
}

// Formatador automático de telefone
document.getElementById('phoneNumber').addEventListener('input', function (e) {
    e.target.value = phoneMask(e.target.value);
});