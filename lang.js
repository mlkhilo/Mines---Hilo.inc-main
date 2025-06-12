// lang.js - Sistema completo de tradução

async function loadLang(lang) {
  try {
    const resp = await fetch(`lang/${lang}.json`);
    if (!resp.ok) throw new Error('Failed to load language');
    return await resp.json();
  } catch (error) {
    console.error('Error loading language:', error);
    return {};
  }
}

function applyLang(dict) {
  // Aplica textos nos elementos com data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = dict[key] || el.textContent;
    
    if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
      el.placeholder = text;
      if (el.value === '' || el.value === el.defaultValue) {
        el.value = text;
      }
    } else {
      el.textContent = text;
    }
  });

  // Aplica textos em atributos como title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (dict[key]) el.title = dict[key];
  });

  // Atualiza o título da página
  if (dict['title']) document.title = dict['title'];
}

// Função principal para definir o idioma
async function setLangPage() {
  const lang = localStorage.getItem('idioma') || 'pt';
  const dict = await loadLang(lang);
  window._LANG_DICT = dict;
  applyLang(dict);
  
  // Atualiza elementos específicos em cada página
  if (typeof atualizarUI === 'function') atualizarUI();
  if (typeof atualizarLoja === 'function') atualizarLoja();
}

// Listener para mudanças de idioma
window.addEventListener('languageChanged', setLangPage);

// Inicializa o idioma ao carregar
document.addEventListener('DOMContentLoaded', setLangPage);