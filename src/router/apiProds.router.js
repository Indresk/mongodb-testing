const express = require('express')
const runSocketFlow = require('../util/socketManager.js')
const paginationManager = require('../util/paginationManager.js')

// products

module.exports = function ({ productManager,socketServer}) {
    const apiProdsRouter = express.Router()
    apiProdsRouter.use(express.json())


    apiProdsRouter.get("/",async (req,res)=>{
        const optionsPag = paginationManager(req);

        const internalResponse = await productManager.getProducts(false,optionsPag)
        const responseStatus = internalResponse.status === "success"?200:404  
        res.status(responseStatus).send(JSON.stringify(internalResponse))
    })
    apiProdsRouter.get("/:pid",async (req,res)=>{
        const internalResponse = await productManager.getProducts(req.params.pid)
        const responseStatus = internalResponse.status === "success"?200:404  
        res.status(responseStatus).send(JSON.stringify(internalResponse))
    })

    apiProdsRouter.post("/",async (req,res)=>{
        const body = req.body
        const internalResponse = await productManager.createProduct(body)
        const responseStatus = internalResponse.status === "success"?201:404

        // implementación de actualización por webSocket en http - POST
        if(internalResponse.status === "success")await runSocketFlow('create',socketServer)

        res.status(responseStatus).send(JSON.stringify(internalResponse))
    })

    apiProdsRouter.put("/:pid",async (req,res)=>{
        const body = req.body
        const internalResponse = await productManager.updateProduct(req.params.pid,body.action,body.value)
        const responseStatus = internalResponse.status === "success"?200:404

        // implementación de actualización por webSocket en http - PUT
        if(internalResponse.status === "success")await runSocketFlow('modify',socketServer)

        res.status(responseStatus).send(JSON.stringify(internalResponse))
    })

    apiProdsRouter.delete("/:pid",async (req,res)=>{
        const internalResponse = await productManager.deleteProduct(req.params.pid)
        const responseStatus = internalResponse.status === "success"?200:404

        // implementación de actualización por webSocket en http - PUT
        if(internalResponse.status === "success")await runSocketFlow('delete',socketServer)

        res.status(responseStatus).send(JSON.stringify(internalResponse))
    })

    return apiProdsRouter
}