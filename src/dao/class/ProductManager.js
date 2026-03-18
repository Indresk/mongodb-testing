const Product = require('./product')
const productsModel = require('../models/productModel.js')

class ProductManager{
    constructor(){
        this.products = []
    }   

    // metodos de manipulación

    async getProducts(id=false,optionsPag){
        if(!id){
            try {
                const filter = optionsPag.filter;
                const options = optionsPag.options;
                let productsFinded = await productsModel.paginate(filter,options);
                if(productsFinded.docs.lenght === 0)throw new Error("No hay ningún producto actualmente creado.")
                console.log(`\nProductos entregados correctamente`)
                return {status: "success", message: `Productos actualmente almacenados entregados satisfactoriamente`,content:productsFinded}
            } catch (error) {
                console.log(`\nError buscando los productos: ${error.message}`)
                return {status: "failed", message:`Error buscando los productos: ${error.message}`}
            }
            
        }
        else{
            try{
                let productFinded = await productsModel.findById(id).lean()
                if(!productFinded) throw new Error(`No se encontró el producto con la ID: ${id}`)
                console.log(`\nEl producto solicitado con la ID: ${id} fue encontrado`)
                return {status: "success", message: `Producto con el ID: ${id} encontrado satisfactoriamente`,content:productFinded}
            }
            catch(error){
                let errorMessage = ''
                error.message.startsWith("Cast to ObjectId failed for value")?errorMessage="ID inválido":errorMessage=error.message;
                console.log(`\nError buscando el producto: ${errorMessage}`)
                return {status: "failed", message:`Error buscando el producto: ${errorMessage}`}
            }
        }
    }

    async createProduct(body){
        console.log(`\nProceso de creación de producto iniciado...`)
        try {

            console.log(body)
            const newProduct = await productsModel.create({...body})
            this.products.push(newProduct)
            console.log(`\nID: ${newProduct._id} asignado al nuevo producto ${newProduct.title}.`)
            return {status: "success",message: `Producto creado satisfactoriamente con el ID: ${newProduct.id}`,content:newProduct._id}
        } catch (error) {
            console.log(`No se pudo crear el producto solicitado: ${error.message}`)
            return {status: "failed", message:`No se pudo crear el producto solicitado: ${error.message}`}
        }
    }

    async updateProduct(id,request,data){
        const idFixed = parseInt(id)
        console.log(`\nProceso de actualización iniciado para el id: ${idFixed}...`)
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
            // await this.#DBManager.updateFile(JSON.stringify(this.products));
            console.log(`\nEl ${request} update fue aplicado correctamente al producto con la ID: ${idFixed}`)
            return {status: "success",message: `El ${request} update fue aplicado correctamente al producto con la ID: ${idFixed}`,content:idFixed}
        } catch (error) {
            console.log(`Error actualizando el producto: ${error.message}`)
            return {status: "failed", message:`Error actualizando el producto: ${error.message}`}
        }
    }

    async deleteProduct(id){
        console.log(`\nProceso de eliminación iniciado para el id: ${id}...`)
        try {
            if(!id)throw new Error(`No se puede eliminar sin una ID apropiada válida.`);

            const existIntenal = await this.getProducts(id);
            if(existIntenal.status != 'success') throw new Error(`No existe el producto con el ID: ${id}.`)
            
            let deleteResponse = await productsModel.deleteOne({_id: id})
            if(deleteResponse.deletedCount === 0) throw new Error(`El producto existe pero fallo la eliminación de la ID: ${id}.`)

            console.log(`\nProducto eliminado exitosamente: ${id}`)
            return {status: "success",message: `Producto eliminado exitosamente: ${id}`}
        } catch (error) {
            console.log("No se pudo eliminar el producto: ",error.message)
            return {status: "failed", message:`No se pudo eliminar el producto: ${error.message}`}
        }
    }     
}

module.exports = ProductManager;