document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle Logic ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    const body = document.body;

    function applyDarkTheme() {
        body.classList.add('dark-mode');
        themeIcon.src = 'assets/sun.png';
        themeText.textContent = 'Light Theme';
        localStorage.setItem('theme', 'dark');
    }

    function applyLightTheme() {
        body.classList.remove('dark-mode');
        themeIcon.src = 'assets/moon.png';
        themeText.textContent = 'Dark Theme';
        localStorage.setItem('theme', 'light');
    }

    if (localStorage.getItem('theme') === 'dark') {
        applyDarkTheme();
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    });

    // --- Data Storage for Search ---
    let allExtensions = [];
    const gallery = document.getElementById('gallery');
    const searchInput = document.getElementById('search-input');

    // Fetch data from extensions.json
    fetch('extensions.json')
        .then(response => response.json())
        .then(data => {
            allExtensions = data; // Save the data
            renderExtensions(allExtensions); // Draw it for the first time
        })
        .catch(error => {
            console.error('Error loading extensions:', error);
            gallery.innerHTML = '<p>Failed to load extensions. Make sure extensions.json is formatted properly.</p>';
        });

    // --- Search Bar Logic ---
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        // Filter out extensions that don't match the search
        const filteredExtensions = allExtensions.filter(ext => {
            const matchName = ext.name.toLowerCase().includes(query);
            const matchAuthor = (ext.author || '').toLowerCase().includes(query);
            const matchDesc = (ext.description || '').toLowerCase().includes(query);
            
            return matchName || matchAuthor || matchDesc;
        });

        // Draw the filtered list
        renderExtensions(filteredExtensions);
    });

    function renderExtensions(extensions) {
        gallery.innerHTML = ''; 

        if (extensions.length === 0) {
            gallery.innerHTML = '<p>No extensions found.</p>';
            return;
        }

        extensions.forEach(ext => {
            const absoluteFileUrl = new URL(ext.file, window.location.href).href;
            
            // Check if it is unsandboxed to display the icon
            // Adding title="Unsandboxed extension!" makes the text appear when you point at it!
            const unsandboxedHtml = ext.unsandboxed 
                ? `<img src="assets/unsandboxed.png" class="unsandboxed-icon" title="Unsandboxed extension!" alt="Unsandboxed" onerror="this.style.display='none'">` 
                : '';

            const card = document.createElement('div');
            card.classList.add('card');

            card.innerHTML = `
                <img src="${ext.banner}" alt="${ext.name} Banner" class="card-banner" onerror="this.src=''">
                <div class="card-content">
                    <div class="card-header-row">
                        <h2 class="card-title">${ext.name}</h2>
                        ${unsandboxedHtml}
                    </div>
                    <p class="card-author">By ${ext.author || 'Unknown'}</p>
                    <p class="card-description">${ext.description || 'No description provided.'}</p>
                    <div class="button-group">
                        <button class="btn btn-secondary copy-btn" data-url="${absoluteFileUrl}">
                            <img src="assets/link.png" width="20" height="20" alt="" class="btn-icon" onerror="this.style.display='none'">
                            <span class="btn-label">Copy Link</span>
                        </button>
                        <button class="btn btn-secondary download-btn" data-file="${ext.file}" data-name="${ext.name}">
                            <img src="assets/download.png" width="20" height="20" alt="" class="btn-icon" onerror="this.style.display='none'">
                            <span>Download</span>
                        </button>
                        <button class="btn btn-primary try-btn" data-url="${absoluteFileUrl}">
                            <img src="assets/turbowarp.png" width="20" height="20" alt="" class="btn-icon" onerror="this.style.display='none'">
                            <span>Try in TurboWarp</span>
                        </button>
                    </div>
                </div>
            `;

            gallery.appendChild(card);
        });

        attachButtonEvents();
    }

    function attachButtonEvents() {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.currentTarget;
                const url = targetBtn.getAttribute('data-url');
                const labelSpan = targetBtn.querySelector('.btn-label');
                
                navigator.clipboard.writeText(url).then(() => {
                    const originalText = labelSpan.textContent;
                    labelSpan.textContent = 'Copied!';
                    setTimeout(() => labelSpan.textContent = originalText, 2000);
                });
            });
        });

        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.currentTarget;
                const file = targetBtn.getAttribute('data-file');
                const name = targetBtn.getAttribute('data-name');
                
                const a = document.createElement('a');
                a.href = file;
                a.download = name.replace(/\s+/g, '_') + '.js';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
        });

        document.querySelectorAll('.try-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.currentTarget;
                const url = targetBtn.getAttribute('data-url');
                const turbowarpUrl = `https://turbowarp.org/editor?extension=${encodeURIComponent(url)}`;
                window.open(turbowarpUrl, '_blank');
            });
        });
    }
});    });

    // --- Render Logic ---
