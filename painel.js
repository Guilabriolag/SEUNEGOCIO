document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu');
    const tabs = document.querySelectorAll('main .tab');

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

    // 1. Criar botões de navegação dinamicamente
    TABS_CONFIG.forEach(tabInfo => {
        const button = document.createElement('button');
        button.dataset.tab = tabInfo.id;
        button.innerHTML = tabInfo.label;
        menuContainer.appendChild(button);
    });

    const menuButtons = document.querySelectorAll('#menu button');

    // 2. Lógica para alternar abas
    menuContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const targetTabId = e.target.dataset.tab;

            // Esconder todas as abas
            tabs.forEach(tab => tab.classList.remove('active'));

            // Mostrar a aba alvo
            const targetTab = document.getElementById(targetTabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }

            // Marcar botão como ativo
            menuButtons.forEach(button => button.classList.remove('active'));
            e.target.classList.add('active');
        }
    });

    // 3. Ativar a primeira aba por padrão
    if (menuButtons.length > 0) {
        menuButtons[0].click();
    }

    // 4. Inicializar o Gráfico do Dashboard (Exemplo)
    const ctx = document.getElementById('vendasChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Vendas da Semana',
                data: [120, 190, 300, 500, 200, 300, 450],
                backgroundColor: 'rgba(41, 128, 185, 0.2)',
                borderColor: 'rgba(41, 128, 185, 1)',
                borderWidth: 2,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
