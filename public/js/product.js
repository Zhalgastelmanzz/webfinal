document.addEventListener('DOMContentLoaded', async () => {
    const elements = {
        productName: document.getElementById('productName'),
        productBrand: document.getElementById('productBrand'),
        productPrice: document.getElementById('productPrice'),
        productDesc: document.getElementById('productDesc'),
        productImg: document.getElementById('productImg'),
        variantSelect: document.getElementById('variantSelect'),
        addToCartBtn: document.getElementById('addToCartBtn'),
        quantityInput: document.getElementById('quantityInput')
    };

    if (!elements.productName || !elements.productImg) {
        showError('Ошибка страницы: не найдены необходимые элементы');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        showError('ID товара не указан в ссылке');
        setTimeout(() => { window.location.href = '/'; }, 3000);
        return;
    }

    console.log('Попытка загрузки продукта:', productId);

    try {
        const res = await fetch(`/api/products/${productId}`);
        console.log('Статус от сервера:', res.status);

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Товар не найден (код ${res.status}): ${errorText}`);
        }

        const product = await res.json();
        console.log('Продукт успешно загружен:', product.name);

        if (!product || !product._id) {
            throw new Error('Данные товара пустые');
        }

        elements.productName.innerText = product.name || 'Без названия';
        elements.productBrand.innerText = product.brand || 'Не указан';
        elements.productDesc.innerText = product.description || 'Описание отсутствует';

        const price = product.price ? product.price.toLocaleString('ru-RU') : '—';
        const currency = product.currency || 'KZT';
        elements.productPrice.innerText = `${price} ${currency}`;

        elements.productImg.src = (product.images && product.images.length > 0)
            ? product.images[0]
            : 'https://via.placeholder.com/500?text=Нет+фото';
        elements.productImg.alt = product.name || 'Изображение товара';

        if (elements.variantSelect) {
            elements.variantSelect.innerHTML = '<option value="">Выберите платформу</option>';

            if (product.variants && product.variants.length > 0) {
                product.variants.forEach(v => {
                    const option = document.createElement('option');
                    option.value = v.platform || '';
                    option.textContent = `${v.platform || 'Неизвестно'} (${v.stock || 0} в наличии)`;
                    elements.variantSelect.appendChild(option);
                });
            } else {
                elements.variantSelect.innerHTML += '<option value="">Вариантов нет</option>';
            }
        }

        if (elements.addToCartBtn) {
            elements.addToCartBtn.onclick = () => addToCart(product._id, product.price);
        }

    } catch (err) {
        console.error('Ошибка загрузки:', err);
        showError(err.message || 'Товар не найден или ошибка сервера. Вернитесь на главную.');
    }
});

function showError(message) {
    const container = document.querySelector('.product-container') || document.body;
    container.innerHTML = `
        <div style="color: red; padding: 40px; text-align: center; font-size: 1.4em;">
            ${message}
            <br><br>
            <a href="/" style="color: blue; text-decoration: underline; font-size: 1em;">
                Вернуться на главную страницу
            </a>
        </div>
    `;
}

// Функция корзины (оставь как есть или подправь)
async function addToCart(productId, originalPrice) {
    // твой код добавления в корзину
    alert('Добавлено в корзину: ' + productId);
}