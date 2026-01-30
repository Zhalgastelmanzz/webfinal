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
        product.variants.forEach(v => {
            const option = document.createElement('option');
            option.value = v.sku;
            option.textContent = `${v.size} - ${v.color} (${v.stockQty} in stock)`;
            variantSelect.appendChild(option);
        });

        document.getElementById('addToCartBtn').onclick = () => addToCart(product._id);

    } catch (err) {
        console.error('Error fetching product:', err);
    }
});

async function addToCart(productId) {
    const token = localStorage.getItem('token');
    const sku = document.getElementById('variantSelect').value;
    const qty = parseInt(document.getElementById('quantityInput').value);

    const priceText = document.getElementById('productPrice').innerText;
    const priceSnapshot = parseFloat(priceText.replace(/[^0-9.]/g, '')); 

    const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, sku, qty, priceSnapshot }) 
    });

    if (!token) {
        alert('Please login first');
        window.location.href = '/auth.html';
        return;
    }

    if (res.ok) {
        alert('Product added to cart!');
    } else {
        alert('Failed to add to cart');
    }
}