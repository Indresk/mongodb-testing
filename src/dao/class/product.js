const IdModule = require('./idModule')

class Product extends IdModule{
    constructor(id=0,title="titulo",description="desc",code=1,price=1,status=false,stock=1,category="no-cat",thumbnail=[]){
        super();
        this.id = id
        this.title = title
        this.description = description
        this.code = code
        this.price = price
        this.status = status
        this.stock = stock
        this.category = category
        this.thumbnail = thumbnail
    }

    // metodos de actualización progresiva

    addStock(value){
        let valueVerified = parseInt(value)
        if(isNaN(valueVerified)) throw new Error('El valor provisto para esta propiedad debe ser numerico sin decimales.')
        this.stock += valueVerified; 
    }

    removeStock(value){ 
        let valueVerified = parseInt(value)
        if(isNaN(valueVerified)) throw new Error('El valor provisto para esta propiedad debe ser numerico sin decimales.')
        if(this.stock<valueVerified) throw new Error(`No se puede bajar el stock por debajo de 0, el stock actual es ${this.stock}`);
        this.stock -= valueVerified;
    }

    addThumbnail(url){ this.thumbnail.push(url) }

    removeThumbnail(url){
        let urlIndex = this.thumbnail.indexOf(url)
        if(urlIndex === -1) throw new Error("No se encontró el thumbnail en este producto para retirarla.")
        this.thumbnail.splice(urlIndex,1);
    } 

    // metodos de actualización directa

    updateTitle(newTitle){ this.title = newTitle }

    updateDescription(newDesc){ this.description = newDesc }

    updatePrice(newPrice){ 
        let priceVerified = parseInt(newPrice)
        if(isNaN(priceVerified)) throw new Error('El valor provisto para esta propiedad debe ser numerico sin decimales.')
        this.price = priceVerified 
    }

    updateStatus(newStatus){ 
        let statusVerified = false
        if(newStatus.toLowerCase() === "active") statusVerified = true;
        this.status = statusVerified; 
    }

    updateCategory(newCategory){ this.category = newCategory; }
}

module.exports = Product;