function renderExtensions(extensions) {
        gallery.innerHTML = ''; 

        if (extensions.length === 0) {
            gallery.innerHTML = '<p>No extensions found.</p>';
            return;
        }

        extensions.forEach(ext => {
            const absoluteFileUrl = new URL(ext.file, window.location.href).href;
            
            const unsandboxedHtml = ext.unsandboxed 
                ? `<img src="assets/unsandboxed.png" class="unsandboxed-icon" title="Unsandboxed extension!" alt="Unsandboxed" onerror="this.style.display='none'">` 
                : '';

            // CHANGE: Check if it's unsandboxed to change the button text!
            const tryButtonText = ext.unsandboxed ? 'How to Use' : 'Try in TurboWarp';

            const card = document.createElement('div');
            card.classList.add('card');

            card.innerHTML = `
                <img src="${ext.banner}" alt="${ext.name} Banner" class="card-banner" onerror="this.src=''">
                <div class="card-content">
                    <div class="card-header-row">
                        <h2 class="card-title">${ext.name}</h2>
                        ${unsandboxedHtml}
                    </div>
                    <p class="card-author">By ${ext.author || 'Unknown'}</p>
                    <p class="card-description">${ext.description || 'No description provided.'}</p>
                    <div class="button-group">
                        <button class="btn btn-secondary copy-btn" data-url="${absoluteFileUrl}">
                            <img src="assets/link.png" width="20" height="20" alt="" class="btn-icon" onerror="this.style.display='none'">
                            <span class="btn-label">Copy Link</span>
                        </button>
                        <button class="btn btn-secondary download-btn" data-file="${ext.file}" data-name="${ext.name}">
                            <img src="assets/download.png" width="20" height="20" alt="" class="btn-icon" onerror="this.style.display='none'">
                            <span>Download</span>
                        </button>
                        <!-- CHANGE: We added data-unsandboxed so the button knows what type of extension it is -->
                        <button class="btn btn-primary try-btn" data-url="${absoluteFileUrl}" data-unsandboxed="${ext.unsandboxed}">
                            <img src="assets/turbowarp.png" width="20" height="20" alt="" class="btn-icon" onerror="this.style.display='none'">
                            <span>${tryButtonText}</span>
                        </button>
                    </div>
                </div>
            `;

            gallery.appendChild(card);
        });

        attachButtonEvents();
    }

    function attachButtonEvents() {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.currentTarget;
                const url = targetBtn.getAttribute('data-url');
                const labelSpan = targetBtn.querySelector('.btn-label');
                
                navigator.clipboard.writeText(url).then(() => {
                    const originalText = labelSpan.textContent;
                    labelSpan.textContent = 'Copied!';
                    setTimeout(() => labelSpan.textContent = originalText, 2000);
                });
            });
        });

        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.currentTarget;
                const file = targetBtn.getAttribute('data-file');
                const name = targetBtn.getAttribute('data-name');
                
                const a = document.createElement('a');
                a.href = file;
                a.download = name.replace(/\s+/g, '_') + '.js';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
        });

        document.querySelectorAll('.try-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.currentTarget;
                const url = targetBtn.getAttribute('data-url');
                
                // CHANGE: Read the unsandboxed status
                const isUnsandboxed = targetBtn.getAttribute('data-unsandboxed') === 'true';

                if (isUnsandboxed) {
                    // Show instructions instead of trying to open the URL
                    alert("⚠️ TURBOWARP SECURITY RULE:\n\nTurboWarp does not allow unsandboxed extensions to be loaded directly from a URL.\n\nTo use this extension:\n1. Click the 'Download' button.\n2. Open TurboWarp and click 'Add Extension'.\n3. Click 'Custom Extension' at the bottom.\n4. Select 'File' and choose your downloaded file.\n5. IMPORTANT: Check the 'Run extension without sandbox' box!");
                } else {
                    // It is sandboxed, open it normally!
                    const turbowarpUrl = `https://turbowarp.org/editor?extension=${encodeURIComponent(url)}`;
                    window.open(turbowarpUrl, '_blank');
                }
            });
        });
    }
