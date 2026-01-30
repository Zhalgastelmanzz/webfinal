document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    fetchProducts();
});

const urlParams = new URLSearchParams(window.location.search);
const categoryFilter = urlParams.get('category');

if (categoryFilter) {
    fetchProducts(categoryFilter); 
} else {
    fetchProducts();
}

async function loadCategories() {
    try {
        const res = await fetch('/api/categories');
        const categories = await res.json();
        const container = document.getElementById('category-list');

        categories.forEach(cat => {
            const link = document.createElement('a');
            link.href = "#";
            link.className = "list-group-item list-group-item-action";
            link.innerText = cat.name;
            
            link.onclick = (e) => {
                e.preventDefault();
                filterByCategory(cat._id, link); 
            };
            container.appendChild(link);
        });
    } catch (err) {
        console.error("Error:", err);
    }
}

async function filterByCategory(categoryId, element) {
    document.querySelectorAll('#category-list .list-group-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');

    fetchProducts(categoryId === 'all' ? null : categoryId);
}


async function fetchProducts(category = null) {
    const container = document.getElementById('product-container');
    container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div></div>';

    try {
        let url = '/api/products';
        if (category) url += `?category=${category}`;

        const res = await fetch(url);
        const products = await res.json();
        
        renderProducts(products);
    } catch (err) {
        container.innerHTML = '<p class="text-danger text-center">Error loading products.</p>';
    }
}

function renderProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = '';

    products.forEach(p => {
        const productUrl = `/product.html?id=${p._id}&catName=${encodeURIComponent(p.categoryName || 'Одежда')}`;
        
        container.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    <img src="${p.images[0] || 'https://via.placeholder.com/300'}" class="card-img-top" alt="${p.name}">
                    <div class="card-body">
                        <h6 class="text-muted small">${p.brand}</h6>
                        <h5 class="card-title">${p.name}</h5>
                        <p class="text-primary fw-bold">${p.price} KZT</p>
                    </div>
                    <div class="card-footer bg-white border-0 pb-3">
                        <a href="${productUrl}" class="btn btn-outline-dark btn-sm w-100">View Details</a>
                    </div>
                </div>
            </div>
        `;
    });
}