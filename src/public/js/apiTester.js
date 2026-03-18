const API_BASE = '/api';

async function apiRequest(endpoint, options = {}) {
    const responseId = options.responseId || 'products';
    const statusEl = document.getElementById(`${responseId}-status`);
    const bodyEl = document.getElementById(`${responseId}-body`);
    const containerEl = document.getElementById(`${responseId}-response`);
    
    try {
        // Mostrar loading
        statusEl.textContent = 'Loading...';
        statusEl.className = 'response-status response-loading';
        bodyEl.textContent = 'Cargando respuesta del servidor...';
        containerEl.style.display = 'block';

        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: options.body ? JSON.stringify(options.body) : null
        });

        const data = await response.text(); // Primero texto para manejar errores
        let parsedData;
        
        try {
            parsedData = JSON.parse(data);
        } catch {
            parsedData = data; // Si no es JSON, mostrar como texto
        }

        // Éxito
        statusEl.textContent = `Status: ${response.status}`;
        statusEl.className = response.ok ? 'response-status' : 'response-status response-error';
        bodyEl.textContent = JSON.stringify(parsedData, null, 2);
        bodyEl.className = response.ok ? 'response-body' : 'response-body error';
        
    } catch (error) {
        statusEl.textContent = 'Status: 500';
        statusEl.className = 'response-status response-error';
        bodyEl.textContent = `Error de red:\n${error.message}`;
        bodyEl.className = 'response-body error';
        console.error('API Error:', error);
    }
}

function clearResponse(responseId) {
    const container = document.getElementById(`${responseId}-response`);
    const statusEl = document.getElementById(`${responseId}-status`);
    const bodyEl = document.getElementById(`${responseId}-body`);
    
    container.style.display = 'none';
    statusEl.textContent = 'Esperando...';
    bodyEl.textContent = 'Haz clic en el botón para probar el endpoint';
    bodyEl.className = 'response-body response-empty';
}

// PRODUCTS ENDPOINTS
async function testGetProducts() {
    await apiRequest('/products', { responseId: 'products' });
}

async function testGetProductById() {
    const pid = document.getElementById('pid-get').value;
    if (!pid) return alert('❌ Ingresa un Product ID');
    await apiRequest(`/products/${pid}`, { responseId: 'product' });
}

async function testCreateProduct() {
    const productData = {
        title: document.getElementById('title').value || 'Sin título',
        description: document.getElementById('description').value || 'Sin descripción',
        code: document.getElementById('code').value || 'NOCODE',
        price: parseFloat(document.getElementById('price').value) || 0,
        status: document.getElementById('status').value === 'true',
        stock: parseInt(document.getElementById('stock').value) || 0,
        category: document.getElementById('category').value || 'Sin categoría',
        thumbnails: document.getElementById('thumbnails').value 
            ? document.getElementById('thumbnails').value.split(',').map(t => t.trim()).filter(t => t)
            : []
    };
    
    await apiRequest('/products', {
        method: 'POST',
        body: productData,
        responseId: 'create'
    });
}

async function testUpdateProduct() {
    const pid = document.getElementById('pid-put').value;
    const action = document.getElementById('update-action').value;
    const value = document.getElementById('update-value').value;
    
    if (!pid || !value) return alert('❌ Completa Product ID y Value');
    
    await apiRequest(`/products/${pid}`, {
        method: 'PUT',
        body: { action, value },
        responseId: 'update'
    });
}

async function testDeleteProduct() {
    const pid = document.getElementById('pid-delete').value;
    if (!pid) return alert('❌ Ingresa un Product ID');
    await apiRequest(`/products/${pid}`, { 
        method: 'DELETE',
        responseId: 'delete'
    });
}

// CARTS ENDPOINTS
async function testGetCart() {
    const cid = document.getElementById('cid-get').value;
    if (!cid) return alert('❌ Ingresa un Cart ID');
    await apiRequest(`/carts/${cid}`, { responseId: 'cart' });
}

async function testCreateCart() {
    await apiRequest('/carts', { 
        method: 'POST',
        responseId: 'cart-create'
    });
}

async function testAddProductToCart() {
    const cid = document.getElementById('cid-add').value;
    const pid = document.getElementById('pid-add').value;
    const quantity = document.getElementById('quantity').value;
    
    if (!cid || !pid) return alert('❌ Completa Cart ID y Product ID');
    
    await apiRequest(`/carts/${cid}/product/${pid}`, {
        method: 'POST',
        body: { quantity: parseInt(quantity) || 1 },
        responseId: 'cart-add'
    });
}

// contenido placeholder para probar productos

function randText(len) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ';
    let s = '';
    for (let i = 0; i < len; i++) {
        s += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Capitalizar la primera letra para mejor aspecto
    if (s.length > 0) s = s.charAt(0).toUpperCase() + s.slice(1);
    return s.trim();
}

function randNum(min, max, decimals) {
    const n = Math.random() * (max - min) + min;
    return decimals ? parseFloat(n.toFixed(decimals)) : Math.floor(n);
}

function randThumbnails() {
    const imgs = [
        'https://picsum.photos/seed/' + Math.random().toString(36).substring(2, 7) + '/200/200',
        'https://picsum.photos/seed/' + Math.random().toString(36).substring(2, 7) + '/200/200',
        'https://picsum.photos/seed/' + Math.random().toString(36).substring(2, 7) + '/200/200'
    ];
    return imgs.slice(0, Math.floor(Math.random() * imgs.length) + 1).join(',');
}

function addPlaceHolders(){
    const catList = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Accesorios'];
    document.querySelector('#title').value = randText(12)
    document.querySelector('#description').value = randText(28)
    document.querySelector('#code').value = 'PR-' + Math.floor(Math.random() * 9000 + 1000);
    document.querySelector('#price').value = randNum(1, 9999, 0);
    document.querySelector('#stock').value = randNum(1, 99, 0);
    document.querySelector('#status').value = Math.random() > 0.5 ? 'true' : 'false';
    document.querySelector('#category').value = catList[Math.floor(Math.random() * catList.length)];
    document.querySelector('#thumbnails').value = randThumbnails();
}