let projects = JSON.parse(localStorage.getItem('citeflow_projects')) || [];
let currentProjectId = null;
let currentSourceType = 'website';
let webVersion = 'V1.6.8C';
document.getElementById("version").textContent = `Settings (${webVersion})`;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MLA_MONTHS = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

		function encodeProject(project) {
    		return LZString.compressToEncodedURIComponent(JSON.stringify(project));
		}

		function decodeProject(encoded) {
    		return JSON.parse(LZString.decompressFromEncodedURIComponent(encoded));
		}
        function hideAllViews() {
            document.querySelectorAll('section').forEach(s => s.classList.add('view-hidden'));
        }

        function showDashboard() {
            hideAllViews();
            document.getElementById('view-dashboard').classList.remove('view-hidden');
            renderProjects();
        }

        function openProject(id) {
    		currentProjectId = id;
   			const project = projects.find(p => p.id === id);
    		if (!project) return;
    		if (project.explosive) {
        		explodeProjectCard(id);
        		projects = projects.filter(p => p.id !== id);
        		saveToDisk();

        		setTimeout(() => {
            		renderProjects();
            		showToast("BOOM");
        		}, 700);
        		return;
    		}
    		if (project.redirectUrl) {
        		window.open(project.redirectUrl, "_blank");
        		return;
    		}
    		document.getElementById('current-project-name').innerText = project.name;
    		hideAllViews();
    		document.getElementById('view-project-details').classList.remove('view-hidden');

    		if (project.name.toLowerCase() === "google") {
        		showGoogleEasterEgg();
    		} else {
        		const easter = document.getElementById('google-easter-egg');
        		if (easter) easter.remove();
        		renderCitations();
    		}
		}

        function switchTab(type) {
            currentSourceType = type;
            document.querySelectorAll('.tab-btn').forEach(btn => btn.className = "tab-btn px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-all");
            document.getElementById(`btn-${type}`).className = "tab-btn px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold border border-blue-100 transition-all";
            renderForm(type);
        }

        function renderForm(type) {
            const container = document.getElementById('form-container');
            let html = '';

            if (type === 'website') {
                html = `
                    <div class="space-y-4">
                        <label class="text-xs font-bold text-slate-400 uppercase">Website URL</label>
                        <input type="text" id="url" oninput="updatePreview()" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" placeholder="https://...">
                        
                        <div class="space-y-2">
                            <label class="text-xs font-bold text-slate-400 uppercase">Date of publication</label>
                            <div class="text-[10px] text-slate-400 mb-1">Month</div>
                            <div class="grid grid-cols-6 gap-1 mb-3">${MONTHS.map(m => `<button onclick="setDateValue('pub-month', '${m}')" class="grid-select-btn pub-month-btn">${m.substring(0,3)}</button>`).join('')}</div>
                            <input type="hidden" id="pub-month">
                            <div class="text-[10px] text-slate-400 mb-1">Day</div>
                            <div class="grid grid-cols-10 gap-1">${Array.from({length: 31}, (_, i) => `<button onclick="setDateValue('pub-day', ${i+1})" class="grid-select-btn pub-day-btn">${i+1}</button>`).join('')}</div>
                            <input type="hidden" id="pub-day">
                            <input type="text" id="pub-year" oninput="updatePreview()" placeholder="Year" class="w-full p-2 text-sm border-b mt-2 outline-none">
                        </div>

                        <div class="space-y-2 pt-4">
                            <div class="flex justify-between items-center">
                                <label class="text-xs font-bold text-slate-400 uppercase">Most recent date of access</label>
                                <button onclick="setToday()" class="text-[10px] font-bold text-blue-600">[ today? ]</button>
                            </div>
                            <div class="text-[10px] text-slate-400 mb-1">Month</div>
                            <div class="grid grid-cols-6 gap-1 mb-3">${MONTHS.map(m => `<button onclick="setDateValue('acc-month', '${m}')" class="grid-select-btn acc-month-btn">${m.substring(0,3)}</button>`).join('')}</div>
                            <input type="hidden" id="acc-month">
                            <div class="text-[10px] text-slate-400 mb-1">Day</div>
                            <div class="grid grid-cols-10 gap-1">${Array.from({length: 31}, (_, i) => `<button onclick="setDateValue('acc-day', ${i+1})" class="grid-select-btn acc-day-btn">${i+1}</button>`).join('')}</div>
                            <input type="hidden" id="acc-day">
                            <input type="text" id="acc-year" oninput="updatePreview()" placeholder="Year" class="w-full p-2 text-sm border-b mt-2 outline-none">
                        </div>

                        <div class="pt-6 border-t">
                            <h4 class="text-sm font-bold mb-4">Web Page Contributors</h4>
                            <div class="flex gap-4 mb-4">
                                <label class="text-xs font-medium"><input type="radio" name="role" value="Author" checked onchange="updatePreview()"> Author</label>
                                <label class="text-xs font-medium"><input type="radio" name="role" value="Editor" onchange="updatePreview()"> Editor</label>
                                <label class="text-xs font-medium"><input type="radio" name="role" value="Translator" onchange="updatePreview()"> Translator</label>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <input type="text" id="first" oninput="updatePreview()" placeholder="First name" class="p-3 bg-slate-50 rounded-lg text-sm">
                                <input type="text" id="middle" oninput="updatePreview()" placeholder="Middle name" class="p-3 bg-slate-50 rounded-lg text-sm">
                                <input type="text" id="last" oninput="updatePreview()" placeholder="Last name or group" class="p-3 bg-slate-50 rounded-lg text-sm">
                                <input type="text" id="suffix" oninput="updatePreview()" placeholder="Suffix" class="p-3 bg-slate-50 rounded-lg text-sm">
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-400 uppercase">Web page or document/article title</label>
                            <input type="text" id="title" oninput="updatePreview()" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-slate-400 uppercase">Name of the website</label>
                                <input type="text" id="website-name" oninput="updatePreview()" class="p-3 bg-slate-50 border border-slate-200 rounded-lg w-full">
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-slate-400 uppercase">Publisher of the site</label>
                                <input type="text" id="publisher" oninput="updatePreview()" class="p-3 bg-slate-50 border border-slate-200 rounded-lg w-full">
                            </div>
                        </div>
                    </div>
                `;
            } else if (type === 'book') {
                html = `
                    <div class="space-y-6">
                        <h4 class="text-sm font-bold">Contributors</h4>
                        <div class="grid grid-cols-3 gap-2 mb-4">
                            ${['Author', 'Compiler', 'Editor', 'Illustrator', 'Narrator', 'Translator'].map(r => `
                                <label class="text-[11px] font-medium"><input type="radio" name="role" value="${r}" onchange="updatePreview()"> ${r}</label>
                            `).join('')}
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <input type="text" id="first" oninput="updatePreview()" placeholder="First name" class="p-3 bg-slate-50 rounded-lg text-sm">
                            <input type="text" id="middle" oninput="updatePreview()" placeholder="Middle name" class="p-3 bg-slate-50 rounded-lg text-sm">
                            <input type="text" id="last" oninput="updatePreview()" placeholder="Last name or group" class="p-3 bg-slate-50 rounded-lg text-sm">
                            <input type="text" id="suffix" oninput="updatePreview()" placeholder="Suffix" class="p-3 bg-slate-50 rounded-lg text-sm">
                        </div>

                        <div class="space-y-4 pt-4 border-t">
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-slate-400 uppercase">Title of book</label>
                                <input type="text" id="title" oninput="updatePreview()" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <input type="text" id="publisher" oninput="updatePreview()" placeholder="Publisher" class="p-3 bg-slate-50 rounded-lg text-sm">
                                <input type="text" id="pub-year" oninput="updatePreview()" placeholder="Year" class="p-3 bg-slate-50 rounded-lg text-sm">
                            </div>
                            <input type="text" id="city" oninput="updatePreview()" placeholder="Publication city (if needed)" class="w-full p-3 bg-slate-50 rounded-lg text-sm">
                        </div>
                    </div>
                `;
            } else if (type === 'media') {
                html = `
                    <div class="space-y-6">
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-400 uppercase">Type of file/software/app</label>
                            <input type="text" id="file-type" oninput="updatePreview()" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        </div>

                        <div class="pt-4 border-t">
                            <h4 class="text-sm font-bold mb-4">Artists</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <input type="text" id="first" oninput="updatePreview()" placeholder="First name" class="p-3 bg-slate-50 rounded-lg text-sm">
                                <input type="text" id="middle" oninput="updatePreview()" placeholder="Middle name" class="p-3 bg-slate-50 rounded-lg text-sm">
                                <input type="text" id="last" oninput="updatePreview()" placeholder="Last name or group" class="p-3 bg-slate-50 rounded-lg text-sm">
                                <input type="text" id="suffix" oninput="updatePreview()" placeholder="Suffix" class="p-3 bg-slate-50 rounded-lg text-sm">
                            </div>
                        </div>

                        <div class="space-y-4 pt-4 border-t">
                            <label class="text-xs font-bold text-slate-400 uppercase">Type of image</label>
                            <div class="flex gap-4">
                                ${['Clip art', 'Illustration', 'Image', 'Photograph'].map(i => `
                                    <label class="text-xs"><input type="radio" name="img-type" value="${i}" onchange="updatePreview()"> ${i}</label>
                                `).join('')}
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-slate-400 uppercase">Title of photograph</label>
                                <input type="text" id="title" oninput="updatePreview()" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            </div>
                        </div>

                        <div class="space-y-2 pt-4 border-t">
                            <label class="text-xs font-bold text-slate-400 uppercase">Date created / copyright</label>
                            <div class="text-[10px] text-slate-400">Month</div>
                            <div class="grid grid-cols-6 gap-1">${MONTHS.map(m => `<button onclick="setDateValue('pub-month', '${m}')" class="grid-select-btn pub-month-btn">${m.substring(0,3)}</button>`).join('')}</div>
                            <input type="hidden" id="pub-month">
                            <div class="text-[10px] text-slate-400 mt-2">Day</div>
                            <div class="grid grid-cols-10 gap-1">${Array.from({length: 31}, (_, i) => `<button onclick="setDateValue('pub-day', ${i+1})" class="grid-select-btn pub-day-btn">${i+1}</button>`).join('')}</div>
                            <input type="hidden" id="pub-day">
                            <input type="text" id="pub-year" oninput="updatePreview()" placeholder="Year" class="w-full p-2 text-sm border-b mt-2 outline-none">
                        </div>
                    </div>
                `;
            }
            container.innerHTML = html;
            updatePreview();
        }

        function setDateValue(id, val) {
            document.getElementById(id).value = val;
            const btns = document.querySelectorAll(`.${id}-btn`);
            btns.forEach(b => {
                b.classList.remove('active');
                if (b.innerText === val.toString().substring(0,3) || b.innerText === val.toString()) b.classList.add('active');
            });
            updatePreview();
        }

        function setToday() {
            const now = new Date();
            setDateValue('acc-month', MONTHS[now.getMonth()]);
            setDateValue('acc-day', now.getDate());
            document.getElementById('acc-year').value = now.getFullYear();
            updatePreview();
        }

        function formatMLA() {
            const data = {
                type: currentSourceType,
                first: document.getElementById('first')?.value.trim(),
                last: document.getElementById('last')?.value.trim(),
                title: document.getElementById('title')?.value.trim(),
                pMonth: document.getElementById('pub-month')?.value,
                pDay: document.getElementById('pub-day')?.value,
                pYear: document.getElementById('pub-year')?.value.trim(),
                role: document.querySelector('input[name="role"]:checked')?.value || 'Author'
            };

            if (!data.last && !data.title) return null;

            let author = data.last ? `${data.last}${data.first ? ', ' + data.first : ''}. ` : "";
            let mIndex = MONTHS.indexOf(data.pMonth);
            let mShort = mIndex !== -1 ? MLA_MONTHS[mIndex] + " " : "";
            let pubDate = `${data.pDay ? data.pDay + ' ' : ''}${mShort}${data.pYear ? data.pYear + ', ' : ''}`;

            if (data.type === 'website') {
                const site = document.getElementById('website-name').value.trim();
                const pub = document.getElementById('publisher').value.trim();
                const url = document.getElementById('url').value.trim();
                const aMonth = document.getElementById('acc-month').value;
                const aDay = document.getElementById('acc-day').value;
                const aYear = document.getElementById('acc-year').value.trim();
                
                let access = "";
                if (aYear) {
                    let amIndex = MONTHS.indexOf(aMonth);
                    let amShort = amIndex !== -1 ? MLA_MONTHS[amIndex] + " " : "";
                    access = ` Accessed ${aDay ? aDay + ' ' : ''}${amShort}${aYear}.`;
                }

                return `${author}${data.title ? '"' + data.title + '."' : ''} <span class="italic">${site || ''}</span>, ${pub ? pub + ', ' : ''}${pubDate}${url ? url + '.' : ''}${access}`.replace(/, ,/g, ',').trim();
            } else if (data.type === 'book') {
                const pub = document.getElementById('publisher').value.trim();
                const city = document.getElementById('city').value.trim();
                return `${author}<span class="italic">${data.title || ''}</span>. ${pub ? pub + ', ' : ''}${city ? city + ', ' : ''}${data.pYear ? data.pYear + '.' : ''}`;
            } else {
                const fType = document.getElementById('file-type').value.trim();
                const iType = document.querySelector('input[name="img-type"]:checked')?.value || 'Image';
                return `${author}<span class="italic">${data.title || ''}</span>. ${fType || iType}. ${pubDate}`.trim();
            }
        }

        function updatePreview() {
            const formatted = formatMLA();
            const render = document.getElementById('mla-render');
            if (formatted) {
                render.innerHTML = formatted;
                render.className = "mla-preview text-sm text-slate-900";
            } else {
                render.innerHTML = "Preview will appear here...";
                render.className = "mla-preview text-sm italic text-slate-400";
            }
        }

        function renderProjects() {
            const grid = document.getElementById('project-grid');
            grid.innerHTML = projects.map(p => `
                <div onclick="openProject(${p.id})" class="project-card group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl cursor-pointer relative transition-all">
                    <div class="flex items-start justify-between mb-8">
                        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl"><i class="fas fa-folder"></i></div>
                        <button onclick="deleteProject(event, ${p.id})" class="project-actions opacity-0 p-2 text-slate-300 hover:text-red-500 transition-all"><i class="fas fa-trash-can"></i></button>
                    </div>
                    <h4 class="font-bold text-lg text-slate-900 mb-1">${p.name}</h4>
                    <p class="text-slate-500 text-sm">${p.citations.length} Citations</p>
                </div>
            `).join('');
        }

        function renderCitations() {
            const container = document.getElementById('citation-list');
            const project = projects.find(p => p.id === currentProjectId);
            if (project.citations.length === 0) {
                container.innerHTML = `<div class="p-16 text-center text-slate-400">No citations yet.</div>`;
                return;
            }
            container.innerHTML = `<div class="divide-y divide-slate-100">${project.citations.map(c => `
                <div class="p-6 flex items-start justify-between group hover:bg-slate-50 transition-all">
                    <div class="mla-preview text-slate-800 text-sm">${c.formatted}</div>
                    <button onclick="deleteCitation(${c.id})" class="p-2 text-slate-200 hover:text-red-500"><i class="fas fa-times"></i></button>
                </div>
            `).join('')}</div>`;
        }

        function showCitationForm() {
            hideAllViews();
            document.getElementById('view-add-citation').classList.remove('view-hidden');
            switchTab('website');
        }

        function saveCitation() {
            const formatted = formatMLA();
            if (!formatted) return;
            const projectIndex = projects.findIndex(p => p.id === currentProjectId);
            projects[projectIndex].citations.push({ id: Date.now(), formatted: formatted, textOnly: document.getElementById('mla-render').innerText });
            projects[projectIndex].citations.sort((a,b) => a.textOnly.localeCompare(b.textOnly));
            saveToDisk();
            openProject(currentProjectId);
            showToast("Citation saved!");
        }

        function deleteCitation(id) {
			 if (!confirm("Delete this citation? This cannot be undone.")) return;
            const pIdx = projects.findIndex(p => p.id === currentProjectId);
            projects[pIdx].citations = projects[pIdx].citations.filter(c => c.id !== id);
            saveToDisk();
            renderCitations();
        }

        function openNewProjectModal() { document.getElementById('modal-project').classList.remove('opacity-0', 'pointer-events-none'); }
        function closeProjectModal() { document.getElementById('modal-project').classList.add('opacity-0', 'pointer-events-none'); }
        function createNewProject() {
            const name = document.getElementById('project-name-input').value.trim();
            if (!name) return;
            projects.unshift({ id: Date.now(), name, citations: [], createdAt: Date.now() });
            saveToDisk();
            closeProjectModal();
            renderProjects();
        }
        function deleteProject(e, id) { e.stopPropagation(); if (!confirm("Delete this project and all its citations? This cannot be undone.")) return; projects = projects.filter(p => p.id !== id); saveToDisk(); renderProjects(); }
        function saveToDisk() { localStorage.setItem('citeflow_projects', JSON.stringify(projects)); }
        function showToast(m) { const t = document.getElementById('toast'); t.innerText = m; t.classList.add('opacity-100'); setTimeout(() => t.classList.remove('opacity-100'), 4000); }
        function cancelCitation() { openProject(currentProjectId); }
        function copyProjectToClipboard() {
            const citations = document.querySelectorAll("#citation-list .mla-preview");

            let text = "";

            citations.forEach(c => {
                text += c.innerText + "\n\n";
            });

            navigator.clipboard.writeText(text);

            showToast("Citations copied!");
        }
        function exportToGoogleDocs() {
    		const citations = document.querySelectorAll("#citation-list .mla-preview");
    		if (citations.length === 0) {
        		showToast("No citations to export!");
        		return;
    		}
			let text = "";

            citations.forEach(c => {
                text += c.innerText + "\n\n";
            });

            navigator.clipboard.writeText(text);

    		let content = Array.from(citations).map(c => c.innerText).join("\n\n");

    		const encodedContent = encodeURIComponent(content);

    		const project = projects.find(p => p.id === currentProjectId);
			const url = `https://docs.google.com/document/create?usp=docs_home&title=${encodeURIComponent(project.name)}&body=${encodedContent}`;
			showToast("Opening Google Docs, press paste after opening.");
            
            setTimeout(() => {
            	const project = projects.find(p => p.id === currentProjectId);
            	const url = `https://docs.google.com/document/create?usp=docs_home&title=${encodeURIComponent(project.name)}&body=${encodeURIComponent(content)}`;
            	window.open(url, "_blank");
        	}, 4000);

		}
        function openComparison() {
            document.getElementById("comparison-popup").classList.remove("hidden");
            document.getElementById("comparison-popup").classList.add("flex");
        }

        function closeComparison() {
            document.getElementById("comparison-popup").classList.add("hidden");
        }
        function openUpdates() {
    		const popup = document.getElementById("updates-popup");
    		const box = document.getElementById("updates-box");
    		popup.classList.remove("hidden");
		}

		function closeUpdates() {
    		const popup = document.getElementById("updates-popup");
    		const box = document.getElementById("updates-box");
			popup.classList.add("hidden");
		}
		function openExportPopup() {
    		document.getElementById("export-popup").classList.remove("hidden");
		}
		function closeExportPopup() {
   			document.getElementById("export-popup").classList.add("hidden");
		}
		let adminCountdownInterval = null;

		function startAdminCountdown() {
    		let timeLeft = 10;
    		const countdownEl = document.getElementById("admin-countdown");
    		const cancelBtn = document.getElementById("cancel-admin-btn");

    		adminCountdownInterval = setInterval(() => {
        		timeLeft--;
        		if (countdownEl) countdownEl.innerText = timeLeft;

        		if (timeLeft <= 0) {
            		clearInterval(adminCountdownInterval);
            		countdownEl.innerText = "0";

            		setTimeout(() => {
                		const banner = document.getElementById("admin-banner");
                		if (banner) banner.remove();
                		adminAbuse();
            		}, 400);
        		}
    		}, 1000);

    		if (cancelBtn) {
        		cancelBtn.addEventListener("click", () => {
            		clearInterval(adminCountdownInterval);
            		const banner = document.getElementById("admin-banner");
            		if (banner) banner.remove();
            		showToast("Admin countdown cancelled!");
        		});
    		}
		}
		function showGoogleEasterEgg() {
    		const old = document.getElementById('google-easter-egg');
    		if (old) old.remove();

    		const easterDiv = document.createElement('div');
    		easterDiv.id = 'google-easter-egg';
    		easterDiv.className = 'flex flex-col items-center justify-center py-16';
    		easterDiv.innerHTML = `
        		<h2 class="text-3xl font-bold mb-6">Google Search</h2>
        		<input id="google-easter-input" type="text" placeholder="Type anything..." class="w-full max-w-md p-3 border border-slate-300 rounded-xl text-center mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600">
        		<button id="google-easter-btn" class="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">Search</button>
    		`;
    		document.getElementById('view-project-details').prepend(easterDiv);

    		document.getElementById('google-easter-btn').addEventListener('click', () => {
        		const query = document.getElementById('google-easter-input').value.trim();
        		if (!query) return;
        		window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    		});
		}
		function addToCalendar() {
    		if (!confirm("Add this event to your calendar?")) return;

    		const start = "20260327";
    		const end = "20260328";

    		const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:GoggleTools Major Update
DESCRIPTION:A major update is coming to GoggleTools!
DTSTART;VALUE=DATE:${start}
DTEND;VALUE=DATE:${end}
END:VEVENT
END:VCALENDAR`;

    		const blob = new Blob([ics], { type: "text/calendar;charset=utf-8;" });
    		const url = URL.createObjectURL(blob);

    		const a = document.createElement("a");
    		a.href = url;
    		a.download = "goggletools-update.ics";
    		document.body.appendChild(a);
    		a.click();
    		document.body.removeChild(a);

    		URL.revokeObjectURL(url);
		}
    	async function shareProjectLink() {
    		if (!currentProjectId) return showToast("No project open!");

    		const project = projects.find(p => p.id === currentProjectId);
    		if (!project) return;
    		const encoded = encodeProject(project);
    		const link = `${window.location.origin}/mla/share?project=${encoded}`;

    		if (navigator.share) {
        		try {
            		await navigator.share({
                		title: project.name,
                		url: link
            		});
					showToast("Shared successfully!");
        		} catch (err) {
            		console.log("Share cancelled or failed", err);
        		}
    		} else {
        		navigator.clipboard.writeText(link);
        		showToast("Project link copied!");
    		}
		}
		function filterCitations() {
    		const input = document.getElementById("citation-search").value.trim();
   			const query = input.toLowerCase();

    		let container = document.getElementById('search-results-container');
    		if (!container) {
        		container = document.createElement('div');
        		container.id = 'search-results-container';
        		container.className = 'mt-4 space-y-2';
        		document.getElementById('dashboard-search').after(container);
    		}

    		if (!input) {
        		container.innerHTML = "";
        			return;
    		}

    		const allCitations = projects.flatMap(p => p.citations.map(c => ({
        		projectName: p.name,
        		formatted: c.formatted
    		})));

   			const results = allCitations.filter(c => c.formatted.toLowerCase().includes(query));

    		if (results.length === 0) {
        		container.innerHTML = `<div class="p-4 text-center text-slate-400 italic">No citations found.</div>`;
        		return;
    		}

    		container.innerHTML = results.map(r => `
        		<div class="p-3 border rounded-lg bg-white dark:bg-black text-slate-900 dark:text-white">
            		<p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Project: ${r.projectName}</p>
            		<p>${r.formatted}</p>
        		</div>
    		`).join('') + "<br>";
		}
		function showQRCode() {
    		if (!currentProjectId) return showToast("No project open!");

    		const project = projects.find(p => p.id === currentProjectId);
    		const encoded = encodeProject(project);
    		const link = `${window.location.origin}/mla/share?project=${encoded}`;
			const modal = document.createElement("div");
    		modal.className = "fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]";

   			modal.innerHTML = `
        		<div class="bg-white p-6 rounded-2xl text-center shadow-2xl max-w-sm w-full">
            		<h3 class="text-lg font-bold mb-4">Scan to open project</h3>
            		<canvas id="qr-canvas"></canvas>
            		<button class="mt-6 px-4 py-2 bg-blue-600 text-white rounded-xl">Close</button>
        		</div>
    		`;

    		document.body.appendChild(modal);

    		modal.querySelector("button").onclick = () => modal.remove();

    		const canvas = modal.querySelector("#qr-canvas");

    		const qr = new QRious({
        		element: canvas,
        		value: link,
        		size: 336
    		});
		}

        window.onload = () => {
			localStorage.setItem("update_attended", "2");
    		showDashboard();
    		startAdminCountdown();
			updateStats();
		};

const icon = document.getElementById("goggle-icon");
const panel = document.getElementById("goggle-panel");
const input = document.getElementById("goggle-input");
const reply = document.getElementById("goggle-reply");
const suggests = document.querySelectorAll(".goggle-suggest");

let open = false;
icon.classList.add("idle");

icon.onclick = (e) => {
    e.stopPropagation();
    open = !open;

    if (open) {
        icon.classList.remove("idle");
        icon.classList.add("active");
        panel.classList.add("show");
        panel.classList.remove("hidden");
        input.focus();
    } else {
        closeGoggle();
    }
};

function closeGoggle() {
    open = false;
    icon.classList.remove("active");
    icon.classList.add("deactivate");

    panel.classList.remove("show");
    panel.classList.add("hidden");
    reply.classList.remove("show");

    setTimeout(() => {
        icon.classList.remove("deactivate");
        icon.classList.add("idle");
    }, 300);
}

document.addEventListener("click", (e) => {
    if (!document.getElementById("goggle-agent").contains(e.target)) {
        closeGoggle();
    }
});

suggests.forEach(btn => {
    btn.onclick = (e) => {
        e.stopPropagation();
        input.value = btn.innerText;
        input.focus();
    };
});

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleGoggle(input.value.toLowerCase());
        input.value = "";
    }
});

let awaitingChatGPT = false;

function handleGoggle(text) {
    text = text.toLowerCase().trim();

    if (awaitingChatGPT && (text === "ok" || text === "y" || text === "yes")) {
        window.location.href = "https://chatgpt.com";
        return;
    }

    awaitingChatGPT = false;

    let res = "";

    if (text.includes("what") && text.includes("goggletools")) {
        res = "GoggleTools is a world's first offline MLA citation tool with projects and modern UI!";
    }
    else if (text.includes("how") && text.includes("goggletools")) {
        res = "Click the button here to create a project, add a citation and you can see the output in MLA format!";
    }
    else if (text.includes("project")) {
        res = "Projects store your citations. Click 'New Project' to create one.";
    }
    else if (text.includes("citation")) {
        res = "Click 'Add Citation' inside a project, fill in the form as much information as you can find, and click save to check the MLA output.";
    }
    else if (text.includes("mla")) {
        res = "MLA is a citation format used for academic writing.";
    }
	else if (text.includes("noodletools")) {
        res = "NoodleTools? Nah, it's outdated, slow and has an old interface.";
    }
    else {
        res = "Ask ChatGPT?";
        awaitingChatGPT = true;
    }

    showReply(res);
}
function showReply(text) {
    setTimeout(() => {
        reply.textContent = text;
        reply.classList.add("show");
    }, 1000);
}
function exportCitations(format) {
    const project = projects.find(p => p.id === currentProjectId);
    if (!project || project.citations.length === 0) {
        showToast("No citations to export!");
        return;
    }

    const content = project.citations.map(c => c.textOnly || c.formatted).join("\n\n");

    if (format === "txt") {
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${project.name}-citations.txt`;
        a.click();
    } 
    else if (format === "pdf") {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const lines = doc.splitTextToSize(content, 180);
        doc.text(lines, 15, 20);
        doc.save(`${project.name}-citations.pdf`);
    } 
    else if (format === "docx") {
        if (!window.docx) {
            showToast("Docx library not loaded yet!");
            return;
        }

        const { Document, Packer, Paragraph, TextRun } = window.docx;

        const doc = new Document({
            sections: [{
                children: project.citations.map(c => new Paragraph({
                    children: [new TextRun(c.textOnly || c.formatted)]
                }))
            }]
        });

        Packer.toBlob(doc).then(blob => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `${project.name}-citations.docx`;
            a.click();
        });
    }
}

