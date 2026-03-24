async function updateCart(request,model,options){
    const { cid, pid, quantityFixed, currentCart, newProds, prodsInDB, subtract, stock} = options;
    let stockBuffer = 0;

    try{
        switch(request){
            case "addProd": return await addProduct();
            case "updateAllProds": return await updateAllProds();
            case "deleteAllProds": return await deleteAllProds();
            case "updateProd": return await updateProd();
            case "deleteProd": return await deleteProd();
            default: throw new Error("Request solicitado no reconocido");
        }
    }
    catch(error){
        throw new Error(error.message)
    }

    async function addProduct(){
        let products = currentCart.products;
        const productSearch = products.find(p => p.product._id.toString() === pid);        

        if (!productSearch) {
            products.push({ product: pid, quantity: quantityFixed });
            stockBuffer = quantityFixed;
        } else {
            productSearch.quantity += quantityFixed;
            stockBuffer = productSearch.quantity + quantityFixed
        }
        if (stockBuffer > stock)throw new Error(`No se puede añadir mayor cantidad que el stock actual del producto: ${stock}`)
        if (stockBuffer < 0)throw new Error(`No se pueden retirar unidades del producto por encima del stock actual: ${stock}`)

        return await model.findByIdAndUpdate(cid, currentCart,{returnDocument:'after',lean:true});
    }

    async function updateAllProds(){
        if(!verifyNewProdsStructure(newProds))throw new Error('Array de productos inválido, debe contener objeto y cada objeto las propiedades product y quantity')
        if(!verifyProdsExist(newProds,prodsInDB))throw new Error('Alguno de los productos que estas intentando agregar al carrito no existe en la DB.')
        let products = currentCart.products;
        products.splice(0,products.length)
        newProds.forEach(prod => {products.push(prod)});
        return await model.findByIdAndUpdate(cid,currentCart,{returnDocument:'after',lean:true});
    }
    async function deleteAllProds(){
        return await model.findByIdAndUpdate(cid,{ $set: { products: [] } },{returnDocument:'after',lean:true});
    }

    async function updateProd(){
        let products = currentCart.products;
        const productSearch = products.find(p => p.product._id.toString() === pid);        
        if (!productSearch)throw new Error('El producto indicado no existe en este carrito.')
        if(subtract){
            stockBuffer = productSearch.quantity - quantityFixed
            productSearch.quantity -= quantityFixed
        }
        else{
            stockBuffer = productSearch.quantity + quantityFixed
            productSearch.quantity += quantityFixed
        }
        if (stockBuffer > stock)throw new Error(`No se puede añadir mayor cantidad que el stock actual del producto: ${stock}`)
        if (stockBuffer < 0)throw new Error(`No se pueden retirar unidades del producto por encima del stock actual: ${stock}`)

        return await model.findByIdAndUpdate(cid, currentCart,{returnDocument:'after',lean:true});
    }

    async function deleteProd(){
        let products = currentCart.products;
        const indexOfwantedProd = products.findIndex(p => p.product._id.toString() === pid);
        if (indexOfwantedProd === -1)throw new Error('El producto indicado no existe en este carrito.')
        products.splice(indexOfwantedProd,1)
        return await model.findByIdAndUpdate(cid, currentCart,{returnDocument:'after',lean:true});
    }

    // Funciones de verificación

    function verifyProdsExist(prodsFromAPI, prodsInDB) {
        const ids1 = prodsFromAPI.map(p=>p.product);
        const ids2Set = new Set(prodsInDB);
        return ids1.every(id=>ids2Set.has(id));
    }

    function verifyStructure(obj) {
        const EXPECTED_KEYS = ["product", "quantity"];

        if (typeof obj !== "object" || obj === null || Array.isArray(obj))return false

        const keys = Object.keys(obj).sort();
        return keys.length === EXPECTED_KEYS.length && keys.every((key, i) => key === EXPECTED_KEYS[i]);
    }

    function verifyNewProdsStructure(arr) {
        return Array.isArray(arr) && arr.every(verifyStructure);
    }  
}

module.exports = updateCart;