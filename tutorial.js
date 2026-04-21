document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('newUser')) {
        localStorage.setItem('newUser', 'true');
    }

    if (localStorage.getItem('newUser') === 'true') {
        document.getElementById('tutorialIntro').classList.remove("hidden")
        document.getElementById('tutorialIntro').style.display = 'flex';
    }
});
function nextIntroStep(step) {
    document.getElementById('introStep1').classList.add('hidden');
    document.getElementById('introStep2').classList.remove('hidden');
}
function finishIntroFlow(skip = false) {
    const intro = document.getElementById('tutorialIntro');
    if (!skip) {
        const name = document.getElementById('userNameInput').value.trim();
        if (name) localStorage.setItem('profileUsername', name);
    }
    intro.style.opacity = '0';
    setTimeout(() => {
        intro.style.display = 'none';
        startTutorial();
    }, 500);
}
let highlightOverlay;
let highlightedElement;
let highlightInterval;
function highlightElement(el) {
    removeHighlight();
    if (!el) return;
    highlightedElement = el;

    highlightOverlay = document.createElement('div');
    highlightOverlay.style.position = 'absolute';
    highlightOverlay.style.border = '3px solid rgba(59,130,246,0.9)';
    highlightOverlay.style.borderRadius = '16px';
    highlightOverlay.style.boxShadow = '0 0 0 6px rgba(59,130,246,0.2), 0 0 30px rgba(59,130,246,0.6)';
    highlightOverlay.style.borderRadius = '8px';
    highlightOverlay.style.pointerEvents = 'none';
    highlightOverlay.style.zIndex = '9999';
    highlightOverlay.style.transition = 'all 0.1s ease';
    highlightOverlay.style.animation = 'pulseHighlight 2s infinite';

    highlightOverlay.style.background = 'linear-gradient(45deg, rgba(59,130,246,0.2), rgba(59,130,246,0.1))';
    highlightOverlay.style.backgroundSize = '200% 200%';
    highlightOverlay.style.animation += ', shine 2s infinite linear';

    document.body.appendChild(highlightOverlay);

    function updatePosition() {
        if (!highlightedElement) return;
        const rect = highlightedElement.getBoundingClientRect();
        highlightOverlay.style.width = rect.width + 'px';
        highlightOverlay.style.height = rect.height + 'px';
        highlightOverlay.style.top = window.scrollY + rect.top + 'px';
        highlightOverlay.style.left = window.scrollX + rect.left + 'px';
    }

    updatePosition();
    highlightInterval = setInterval(updatePosition, 50);

    if (!document.getElementById('highlight-animations')) {
        const style = document.createElement('style');
        style.id = 'highlight-animations';
        style.innerHTML = `
        @keyframes pulseHighlight {
            0% { box-shadow: 0 0 10px 2px rgba(59,130,246,0.4); }
            50% { box-shadow: 0 0 25px 8px rgba(59,130,246,0.7); }
            100% { box-shadow: 0 0 10px 2px rgba(59,130,246,0.4); }
        }
        @keyframes shine {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        `;
        document.head.appendChild(style);
    }
}
function removeHighlight() {
    if (highlightOverlay) highlightOverlay.remove();
    highlightOverlay = null;
    highlightedElement = null;
    if (highlightInterval) clearInterval(highlightInterval);
}
let tutorialTooltip;
function showTooltip(el, text) {
    removeTooltip();

    tutorialTooltip = document.createElement('div');
    tutorialTooltip.innerHTML = `
        <div class="bg-white text-slate-900 px-5 py-4 rounded-2xl shadow-xl border border-blue-100 max-w-xs">
            <p class="text-sm font-semibold">${text}</p>
        </div>
    `;
    tutorialTooltip.style.position = 'absolute';
    tutorialTooltip.style.zIndex = 10000;
    document.body.appendChild(tutorialTooltip);
    function updateTooltip() {
        const rect = el.getBoundingClientRect();
        tutorialTooltip.style.top = `${window.scrollY + rect.bottom + 12}px`;
        tutorialTooltip.style.left = `${window.scrollX + rect.left + rect.width/2 - tutorialTooltip.offsetWidth/2}px`;
    }
    updateTooltip();
    const interval = setInterval(updateTooltip, 50);
    tutorialTooltip.dataset.interval = interval;
}
function removeTooltip() {
    if (tutorialTooltip) {
        clearInterval(tutorialTooltip.dataset.interval);
        tutorialTooltip.remove();
        tutorialTooltip = null;
    }
}
function startTutorial() {
    const newProjectBtn = document.querySelector("button[onclick='openNewProjectModal()']");
    if (!newProjectBtn) return console.warn("New Project button not found!");

    highlightElement(newProjectBtn);
    showTooltip(newProjectBtn, "Click here to create your first project!");
    newProjectBtn.addEventListener('click', step2NewProjectInput, { once: true });
}
function step2NewProjectInput() {
    removeHighlight();
    removeTooltip();
    const projectInput = document.getElementById('project-name-input');
    highlightElement(projectInput);
    showTooltip(projectInput, "Type your project name here.");

    const createBtn = document.querySelector("#modal-project button[onclick='createNewProject()']");
    createBtn.addEventListener('click',step3ProjectCard, { once: true });
}
function step3ProjectCard() {
    removeHighlight();
    removeTooltip();
    const firstCard = document.querySelector('#project-grid .project-card');
    if (!firstCard) return;

    highlightElement(firstCard);
    showTooltip(firstCard, "Double click your project card to open it.");
    firstCard.addEventListener('click', step4AddCitation, { once: true });
}
function step4AddCitation() {
    removeHighlight();
    removeTooltip();
    const addCitationBtn = document.querySelector("#view-project-details button[onclick='showCitationForm()']");
    if (!addCitationBtn) return;
    highlightElement(addCitationBtn);
    showTooltip(addCitationBtn, "Add a new citation here!");

    addCitationBtn.addEventListener('click', step5SaveCitation, { once: true });
}
function step5SaveCitation() {
    removeHighlight();
    removeTooltip();
    const saveCitationBtn = document.querySelector("#view-add-citation button[onclick='saveCitation()']");
    if (!saveCitationBtn) return;
    highlightElement(saveCitationBtn);
    showTooltip(saveCitationBtn, "Save your citation to finish!");

    saveCitationBtn.addEventListener('click', finishTutorial, { once: true });
}
function finishTutorial() {
    removeHighlight();
    removeTooltip();
    showConfetti();
    localStorage.setItem('newUser', 'false');
}
function showConfetti(x = window.innerWidth / 2, y = window.innerHeight / 2) {
    const confettiCount = 120; // more pieces
    const colors = ['#FFD700','#FF4C4C','#4CFF4C','#4C6BFF','#FF4CFF','#FF924C','#00FFFF','#FFA500'];

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        const size = Math.random() * 12 + 6; // bigger pieces
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.position = 'fixed';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = 9999;
        confetti.style.top = `${y}px`;
        confetti.style.left = `${x}px`;
        confetti.style.opacity = 1;
        confetti.style.transform = `translate(0,0) rotate(${Math.random()*360}deg)`;

        document.body.appendChild(confetti);

        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 300 + 150; // bigger spread
        const rotate = (Math.random() - 0.5) * 1080; // more rotation

        confetti.animate([
            { transform: `translate(0,0) rotate(0deg) scale(1)`, opacity: 1 },
            { transform: `translate(${Math.cos(angle)*distance}px, ${Math.sin(angle)*distance + 100}px) rotate(${rotate}deg) scale(1.2)`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 500,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards'
        });

        setTimeout(() => confetti.remove(), 2500);
    }
}
