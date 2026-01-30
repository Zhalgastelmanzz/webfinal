
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

async function fetchProducts() {
    try {
        const response = await fetch('/api/products'); 
        const products = await response.json();
        
        console.log("Response from server:", products); 
        if (!Array.isArray(products)) {
            console.error("Server returned NOT an array. Check your controller!");
            return;
        }


        renderProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}
function renderProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = ''; 
    products.forEach(product => {
        const productHTML = `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${product.images[0] || 'https://via.placeholder.com/300'}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text text-muted small">${product.brand}</p>
                        <h6 class="text-primary">${product.price} ${product.currency}</h6>
                    </div>
                    <div class="card-footer bg-transparent border-top-0">
                        <button class="btn btn-outline-primary w-100" onclick="addToCart('${product._id}')">В корзину</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productHTML;
    });
}