const BIN_ID = '68db6557ae596e708f00b490';
const API_KEY = '$2a$10$tjnnaauKPcx3meNHOAbLnefskEWrEHoUCjB1Q0A2WdjUodgzxGpJG';
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;

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
