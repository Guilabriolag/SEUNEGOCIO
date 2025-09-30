document.addEventListener('DOMContentLoaded', () => {
  const botoes = document.querySelectorAll('#menu button');
  const abas = document.querySelectorAll('main .tab');

  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      const destino = botao.getAttribute('data-tab');
      abas.forEach(aba => aba.classList.remove('active'));
      const alvo = document.getElementById(destino);
      if (alvo) alvo.classList.add('active');
    });
  });
});
