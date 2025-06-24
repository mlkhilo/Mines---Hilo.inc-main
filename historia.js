// Configurações do canvas
const configCanvas = {
    corLinha: 'rgba(255, 255, 0, 0.7)',
    larguraLinha: 3,
    atrasoRedesenho: 200 // ms para debounce do resize
};

// Cache de elementos
const elementosCache = {
    canvas: null,
    ctx: null,
    ultimoRedesenho: null
};

// Inicializa o canvas
function initCanvas() {
    elementosCache.canvas = document.getElementById('mapaCaminhos');
    elementosCache.ctx = elementosCache.canvas.getContext('2d');
    
    // Configura qualidade para dispositivos retina
    const dpr = window.devicePixelRatio || 1;
    elementosCache.canvas.width = window.innerWidth * dpr;
    elementosCache.canvas.height = window.innerHeight * dpr;
    elementosCache.ctx.scale(dpr, dpr);
    
    // Estilo inicial
    elementosCache.ctx.strokeStyle = configCanvas.corLinha;
    elementosCache.ctx.lineWidth = configCanvas.larguraLinha;
    elementosCache.ctx.lineCap = 'round';
    elementosCache.ctx.lineJoin = 'round';
}

// Desenha linhas conectando as fases
function desenharLinhas() {
    if (!elementosCache.canvas || !elementosCache.ctx) {
        initCanvas();
    }
    
    const agora = Date.now();
    if (elementosCache.ultimoRedesenho && (agora - elementosCache.ultimoRedesenho) < configCanvas.atrasoRedesenho) {
        return;
    }
    elementosCache.ultimoRedesenho = agora;
    
    // Ajusta tamanho do canvas
    elementosCache.canvas.width = window.innerWidth;
    elementosCache.canvas.height = window.innerHeight;
    
    // Limpa o canvas
    elementosCache.ctx.clearRect(0, 0, elementosCache.canvas.width, elementosCache.canvas.height);
    
    // Conecta as fases
    conectarFases('fase1', 'fase2');
    conectarFases('fase2', 'fase3');
    conectarFases('fase3', 'fase4');
    conectarFases('fase4', 'fase5');
    conectarFases('fase5', 'fase6');
    conectarFases('fase6', 'fase7');
    conectarFases('fase7', 'fase8');
    conectarFases('fase8', 'fase9');
    conectarFases('fase9', 'fase10');
}

// Conecta duas fases com uma linha
function conectarFases(idFaseA, idFaseB) {
    const faseA = document.getElementById(idFaseA);
    const faseB = document.getElementById(idFaseB);
    
    if (!faseA || !faseB) return;
    
    const rectA = faseA.getBoundingClientRect();
    const rectB = faseB.getBoundingClientRect();
    
    const xA = rectA.left + rectA.width / 2;
    const yA = rectA.top + rectA.height / 2;
    const xB = rectB.left + rectB.width / 2;
    const yB = rectB.top + rectB.height / 2;
    
    // Desenha a linha
    elementosCache.ctx.beginPath();
    elementosCache.ctx.moveTo(xA, yA);
    elementosCache.ctx.lineTo(xB, yB);
    elementosCache.ctx.stroke();
    
    // Adiciona efeito de ponta de seta para fases completas
    if (faseA.classList.contains('completa') {
        desenharSeta(xA, yA, xB, yB);
    }
}

// Desenha uma seta na ponta da linha
function desenharSeta(fromX, fromY, toX, toY) {
    const headLength = 10;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    elementosCache.ctx.beginPath();
    elementosCache.ctx.moveTo(toX, toY);
    elementosCache.ctx.lineTo(
        toX - headLength * Math.cos(angle - Math.PI / 6),
        toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    elementosCache.ctx.moveTo(toX, toY);
    elementosCache.ctx.lineTo(
        toX - headLength * Math.cos(angle + Math.PI / 6),
        toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    elementosCache.ctx.stroke();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initCanvas();
    desenharLinhas();
    
    // Adiciona eventos de clique nas fases
    document.querySelectorAll('.fase').forEach(fase => {
        fase.addEventListener('click', function() {
            const id = this.id;
            // Implementar lógica para abrir o modal correspondente
            console.log(`Fase clicada: ${id}`);
        });
    });
});

// Otimização para redimensionamento
let timeoutResize;
window.addEventListener('resize', function() {
    clearTimeout(timeoutResize);
    timeoutResize = setTimeout(desenharLinhas, configCanvas.atrasoRedesenho);
});