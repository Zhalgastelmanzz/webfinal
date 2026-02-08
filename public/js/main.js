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

        // Добавляем "All Products" только один раз — вручную
        const allLink = document.createElement('a');
        allLink.href = "#";
        allLink.className = "list-group-item list-group-item-action active";
        allLink.innerText = "All Products";
        allLink.onclick = (e) => {
            e.preventDefault();
            document.querySelectorAll('#category-list a').forEach(el => el.classList.remove('active'));
            allLink.classList.add('active');
            fetchProducts();
        };
        container.appendChild(allLink);

        // Добавляем категории из базы, пропуская "All Products" (если вдруг она там есть)
        categories.forEach(cat => {
            if (cat.name.trim().toLowerCase() === "all products") {
                return; // пропускаем дубликат
            }

            const link = document.createElement('a');
            link.href = "#";
            link.className = "list-group-item list-group-item-action";
            link.innerText = cat.name;
            link.dataset.slug = cat.slug || cat.name.toLowerCase().replace(/ /g, '-');

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
        if (document.getElementById('category-list')) {
            document.getElementById('category-list').innerHTML += '<p class="text-danger">Не удалось загрузить категории</p>';
        }
    }
}

async function fetchProducts(category = null) {
    const container = document.getElementById('product-container');
    container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div></div>';

    let url = '/api/products';
    if (category) url += `?category=${category}`;

    fetch(url)
      .then(res => res.json())
      .then(products => {
          console.log('Получено продуктов:', products.length); // добавь для отладки
          container.innerHTML = ''; // очищаем лоадер
          renderProducts(products);
      })
      .catch(err => {
          console.error("Ошибка:", err);
          container.innerHTML = '<p class="text-danger text-center">Ошибка загрузки продуктов. Попробуйте обновить страницу.</p>';
      })
      .finally(() => {
          // всегда скрываем лоадер, даже при ошибке
          const loader = container.querySelector('.spinner-border');
          if (loader) loader.remove();
      });
}
function renderProducts(products) {
    const container = document.getElementById('product-container');
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
        const imgSrc = p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/300x400?text=Нет+фото';
        const name = p.name || 'Без названия';
        const brand = p.brand || '';
        const price = p.price ? p.price.toLocaleString('ru-RU') + ' ' + (p.currency || 'KZT') : 'Цена не указана';

        const catName = p.categoryId?.name || 'Игры';

        const productId = p._id.toString ? p._id.toString() : p._id; 
const productUrl = `/product.html?id=${productId}&catName=${encodeURIComponent(catName || 'Игры')}`;
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