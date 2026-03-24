const express = require('express')
const paginationManager = require('../util/paginationManager.js')

    // cart

module.exports = function ({ cartManager }) {
    const apiCartRouter = express.Router()
    apiCartRouter.use(express.json())


    apiCartRouter.get("/",async (req,res)=>{
        const optionsPag = paginationManager(req);
        
        const internalResponse = await cartManager.getCarts(false,optionsPag)
        const responseStatus = internalResponse.status === "success"?200:404  
        res.status(responseStatus).send(JSON.stringify(internalResponse))
    })
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

    apiCartRouter.put("/:cid",async (req,res)=>{
        const internalResponse = await cartManager.updateCartProds(req.params.cid,req.body.products)
        const responseStatus = internalResponse.status === "success"?201:404
        res.status(responseStatus).send(JSON.stringify(internalResponse))
    })

    apiCartRouter.delete("/:cid",async (req,res)=>{
        const internalResponse = await cartManager.deleteCartProds(req.params.cid)
        const responseStatus = internalResponse.status === "success"?201:404
        res.status(responseStatus).send(JSON.stringify(internalResponse))
    })


    apiCartRouter.post("/:cid/product/:pid",async (req,res)=>{
        const internalResponse = await cartManager.addProdToCart(req.params.cid,req.params.pid,req.body.quantity)
        const responseStatus = internalResponse.status === "success"?201:404
        res.status(responseStatus).send(JSON.stringify(internalResponse))
    })

    apiCartRouter.put("/:cid/product/:pid",async (req,res)=>{
        const internalResponse = await cartManager.updateProdInCart(req.params.cid,req.params.pid,req.body.quantity,req.body.subtract)
        const responseStatus = internalResponse.status === "success"?201:404
        res.status(responseStatus).send(JSON.stringify(internalResponse))
    })

    apiCartRouter.delete("/:cid/product/:pid",async (req,res)=>{
        const internalResponse = await cartManager.deleteProdInCart(req.params.cid,req.params.pid)
        const responseStatus = internalResponse.status === "success"?201:404
        res.status(responseStatus).send(JSON.stringify(internalResponse))
    })

    return apiCartRouter
}