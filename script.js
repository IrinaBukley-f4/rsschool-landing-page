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

wrapperEl && wrapperEl.addEventListener('click', (e) => {
    const card = e.target.closest('.coffee__card');
    if (!card) return;

    const index = card.dataset.index;
    const category = card.dataset.category;

    const filteredProds = allProducts.filter(item => item.category === category);
    const product = filteredProds[index];
    
    showModal(product, index);
});

modalContentEl && modalContentEl.addEventListener('click', (e) => {
    if (e.target.closest('.modal__close')) {
        closeModal();
    }
});
overlayEl && overlayEl.addEventListener('click', () => {
    closeModal();
});
function showModal (product, i) {
    document.body.style.overflow = 'hidden' 
    document.querySelector('.modal').classList.remove('hidden');
    modalContentEl.innerHTML = '';
    modalContentEl.innerHTML = `
        <div class="modal__img">
            <img src="./images/${product.category}/${product.category}-${+i+1}.png" alt="${product.category}">
        </div>
        <div class="modal__descr">
            <h2 class="coffee__card-title">${product.name}</h2>
            <p class="coffee__card-text">${product.description}</p>
            
            <h3 class="coffee__card-subtitle">Size</h3>
            <div class="coffee__card-add" data-type="size">
                <button class="active" data-size="s" data-price="${product.sizes.s['add-price']}">
                    <span>S</span>${product.sizes.s.size}
                </button>
                <button data-size="m" data-price="${product.sizes.m['add-price']}">
                    <span>M</span>${product.sizes.m.size}
                </button>
                <button data-size="l" data-price="${product.sizes.l['add-price']}">
                    <span>L</span>${product.sizes.l.size}
                </button>
            </div>
            
            <h3 class="coffee__card-subtitle">Additives</h3>
            <div class="coffee__card-add" data-type="additive">
                ${product.additives.map((add, idx) => `
                    <button data-additive="${idx}" data-price="${add['add-price']}">
                        <span>${idx + 1}</span>${add.name}
                    </button>
                `).join('')}
            </div>
            
            <div class="coffee__card-total">
                <h3>Total:</h3>
                <span class="modal__price">$${product.price}</span>
            </div>
            
            <div class="coffee__card-info">
                <img src="./icons/info-empty.png" alt="info">
                <span>The cost is not final...</span>
            </div>
            
            <button class="modal__close">close</button>
        </div>
    `;
    initPriceCalculator(product);
}

function closeModal () {
    document.querySelector('.modal').classList.add('hidden');
    document.body.style.overflow = '' 
}

// additives && new price

function initPriceCalculator(product) {
    const basePrice = parseFloat(product.price);
    const sizeButtons = modalContentEl.querySelectorAll('[data-type="size"] button');
    const additiveButtons = modalContentEl.querySelectorAll('[data-type="additive"] button');
    const priceEl = modalContentEl.querySelector('.modal__price');
    
    function updatePrice() {
        let total = basePrice;
        
        sizeButtons.forEach(btn => {
            if (btn.classList.contains('active')) {
                total += parseFloat(btn.dataset.price) || 0;
            }
        });
        
        additiveButtons.forEach(btn => {
            if (btn.classList.contains('active')) {
                total += parseFloat(btn.dataset.price) || 0;
            }
        });
        
        priceEl.textContent = `$${total.toFixed(2)}`;
    }
    
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updatePrice();
        });
    });
    
    additiveButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            updatePrice();
        });
    });
    
    updatePrice();
}

// menu burger

const burgerEl = document.getElementById('burger');
const burgerCoffeeEl = document.getElementById('burger-coffee');
const mobileMenuEl = document.getElementById('mobileMenu');
const MOBILE_BREAKPOINT = 768;

function toggleMenu() {
    burgerEl?.classList.toggle('active');
    burgerCoffeeEl?.classList.toggle('active');
    mobileMenuEl.classList.toggle('active');
    burgerEl?.classList.contains('active') 
        ? document.body.style.overflow = 'hidden' 
        : document.body.style.overflow = '';
    burgerCoffeeEl?.classList.contains('active') 
        ? document.body.style.overflow = 'hidden' 
        : document.body.style.overflow = '';
}

function closeMenu() {
    burgerEl?.classList.remove('active');
    burgerCoffeeEl?.classList.remove('active');
    mobileMenuEl.classList.remove('active');
    document.body.style.overflow = '';
}

burgerEl?.addEventListener('click', toggleMenu);
burgerCoffeeEl?.addEventListener('click', toggleMenu);

mobileMenuEl?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
    document.body.style.overflow = '';
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
    document.body.style.overflow = '';
});

window.addEventListener('resize', () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
        closeMenu();
    }
});

// pagination


//slider

const contentEl = document.querySelector('.slider__content');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const arrowPrevEl = document.querySelector('.arrow__left');
const arrowNextEl = document.querySelector('.arrow__right');

let currentIndex = 0;

function goToSlide(index) {
    if (!contentEl || slides.length === 0) return;
    
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    currentIndex = index;
    
    const slideWidth = slides[0].offsetWidth;
    const gap = parseInt(getComputedStyle(contentEl).gap) || 0;
    
    contentEl.style.transform = `translateX(-${currentIndex * (slideWidth + gap)}px)`;
    
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
}

if (contentEl && slides.length > 0) {
    arrowNextEl?.addEventListener('click', () => goToSlide(currentIndex + 1));
    arrowPrevEl?.addEventListener('click', () => goToSlide(currentIndex - 1));
    
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(Number(dot.dataset.index));
        });
    });
}

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => goToSlide(currentIndex), 100);
});

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