const profilePopup = document.getElementById('profile-popup');
const profileImage = document.getElementById('profile-image');
const profileUpload = document.getElementById('profile-upload');
const profileUsername = document.getElementById('profile-username');

window.addEventListener('DOMContentLoaded', () => {
    const savedImage = localStorage.getItem('profileImage');
    const savedUsername = localStorage.getItem('profileUsername');
    if (savedImage) profileImage.src = savedImage;
    else profileImage.src = 'https://via.placeholder.com/150?text=User';
    if (savedUsername) profileUsername.value = savedUsername;
});

function openProfile() {
    profilePopup.classList.remove('hidden');
}
function closeProfile() {
    profilePopup.classList.add('hidden');
}

profileImage.addEventListener('click', () => profileUpload.click());
profileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function() {
        profileImage.src = reader.result;
        localStorage.setItem('profileImage', reader.result);
    };
    reader.readAsDataURL(file);
});
profileUsername.addEventListener('blur', () => {
    localStorage.setItem('profileUsername', profileUsername.value);
    showToast('Username saved!');
});

function redeemCode() {
    const input = document.getElementById("redeem-code-input");
    const code = input.value.trim().toUpperCase();
    if (!code) {
        showToast("Enter a code first!");
        return;
    }
    if (code === "NOODLETOOLS") {
        const alreadyRedeemed = projects.some(
            p => p.name === "Noodle Tools" && p.redirectUrl === "https://my.noodletools.com"
        );
        if (alreadyRedeemed) {
            playRedeemFailCinematic(() => {
        		showToast("Invalid code!");
    		});
            return;
        }
        projects.unshift({
            id: Date.now(),
            name: "Noodle Tools",
            citations: [],
            createdAt: Date.now(),
            redirectUrl: "https://my.noodletools.com"
        });
        saveToDisk();
        renderProjects();
        input.value = "";
        playRedeemCinematic(() => {
    		showToast("Redeemed successfully!");
		});
        return;
    }
    if (code === "67") {
    	const alreadyRedeemed = projects.some(p => p.name === "67" && p.explosive);

    	if (alreadyRedeemed) {
        	playRedeemFailCinematic(() => {
        		showToast("Invalid code!");
    		});
        	return;
    	}
    	projects.unshift({
        	id: Date.now(),
        	name: "67",
        	citations: [],
        	createdAt: Date.now(),
        	explosive: true
    	});

    	saveToDisk();
    	renderProjects();
    	input.value = "";
    	playRedeemCinematic(() => {
    		showToast("Redeemed successfully!");
		});
    	return;
	}
	if (code === "FINAL CALL") {
		playRedeemCinematic(() => {
    		showToast("Redeemed successfully!");
		});
		FINAL_CALL()
		return;
	}
	if (code === "GIMMEAD") {
		playRedeemCinematic(() => {
    		showToast("Redeemed successfully!");
		});
		showAdPopup()
		return;
	}
	input.value = "";

    playRedeemFailCinematic(() => {
        showToast("Invalid code!");
    });
}
function explodeProjectCard(projectId) {
    const cards = document.querySelectorAll(".project-card");
    cards.forEach(card => {
        if (card.getAttribute("onclick")?.includes(projectId)) {
            const rect = card.getBoundingClientRect();
            const flash = document.createElement("div");
            flash.style.position = "fixed";
            flash.style.inset = "0";
            flash.style.background = "white";
            flash.style.opacity = "0.85";
            flash.style.pointerEvents = "none";
            flash.style.zIndex = "99998";
            flash.style.transition = "opacity 0.35s ease";
            document.body.appendChild(flash);
            requestAnimationFrame(() => {
                flash.style.opacity = "0";
            });
            setTimeout(() => flash.remove(), 350);
            document.body.animate([
                { transform: "translate(0px,0px)" },
                { transform: "translate(-12px,8px)" },
                { transform: "translate(10px,-10px)" },
                { transform: "translate(-8px,12px)" },
                { transform: "translate(6px,-6px)" },
                { transform: "translate(0px,0px)" }
            ], {
                duration: 500,
                easing: "ease-out"
            });
            for (let i = 0; i < 60; i++) {
                const particle = document.createElement("div");
                const size = 6 + Math.random() * 16;
				
                particle.style.position = "fixed";
                particle.style.left = rect.left + rect.width / 2 + "px";
                particle.style.top = rect.top + rect.height / 2 + "px";
                particle.style.width = size + "px";
                particle.style.height = size + "px";
                particle.style.borderRadius = "999px";
                particle.style.background = `hsl(${Math.random()*360},100%,50%)`;
                particle.style.boxShadow = "0 0 12px currentColor";
                particle.style.pointerEvents = "none";
                particle.style.zIndex = "99999";
                particle.style.transition = "all 1s cubic-bezier(.2,.8,.2,1)";
                document.body.appendChild(particle);
                requestAnimationFrame(() => {
                    const x = (Math.random() - 0.5) * 700;
                    const y = (Math.random() - 0.5) * 700;
                    particle.style.transform =
                        `translate(${x}px, ${y}px) rotate(${Math.random()*1080}deg) scale(0)`;
                    particle.style.opacity = "0";
                });
                setTimeout(() => particle.remove(), 1000);
            }
            card.style.transition = "all 0.6s cubic-bezier(.2,.8,.2,1)";
            card.style.transform = "scale(2) rotate(720deg)";
            card.style.opacity = "0";
            card.style.filter = "blur(8px)";
        }
    });
}
function playRedeemCinematic(callback) {
    const cinematic = document.getElementById("redeem-cinematic");
    const spirit = document.getElementById("redeem-spirit");
    const beam = document.getElementById("redeem-beam");
    const shockwave = document.getElementById("redeem-shockwave");
    const text = document.getElementById("redeem-text");
    const redeemBtn = document.querySelector('[onclick="redeemCode()"]');
    const rect = redeemBtn.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    cinematic.classList.remove("hidden");
    cinematic.style.opacity = "1";
    spirit.style.transition = "none";
    beam.style.transition = "none";
    shockwave.style.transition = "none";
    text.style.transition = "none";

    spirit.style.left = startX + "px";
    spirit.style.top = startY + "px";
    spirit.style.opacity = "1";
    spirit.style.transform = "translate(-50%, -50%) scale(0.7)";
    beam.style.opacity = "0";
    beam.style.top = "-140%";
    beam.style.left = "50%";
    beam.style.width = "140px";
    beam.style.transform = "translateX(-50%) rotate(8deg)";
    text.style.opacity = "0";
    text.style.transform = "scale(0.5) rotate(-4deg)";
    const trailInterval = setInterval(() => {
        const p = document.createElement("div");
        p.style.position = "fixed";
        p.style.left = spirit.style.left;
        p.style.top = spirit.style.top;
        p.style.width = "18px";
        p.style.height = "18px";
        p.style.borderRadius = "999px";
        p.style.background = `hsl(${Math.random()*360},100%,70%)`;
        p.style.filter = "blur(4px)";
        p.style.pointerEvents = "none";
        p.style.zIndex = "99999";
        p.style.transition = "all 1s ease-out";
        cinematic.appendChild(p);
        requestAnimationFrame(() => {
            p.style.transform = `
                translate(${(Math.random()-0.5)*100}px, ${(Math.random()-0.5)*100}px)
                scale(0)
            `;
            p.style.opacity = "0";
        });
        setTimeout(() => p.remove(), 1000);
    }, 45);
    setTimeout(() => {
        spirit.style.transition = "all 1.6s cubic-bezier(.15,.85,.2,1)";
        spirit.style.top = "-15%";
        spirit.style.transform = "translate(-50%, -50%) scale(0.15)";
        spirit.style.opacity = "0";
    }, 100);
    setTimeout(() => {
        clearInterval(trailInterval);
        document.body.animate([
            { transform: "translate(0,0) scale(1)" },
            { transform: "translate(-18px,12px) scale(1.03)" },
            { transform: "translate(14px,-14px) scale(1.05)" },
            { transform: "translate(-10px,10px) scale(1.03)" },
            { transform: "translate(0,0) scale(1)" }
        ], {
            duration: 850
        });
        beam.style.transition = "all 0.35s cubic-bezier(.15,.9,.2,1)";
        beam.style.opacity = "1";
        beam.style.top = "-5%";
        beam.style.transform = "translateX(-50%) rotate(0deg)";
        setTimeout(() => {
            beam.style.transition = "all 0.65s ease";
            beam.style.width = "260vw";
        }, 250);
        shockwave.style.opacity = "1";
        shockwave.style.transition = "all 0.9s ease-out";
        shockwave.style.transform = "translate(-50%, -50%) scale(42)";
        shockwave.style.opacity = "0";
        const flash = document.createElement("div");
        flash.style.position = "fixed";
        flash.style.inset = "0";
        flash.style.background = "white";
        flash.style.opacity = "0.9";
        flash.style.pointerEvents = "none";
        flash.style.zIndex = "99998";
        flash.style.transition = "opacity 0.5s ease";
        cinematic.appendChild(flash);
        requestAnimationFrame(() => {
            flash.style.opacity = "0";
        });
        setTimeout(() => flash.remove(), 500);
    }, 1850);

    setTimeout(() => {
        text.style.transition = "all 0.65s cubic-bezier(.2,.9,.2,1)";
        text.style.opacity = "1";
        text.style.transform = "scale(1.15) rotate(0deg)";

        setTimeout(() => {
            text.style.transform = "scale(1)";
        }, 150);

    }, 2450);

    // FADE OUT
    setTimeout(() => {
        cinematic.style.transition = "opacity 0.8s ease";
        cinematic.style.opacity = "0";

        setTimeout(() => {
            cinematic.classList.add("hidden");
            cinematic.style.opacity = "1";
            shockwave.style.transform = "translate(-50%, -50%) scale(0)";

            if (callback) callback();
        }, 800);

    }, 4500);
}
function playRedeemFailCinematic(callback) {
    const cinematic = document.getElementById("redeem-cinematic");
    const spirit = document.getElementById("redeem-spirit");
    const shockwave = document.getElementById("redeem-shockwave");
    const text = document.getElementById("redeem-text");
	const overlay = document.getElementById("redeem-fail-overlay");
    const beam = document.getElementById("redeem-beam");
    const redeemBtn = document.querySelector('[onclick="redeemCode()"]');
    const rect = redeemBtn.getBoundingClientRect();

    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
   
    cinematic.classList.remove("hidden");
    cinematic.style.opacity = "1";
    beam.style.transition = "none";
	beam.style.opacity = "0";
	beam.style.width = "140px";
	beam.style.top = "-140%";
	beam.style.transform = "translateX(-50%) rotate(8deg)";
    spirit.style.transition = "none";
    shockwave.style.transition = "none";
    text.style.transition = "none";

    spirit.style.left = startX + "px";
    spirit.style.top = startY + "px";
    spirit.style.opacity = "1";
    spirit.style.transform = "translate(-50%, -50%) scale(0.7)";

    text.style.opacity = "0";
    text.style.transform = "scale(0.5) rotate(-4deg)";

    const trailInterval = setInterval(() => {
        const p = document.createElement("div");
        p.style.position = "fixed";
        p.style.left = spirit.style.left;
        p.style.top = spirit.style.top;
        p.style.width = "18px";
        p.style.height = "18px";
        p.style.borderRadius = "999px";
        p.style.background = `hsl(${Math.random()*360},100%,70%)`;
        p.style.filter = "blur(4px)";
        p.style.pointerEvents = "none";
        p.style.zIndex = "99999";
        p.style.transition = "all 1s ease-out";
        cinematic.appendChild(p);

        requestAnimationFrame(() => {
            p.style.transform = `
                translate(${(Math.random()-0.5)*100}px, ${(Math.random()-0.5)*100}px)
                scale(0)
            `;
            p.style.opacity = "0";
        });

        setTimeout(() => p.remove(), 1000);
    }, 45);

    setTimeout(() => {
        spirit.style.transition = "all 1.6s cubic-bezier(.15,.85,.2,1)";
        spirit.style.top = "-15%";
        spirit.style.transform = "translate(-50%, -50%) scale(0.15)";
        spirit.style.opacity = "0";
    }, 100);

    setTimeout(() => {
        clearInterval(trailInterval);
    	overlay.style.transition = "none";
    	overlay.style.opacity = "0";

        overlay.style.transition = "opacity 0.25s ease";
        overlay.style.opacity = "1";

        document.body.animate([
            { transform: "translate(0px,0px)" },
            { transform: "translate(-18px,6px)" },
            { transform: "translate(20px,-10px)" },
            { transform: "translate(-16px,12px)" },
            { transform: "translate(14px,-8px)" },
            { transform: "translate(0px,0px)" }
        ], {
            duration: 500,
            easing: "ease-in-out"
        });

    }, 900);

    setTimeout(() => {
        overlay.style.opacity = "0";
        if (callback) callback();
    }, 1800);
}
const startScreen = document.getElementById('start-screen');
const startQuote = document.getElementById('start-quote');
const startTitle = document.getElementById('start-title');
const startSubtitle = document.getElementById('start-subtitle');
let spinInterval = null;
let skipRequested = false;
function finishImmediately() {
    clearInterval(spinInterval);
    startScreen.style.transition = "opacity 0.5s ease-in-out";
    startScreen.style.opacity = 0;
    setTimeout(() => {
        startScreen.style.display = "none";
    }, 500);
	setTimeout(() => {
        startScreen.remove();
    }, 2000);
}
function finishNormally() {
    clearInterval(spinInterval);
    let angle = parseFloat((startQuote.style.transform.match(/rotateY\(([-0-9.]+)deg\)/) || [0, 0])[1]);
    let finalAngle = Math.round(angle / 360) * 360;

    startQuote.style.transition = "transform 0.4s ease-out";
    startQuote.style.transform = `rotateY(${finalAngle}deg)`;
    startTitle.style.opacity = 1;
    const gWidth = startTitle.offsetWidth;
    startTitle.style.opacity = 0;
    startQuote.style.position = "relative";
    startQuote.style.left = "0px";
    startQuote.offsetHeight; // force reflow
    startQuote.style.transition += ", left 0.8s ease-in-out";
    startQuote.style.left = `-${gWidth/2}px`;

    setTimeout(() => {
        startTitle.style.animation = "slideInFromRight 1s forwards";
        startTitle.style.opacity = 1;
    }, 200);
    setTimeout(() => {
        startSubtitle.style.animation = "slideDown 1s forwards";
        startSubtitle.style.opacity = 1;
    }, 1500);
    startScreen.style.transition = "background-color 0.5s ease-in-out";
    startScreen.classList.remove("bg-black");
    startScreen.classList.add("bg-blue-600");
    setTimeout(() => {
        startScreen.style.transition = "opacity 0.5s ease-in-out";
        startScreen.style.opacity = 0;
        setTimeout(() => startScreen.style.display = "none", 500);
    }, 2000);
	setTimeout(() => {
        startScreen.remove();
    }, 4000);
}

