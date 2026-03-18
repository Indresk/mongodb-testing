const express = require('express')
    // cart

module.exports = function ({ cartManager }) {
    const apiCartRouter = express.Router()
    apiCartRouter.use(express.json())


    apiCartRouter.get("/:cid",async (req,res)=>{
        const internalResponse = await cartManager.getCarts(req.params.cid)
        const responseStatus = internalResponse.status === "success"?200:404    
        res.status(responseStatus).send(JSON.stringify(internalResponse))
    })

    apiCartRouter.post("/",async (req,res)=>{
        const internalResponse = await cartManager.createCart()
        const responseStatus = internalResponse.status === "success"?201:404    
        res.status(responseStatus).send(JSON.stringify(internalResponse))
    })
    apiCartRouter.post("/:cid/product/:pid",async (req,res)=>{
        const internalResponse = await cartManager.addProdToCart(req.params.cid,req.params.pid,req.body.quantity)
        const responseStatus = internalResponse.status === "success"?201:404
        res.status(responseStatus).send(JSON.stringify(internalResponse))
    })

    return apiCartRouter
}