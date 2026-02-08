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
    let total = 0;
    currentCartItems = cart.items;

    if (!cart.items || cart.items.length === 0) {
        container.innerHTML = '<div class="text-center py-5"><h5>Your cart is empty</h5></div>';
        return;
    }

    container.innerHTML = cart.items.map(item => {
        const price = item.priceSnapshot || 0;
        const itemTotal = price * item.qty;
        total += itemTotal;
        
        return `
        <div class="card mb-3 shadow-sm border-0 p-3">
            <div class="row align-items-center">
                <div class="col-2">
                    <img src="${item.productId.images?.[0]}" class="img-fluid rounded">
                </div>
                <div class="col-7">
                    <h6 class="fw-bold mb-1">${item.productId.name}</h6>
                    <div class="text-muted small"> Platform: ${item.sku}</div>
                    <div class="mt-1">Qty: ${item.qty} x <strong>${item.priceSnapshot} KZT</strong></div>
                </div>
                <div class="col-3 text-end">
                    <div class="fw-bold mb-3">${(item.priceSnapshot * item.qty).toLocaleString()} KZT</div>
                    <button class="btn btn-sm btn-outline-danger border-0" onclick="removeItem('${item._id}')">
                        <i class="bi bi-trash"></i> Remove
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');

    document.getElementById('subtotal').innerText = `${total} KZT`;

    currentTotal = total;
    document.getElementById('total').innerText = `${total} KZT`;
    const checkoutBtn = document.getElementById('placeOrderBtn');
    if(checkoutBtn) {
        checkoutBtn.onclick = placeOrder;
    }
}

async function placeOrder() {
    console.log("Кнопка нажата!");

    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in to place an order.');

    const orderData = {
        items: currentCartItems.map(item => ({
            productId: item.productId._id || item.productId,
            sku: item.sku,
            qty: item.qty,
            lineTotal: (item.priceSnapshot || 0) * item.qty
        })),
        totalAmount: currentTotal
    };

    try {
        const res = await fetch('/api/orders/orders', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(orderData)
        });

        if (res.ok) {
            const data = await res.json();
            alert('Order placed successfully!');

            const whatsAppNumber = '+77752467758';  
            const message = `My order ID: ${data.orderId}. Please confirm.`;
            window.location.href = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`;
        } else {
            const error = await res.json();
            alert(`Failed to place order: ${error.message}`);
        }
    } catch (err) {
        console.error('Error placing order:', err);
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