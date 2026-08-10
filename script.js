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

    // Check saved theme
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

    // --- Load Extensions Logic ---
    const gallery = document.getElementById('gallery');

    // Fetch data from extensions.json
    fetch('extensions.json')
        .then(response => response.json())
        .then(data => {
            renderExtensions(data);
        })
        .catch(error => {
            console.error('Error loading extensions:', error);
            gallery.innerHTML = '<p>Failed to load extensions. Make sure extensions.json is formatted properly.</p>';
        });

    function renderExtensions(extensions) {
        gallery.innerHTML = ''; 

        extensions.forEach(ext => {
            // Get full URL for TurboWarp and Copy Link
            const absoluteFileUrl = new URL(ext.file, window.location.href).href;
            
            const card = document.createElement('div');
            card.classList.add('card');

            card.innerHTML = `
                <img src="${ext.banner}" alt="${ext.name} Banner" class="card-banner" onerror="this.src=''">
                <div class="card-content">
                    <h2 class="card-title">${ext.name}</h2>
                    <p class="card-author">By ${ext.author || 'Unknown'}</p>
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
        // Copy Link
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

        // Download
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

        // Try in TurboWarp
        document.querySelectorAll('.try-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.currentTarget;
                const url = targetBtn.getAttribute('data-url');
                const turbowarpUrl = `https://turbowarp.org/editor?extension=${encodeURIComponent(url)}`;
                window.open(turbowarpUrl, '_blank');
            });
        });
    }
});
