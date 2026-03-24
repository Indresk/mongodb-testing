const cartSelected = JSON.parse(localStorage.getItem("cart-key")) || 'Ninguno';

const cartSelectedVisual = document.querySelector('#selected-cart')
cartSelectedVisual.innerText = cartSelected

document.querySelectorAll('.button-cart-selector').forEach((button)=>{
    button.addEventListener('click',(e)=>{
        const cartValue = e.target.getAttribute('data-id')
        localStorage.setItem('cart-key',JSON.stringify(cartValue))
        cartSelectedVisual.innerText = cartValue
    })
})

document.querySelectorAll('.add-to-cart-button').forEach((button)=>{
    button.addEventListener('click',async (e)=>{
        const prodId = e.target.getAttribute('data-id')
        const response = await addProductToSelectedCart(prodId)
        const legibleResponse = await response.json();
        console.log(legibleResponse)
        if (!response.ok) {
            Swal.fire({
                text: `${legibleResponse.message}.`,
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error'
            });return
        }
        Swal.fire({
            text: `${legibleResponse.message}.`,
            toast: true,
            position: 'top-right',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon: 'success'
        });
    })
})

document.querySelectorAll('.delete-from-cart-button').forEach((button)=>{
    button.addEventListener('click',async (e)=>{
        const prodId = e.target.getAttribute('data-id')
        const response = await deleteProductFromSelectedCart(prodId)
        const legibleResponse = await response.json();
        console.log(legibleResponse)
        if (!response.ok) {
            Swal.fire({
                text: `${legibleResponse.message}.`,
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error'
            });return
        }
        Swal.fire({
            text: `${legibleResponse.message}.`,
            toast: true,
            position: 'top-right',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            icon: 'success'
        });
        setTimeout(()=>window.location.reload(),1500)
    })
})

async function addProductToSelectedCart(pid) {
    const cid = JSON.parse(localStorage.getItem("cart-key")) || 'Ninguno';
    
    if (cid === 'Ninguno') return alert('❌ Selecciona un carrito');
    
    return await fetch(`/api/carts/${cid}/product/${pid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: 1 }),
    });
}

async function deleteProductFromSelectedCart(pid) {
    const cid = JSON.parse(localStorage.getItem("cart-key")) || 'Ninguno';
    console.log(window.location.pathname)
    if (!window.location.pathname.includes(cid)) return alert('❌ Cambia al carrito donde estas intentando eliminar este producto.');
    if (cid === 'Ninguno') return alert('❌ Selecciona un carrito');
    
    return await fetch(`/api/carts/${cid}/product/${pid}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    });
}
