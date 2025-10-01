document.addEventListener('DOMContentLoaded', () => {
  // --- CONFIG ---
  // ATENÇÃO: Estes dados devem ser os mesmos do seu painel.
  const BIN_ID = '68db6557ae596e708f00b490';
  const API_KEY = '$2a$10$tjnnaauKPcx3meNHOAbLnefskEWrEHoUCjB1Q0A2WdjUodgzxGpJG';
  const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;

  // --- SELECTORS ---
  const carrosselDiv = document.getElementById('carrossel');
  const musicaDiv = document.getElementById('musica');

  // --- FUNCTIONS ---
  
  function montarCarrossel(produtos = []) {
    if (produtos.length === 0) {
      carrosselDiv.innerHTML = '<p>Nenhum produto encontrado. Configure o painel e publique os dados.</p>';
      return;
    }

    carrosselDiv.innerHTML = ''; // Limpa o conteúdo
    produtos.forEach(produto => {
      const precoFormatado = parseFloat(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      
      const produtoHTML = `
        <div class="produto">
          <img src="${produto.imagem || 'https://via.placeholder.com/300x200'}" alt="${produto.nome}">
          <h3>${produto.nome}</h3>
          <p class="descricao">${produto.descricao || ''}</p>
          <p class="preco">${precoFormatado}</p>
        </div>
      `;
      carrosselDiv.innerHTML += produtoHTML;
    });
  }

  function aplicarCustomizacao(customizar = {}) {
    const root = document.documentElement;
    
    // Aplica cores
    if (customizar.corPrincipal) {
      root.style.setProperty('--cor-principal', customizar.corPrincipal);
    }

    // Aplica modo escuro
    if (customizar.modoEscuro) {
      document.body.classList.add('dark-mode');
    }

    // Aplica música
    if (customizar.musicaAtiva && customizar.musicaFundo) {
      // Converte link do YouTube normal para link de embed
      const videoId = customizar.musicaFundo.split('v=')[1];
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId.split('&')[0]}?autoplay=1&loop=1&controls=0&mute=1`;
        musicaDiv.innerHTML = `<iframe width="50" height="30" src="${embedUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
      }
    }
  }

  async function carregarDados() {
    try {
      const res = await fetch(BASE_URL, {
        headers: { 'X-Master-Key': API_KEY }
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const jsonResponse = await res.json();
      const dados = jsonResponse.record;
      
      // Monta a tela com os dados carregados
      montarCarrossel(dados.produtos);
      aplicarCustomizacao(dados.customizar);

    } catch (err) {
      console.error('Erro ao carregar dados do totem:', err);
      carrosselDiv.innerHTML = '<p>Ocorreu um erro ao carregar o cardápio. Tente novamente mais tarde.</p>';
    }
  }

  // --- INITIALIZATION ---
  carregarDados();
});
