    
    async function updateProd(request,model,options){
        const id = options.id;
        const newData = options.data;
        const prevProd = options.prevProduct
        try{
            switch(request){
                case "title": await updateTitle(); break;
                case "description": await updateDescription(); break;
                case "price": await updatePrice(); break;
                case "status": await updateStatus(); break;
                case "category": await updateCategory(); break;

                case "addStock": await addStock(); break;
                case "removeStock": await removeStock(); break;
                case "addThumb": await addThumbnail(); break;
                case "removeThumb": await removeThumbnail(); break;
                default: throw new Error("Request solicitado no reconocido");
            }
        }
        catch(error){
            throw new Error(error.message)
        }


    
        // metodos de actualización progresiva

        async function addStock(){
            let valueVerified = parseInt(newData)
            if(isNaN(valueVerified)) throw new Error('El valor provisto para esta propiedad debe ser numerico sin decimales.')
            const newStock = prevProd.stock + valueVerified;
            await model.findByIdAndUpdate(id,{ $set:{stock:newStock}});
        }

        async function removeStock(){ 
            let valueVerified = parseInt(newData)
            if(isNaN(valueVerified)) throw new Error('El valor provisto para esta propiedad debe ser numerico sin decimales.')
            if(prevProd.stock<valueVerified) throw new Error(`No se puede bajar el stock por debajo de 0, el stock actual es ${prevProd.stock}`);
            const newStock = prevProd.stock - valueVerified;
            await model.findByIdAndUpdate(id,{ $set:{stock:newStock}});
        }

        async function addThumbnail(){
            const newThumbnails = [...prevProd.thumbnails]
            newThumbnails.push(newData)
            await model.findByIdAndUpdate(id,{ $set:{thumbnails:newThumbnails}});
        }

        async function removeThumbnail(){
            const newThumbnails = [...prevProd.thumbnails]
            let urlIndex = newThumbnails.indexOf(newData)
            if(urlIndex === -1) throw new Error("No se encontró el thumbnail en este producto para retirarla.")
            newThumbnails.splice(urlIndex,1);
            await model.findByIdAndUpdate(id,{ $set:{thumbnails:newThumbnails}});
        } 

        // metodos de actualización directa

        async function updateTitle(){
            await model.findByIdAndUpdate(id,{ $set:{title:newData}});
        }

        async function updateDescription(){
            await model.findByIdAndUpdate(id,{ $set:{description:newData}});
        }

        async function updatePrice(){ 
            let priceVerified = parseInt(newData)
            if(isNaN(priceVerified)) throw new Error('El valor provisto para esta propiedad debe ser numerico sin decimales.')
            if(priceVerified<=0) throw new Error('El valor provisto para esta propiedad no puede ser menor o igual a 0.')
            await model.findByIdAndUpdate(id,{ $set:{price:priceVerified}});
        }

        async function updateStatus(){ 
            let statusVerified = false
            if(newData.toLowerCase() === "active") statusVerified = true;
            await model.findByIdAndUpdate(id,{ $set:{status:statusVerified}});
        }

        async function updateCategory(){
            await model.findByIdAndUpdate(id,{ $set:{category:newData}});
        }
        
    }


module.exports = updateProd;