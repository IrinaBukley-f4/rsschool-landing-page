(function () {
    const STORAGE_KEY = 'coffee-theme';
    const body = document.body;
    const themeButtons = document.querySelectorAll('[data-theme]');

    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark');
        } else {
            body.classList.remove('dark');
        }

        themeButtons.forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });

        localStorage.setItem(STORAGE_KEY, theme);
    }

    
    function initTheme() {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            applyTheme(saved);
            return;
        }

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }


    themeButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            applyTheme(btn.dataset.theme);
        });
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    initTheme();
})();