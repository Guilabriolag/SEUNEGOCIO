document.addEventListener('DOMContentLoaded', () => {
  const menuContainer = document.getElementById('menu');
  const tabs = document.querySelectorAll('main .tab');

  // =======================
  // Estado Global
  // =======================
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

  // =======================
  // Abas Dinâmicas
  // =======================
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

  // =======================
  // Funções Auxiliares
  // =======================
  function salvarLocal() {
    localStorage.setItem("painelData", JSON.stringify(state));
  }

  function renderizarCategorias() {
    const container = document.getElementById("category-tree");
    container.innerHTML = "";
    state.categorias.forEach((cat, i) => {
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.innerHTML = `${cat.nome} <button data-del="${i}" class="btn-small">Excluir</button>`;
      details.appendChild(summary);

      const ul = document.createElement("ul");
      cat.sub.forEach((s, j) => {
        const li = document.createElement("li");
        li.innerHTML = `${s} <button data-del-sub="${i}-${j}" class="btn-small">Excluir</button>`;
        ul.appendChild(li);
      });
      details.appendChild(ul);

      container.appendChild(details);
    });

    // Eventos de excluir
    container.querySelectorAll("button[data-del]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const i = e.target.dataset.del;
        state.categorias.splice(i, 1);
        salvarLocal();
        renderizarCategorias();
      });
    });
    container.querySelectorAll("button[data-del-sub]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const [i, j] = e.target.dataset.delSub.split("-");
        state.categorias[i].sub.splice(j, 1);
        salvarLocal();
        renderizarCategorias();
      });
    });
  }

  function renderizarProdutos() {
    const listDiv = document.querySelector("#produtos hr + input")?.parentNode;
    if (!listDiv) return;
    let html = "<h3>Lista de Produtos</h3><ul>";
    state.produtos.forEach((p, i) => {
      html += `<li>
        <strong>${p.nome}</strong> - R$ ${p.preco}
        <button data-del-prod="${i}" class="btn-small">Excluir</button>
      </li>`;
    });
    html += "</ul>";
    listDiv.innerHTML = html;

    listDiv.querySelectorAll("button[data-del-prod]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const i = e.target.dataset.delProd;
        state.produtos.splice(i, 1);
        salvarLocal();
        renderizarProdutos();
      });
    });
  }

  function renderizarClientes() {
    const sec = document.getElementById("clientes");
    let html = "<h3>Lista de Clientes</h3><ul>";
    state.clientes.forEach((c, i) => {
      html += `<li>${c.nome} - ${c.telefone}
        <button data-del-cli="${i}" class="btn-small">Excluir</button></li>`;
    });
    html += "</ul>";
    sec.insertAdjacentHTML("beforeend", html);

    sec.querySelectorAll("button[data-del-cli]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const i = e.target.dataset.delCli;
        state.clientes.splice(i, 1);
        salvarLocal();
        renderizarClientes();
      });
    });
  }

  function renderizarCupons() {
    const sec = document.getElementById("cupons");
    let html = "<h3>Cupons Ativos</h3><ul>";
    state.cupons.forEach((c, i) => {
      html += `<li>${c.codigo} - ${c.valor} 
        <button data-del-cup="${i}" class="btn-small">Excluir</button></li>`;
    });
    html += "</ul>";
    sec.insertAdjacentHTML("beforeend", html);

    sec.querySelectorAll("button[data-del-cup]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const i = e.target.dataset.delCup;
        state.cupons.splice(i, 1);
        salvarLocal();
        renderizarCupons();
      });
    });
  }

  // =======================
  // Eventos dos Formulários
  // =======================

  // Categoria
  document.querySelector("#categorias button")?.addEventListener("click", () => {
    const input = document.querySelector("#categorias input");
    if (input.value.trim()) {
      state.categorias.push({ nome: input.value, sub: [] });
      salvarLocal();
      input.value = "";
      renderizarCategorias();
    }
  });

  // Produto
  document.querySelector("#produtos .form-buttons button:nth-of-type(1)")?.addEventListener("click", () => {
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
    renderizarProdutos();
    alert("Produto adicionado!");
  });

  // Cliente
  document.querySelector("#clientes .form-buttons button")?.addEventListener("click", () => {
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
    renderizarClientes();
  });

  // Cupom
  document.querySelector("#cupons .form-buttons button")?.addEventListener("click", () => {
    const inputs = document.querySelectorAll("#cupons input, #cupons select, #cupons textarea");
    const cupom = {
      codigo: inputs[0].value,
      tipo: inputs[1].value,
      valor: inputs[2].value,
      validade: inputs[3].value,
      minimo: inputs[4].value,
      limite: inputs[5].value,
      mensagem: inputs[6].value,
      ativo: inputs[7].checked
    };
    state.cupons.push(cupom);
    salvarLocal();
    renderizarCupons();
  });

  // =======================
  // Exportar / Importar / Publicar
  // =======================
  function exportarJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "painel-dados.json");
    dlAnchor.click();
  }

  async function importarJSON(arquivo) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        state = JSON.parse(e.target.result);
        salvarLocal();
        alert("✅ Importado com sucesso!");
        renderizarCategorias();
        renderizarProdutos();
        renderizarClientes();
        renderizarCupons();
      } catch {
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

  // Ligações com os botões
  const botoesConfig = document.querySelectorAll("#config .form-buttons button");
  botoesConfig[1].addEventListener("click", publicarNoTotem);   // Publicar
  botoesConfig[2].addEventListener("click", exportarJSON);      // Exportar
  botoesConfig[3].addEventListener("click", () => {             // Importar
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => importarJSON(e.target.files[0]);
    input.click();
  });
  botoesConfig[4].addEventListener("click", () => {             // Restaurar
    if (confirm("Restaurar padrão?")) {
      state = { categorias: [], produtos: [], clientes: [], cupons: [], publicidade: {}, dadosLoja: {}, cobertura: [] };
      salvarLocal();
      alert("✅ Restaurado!");
    }
  });

  // =======================
  // Inicialização
  // =======================
  renderizarCategorias();
  renderizarProdutos();
  renderizarClientes();
  renderizarCupons();
});
