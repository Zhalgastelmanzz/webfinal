document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    fetchProducts(); // по умолчанию все продукты

    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get('category');

    if (categoryFilter) {
        fetchProducts(categoryFilter);
    }
});

async function loadCategories() {
    try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Ошибка загрузки категорий');

        const categories = await res.json();
        const container = document.getElementById('category-list');

        if (!container) {
            console.error('Элемент #category-list не найден');
            return;
        }

        // "All Products"
        const allLink = document.createElement('a');
        allLink.href = "#";
        allLink.className = "list-group-item list-group-item-action active";
        allLink.textContent = "All Products";
        allLink.onclick = (e) => {
            e.preventDefault();
            document.querySelectorAll('#category-list a').forEach(el => el.classList.remove('active'));
            allLink.classList.add('active');
            fetchProducts();
        };
        container.appendChild(allLink);

        categories.forEach(cat => {
            if (cat.name?.trim().toLowerCase() === "all products") return;

            const link = document.createElement('a');
            link.href = "#";
            link.className = "list-group-item list-group-item-action";
            link.textContent = cat.name || 'Без названия';
            link.dataset.slug = cat.slug || cat.name?.toLowerCase().replace(/ /g, '-') || '';

            link.onclick = (e) => {
                e.preventDefault();
                document.querySelectorAll('#category-list a').forEach(el => el.classList.remove('active'));
                link.classList.add('active');
                fetchProducts(link.dataset.slug);
            };
            container.appendChild(link);
        });
    } catch (err) {
        console.error("Ошибка загрузки категорий:", err);
    }
}

async function fetchProducts(category = null) {
    const container = document.getElementById('product-container');
    if (!container) {
        console.error('Элемент #product-container не найден');
        return;
    }

    container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div></div>';

    let url = '/api/products';
    if (category) {
        url += `?category=${encodeURIComponent(category)}`;
    }

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const products = await res.json();

        console.log('Получено продуктов:', products?.length || 0);
        console.log('Пример первого продукта:', products[0] ? {
            name: products[0].name,
            _id: products[0]._id,
            _id_type: typeof products[0]._id,
            _id_length: products[0]._id?.length
        } : 'Нет продуктов');

        container.innerHTML = '';
        renderProducts(products);
    } catch (err) {
        console.error("Ошибка загрузки продуктов:", err);
        container.innerHTML = '<p class="text-danger text-center py-5">Не удалось загрузить товары. Проверь консоль (F12).</p>';
    }
}

function renderProducts(products) {
    const container = document.getElementById('product-container');
    if (!container) return;

    container.innerHTML = '';

    if (!Array.isArray(products) || products.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <h4>В этой категории пока нет товаров</h4>
                <p class="text-muted">Попробуйте выбрать другую категорию</p>
            </div>
        `;
        return;
    }

    products.forEach(p => {
        // Отладка каждого продукта
        console.log(`Продукт: ${p.name || 'Без имени'} | _id: ${p._id} | тип: ${typeof p._id} | длина: ${p._id?.length || 'нет'}`);

        // Защита от битого _id
        if (!p._id || typeof p._id !== 'string' || p._id.length !== 24) {
            console.warn('Пропущен продукт с некорректным _id:', p.name, p._id);
            return;
        }

        const imgSrc = p.images?.[0] || 'https://via.placeholder.com/300x400?text=Нет+фото';
        const name = p.name || 'Без названия';
        const brand = p.brand || '';
        const price = p.price 
            ? `${Number(p.price).toLocaleString('ru-RU')} ${p.currency || 'KZT'}`
            : 'Цена не указана';

        const productUrl = `/product.html?id=${p._id}`;

        const card = `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    <img src="${imgSrc}" class="card-img-top" alt="${name}" style="height: 250px; object-fit: cover;">
                    <div class="card-body">
                        ${brand ? `<h6 class="text-muted small">${brand}</h6>` : ''}
                        <h5 class="card-title">${name}</h5>
                        <p class="text-primary fw-bold">${price}</p>
                    </div>
                    <div class="card-footer bg-white border-0 pb-3">
                        <a href="${productUrl}" class="btn btn-outline-primary btn-sm w-100">Подробнее</a>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML += card;
    });
}