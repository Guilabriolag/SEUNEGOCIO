// 🔗 Conexão com JSONBIN
const BIN_ID = '68db6557ae596e708f00b490';
const API_KEY = '$2a$10$tjnnaauKPcx3meNHOAbLnefskEWrEHoUCjB1Q0A2WdjUodgzxGpJG';
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// ✅ Ativar troca de abas
document.addEventListener('DOMContentLoaded', () => {
  const botoes = document.querySelectorAll('#menu button');
  const abas = document.querySelectorAll('main .tab');

  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      const destino = botao.getAttribute('data-tab');
      abas.forEach(aba => aba.classList.remove('active'));
      document.getElementById(destino).classList.add('active');
    });
  });
});

// 🧠 Salvar dados localmente
function salvar() {
  const produto = {
    nome: document.getElementById('nomeProduto')?.value || '',
    preco: document.getElementById('precoProduto')?.value || '',
    imagem: document.getElementById('imagemProduto')?.value || ''
  };

  const dados = {
    produtos: [produto],
    musica: document.getElementById('musicaFundo')?.value || '',
    idioma: document.getElementById('idiomaSelecionado')?.value || 'pt',
    modoEscuro: document.getElementById('modoEscuro')?.checked || false
  };

  localStorage.setItem('painelDados', JSON.stringify(dados));
  alert('✅ Dados salvos localmente!');
}

// 🌐 Publicar no JSONBIN
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
      alert('🚀 Dados publicados com sucesso!');
    } else {
      alert('⚠️ Erro ao publicar!');
    }
  } catch (err) {
    console.error(err);
    alert('❌ Falha na conexão!');
  }
}

// 📤 Exportar dados
function exportar() {
  const dados = localStorage.getItem('painelDados');
  const blob = new Blob([dados], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'painelDados.json';
  a.click();
}

// 📥 Importar dados
function importar() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem('painelDados', reader.result);
      alert('📦 Dados importados!');
    };
    reader.readAsText(file);
  };
  input.click();
}
