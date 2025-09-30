const BIN_ID = '68db6557ae596e708f00b490';
const API_KEY = '$2a$10$tjnnaauKPcx3meNHOAbLnefskEWrEHoUCjB1Q0A2WdjUodgzxGpJG';
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Exemplo de produto
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
  alert('Dados salvos localmente!');
}

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
