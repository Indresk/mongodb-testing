const Product = require('./product')
const DBManager = require('./DBManager')

class ProductManager{
    #DBManager
    #prodInit
    constructor(pointingDB){
        this.products = []
        this.#DBManager = new DBManager(pointingDB);
        this.#prodInit = false
    }   

    // metodos de manipulación

    async getProducts(id=false){
        const idFixed = parseInt(id)
        if(!this.#prodInit){await this.#initProducts();this.#prodInit=true}
        if(!idFixed){
            try {
                if(this.products.length === 0)throw new Error("No hay ningún producto actualmente creado.")
                console.log(`\nProductos entregados correctamente`)
                return {status: "success", message: `Productos actualmente almacenados entregados satisfactoriamente`,content:this.products}
            } catch (error) {
                console.log(`\nError buscando los productos: ${error.message}`)
                return {status: "failed", message:`Error buscando los productos: ${error.message}`}
            }
            
        }
        else{
            try{
                let productFinded = this.products.find((prod)=>prod.id === idFixed)
                if(!productFinded) throw new Error(`No se encontró el producto con la ID: ${idFixed}`)
                console.log(`\nEl producto solicitado con la ID: ${idFixed} fue encontrado`)
                return {status: "success", message: `Producto con el ID: ${idFixed} encontrado satisfactoriamente`,content:productFinded}
            }
            catch(error){
                console.log(`\nError buscando el producto: ${error.message}`)
                return {status: "failed", message:`Error buscando el producto: ${error.message}`}
            }
        }
    }

    async createProduct(title,description,code,price,status,stock,category,thumbnail){
        console.log(`\nProceso de creación de producto iniciado...`)
        if(!this.#prodInit){await this.#initProducts();this.#prodInit=true}
        try {
            const newProduct = new Product(0,title,description,code,price,status,stock,category,thumbnail)
            await newProduct.setID(this.products);
            this.products.push(newProduct)
            await this.#DBManager.updateFile(JSON.stringify(this.products))
            console.log(`\nID: ${newProduct.id} asignado al nuevo producto ${newProduct.title}.`)
            this.#consoleDisplayProducts()
            return {status: "success",message: `Producto creado satisfactoriamente con el ID: ${newProduct.id}`,content:newProduct.id}
        } catch (error) {
            console.log(`No se pudo crear el producto solicitado: ${error.message}`)
            return {status: "failed", message:`No se pudo crear el producto solicitado: ${error.message}`}
        }
    }

    async updateProduct(id,request,data){
        const idFixed = parseInt(id)
        console.log(`\nProceso de actualización iniciado para el id: ${idFixed}...`)
        if(!this.#prodInit){await this.#initProducts();this.#prodInit=true}
        try {
            let productFinded = this.products.find((prod)=>prod.id === idFixed)
            if(!productFinded) throw new Error(`No se encontró el producto con la ID: ${idFixed}`)
            switch(request){
                case "title": productFinded.updateTitle(data); break;
                case "description": productFinded.updateDescription(data); break;
                case "price": productFinded.updatePrice(data); break;
                case "status": productFinded.updateStatus(data); break;
                case "category": productFinded.updateCategory(data); break;

                case "addStock": productFinded.addStock(data); break;
                case "removeStock": productFinded.removeStock(data); break;
                case "addThumb": productFinded.addThumbnail(data); break;
                case "removeThumb": productFinded.removeThumbnail(data); break;
                default: throw new Error("Request solicitado no reconocido");
            }
            await this.#DBManager.updateFile(JSON.stringify(this.products));
            console.log(`\nEl ${request} update fue aplicado correctamente al producto con la ID: ${idFixed}`)
            this.#consoleDisplayProducts()
            return {status: "success",message: `El ${request} update fue aplicado correctamente al producto con la ID: ${idFixed}`,content:idFixed}
        } catch (error) {
            console.log(`Error actualizando el producto: ${error.message}`)
            return {status: "failed", message:`Error actualizando el producto: ${error.message}`}
        }
    }

    async deleteProduct(id){
        const idFixed = parseInt(id)
        console.log(`\nProceso de eliminación iniciado para el id: ${idFixed}...`)
        if(!this.#prodInit){await this.#initProducts();this.#prodInit=true}
        try {
            if(!this.products.some(product => product.id === idFixed)) throw new Error(`No existe el producto con el ID: ${idFixed}.`)
            const productsFiltered = this.products.filter((product)=> product.id !== idFixed)
            await this.#DBManager.updateFile(JSON.stringify(productsFiltered))
            this.products = productsFiltered
            console.log(`\nProducto eliminado exitosamente: ${idFixed}`)
            this.#consoleDisplayProducts()
            return {status: "success",message: `Producto eliminado exitosamente: ${idFixed}`}
        } catch (error) {
            console.log("No se pudo eliminar el producto: ",error.message)
            return {status: "failed", message:`No se pudo eliminar el producto: ${error.message}`}
        }
    }

    
    // metodos de inicialización
    async #initProducts(){
        try {
            console.log('Inicializando productos...')
            const temporalProds = await this.#DBManager.readFile()
            if(temporalProds.length !== 0){
            this.products = temporalProds.map(prod => new Product(prod.id,prod.title,prod.description,prod.code,prod.price,prod.status,prod.stock,prod.category,prod.thumbnail));
            console.log(`Productos del archivo almacenados en memoria exitosamente: \n`)
            this.#consoleDisplayProducts()}
            else{console.log(`El archivo no tiene actualmente ningún producto.`)}
        } catch (error) {
            console.log('No se pudieron obtener los productos guardados: ',error.message)
        }
    }

    //metodos auxiliares

    #consoleDisplayProducts(){
        this.products.map((product,index)=>console.log(`Index: ${index} | Product: ${JSON.stringify(product)}`))
    }
     
}

module.exports = ProductManager;