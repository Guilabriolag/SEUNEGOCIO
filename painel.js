document.addEventListener('DOMContentLoaded', () => {
  // --- STATE ---
  let state = {
    produtos: [],
    customizar: {
      corPrincipal: '#0078D4',
      modoEscuro: false,
      musicaFundo: '',
      musicaAtiva: false
    }
  };

  // --- SELECTORS ---
  const menuButtons = document.querySelectorAll('#menu button');
  const tabs = document.querySelectorAll('main .tab');
  const btnAddProduto = document.getElementById('btnAddProduto');
  const listaProdutosDiv = document.getElementById('listaProdutos');
  const btnPublicar = document.getElementById('btnPublicar');
  const btnExportar = document.getElementById('btnExportar');
  const btnImportar = document.getElementById('btnImportar');

  // --- FUNCTIONS ---
  
  // Tab Navigation
  function setupTabs() {
    menuButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        tabs.forEach(tab => tab.classList.remove('active'));
        document.getElementById(targetTab).classList.add('active');

        menuButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });
    // Activate first tab by default
    menuButtons[0].click();
  }

  // Render product list in the panel
  function renderProdutos() {
    listaProdutosDiv.innerHTML = '';
    state.produtos.forEach((produto, index) => {
      const item = document.createElement('div');
      item.className = 'product-item';
      item.innerHTML = `
        <img src="${produto.imagem || 'https://via.placeholder.com/50'}" alt="${produto.nome}">
        <div>
          <strong>${produto.nome}</strong><br>
          <span>R$ ${produto.preco}</span>
        </div>
        <button data-index="${index}">Remover</button>
      `;
      listaProdutosDiv.appendChild(item);
    });
  }

  function adicionarProduto() {
    const nome = document.getElementById('nomeProduto').value;
    const preco = document.getElementById('precoProduto').value;
    const imagem = document.getElementById('imagemProduto').value;
    const descricao = document.getElementById('descricaoProduto').value;

    if (!nome || !preco) {
      alert('Nome e Preço são obrigatórios!');
      return;
    }

    state.produtos.push({ nome, preco, imagem, descricao });
    renderProdutos();
    // Clear form fields
    document.getElementById('nomeProduto').value = '';
    document.getElementById('precoProduto').value = '';
    document.getElementById('imagemProduto').value = '';
    document.getElementById('descricaoProduto').value = '';
  }

  async function publicarDados() {
    const binId = document.getElementById('binId').value;
    const masterKey = document.getElementById('masterKey').value;
    
    if (!binId || !masterKey) {
      alert('BIN ID e Master Key são necessários para publicar!');
      return;
    }

    // Collect customization data
    state.customizar.corPrincipal = document.getElementById('corPrincipal').value;
    state.customizar.modoEscuro = document.getElementById('modoEscuro').checked;
    state.customizar.musicaFundo = document.getElementById('musicaFundo').value;
    state.customizar.musicaAtiva = document.getElementById('musicaAtiva').checked;
    
    alert('Publicando dados... Aguarde a confirmação.');

    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': masterKey
        },
        body: JSON.stringify(state)
      });
      
      if (!response.ok) {
        throw new Error(`Erro na publicação: ${response.statusText}`);
      }

      await response.json();
      alert('✅ Dados publicados com sucesso no Totem!');
    } catch (error) {
      console.error('Erro ao publicar:', error);
      alert(`❌ Falha na publicação. Verifique o console (F12) para mais detalhes.`);
    }
  }

  function exportarDados() {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dados_seunegocio.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  function importarDados(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedState = JSON.parse(e.target.result);
        state = importedState;
        renderProdutos();
        // Update UI with imported customization
        document.getElementById('corPrincipal').value = state.customizar.corPrincipal || '#0078D4';
        document.getElementById('modoEscuro').checked = state.customizar.modoEscuro || false;
        document.getElementById('musicaFundo').value = state.customizar.musicaFundo || '';
        document.getElementById('musicaAtiva').checked = state.customizar.musicaAtiva || false;
        alert('Dados importados com sucesso!');
      } catch (error) {
        alert('Arquivo JSON inválido!');
      }
    };
    reader.readAsText(file);
  }

  // --- EVENT LISTENERS ---
  setupTabs();
  btnAddProduto.addEventListener('click', adicionarProduto);
  btnPublicar.addEventListener('click', publicarDados);
  btnExportar.addEventListener('click', exportarDados);
  btnImportar.addEventListener('change', importarDados);
  
  listaProdutosDiv.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const index = e.target.getAttribute('data-index');
      state.produtos.splice(index, 1);
      renderProdutos();
    }
  });
});