function starthellnah() {
    let angle = 0;
    let speed = 10;
    const acceleration = 1.05;
    const maxSpinDuration = 2000;
    const startTime = Date.now();

    spinInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;

        if (elapsed > maxSpinDuration) {
            if (!skipRequested) finishNormally();
            return;
        }

        angle += speed;
        speed *= acceleration;
        startQuote.style.transform = `rotateY(${angle}deg)`;
    }, 30);

    startScreen.addEventListener('click', () => {
        if (!skipRequested) {
            skipRequested = true;
            finishImmediately();
        }
    });

    setTimeout(() => {
        if (!skipRequested) finishNormally();
    }, 6000);
}
window.addEventListener('DOMContentLoaded', starthellnah);
function updateStats() {
    let projectsData = [];
    let adminAttended = 0;

    try {
        const stored = localStorage.getItem('citeflow_projects');
        projectsData = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(projectsData)) projectsData = [];
    } catch {
        projectsData = [];
    }

    try {
        const storedAdmin = localStorage.getItem('update_attended');
        adminAttended = storedAdmin ? parseInt(storedAdmin) : 0;
        if (isNaN(adminAttended)) adminAttended = 0;
    } catch {
        adminAttended = 0;
    }

    let totalProjects = projectsData.length || 0;
    let totalCitations = 0;
    let totalChars = 0;

    projectsData.forEach(p => {
        if (!p || !Array.isArray(p.citations)) return;

        totalCitations += p.citations.length;

        p.citations.forEach(c => {
            const text = c?.textOnly || c?.formatted || "";
            totalChars += text.length;
        });
    });

    totalProjects = totalProjects;
    totalCitations = totalCitations;
    totalChars = totalChars;
    adminAttended = adminAttended;

    document.getElementById("stat-projects").innerText = totalProjects;
    document.getElementById("stat-citations").innerText = totalCitations;
    document.getElementById("stat-characters").innerText = totalChars;
    document.getElementById("stat-admin").innerText = adminAttended;
}
const targetDate = new Date("2026-06-01T00:00:00+04:00").getTime(); 
function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;
    if (diff <= 0) {
        document.getElementById("countdown-display").innerHTML = "NOW PUBLIC";
        return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    document.getElementById("countdown-display").innerHTML =
        `${days} Day ${hours} Hour ${mins} Min ${secs} Sec`;
}
setInterval(updateCountdown, 500);
updateCountdown();

