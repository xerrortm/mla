let projects = JSON.parse(localStorage.getItem('citeflow_projects')) || [{ id: 1, name: 'My Project', citations: [], createdAt: Date.now() }];
        let currentProjectId = null;
        let currentSourceType = 'website';
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
        function showToast(m) { const t = document.getElementById('toast'); t.innerText = m; t.classList.add('opacity-100'); setTimeout(() => t.classList.remove('opacity-100'), 6000); }
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

    		setTimeout(() => {
        		box.classList.remove("scale-95", "opacity-0");
        		box.classList.add("scale-100", "opacity-100");
    		}, 10);
		}

		function closeUpdates() {
    		const popup = document.getElementById("updates-popup");
    		const box = document.getElementById("updates-box");

    		box.classList.add("scale-95", "opacity-0");

    		setTimeout(() => {
        		popup.classList.add("hidden");
    		}, 200);
		}
		
		let adminCountdownInterval = null; // Store interval so we can clear it

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

    		// Create Easter egg div
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
    		showDashboard();
    		startAdminCountdown();
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

    // Combine all citation texts
    const content = project.citations.map(c => c.textOnly || c.formatted).join("\n\n");

    if (format === "txt") {
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${project.name}-citations.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } 
    else if (format === "pdf") {
        // Using jsPDF library
        if (typeof jsPDF === "undefined") {
            showToast("PDF export requires jsPDF library!");
            return;
        }
        const doc = new jsPDF();
        const lines = doc.splitTextToSize(content, 180); // wrap text
        doc.text(lines, 15, 20);
        doc.save(`${project.name}-citations.pdf`);
    } 
    else if (format === "docx") {
        // Using docx library
        if (typeof docx === "undefined") {
            showToast("DOCX export requires docx library!");
            return;
        }
        const { Document, Packer, Paragraph, TextRun } = docx;
        const doc = new Document({
            sections: [{
                properties: {},
                children: project.citations.map(c => new Paragraph({
                    children: [new TextRun(c.textOnly || c.formatted)]
                }))
            }]
        });
        Packer.toBlob(doc).then(blob => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `${project.name}-citations.docx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }
}
