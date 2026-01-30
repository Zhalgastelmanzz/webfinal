let currentCartItems = [];
let currentTotal = 0;

document.addEventListener('DOMContentLoaded', fetchCart);

async function fetchCart() {
    const token = localStorage.getItem('token');
    if (!token) return window.location.href = '/auth.html';

    try {
        const res = await fetch('/api/cart', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const cart = await res.json();
        currentCartItems = cart.items || [];
        renderCart(cart);
    } catch (err) { console.error(err); }
}

function renderCart(cart) {
    const container = document.getElementById('cartContainer');
    const checkoutBtn = document.getElementById('checkoutBtn');
    let total = 0;

    if (!cart.items || cart.items.length === 0) {
        container.innerHTML = 'Your cart is empty.';
        checkoutBtn.disabled = true;
        return;
    }

 container.innerHTML = cart.items.map(item => {
    const price = item.priceSnapshot || (item.productId ? item.productId.price : 0);
    const itemTotal = price * item.qty;
    total += itemTotal;
    
    const imgUrl = (item.productId && item.productId.images && item.productId.images[0]) 
                   ? item.productId.images[0] 
                   : 'https://via.placeholder.com/80';

    return `
        <div class="card mb-3 shadow-sm">
            <div class="card-body">
                <div class="d-flex align-items-center">
                    <img src="${imgUrl}" alt="product" class="rounded me-3" style="width: 80px; height: 80px; object-fit: cover;">
                    
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h5 class="card-title mb-1">${item.productId ? item.productId.name : 'Unknown Product'}</h5>
                                <p class="text-muted small mb-0">SKU: ${item.sku}</p>
                            </div>
                            <button class="btn btn-outline-danger btn-sm border-0" onclick="removeItem('${item._id}')">
                                <i class="bi bi-trash"></i> Удалить
                            </button>
                        </div>
                        
                        <div class="d-flex justify-content-between align-items-center mt-2">
                            <span class="text-muted">Кол-во: <strong>${item.qty}</strong></span>
                            <span class="fw-bold text-primary">${itemTotal.toLocaleString()} KZT</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}).join('');

    currentTotal = total;
    document.getElementById('total').innerText = `${total} KZT`;
    checkoutBtn.disabled = false;
    checkoutBtn.onclick = placeOrder;
}

async function placeOrder() {
    const token = localStorage.getItem('token');
    const address = document.getElementById('addressInput').value;

    if (!address) return alert('Please enter address');

    const cleanItems = currentCartItems.map(item => ({
        productId: item.productId._id || item.productId,
        sku: item.sku,
        qty: item.qty
    }));

    const res = await fetch('/api/orders/orders', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
            items: cleanItems, 
            totalAmount: currentTotal,
            shippingAddress: { city: "Default", street: address, zip: "000000" }
        })
    });

    if (res.ok) {
        alert('Success!');
        window.location.href = '/profile.html';
    } else {
        alert('Failed to place order');
    }
}

async function removeItem(itemId) {
    const token = localStorage.getItem('token');
    await fetch(`/api/cart/item/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchCart();
}