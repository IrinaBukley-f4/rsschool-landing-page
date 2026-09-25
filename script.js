// render cards
let allProducts = [];
const wrapperEl = document.querySelector('.coffee__wrapper');
const tabsEls = document.querySelectorAll('.tab');

async function getData() {
    const res = await fetch('./products.json');
    return res.json();
}

async function init() {
    allProducts = await getData();
    renderCards('coffee');
}

function renderCards(cat) {
    const fileredProds = allProducts.filter(item => item.category === cat);
    if (!wrapperEl) return;
    wrapperEl.innerHTML = '';

    fileredProds.forEach((prod, index) => {
        const card = document.createElement('div');
        card.className = 'coffee__card';
        card.innerHTML = `
            <img src="./images/${prod.category}/${prod.category}-${index + 1}.png" alt=${prod.name} class="coffee__card-img">
               <div class="card__info">
                    <div class="card__descr">
                        <h2 class="coffee__card-title">${prod.name}</h2>
                        <p class="coffee__card-text">${prod.description} </p>
                    </div>
                    <p class="coffee__card-price">$${prod.price}</p>
               </div>
        `;
        wrapperEl.appendChild(card);
    })
}
init();

tabsEls && tabsEls.forEach(tab => {
    tab.addEventListener('click', (e) => {
        tabsEls.forEach(el => el.classList.remove('active'));
        e.currentTarget.classList.add('active');
        renderCards(e.currentTarget.id);
    })
});

// modal window

wrapperEl.addEventListener('click', (e) => {
    console.log(e.target.closest('.coffee__card'));
});

function showModal () {
    
}

// menu burger


// pagination


//slider


// theme

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