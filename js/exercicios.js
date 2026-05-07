// Lógica para as abas (Tabs)
document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.exercise-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            
            // Reset all reveals when switching tabs
            resetAllReveals();
        });
    });

    // Filtro de Julgamento (Ex 5) - Tornar palavras clicáveis
    document.querySelectorAll('.mixed-text-box p').forEach(p => {
        // Divide o texto por espaços, incluindo a pontuação com a palavra
        const text = p.innerText;
        const words = text.split(' ');
        
        // Reconstrói o HTML com cada palavra envolta em um span clicável
        p.innerHTML = words.map(word => {
            // Escapa as aspas apenas para evitar quebrar o HTML, 
            // mas mantém o visual intacto se houver.
            return `<span class="strikeable-word">${word}</span>`;
        }).join(' ');
    });

    // Lógica para marcar as palavras ao clicar (Riscado ou Highlight)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('strikeable-word')) {
            // Verifica em qual exercício estamos para decidir o estilo
            const exerciseId = e.target.closest('.exercise-content').id;
            
            if (exerciseId === 'ex3') {
                e.target.classList.toggle('user-highlighted');
            } else if (exerciseId === 'ex5') {
                e.target.classList.toggle('user-struck');
            }
        }
    });
});

// Lógica para o componente "Secure Reveal"
function requestReveal(btnElement) {
    const secureContainer = btnElement.closest('.secure-reveal');
    const revealBtn = btnElement;
    const confirmBox = secureContainer.querySelector('.reveal-confirm');
    
    // Hide original button, show confirmation
    revealBtn.classList.add('hidden');
    confirmBox.classList.remove('hidden');
}

function confirmReveal(btnElement) {
    const secureContainer = btnElement.closest('.secure-reveal');
    const confirmBox = secureContainer.querySelector('.reveal-confirm');
    const contentBox = secureContainer.querySelector('.reveal-content');
    
    // Hide confirmation, show actual content
    confirmBox.classList.add('hidden');
    contentBox.classList.remove('hidden');
}

function cancelReveal(btnElement) {
    const secureContainer = btnElement.closest('.secure-reveal');
    const revealBtn = secureContainer.querySelector('.elegant-btn.outline');
    const confirmBox = secureContainer.querySelector('.reveal-confirm');
    
    // Hide confirmation, show original button again
    confirmBox.classList.add('hidden');
    revealBtn.classList.remove('hidden');
}

function resetAllReveals() {
    const secureContainers = document.querySelectorAll('.secure-reveal');
    secureContainers.forEach(container => {
        const revealBtn = container.querySelector('.elegant-btn.outline');
        const confirmBox = container.querySelector('.reveal-confirm');
        const contentBox = container.querySelector('.reveal-content');
        
        revealBtn.classList.remove('hidden');
        confirmBox.classList.add('hidden');
        contentBox.classList.add('hidden');
    });
}

// Lógica para o Lens Selector (Ex 6)
document.addEventListener('DOMContentLoaded', () => {
    const lensBtns = document.querySelectorAll('.lens-btn');
    const lensContents = document.querySelectorAll('.lens-content');

    lensBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            lensBtns.forEach(b => b.classList.remove('active'));
            lensContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const targetId = 'lens-' + btn.getAttribute('data-lens');
            document.getElementById(targetId).classList.add('active');
            
            resetAllReveals();
        });
    });

    // Initialize Flashcards
    if (document.getElementById('fc-current')) {
        renderFlashcard();
    }
});

