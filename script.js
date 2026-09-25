// render cards
let allProducts = [];
const wrapperEl = document.querySelector('.coffee__wrapper');
const tabsEls = document.querySelectorAll('.tab');
const modalEl = document.querySelector('.modal');
const closeModalEl = document.querySelector('.modal__close');
const overlayEl = document.querySelector('.modal__overlay');
const modalContentEl = document.querySelector('.modal__content');

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
        card.dataset.index = index; 
        card.dataset.category = cat;
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
    const card = e.target.closest('.coffee__card');
    if (!card) return;

    const index = card.dataset.index;
    const category = card.dataset.category;

    const filteredProds = allProducts.filter(item => item.category === category);
    const product = filteredProds[index];
    
    showModal(product, index);
});

modalContentEl.addEventListener('click', (e) => {
    if (e.target.closest('.modal__close')) {
        closeModal();
    }
});
overlayEl.addEventListener('click', () => {
    closeModal();
});
function showModal (product, i) {
    document.querySelector('.modal').classList.remove('hidden');
    modalContentEl.innerHTML = '';
    modalContentEl.innerHTML = `
        <div class="modal__img"><img src="./images/${product.category}/${product.category}-${+i+1}.png" alt="${product.category}"></div>
        <div class="modal__descr">
            <h2 class="coffee__card-title">${product.name}</h2>
            <p class="coffee__card-text">${product.description}</p>
            <h3 class="coffee__card-subtitle">Size</h3>
            <div class="coffee__card-add">
                <button class="active"><span>S</span>${product.sizes.s.size}</button>
                <button><span>M</span>${product.sizes.m.size}</button>
                <button><span>L</span>${product.sizes.l.size}</button>
            </div>
            <h3 class="coffee__card-subtitle">Additives</h3>
            <div class="coffee__card-add">
                <button><span>1</span>${product.additives[0].name}</button>
                <button><span>2</span>${product.additives[1].name}</button>
                <button><span>3</span>${product.additives[2].name}</button>
            </div>
            <div class="coffee__card-total">
                <h3>Total:</h3>
                <span>$${product.price}</span>
            </div>
            <div class="coffee__card-info">
                <img src="./icons/info-empty.png" alt="info">
                <span>The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</span>
            </div>
            <button class="modal__close">close</button>
        </div>
    `;
}

function closeModal () {
    document.querySelector('.modal').classList.add('hidden');
}

// menu burger


// pagination


//slider


// фadditives && new price


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