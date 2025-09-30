// Config JSONBIN
const BIN_ID = 'SEU_BIN_ID';
const API_KEY = 'SUA_API_KEY';
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;

// Carregar dados do painel
async function carregarDados() {
  try {
    const res = await fetch(BASE_URL, {
      headers: { 'X-Master-Key': API_KEY }
    });
    const json = await res.json();
    const dados = json.record;
    montarCarrossel(dados.produtos || []);
    aplicarMusica(dados.musica);
    aplicarIdioma(dados.idioma || 'pt');
    gerarQR();
    aplicarModoEscuro(dados.modoEscuro);
  } catch (err) {
    console.error('Erro ao carregar dados:', err);
  }
}

// Montar carrossel de produtos
function montarCarrossel(produtos) {
  const carrossel = document.getElementById('carrossel');
  carrossel.innerHTML = '';
  produtos.forEach(prod => {
    const div = document.createElement('div');
    div.className = 'produto';
    div.innerHTML = `
      <img src="${prod.imagem}" alt="${prod.nome}" />
      <h3>${prod.nome}</h3>
      <p>R$ ${prod.preco}</p>
      <button onclick="confirmarPedido('${prod.nome}')">Adicionar</button>
    `;
    carrossel.appendChild(div);
  });
}

// Confirmar pedido
function confirmarPedido(nome) {
  alert(`Produto "${nome}" adicionado ao pedido!`);
  // Aqui você pode integrar com impressão ou carrinho
}

// Música de fundo
function aplicarMusica(link) {
  if (!link) return;
  const musica = document.getElementById('musica');
  if (link.includes('spotify')) {
    musica.innerHTML = `<iframe src="${link}" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
    musica.style.display = 'block';
  } else if (link.includes('youtube')) {
    musica.innerHTML = `<iframe width="0" height="0" src="${link}?autoplay=1&loop=1" frameborder="0" allow="autoplay"></iframe>`;
  }
}

// Idioma
function aplicarIdioma(lang) {
  const textos = {
    pt: { retirar: '🛍️ Retirar', delivery: '🚚 Delivery' },
    en: { retirar: '🛍️ Pickup', delivery: '🚚 Delivery' },
    es: { retirar: '🛍️ Retiro', delivery: '🚚 Entrega' }
  };
  document.getElementById('retirar').textContent = textos[lang].retirar;
  document.getElementById('delivery').textContent = textos[lang].delivery;
}

document.getElementById('idioma').addEventListener('change', e => {
  aplicarIdioma(e.target.value);
});

// QR Code
function gerarQR() {
  const url = window.location.href;
  const qr = document.getElementById('qr');
  qr.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(url)}" alt="QR Code" />`;
}

// Modo escuro
function aplicarModoEscuro(ativo) {
  document.body.style.backgroundColor = ativo ? '#111' : '#fff';
  document.body.style.color = ativo ? '#eee' : '#333';
}

// Iniciar
window.onload = carregarDados;
