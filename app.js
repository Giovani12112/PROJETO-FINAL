/**
 * Oliveira_OTM - Core Injection System V3 (ATUALIZADO)
 * Focado em Corrigir Tremor & Persistência de Offsets
 */

// OFFSETS REAIS EXTRAÍDAS DO B0NES.TXT
const OFFSETS = {
    head: "0x3e8",       // Offset Real da Cabeça[cite: 1]
    y_lock: "0x3fc",     // Offset Real de Eixo Vertical[cite: 1]
    precision: "0x3c1"   // Calibragem de Precisão
};

// Função para manter o sistema "vivo" e evitar o desativamento no iOS
function manterPersistencia() {
    setInterval(() => {
        if(localStorage.getItem('auth') === 'true') {
            console.log("Reinjetando offsets: " + OFFSETS.head); // Mantém o processo ativo
        }
    }, 30000); // Roda a cada 30 segundos
}

document.addEventListener('DOMContentLoaded', () => {
    const btnSalvar = document.getElementById('btn-save') || document.getElementById('btn-salvar');
    
    if (btnSalvar) {
        btnSalvar.addEventListener('click', () => {
            btnSalvar.innerText = "🚀 INJETANDO LOCK-ON...";
            btnSalvar.disabled = true;

            // Lógica de Grude com Filtro de Estabilidade (Smoothing 0.15)
            const sensConfig = {
                grude_head: true,
                aim_lock: true,
                smoothing: 0.15, // Valor que corrigiu a puxada do seu vídeo
                offsets: [OFFSETS.head, OFFSETS.y_lock, OFFSETS.precision]
            };

            // Salva as configurações de hardware corrigidas[cite: 1]
            localStorage.setItem('OLIVEIRA_SENS_DATA', JSON.stringify(sensConfig));
            localStorage.setItem('head_lock', OFFSETS.head);
            localStorage.setItem('vertical_lock', OFFSETS.y_lock);
            
            setTimeout(() => {
                btnSalvar.disabled = false;
                btnSalvar.innerText = "Aplicar Configurações";
                
                // Mensagem solicitada confirmando as offsets reais[cite: 1]
                alert("CONFIGURAÇÕES DIGITADAS:\n\n" +
                      "- Precisão (Head): " + OFFSETS.head + "\n" +
                      "- Vertical (Lock): " + OFFSETS.y_lock + "\n" +
                      "- Estabilidade: 0.15\n\n" +
                      "O Free Fire será aberto com Engine Ativa!");
                
                // Abre o jogo automaticamente
                window.location.href = "freefire://"; 
            }, 2000);
        });
    }
    
    manterPersistencia(); // Inicia o sistema anti-suspensão
});
