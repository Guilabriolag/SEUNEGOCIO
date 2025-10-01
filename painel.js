document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // 1. ESTADO CENTRAL DO PAINEL
    // =================================================================
    let state = {
        dashboard: {},
        categorias: {},
        modoVenda: {},
        produtos: [],
        clientes: [],
        cupons: [],
        publicidade: {},
        dadosLoja: {},
        cobertura: [],
        customizar: {},
        config: {}
    };

    // =================================================================
    // 2. SELETORES DE ELEMENTOS DO HTML (DOM)
    // =================================================================
    const menuContainer = document.getElementById('menu');
    const tabs = document.querySelectorAll('main .tab');
    
    // --- Aba de Produtos ---
    const formProduto = document.querySelector('#produtos .card');
    const btnCriarProduto = formProduto.querySelector('button');
    const listaProdutosContainer = document.createElement('div');
    formProduto.appendChild(listaProdutosContainer);

    // --- Aba de Configurações ---
    const btnPublicar = document.querySelector('#config .btn-primary');


    // =================================================================
    // 3. FUNÇÕES PRINCIPAIS
    // =================================================================

    // --- NAVEGAÇÃO E UI GERAL (sem alterações) ---
    function setupTabs() {
        const TABS_CONFIG = [ { id: 'dashboard', label: '📊 Dashboard' }, { id: 'categorias', label: '𗂬 Categorias' }, { id: 'modo-venda', label: '⚖️ Modo de Venda' }, { id: 'produtos', label: '📦 Produtos' }, { id: 'clientes', label: '👥 Clientes' }, { id: 'cupons', label: '🎟️ Cupons' }, { id: 'publicidade', label: '📢 Publicidade' }, { id: 'dados-loja', label: '🗝️ Dados da Loja' }, { id: 'cobertura', label: '🗺️ Cobertura' }, { id: 'customizar', label: '🎨 Customizar' }, { id: 'config', label: '⚙️ Configurações' } ];
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
                menuButtons.forEach(button => button.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
        if (menuButtons.length > 0) menuButtons[0].click();
    }
    function setupDashboardChart() { /* ...código do gráfico sem alterações... */ }

    // --- ABA PRODUTOS (sem alterações) ---
    function renderizarProdutos() { /* ...código de renderizar sem alterações... */ }
    function adicionarProduto() { /* ...código de adicionar sem alterações... */ }
    function removerProduto(index) { /* ...código de remover sem alterações... */ }

    // --- ABA CONFIGURAÇÕES (NOVA LÓGICA) ---
    
    /**
     * Coleta todos os dados de todas as abas e os agrupa no objeto 'state'.
     */
    function coletarDadosDoPainel() {
        // Coleta dados da aba "Customizar"
        const customizarTab = document.getElementById('customizar');
        state.customizar = {
            corPrincipal: customizarTab.querySelector('input[type="color"]').value,
            modoEscuro: customizarTab.querySelector('input[type="checkbox"]').checked,
            musicaFundo: customizarTab.querySelector('input[type="text"]').value.trim()
        };

        // Coleta dados da aba "Dados da Loja"
        const dadosLojaTab = document.getElementById('dados-loja');
        state.dadosLoja = {
            nome: dadosLojaTab.querySelector('input[placeholder="Nome da Loja"]').value,
            telefone: dadosLojaTab.querySelector('input[placeholder="Telefone Principal"]').value,
            pix: dadosLojaTab.querySelector('input[placeholder="Chave PIX"]').value,
            // Adicionar outros campos aqui
        };
        
        // A lista de produtos (state.produtos) já está atualizada pelas funções adicionar/remover.
        
        // Futuramente, adicionar a coleta de dados das outras abas aqui.
        console.log("Dados coletados para publicação:", state);
    }

    /**
     * Envia o objeto 'state' completo para o JSONBin.
     */
    async function publicarDados() {
        if (!confirm("Você tem certeza que deseja publicar os dados atuais no totem? Isso irá sobrescrever os dados antigos.")) {
            return;
        }

        // 1. Coleta os dados mais recentes de todos os campos
        coletarDadosDoPainel();

        // 2. Pega as chaves da API
        const configTab = document.getElementById('config');
        const binId = configTab.querySelector('input[value="68db6557ae596e708f00b490"]').value;
        const masterKey = configTab.querySelector('input[type="password"]').value;

        if (!masterKey) {
            alert("Erro: A 'Master Key' do JSONBIN é obrigatória para publicar!");
            return;
        }
        
        alert("Publicando... Por favor, aguarde.");

        // 3. Envia os dados para a API
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
                const errorData = await response.json();
                throw new Error(`Erro ${response.status}: ${errorData.message}`);
            }

            await response.json();
            alert("✅ Sucesso! Os dados foram publicados e seu totem está atualizado.");

        } catch (error) {
            console.error("Falha na Publicação:", error);
            alert(`❌ Falha ao publicar os dados. Verifique o console (F12) para detalhes do erro.`);
        }
    }


    // =================================================================
    // 4. EVENT LISTENERS
    // =================================================================
    btnCriarProduto.addEventListener('click', adicionarProduto);
    listaProdutosContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-danger') && e.target.dataset.index) {
            removerProduto(e.target.dataset.index);
        }
    });

    // NOVO: Event listener para o botão de Publicar
    btnPublicar.addEventListener('click', publicarDados);


    // =================================================================
    // 5. INICIALIZAÇÃO
    // =================================================================
    setupTabs();
    setupDashboardChart();
    renderizarProdutos();
});
