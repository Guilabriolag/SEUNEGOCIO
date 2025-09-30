// Troca de abas
document.querySelectorAll('#menu button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// JSONBIN config
const BIN_ID = 'SEU_BIN_ID';
const API_KEY = 'SUA_API_KEY';
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Salvar dados
function salvar() {
  const dados = {
    loja: document.getElementById('nomeLoja')?.value || '',
    musica: document.getElementById('musicaFundo')?.value || '',
    // Adicione aqui todos os campos relevantes
  };
  localStorage.setItem('painelDados', JSON.stringify(dados));
  alert('Dados salvos localmente!');
}

// Publicar no JSONBIN
async function publicar() {
  const dados = JSON.parse(localStorage.getItem('painelDados') || '{}');
  try {
    const res = await fetch(BASE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY
      },
      body: JSON.stringify(dados)
    });
    if (res.ok) {
      alert('Dados publicados com sucesso!');
    } else {
      alert('Erro ao publicar!');
    }
  } catch (err) {
    console.error(err);
    alert('Falha na conexão!');
  }
}

// Exportar
function exportar() {
  const dados = localStorage.getItem('painelDados');
  const blob = new Blob([dados], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'painelDados.json';
  a.click();
}

// Importar
function importar() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem('painelDados', reader.result);
      alert('Dados importados!');
    };
    reader.readAsText(file);
  };
  input.click();
}

// Idioma (exemplo simples)
const idiomas = {
  pt: { salvar: 'Salvar', publicar: 'Publicar' },
  en: { salvar: 'Save', publicar: 'Publish' },
  es: { salvar: 'Guardar', publicar: 'Publicar' }
};

function aplicarIdioma(lang) {
  document.querySelector('button[onclick="salvar()"]').textContent = idiomas[lang].salvar;
  document.querySelector('button[onclick="publicar()"]').textContent = idiomas[lang].publicar;
}

// Sons
function tocarSom(tipo) {
  const sons = {
    sucesso: 'https://example.com/sucesso.mp3',
    erro: 'https://example.com/erro.mp3'
  };
  const audio = new Audio(sons[tipo]);
  audio.play();
}

// Animações (exemplo simples)
document.querySelectorAll('section.tab').forEach(tab => {
  tab.style.transition = 'opacity 0.5s ease';
});

// Modo escuro
function aplicarModoEscuro(ativo) {
  document.body.style.backgroundColor = ativo ? '#111' : '#f5f5f5';
  document.body.style.color = ativo ? '#eee' : '#333';
}
