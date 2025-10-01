document.addEventListener('DOMContentLoaded', () => {
  const menuContainer = document.getElementById('menu');
  const tabs = document.querySelectorAll('main .tab');

  // Estrutura inicial de dados
  let state = JSON.parse(localStorage.getItem("painelData")) || {
    categorias: [],
    produtos: [],
    clientes: [],
    cupons: [],
    publicidade: {
      banner: { texto: "", url: "", link: "" },
      carrossel: [],
      instagram: "",
      facebook: "",
      whatsapp: ""
    },
    dadosLoja: {
      nome: "",
      telefone: "",
      pix: "",
      banco: "",
      endereco: "",
      logo: "",
      horario: ""
    },
    cobertura: []
  };

  const TABS_CONFIG = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'categorias', label: '🗂️ Categorias' },
    { id: 'modo-venda', label: '⚖️ Modo de Venda' },
    { id: 'produtos', label: '📦 Produtos' },
    { id: 'clientes', label: '👥 Clientes' },
    { id: 'cupons', label: '🎟️ Cupons' },
    { id: 'publicidade', label: '📢 Publicidade' },
    { id: 'dados-loja', label: '🗝️ Dados da Loja' },
    { id: 'cobertura', label: '🗺️ Cobertura' },
    { id: 'customizar', label: '🎨 Customizar' },
    { id: 'config', label: '⚙️ Configurações' }
  ];

  // Criar botões de navegação
  TABS_CONFIG.forEach(tabInfo => {
    const button = document.createElement('button');
    button.dataset.tab = tabInfo.id;
    button.innerHTML = tabInfo.label;
    menuContainer.appendChild(button);
  });

  const menuButtons = document.querySelectorAll('#menu button');

  menuContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const targetTabId = e.target.dataset.tab;
      tabs.forEach(tab => tab.classList.remove('active'));
      const targetTab = document.getElementById(targetTabId);
      if (targetTab) targetTab.classList.add('active');
      menuButtons.forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
    }
  });

  if (menuButtons.length > 0) menuButtons[0].click();

  // ========================
  // Funções Auxiliares
  // ========================
  function salvarLocal() {
    localStorage.setItem("painelData", JSON.stringify(state));
  }

  function coletarDadosDoPainel() {
    return state;
  }

  function exportarJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "painel-dados.json");
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  }

  async function importarJSON(arquivo) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        state = JSON.parse(e.target.result);
        salvarLocal();
        alert("✅ Importado com sucesso!");
      } catch (err) {
        alert("❌ Erro ao importar JSON");
      }
    };
    reader.readAsText(arquivo);
  }

  async function publicarNoTotem() {
    const binId = document.querySelector("input[placeholder='Seu BIN ID']").value;
    const masterKey = document.querySelector("input[placeholder='Sua Master Key']").value;
    if (!binId || !masterKey) {
      alert("Informe BIN ID e Master Key");
      return;
    }

    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": masterKey
        },
        body: JSON.stringify(state)
      });
      if (res.ok) {
        alert("✅ Publicado no Totem!");
      } else {
        alert("❌ Erro ao publicar: " + res.status);
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão com JSONBIN");
    }
  }

  // ========================
  // Ligações com Botões
  // ========================
  // Exportar JSON
  document.querySelector("button.btn-secondary:nth-of-type(1)").addEventListener("click", exportarJSON);

  // Importar JSON
  document.querySelector("button.btn-secondary:nth-of-type(2)").addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => importarJSON(e.target.files[0]);
    input.click();
  });

  // Publicar no Totem
  document.querySelector(".btn-primary").addEventListener("click", publicarNoTotem);

  // Restaurar Padrão
  document.querySelector(".btn-danger").addEventListener("click", () => {
    if (confirm("Tem certeza que deseja restaurar o padrão?")) {
      state = { categorias: [], produtos: [], clientes: [], cupons: [], publicidade: {}, dadosLoja: {}, cobertura: [] };
      salvarLocal();
      alert("✅ Restaurado");
    }
  });

  // Aqui você pode adicionar listeners específicos de cada formulário
  // Exemplo: Criar Categoria
  const btnCat = document.querySelector("#categorias button");
  if (btnCat) {
    btnCat.addEventListener("click", () => {
      const nome = document.querySelector("#categorias input").value;
      if (nome) {
        state.categorias.push({ nome, sub: [] });
        salvarLocal();
        alert("Categoria adicionada!");
      }
    });
  }

  // Criar Produto
  const btnProd = document.querySelector("#produtos .form-buttons button:nth-of-type(1)");
  if (btnProd) {
    btnProd.addEventListener("click", () => {
      const inputs = document.querySelectorAll("#produtos input, #produtos select, #produtos textarea");
      const produto = {
        nome: inputs[0].value,
        preco: inputs[1].value,
        imagem: inputs[2].value,
        categoria: inputs[3].value,
        subcategoria: inputs[4].value,
        modoVenda: inputs[5].value,
        estoque: inputs[6].value,
        destaque: inputs[7].checked,
        ativo: inputs[8].checked,
        descricao: inputs[9].value
      };
      state.produtos.push(produto);
      salvarLocal();
      alert("Produto criado!");
    });
  }

  // Salvar Cliente
  const btnCliente = document.querySelector("#clientes .form-buttons button");
  if (btnCliente) {
    btnCliente.addEventListener("click", () => {
      const inputs = document.querySelectorAll("#clientes input, #clientes textarea");
      const cliente = {
        nome: inputs[0].value,
        telefone: inputs[1].value,
        endereco: inputs[2].value,
        bairro: inputs[3].value,
        historico: inputs[4].value,
        notificacoes: inputs[5].checked
      };
      state.clientes.push(cliente);
      salvarLocal();
      alert("Cliente salvo!");
    });
  }

});