setInterval(updateCountdown, 500);
updateCountdown();
function openLaunchPopup() {
    document.getElementById("launch-popup").classList.remove("hidden");
    document.getElementById("launch-popup").classList.add("flex");
}

function closeLaunchPopup() {
    document.getElementById("launch-popup").classList.add("hidden");
    document.getElementById("launch-popup").classList.remove("flex");
}
function setPass() {
    const btn = document.getElementById("pass-btn");
    const local = localStorage.getItem("passcode");
    if (!local) {
        const code = prompt("Enter 4-digit passcode:");
        if (code && /^\d{4}$/.test(code)) {
            localStorage.setItem("passcode", code);
            showToast("Passcode set!");
            btn.textContent = "Disable";
        } else {
            alert("Must be exactly 4 numbers");
        }

    } else {
        localStorage.removeItem("passcode");
        showToast("Passcode removed!");
        btn.textContent = "Enable";
    }
}

function handlePasscodeInput() {
    const input = document.getElementById("passcode-input");
    input.value = input.value.replace(/\D/g, "");
    if (input.value.length === 4) {
        checkPasscode(input.value);
    }
}
function checkPasscode(value) {
    const saved = localStorage.getItem("passcode");
    if (value === saved) {
        document.getElementById("passcode-lock").classList.add("hidden");
    } else {
        const input = document.getElementById("passcode-input");
        input.value = "";
        input.animate([
            { transform: "translateX(0)" },
            { transform: "translateX(-6px)" },
            { transform: "translateX(6px)" },
            { transform: "translateX(0)" }
        ], { duration: 200 });
    }
}
window.addEventListener("load", () => {
    if (localStorage.getItem("passcode")) {
        document.getElementById("passcode-lock").classList.remove("hidden");
		document.getElementById("pass-btn").textContent="Disable";
    }
});
async function forgotPasscode() {
	const SERVICE_ID = "service_zjz7o0t";
	const TEMPLATE_ID = "template_hyhsf5n";
	const PUBLIC_KEY = "yGVzllcBp2uAdb4pI";
	emailjs.init(PUBLIC_KEY);
    const email = prompt("Enter your email to receive your passcode:");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast("Invalid email");
        return;
    }
    const passcode = localStorage.getItem("passcode");
    if (!passcode) {
        showToast("No passcode is set!");
        return;
    }
    const sendBtnState = document.getElementById("forgot-btn");
    if (sendBtnState) sendBtnState.disabled = true;
    try {
        const templateParams = {
            to_email: email,
            email: email,
            from_name: "GoggleTools",
            user_email: email,
            code: passcode,
            reply_to: "helloxerrortm@gmail.com"
        };
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
        showToast("Passcode sent to email");
    } catch (err) {
        console.error(err);
        showToast("Failed to send email");
    } finally {
        if (sendBtnState) sendBtnState.disabled = false;
    }
}
function openAdPopup() {
  const popup = document.getElementById("ad-popup");
  const container = document.getElementById("ad-container");
  popup.classList.remove("hidden");

  container.innerHTML = `
    <ins class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-2747186016364644"
      data-ad-slot="6807402378"
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
  `;

  (adsbygoogle = window.adsbygoogle || []).push({});
}
function closeAdPopup() {
	const popup = document.getElementById("ad-popup");
	popup.classList.add("hidden");
}
