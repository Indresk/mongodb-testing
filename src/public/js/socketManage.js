const socket = io();

socket.on("prods-updated", ({prods,status,message,action}) => {
    const container = document.querySelector(".products-rt")
    container.innerHTML = ''
    let actionMessage = ''

    switch(action){
        case 'create': actionMessage = 'creó'; break;
        case 'delete': actionMessage = 'eliminó'; break;
        case 'modify': actionMessage = 'modificó'; break;
        default: status = 'failed'; break;
    }

    if(status === 'failed'){
        Swal.fire({
            text: `Error actualizando los productos en tiempo real: ${message}.`,
            toast: true,
            position: 'top-right',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon: 'error'
        });return
    }

    prods.forEach(prod => {
        const card = document.createElement('div')
        card.className = 'product-preview'
        card.innerHTML = `
            <div>
                <strong>ID: ${prod.id}</strong>
                <div class="prod-status ${prod.status?'active':'inactive'}">${prod.status?'Disponible':'Agotado'}</div>
            </div>
            <img src="${prod.mainThumb}" alt="" class="main-thumb" alt="">
            <div>
                <h3>${prod.title}</h3>
                <p>$${prod.price}</p>
            </div>
            <a href="/product/${prod.id}"><button class="btn">Revisar producto</button></a>
        `
        container.appendChild(card)
    });

    Swal.fire({
        text: `Se ${actionMessage} un producto en tiempo real.`,
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success'
    });
})