const updateCart = require('./cartUpdateValidation.js')
const cartsModel = require('../models/cartModel.js')

class CartManager {
    constructor(ProdsManager){
        this.carts = []
        this.ProdsManager = ProdsManager
    }

    async getCarts(id=false,optionsPag){
        let cartFinded = {}
        try{
            if(!id){
                const filter = optionsPag.filter;
                const options = optionsPag.options;
                cartFinded = await cartsModel.paginate(filter,options);
                if(cartFinded.docs.lenght === 0)throw new Error("No hay ningún cart actualmente creado.")
            }
            else{
                cartFinded = await cartsModel.findById(id).lean()
                if(!cartFinded) throw new Error(`No se encontró el carrito con la ID: ${id}`)
                console.log(`\nCarrito encontrado`)
                return {status: "success", payload:cartFinded}
            }
            console.log(`\nCarritos encontrados`)
            let {docs,totalDocs,limit,pagingCounter,...paginationData} = cartFinded;
            if(!id){
                paginationData.prevLink = paginationData.prevPage?`page=${paginationData.prevPage}`:null;
                paginationData.nextLink = paginationData.nextPage?`page=${paginationData.nextPage}`:null;
            }
            return {status: "success", payload:docs,...paginationData}
        }
        catch(error){
            let errorMessage = ''
            error.message.startsWith("Cast to ObjectId failed for value")?errorMessage="ID inválido":errorMessage=error.message;
            return {status: "error", payload:`Error buscando el carrito: ${errorMessage}`}
        }
    }

    // cart general operations

    async updateCartProds(cid,newProds){
        console.log(`\nProceso de actualización de todos los productos iniciado...`)
        try {
            const currentInternalProds = await this.ProdsManager.getProducts(false,{internalRequest:true})
            if(currentInternalProds.status != 'success') throw new Error(`Error en la revisión interna de productos`)

            const existIntenalcart = await this.getCarts(cid);
            if(existIntenalcart.status != 'success') throw new Error(`No existe el carrito con el ID: ${cid}.`)
            
            const resolvedCart = await updateCart('updateAllProds',cartsModel,{cid,newProds:newProds,prodsInDB:currentInternalProds.payload,currentCart:existIntenalcart.payload});
            return {status: "success",message: `Los nuevos productos han sido añadidos al carrito con el ID: ${cid}.`,content:resolvedCart}
        } catch (error) {
            return {status: "error", message:`No se pudieron actualizar los productos del cart solicitado: ${error.message}`}
        }
    }

    async deleteCartProds(cid){
        console.log(`\nProceso de eliminación de todos los productos iniciado...`)
        try {
            const existIntenalcart = await this.getCarts(cid);
            if(existIntenalcart.status != 'success') throw new Error(`No existe el carrito con el ID: ${cid}.`)
            
            const resolvedCart = await updateCart('deleteAllProds',cartsModel,{cid});
            return {status: "success",message: `Los productos han sido eliminados del carrito con el ID: ${cid}.`,content:resolvedCart}
        } catch (error) {
            return {status: "error", message:`No se pudieron eliminar los productos del cart solicitado: ${error.message}`}
        }
    }

    async createCart(){
        console.log(`\nProceso de creación de cart iniciado...`)
        try {
            const newCart = await cartsModel.create({})
            console.log(`\nID: ${newCart.id} asignado al nuevo carrito.`)
            return {status: "success",message: `Cart creado satisfactoriamente con el ID: ${newCart.id}`,content:newCart.id}
        } catch (error) {
            console.log(`No se pudo crear el cart solicitado: ${error.message}`)
            return {status: "error", message:`No se pudo crear el cart solicitado: ${error.message}`}
        }
    }

    // prods over card operations

    async addProdToCart(cid,pid,quantity){
        console.log(`\nProceso de añadir producto a cart iniciado...`)
        try {
            const quantityFixed = Number(quantity)
            
            if(isNaN(quantityFixed)) throw new Error(`La cantidad brindada: ${quantity} no es valida.`)
            if(quantityFixed<0) throw new Error(`La cantidad brindada: ${quantityFixed} no es valida.`)
            const existIntenalcart = await this.getCarts(cid);
            if(existIntenalcart.status != 'success') throw new Error(`No existe el carrito con el ID: ${cid}.`)

            const existIntenalprod = await this.ProdsManager.getProducts(pid)
            if(existIntenalprod.status != 'success') throw new Error(`No se encontró el producto con la ID: ${pid}`)
            
            const resolvedCart = await updateCart('addProd',cartsModel,{cid,pid,quantityFixed,currentCart:existIntenalcart.payload,stock:existIntenalprod.payload.stock})

            return {status: "success",message: `El producto con el ID: ${pid} ha sido añadido al carrito ${cid}`,content:JSON.stringify(resolvedCart)}
        } catch (error) {
            return {status: "error", message:`No se pudo añadir el producto al cart solicitado: ${error.message}`}
        }
    }

    async updateProdInCart(cid,pid,quantity,subtract = false){
        console.log(`\nProceso de actualizar cantidad de producto en cart iniciado...`)
        try {
            const quantityFixed = Number(quantity)
            
            if(isNaN(quantityFixed)) throw new Error(`La cantidad brindada: ${quantity} no es valida.`)
            if(quantityFixed<0) throw new Error(`La cantidad brindada: ${quantityFixed} no es valida.`)
            const existIntenalcart = await this.getCarts(cid);
            if(existIntenalcart.status != 'success') throw new Error(`No existe el carrito con el ID: ${cid}.`)

            const existIntenalprod = await this.ProdsManager.getProducts(pid)
            if(existIntenalprod.status != 'success') throw new Error(`No se encontró el producto con la ID: ${pid}`)
            
            const resolvedCart = await updateCart('updateProd',cartsModel,{cid,pid,quantityFixed,currentCart:existIntenalcart.payload,subtract,stock:existIntenalprod.payload.stock})
            const finalQuantity = resolvedCart.products.find(p => p.product._id.toString() === pid).quantity

            return {status: "success",message: `${quantityFixed} unidades se han ${subtract?'retirado':'añadido'} del producto con el ID: ${pid} exitosamente en el carrito con el ID: ${cid}. | Unidades totales: ${finalQuantity}.`,content:resolvedCart}
        } catch (error) {
            return {status: "error", message:`No se pudo actualizar el producto en el cart solicitado: ${error.message}`}
        }
    }

    async deleteProdInCart(cid,pid){
        console.log(`\nProceso de eliminar producto en cart iniciado...`)
        try {
            const existIntenalcart = await this.getCarts(cid);
            if(existIntenalcart.status != 'success') throw new Error(`No existe el carrito con el ID: ${cid}.`)
            
            const resolvedCart = await updateCart('deleteProd',cartsModel,{cid,pid,currentCart:existIntenalcart.payload})

            return {status: "success",message: `El producto con el ID: ${pid} se ha eliminado exitosamente en el carrito con el ID: ${cid}.`,content:resolvedCart}
        } catch (error) {
            return {status: "error", message:`No se pudo elminar el producto en el cart solicitado: ${error.message}`}
        }
    }
}

module.exports = CartManager;