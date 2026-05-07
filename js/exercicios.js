document.addEventListener('DOMContentLoaded', () => {
    // Lógica para as abas (Tabs)
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
