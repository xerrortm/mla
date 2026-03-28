// NEW USER TUTORIAL SCRIPT
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('newUser')) {
        localStorage.setItem('newUser', 'true');
    }

    // Start tutorial only if new user
    if (localStorage.getItem('newUser') === 'true') {
        // Wait a tiny bit to make sure projects are rendered
        setTimeout(() => startTutorial(), 500);
    }
});

function startTutorial() {
    const newProjectBtn = document.querySelector("button[onclick='openNewProjectModal()']");
    if (!newProjectBtn) return console.warn("New Project button not found!");

    highlightElement(newProjectBtn);
    newProjectBtn.addEventListener('click', step2NewProjectInput, { once: true });
}

function step2NewProjectInput() {
    removeHighlight();
    const projectInput = document.getElementById('project-name-input');
    highlightElement(projectInput);

    const createBtn = document.querySelector("#modal-project button[onclick='createNewProject()']");
    createBtn.addEventListener('click', () => {
        // Wait for renderProjects to finish
        setTimeout(step3ProjectCard, 300);
    }, { once: true });
}

function step3ProjectCard() {
    removeHighlight();

    // pick the top-left project card (first in grid)
    const firstCard = document.querySelector('#project-grid .project-card');
    if (!firstCard) return;

    highlightElement(firstCard);
    firstCard.addEventListener('click', step4AddCitation, { once: true });
}

function step4AddCitation() {
    removeHighlight();
    const addCitationBtn = document.querySelector("#view-project-details button[onclick='showCitationForm()']");
    if (!addCitationBtn) return;
    highlightElement(addCitationBtn);

    addCitationBtn.addEventListener('click', step5SaveCitation, { once: true });
}

function step5SaveCitation() {
    removeHighlight();
    const saveCitationBtn = document.querySelector("#view-add-citation button[onclick='saveCitation()']");
    if (!saveCitationBtn) return;
    highlightElement(saveCitationBtn);

    saveCitationBtn.addEventListener('click', finishTutorial, { once: true });
}

function finishTutorial() {
    removeHighlight();
    showConfetti();
    localStorage.setItem('newUser', 'false');
}

// HIGHLIGHT AND CONFETTI UTILS
let highlightOverlay;
function highlightElement(el) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    highlightOverlay = document.createElement('div');
    highlightOverlay.style.position = 'fixed';
    highlightOverlay.style.top = rect.top + 'px';
    highlightOverlay.style.left = rect.left + 'px';
    highlightOverlay.style.width = rect.width + 'px';
    highlightOverlay.style.height = rect.height + 'px';
    highlightOverlay.style.border = '4px solid #3b82f6';
    highlightOverlay.style.borderRadius = '8px';
    highlightOverlay.style.pointerEvents = 'none';
    highlightOverlay.style.zIndex = '9999';
    highlightOverlay.style.transition = 'all 0.2s';
    document.body.appendChild(highlightOverlay);
}

function removeHighlight() {
    if (highlightOverlay) {
        highlightOverlay.remove();
        highlightOverlay = null;
    }
}

function showConfetti() {
    const confettiCount = 50;
    for (let i = 0; i < confettiCount; i++) {
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.width = '8px';
        div.style.height = '8px';
        div.style.background = `hsl(${Math.random()*360}, 70%, 50%)`;
        div.style.top = '0px';
        div.style.left = `${Math.random() * window.innerWidth}px`;
        div.style.zIndex = '9999';
        div.style.borderRadius = '50%';
        div.style.pointerEvents = 'none';
        div.style.transition = 'transform 1s ease-out, opacity 1s';
        document.body.appendChild(div);

        setTimeout(() => {
            div.style.transform = `translateY(${window.innerHeight + 50}px) rotate(${Math.random()*360}deg)`;
            div.style.opacity = '0';
        }, 50);

        setTimeout(() => div.remove(), 1200);
    }
}