// Dados para o Flashcards (Ex 7)
const flashcardsData = [
    {
        title: "Cena A",
        text: "Toda decisão de gasto acima de R$ 200 precisa de aprovação do diretor. Ele aprova em 3 dias. O time espera.",
        primary: "<strong>Compressão (4)</strong>. O fluxo está bloqueado num ponto.",
        secondary: null
    },
    {
        title: "Cena B",
        text: "O discurso oficial diz \"autonomia e confiança\". O sistema de assinaturas exige 3 aprovações. Os dois coexistem sem ninguém questionar.",
        primary: "<strong>Disjunção (1)</strong>. Dois regimes simultâneos e contraditórios.",
        secondary: null
    },
    {
        title: "Cena C",
        text: "Um time da empresa começou a fazer reuniões sem pauta fixa. Os resultados melhoraram. Nenhum outro time replicou a prática.",
        primary: "<strong>Atração (7)</strong>. Alguém já faz diferente, mas não se espalha.",
        secondary: "<strong>Capacidade latente (8)</strong> — a prática existe como potência não aproveitada."
    },
    {
        title: "Cena D",
        text: "A empresa precisa de entregas rápidas para competir. A empresa precisa de certificação de qualidade para manter o cliente grande. Ambas são necessárias e se tensionam.",
        primary: "<strong>Paradoxo (2)</strong>. Dois polos legítimos em tensão.",
        secondary: "<strong>Fratura (3)</strong> — a interface entre velocidade e qualidade não foi desenhada."
    },
    {
        title: "Cena E",
        text: "O time se reúne toda segunda para planejar. As tarefas são definidas, distribuídas e ninguém começa antes de quarta.",
        primary: "<strong>Estagnação (5)</strong>. Energia no planejamento, movimento na execução não.",
        secondary: "<strong>Compressão (4)</strong> — algo entre segunda e quarta comprime o fluxo."
    },
    {
        title: "Cena F",
        text: "Três pessoas do time sabem programar em Python. As tarefas de automação são todas feitas manualmente em Excel.",
        primary: "<strong>Capacidade latente (8)</strong>. O saber-fazer existe e não é usado.",
        secondary: null
    },
    {
        title: "Cena G",
        text: "A empresa mudou de estratégia 4 vezes nos últimos 6 meses. Cada vez as prioridades mudam, equipes se reorganizam, nada é concluído.",
        primary: "<strong>Turbulência (6)</strong>. Movimento sem direção.",
        secondary: "<strong>Estagnação (5)</strong> — tanto movimento que nada avança."
    },
    {
        title: "Cena H",
        text: "Duas pessoas começaram a documentar decisões técnicas espontaneamente. Ninguém pediu. A prática não se espalhou porque não há onde compartilhar.",
        primary: "<strong>Emergência travada (9)</strong>. Algo tentando nascer, barrado pela ausência de suporte.",
        secondary: null
    },
    {
        title: "Cena I",
        text: "Vendas promete prazos sem consultar produto. Produto descobre os prazos quando o cliente já está esperando. Não há reunião conjunta entre as áreas.",
        primary: "<strong>Fratura (3)</strong>. Interface mal desenhada entre áreas que precisam cooperar.",
        secondary: "<strong>Disjunção (1)</strong> — dois regimes de promessa e entrega sem alinhamento."
    }
];

let currentCardIndex = 0;

function renderFlashcard() {
    const data = flashcardsData[currentCardIndex];
    document.getElementById('fc-current').innerText = currentCardIndex + 1;
    document.getElementById('fc-total').innerText = flashcardsData.length;
    document.getElementById('fc-scene-title').innerText = data.title;
    document.getElementById('fc-scene-text').innerText = data.text;
    
    document.getElementById('fc-primary-ans').innerHTML = data.primary;
    
    const secContainer = document.getElementById('fc-secondary-container');
    if (data.secondary) {
        document.getElementById('fc-secondary-ans').innerHTML = data.secondary;
        secContainer.classList.remove('hidden');
    } else {
        secContainer.classList.add('hidden');
    }
    
    // reset UI
    document.getElementById('fc-answer-box').classList.add('hidden');
    document.getElementById('fc-reveal-btn').classList.remove('hidden');
    
    // Disable/Enable nav buttons
    document.getElementById('fc-prev').disabled = currentCardIndex === 0;
    document.getElementById('fc-next').disabled = currentCardIndex === flashcardsData.length - 1;
}

document.addEventListener('DOMContentLoaded', () => {
    const btnNext = document.getElementById('fc-next');
    const btnPrev = document.getElementById('fc-prev');
    const btnReveal = document.getElementById('fc-reveal-btn');
    
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if (currentCardIndex < flashcardsData.length - 1) {
                currentCardIndex++;
                renderFlashcard();
            }
        });
    }
    
    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (currentCardIndex > 0) {
                currentCardIndex--;
                renderFlashcard();
            }
        });
    }
    
    if (btnReveal) {
        btnReveal.addEventListener('click', () => {
            document.getElementById('fc-reveal-btn').classList.add('hidden');
            document.getElementById('fc-answer-box').classList.remove('hidden');
        });
    }
});
