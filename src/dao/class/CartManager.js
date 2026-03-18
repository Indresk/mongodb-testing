const Cart = require('./cart')

class CartManager {
    constructor(ProdsManager){
        this.carts = []
        this.ProdsManager = ProdsManager
    }

    async getCarts(id=false){
        const idFixed = parseInt(id)
        if(!idFixed){
            try {
                if(this.carts.length === 0)throw new Error("No hay ningún cart actualmente creado.")
                console.log(`\nEstos son los carritos actualmente almacenados`)
                return {status: "success", message: `Carritos actualmente almacenados entregados satisfactoriamente`,content:this.carts}
            } catch (error) {
                console.log(`\nError buscando los carritos: ${error.message}`)
                return {status: "failed", message:`Error buscando los carritos: ${error.message}`}
            }
            
        }
        else{
            try{
                let CartFinded = this.carts.find((cart)=>cart.id === idFixed)
                if(!CartFinded) throw new Error(`No se encontró el carrito con la ID: ${idFixed}`)
                console.log(`\nEl carrito solicitado con la ID: ${idFixed} fue encontrado`)
                return {status: "success", message: `Carrito con el ID: ${idFixed} encontrado satisfactoriamente`,content:CartFinded}
            }
            catch(error){
                console.log(`\nError buscando el carrito: ${error.message}`)
                return {status: "failed", message:`Error buscando el carrito: ${error.message}`}
            }
        }
    }

    async addProdToCart(cid,pid,quantity){
        const cidFixed = parseInt(cid)
        const pidFixed = parseInt(pid)
        const quantityFixed = parseInt(quantity)
        console.log(`\nProceso de añadir producto a cart iniciado...`)
        try {
            if(isNaN(quantityFixed)) throw new Error(`La cantidad brindada: ${quantity} no es valida.`)
            let cartFinded = this.carts.find((cart)=>cart.id === cidFixed)
            if(!cartFinded) throw new Error(`No se encontró el cart con la ID: ${cidFixed}`)
            let prodFinded = await this.ProdsManager.getProducts(pidFixed)
            if(prodFinded.status === 'failed') throw new Error(`No se encontró el producto con la ID: ${pidFixed}`)
            const finalQuantity = cartFinded.addProduct(prodFinded.content,quantityFixed)
            // await this.#DBManager.updateFile(JSON.stringify(this.carts))
            console.log(`\n${quantity} unidades del producto con el ID: ${pidFixed} han sido añadidas exitosamente al carrito con el ID: ${cidFixed}. | Unidades totales: ${finalQuantity}.`)
            return {status: "success",message: `${quantity} unidades del producto con el ID: ${pidFixed} han sido añadidas exitosamente al carrito con el ID: ${cidFixed}. | Unidades totales: ${finalQuantity}.`,content:cartFinded}
        } catch (error) {
            console.log(`No se pudo añadir el producto al cart solicitado: ${error.message}`)
            return {status: "failed", message:`No se pudo añadir el producto al cart solicitado: ${error.message}`}
        }
    }

    async createCart(){
        console.log(`\nProceso de creación de cart iniciado...`)
        try {
            const newCart = new Cart()
            await newCart.setID(this.carts);
            this.carts.push(newCart)
            // await this.#DBManager.updateFile(JSON.stringify(this.carts))
            console.log(`\nID: ${newCart.id} asignado al nuevo carrito.`)
            return {status: "success",message: `Cart creado satisfactoriamente con el ID: ${newCart.id}`,content:newCart.id}
        } catch (error) {
            console.log(`No se pudo crear el cart solicitado: ${error.message}`)
            return {status: "failed", message:`No se pudo crear el cart solicitado: ${error.message}`}
        }
    }
}

module.exports = CartManager;