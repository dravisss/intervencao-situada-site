// Perturbações page — Exercícios de Intervenção

document.addEventListener('DOMContentLoaded', () => {

    // Tab navigation (shared selector with exercicios.html)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.exercise-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const target = document.getElementById(targetId);
            if (target) target.classList.add('active');

            resetAllReveals();
        });
    });

    // Strikeable words for Actantes (ex3)
    document.querySelectorAll('.mixed-text-box p').forEach(p => {
        const text = p.innerText;
        const words = text.split(' ');
        p.innerHTML = words.map(word =>
            `<span class="strikeable-word">${word}</span>`
        ).join(' ');
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('strikeable-word')) {
            const ex = e.target.closest('.exercise-content');
            if (ex) {
                const id = ex.id;
                if (id === 'ex3') {
                    e.target.classList.toggle('user-highlighted');
                } else if (id === 'ex5') {
                    e.target.classList.toggle('user-struck');
                }
            }
        }
    });

});

// Reuse secure reveal from shared exercicios.js
function requestReveal(btn) {
    const container = btn.closest('.secure-reveal');
    const confirmBox = container.querySelector('.reveal-confirm');
    btn.classList.add('hidden');
    confirmBox.classList.remove('hidden');
}

function confirmReveal(btn) {
    const container = btn.closest('.secure-reveal');
    const confirmBox = container.querySelector('.reveal-confirm');
    const contentBox = container.querySelector('.reveal-content');
    confirmBox.classList.add('hidden');
    contentBox.classList.remove('hidden');
}

function cancelReveal(btn) {
    const container = btn.closest('.secure-reveal');
    const revealBtn = container.querySelector('.elegant-btn.outline');
    const confirmBox = container.querySelector('.reveal-confirm');
    confirmBox.classList.add('hidden');
    revealBtn.classList.remove('hidden');
}

function resetAllReveals() {
    document.querySelectorAll('.secure-reveal').forEach(container => {
        const revealBtn = container.querySelector('.elegant-btn.outline');
        const confirmBox = container.querySelector('.reveal-confirm');
        const contentBox = container.querySelector('.reveal-content');
        if (revealBtn) revealBtn.classList.remove('hidden');
        if (confirmBox) confirmBox.classList.add('hidden');
        if (contentBox) contentBox.classList.add('hidden');
    });
}

// Card selection
function toggleSelect(el) {
    el.classList.toggle('selected');
}

// Discard (ex3)
function toggleDiscard(el) {
    el.classList.toggle('discarded');
}

// Canvas toggle
function showCanvas(id) {
    document.querySelectorAll('.canvas-detail').forEach(c => c.classList.remove('show'));
    const target = document.getElementById(id);
    if (target) target.classList.add('show');
}
