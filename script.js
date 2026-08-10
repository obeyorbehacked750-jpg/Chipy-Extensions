document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle Logic ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check saved theme in localStorage
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        themeToggleBtn.textContent = '?? Light Theme';
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.textContent = '?? Light Theme';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggleBtn.textContent = '?? Dark Theme';
        }
    });

    // --- Load Extensions Logic ---
    const gallery = document.getElementById('gallery');

    // Fetch the JSON file
    fetch('extensions.json')
        .then(response => response.json())
        .then(data => {
            renderExtensions(data);
        })
        .catch(error => {
            console.error('Error loading extensions:', error);
            gallery.innerHTML = '<p>Failed to load extensions. Ensure you are running this on a local server (like VS Code Live Server).</p>';
        });

    function renderExtensions(extensions) {
        gallery.innerHTML = ''; // Clear gallery

        extensions.forEach(ext => {
            // Get the absolute URL for the extension file (needed for TurboWarp)
            const absoluteFileUrl = new URL(ext.file, window.location.href).href;
            
            // Create card container
            const card = document.createElement('div');
            card.classList.add('card');

            // Generate card HTML
            card.innerHTML = `
                <img src="${ext.banner}" alt="${ext.name} Banner" class="card-banner" onerror="this.src=''">
                <div class="card-content">
                    <h2 class="card-title">${ext.name}</h2>
                    <div class="button-group">
                        <button class="btn btn-secondary copy-btn" data-url="${absoluteFileUrl}">?? Copy Link</button>
                        <button class="btn btn-secondary download-btn" data-file="${ext.file}" data-name="${ext.name}">?? Download</button>
                        <button class="btn btn-primary try-btn" data-url="${absoluteFileUrl}">?? Try in TurboWarp</button>
                    </div>
                </div>
            `;

            gallery.appendChild(card);
        });

        // Add event listeners to the newly created buttons
        attachButtonEvents();
    }

    function attachButtonEvents() {
        // 1. Copy Link
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const url = e.target.getAttribute('data-url');
                navigator.clipboard.writeText(url).then(() => {
                    const originalText = e.target.textContent;
                    e.target.textContent = '? Copied!';
                    setTimeout(() => e.target.textContent = originalText, 2000);
                });
            });
        });

        // 2. Download
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const file = e.target.getAttribute('data-file');
                const name = e.target.getAttribute('data-name');
                
                const a = document.createElement('a');
                a.href = file;
                a.download = name.replace(/\s+/g, '_') + '.js'; // Formats name with underscores
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
        });

        // 3. Try in TurboWarp
        document.querySelectorAll('.try-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const url = e.target.getAttribute('data-url');
                // Format: https://turbowarp.org/editor?extension=URL
                const turbowarpUrl = `https://turbowarp.org/editor?extension=${encodeURIComponent(url)}`;
                window.open(turbowarpUrl, '_blank');
            });
        });
    }
});