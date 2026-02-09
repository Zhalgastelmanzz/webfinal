document.addEventListener('DOMContentLoaded', async () => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = '/';
        return;
    }

    try {
        const res = await fetch(`/api/products/${productId}`); 
        const product = await res.json();

        document.getElementById('productName').innerText = product.name;
        document.getElementById('productBrand').innerText = product.brand;
        document.getElementById('productPrice').innerText = `${product.price} ${product.currency}`;
        document.getElementById('productDesc').innerText = product.description;
        document.getElementById('productImg').src = product.images[0] || 'https://via.placeholder.com/500';

        const variantSelect = document.getElementById('variantSelect');
        product.platforms.forEach(platform => {
            const option = document.createElement('option');
            option.value = platform;
            option.textContent = platform; // Добавляем платформы в выпадающий список
            variantSelect.appendChild(option);
        });

        // Убираем поле для ввода количества и всегда ставим qty = 1
        document.getElementById('addToCartBtn').onclick = () => addToCart(product._id, 1); // Ставим количество 1 по умолчанию

    } catch (err) {
        console.error('Error fetching product:', err);
    }
});

async function addToCart(productId, qty) { 
    const token = localStorage.getItem('token');

    if (!token) {
        if (confirm('In order to add items to your cart, you need to log in. Proceed to login page?')) {
            window.location.href = '/auth.html';
        }
        return;
    }

    const sku = document.getElementById('variantSelect').value;
    const priceText = document.getElementById('productPrice').innerText;
    const priceSnapshot = parseFloat(priceText.replace(/[^0-9.]/g, '')); // Извлекаем цену без валюты

    try {
        const res = await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, sku, qty, priceSnapshot }) // Передаем количество 1
        });

        if (res.status === 401) {
            alert('Your session has expired. Please log in again.');
            localStorage.removeItem('token');
            window.location.href = '/auth.html';
            return;
        }

        if (res.ok) {
            alert('Product added to cart successfully!');
        } else {
            alert('Failed to add product to cart. Please try again later.');
        }
    } catch (err) {
        console.error('Error adding product to cart:', err);
    }
}
