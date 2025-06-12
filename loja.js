// Sistema de Progresso
const progresso = JSON.parse(localStorage.getItem('progresso')) || {
  gemas: 0,
  skinsCompradas: ['classico'],
  skinAtiva: 'classico',
  powerUps: {
    minaDourada: false,
    vidasExtras: 0,
    visaoAguia: 0
  }
};

// Estado do Jogo
let estado = JSON.parse(localStorage.getItem('estadoJogo')) || {
  saldo: 100
};


// Função para transição entre páginas
function transitionToPage(url) {
  document.body.classList.add('fade-out');
  setTimeout(() => {
    window.location.href = url;
  }, 300);
}

function atualizarLoja() {
  // Atualiza saldo de gemas
  document.getElementById('saldo-gemas').textContent = progresso.gemas;
  document.getElementById('qtd-vidas').textContent = progresso.powerUps.vidasExtras;
  
  document.querySelectorAll('.item-loja').forEach(item => {
    const id = item.dataset.id;
    const preco = Number(item.dataset.preco);
    const btn = item.querySelector('button');
    const precoEl = item.querySelector('.preco');
    
    if (id) {
      const comprado = progresso.skinsCompradas.includes(id) || 
                      (id === 'vida-extra' && progresso.powerUps.vidasExtras > 0) ||
                      (id === 'mina-dourada' && progresso.powerUps.minaDourada) ||
                      (id === 'visao-aguia' && progresso.powerUps.visaoAguia > 0);
      
      const dict = window._LANG_DICT || {};
      
      // Atualiza o preço (formata corretamente)
      if (preco === 0) {
        precoEl.innerHTML = dict['free'] || 'Gratuito';
      } else {
        // Formata o preço sem usar a string de template do JSON
        precoEl.innerHTML = `${preco} <i class="fas fa-gem"></i>`;
      }

      if (comprado) {
        if (id === 'classico' || id === 'neon' || id === 'espaco' || id === 'retro') {
          const emUso = progresso.skinAtiva === id;
          btn.textContent = emUso ? (dict['using'] || 'Usando') : (dict['use'] || 'Usar');
          btn.className = emUso ? 'btn-usar' : 'btn-comprar';
          btn.onclick = emUso ? null : () => selecionarSkin(id);
        } else if (id.startsWith('dinheiro-')) {
          btn.textContent = dict['buy'] || 'Comprar';
          btn.className = 'btn-comprar';
          btn.onclick = () => comprarItem(id, preco);
        } else {
          btn.textContent = dict['bought'] || 'Comprado';
          btn.className = 'btn-usar';
          btn.onclick = null;
        }
      } else {
        btn.textContent = dict['buy'] || 'Comprar';
        btn.className = 'btn-comprar';
        btn.onclick = () => comprarItem(id, preco);
      }
    }
  });
}

function comprarItem(id, preco) {
  const lang = window._LANG_DICT || {};
  if (progresso.gemas >= preco) {
    progresso.gemas -= preco;
    
    if (id === 'vida-extra') {
      progresso.powerUps.vidasExtras++;
    } else if (id === 'mina-dourada') {
      progresso.powerUps.minaDourada = true;
    } else if (id === 'visao-aguia') {
      progresso.powerUps.visaoAguia++;
    } else if (id.startsWith('dinheiro-')) {
      const valor = parseInt(id.split('-')[1]);
      estado.saldo += valor;
      localStorage.setItem('estadoJogo', JSON.stringify(estado));
      mostrarFeedback((lang['money_added'] || '+R$') + valor + (lang['added'] || ' adicionados!'), 'sucesso');
    } else {
      progresso.skinsCompradas.push(id);
    }
    
    localStorage.setItem('progresso', JSON.stringify(progresso));
    atualizarLoja();
    mostrarFeedback(lang['purchase_success'] || 'Compra realizada!', 'sucesso');
  } else {
    mostrarFeedback(lang['insufficient_gems'] || 'Gemas insuficientes!', 'erro');
  }
}

// Seleção de skin
function selecionarSkin(id) {
  const lang = window._LANG_DICT || {};
  progresso.skinAtiva = id;
  localStorage.setItem('progresso', JSON.stringify(progresso));
  atualizarLoja();
  mostrarFeedback((lang['skin_applied'] || 'Skin ') + (lang[`skin_${id}`] || id) + (lang['applied'] || ' aplicada!'), 'sucesso');
}

// Feedback de compra
function mostrarFeedback(mensagem, tipo) {
  const feedback = document.getElementById('feedbackCompra');
  feedback.textContent = mensagem;
  feedback.className = `feedback-compra ${tipo}`;
  
  setTimeout(() => {
    feedback.className = 'feedback-compra';
  }, 3000);
}

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
  await setLangPage();
  atualizarLoja();
  // Configura eventos dos botões de voltar
  document.querySelectorAll('.btn-voltar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      transitionToPage('index.html');
    });
  });
});