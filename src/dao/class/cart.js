const IdModule = require('./idModule')

class Cart extends IdModule{
    constructor(id=0,products=[]){
        super();
        this.id = id
        this.products = products
    }

    addProduct(prod,quantity){
        let finalQuantity = 0
        const productSearch = this.products.find((product)=>product.product === prod.id)
        if(!productSearch){
            this.products.push({product:prod.id,quantity:quantity})
            return quantity
        }
        else{ 
            this.products = this.products.map((p)=>{
                if(p.product===prod.id){finalQuantity = p.quantity+quantity; return {...p,quantity:finalQuantity}}
                return p
            })
        }
        return finalQuantity
    }
}

module.exports = Cart;