const updateProd = require('./productUpdateValidation.js')
const productsModel = require('../models/productModel.js')

class ProductManager{
    constructor(){
    }   

    // metodos de manipulación

    async getProducts(id=false,optionsPag){
        let productFinded = {}
        const internal = optionsPag?.internalRequest || false;
        try{
            if(!id){
                if(internal){
                    productFinded.docs = (await productsModel.find({},{_id:1}).lean()).map(p=>p._id.toString());
                }
                else{
                    const filter = optionsPag?.filter;
                    const options = optionsPag?.options;
                    productFinded = await productsModel.paginate(filter,options);
                    if(productFinded.docs.lenght === 0)throw new Error("No hay ningún producto actualmente creado.")
                }
                
            }
            else{
                productFinded = await productsModel.findById(id).lean()
                if(!productFinded) throw new Error(`No se encontró el producto con la ID: ${id}`)
                console.log(`\nProducto encontrado`)
                return {status: "success", payload:productFinded}
            }
            console.log(`\nProductos encontrados`)
            let {docs,totalDocs,limit,pagingCounter,...paginationData} = productFinded;
            if(!id){
                paginationData.prevLink = paginationData.prevPage?`page=${paginationData.prevPage}`:null;
                paginationData.nextLink = paginationData.nextPage?`page=${paginationData.nextPage}`:null;
            }
            return {status: "success", payload:docs,...paginationData}
        }
        catch(error){
            let errorMessage = ''
            error.message.startsWith("Cast to ObjectId failed for value")?errorMessage="ID inválido":errorMessage=error.message;
            return {status: "error", payload:`Error buscando el producto: ${errorMessage}`}
        }
    }

    async createProduct(body){
        console.log(`\nProceso de creación de producto iniciado...`)
        try {
            console.log(body)
            const newProduct = await productsModel.create({...body})
            console.log(`\nID: ${newProduct._id} asignado al nuevo producto ${newProduct.title}.`)
            return {status: "success",message: `Producto creado satisfactoriamente con el ID: ${newProduct.id}`,content:newProduct._id}
        } catch (error) {
            console.log(`No se pudo crear el producto solicitado: ${error.message}`)
            return {status: "error", message:`No se pudo crear el producto solicitado: ${error.message}`}
        }
    }

    async updateProduct(id,request,data){
        console.log(`\nProceso de actualización iniciado para el id: ${id}...`)
        try {
            const existIntenal = await this.getProducts(id);
            if(existIntenal.status != 'success') throw new Error(`No se encontró el producto con la ID: ${id}`)
            await updateProd(request,productsModel,{id,data,prevProduct:existIntenal.payload})
            console.log(`\nEl ${request} update fue aplicado correctamente al producto con la ID: ${id}`)
            return {status: "success",message: `El ${request} update fue aplicado correctamente al producto con la ID: ${id}`,content:id}
        } catch (error) {
            console.log(`Error actualizando el producto: ${error.message}`)
            return {status: "error", message:`Error actualizando el producto: ${error.message}`}
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
            return {status: "error", message:`No se pudo eliminar el producto: ${error.message}`}
        }
    }     
}

module.exports = ProductManager;