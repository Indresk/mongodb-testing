const express = require('express')
const paginationManager = require('../util/paginationManager.js')

module.exports = function ({ productManager,cartManager }) {
    const viewsRouter = express.Router()
    viewsRouter.use(express.json())

    viewsRouter.get("/", async (req, res) => {
        const optionsPag = paginationManager(req);        
        const internalResponse = await productManager.getProducts(false,optionsPag)

        switch(internalResponse.status){
            case 'error':
                return res.redirect(`/404?errorMessage=${internalResponse.payload}`)

            case 'success':
                const {payload,...pagination} = internalResponse;
                const prodsToRender = payload.map((prod)=>{return {...prod, mainThumb:prod.thumbnails[0]}})
                return res.render("home", {
                    products: prodsToRender,
                    pagination: pagination,
                    head: {
                        styles: "/css/styles.css",
                        title: "Vista de productos"
                    }
                })
           
            default:
                return res.redirect(`/404?errorMessage=${internalResponse.payload}`)
        }
    });

    viewsRouter.get("/products", async (req, res) => {
        const optionsPag = paginationManager(req);        
        const internalResponse = await productManager.getProducts(false,optionsPag)

        switch(internalResponse.status){
            case 'error':
                return res.redirect(`/404?errorMessage=${internalResponse.payload}`)

            case 'success':
                const {payload,...pagination} = internalResponse;
                const prodsToRender = payload.map((prod)=>{return {...prod, mainThumb:prod.thumbnails[0]}})
                return res.render("products", {
                    products: prodsToRender,
                    pagination: pagination,
                    head: {
                        styles: "/css/styles.css",
                        title: "Vista de productos"
                    }
                })
           
            default:
                return res.redirect(`/404?errorMessage=${internalResponse.payload}`)
        }
    });

    viewsRouter.get("/carts", async (req, res) => {
        const optionsPag = paginationManager(req);
        const internalResponse = await cartManager.getCarts(false,optionsPag)

        switch(internalResponse.status){
            case 'error':
                return res.redirect(`/404?errorMessage=${internalResponse.payload}`)

            case 'success':
                const {payload,...pagination} = internalResponse;
                const payloadToRender = payload.map((cart)=>{return {...cart, prodsNumber:cart.products.length}})
                return res.render("carts", {
                    payload: payloadToRender,
                    pagination: pagination,
                    head: {
                        styles: "/css/styles.css",
                        title: "Vista de productos",
                    }
                })
           
            default:
                return res.redirect(`/404?errorMessage=${internalResponse.payload}`)
        }
    });

    viewsRouter.get("/carts/:cid", async (req, res) => {
        const internalResponse = await cartManager.getCarts(req.params.cid)

        switch(internalResponse.status){
            case 'error':
                return res.redirect(`/404?errorMessage=${internalResponse.payload}`)
            case 'success':
                const {payload} = internalResponse;
                const prodsToRender = payload.products.map((item)=>{return {...item, product:{...item.product,id:item.product._id.toString(),mainThumb:item.product.thumbnails[0]}}})
                return res.render("detailCarts", {
                    products: prodsToRender,
                    data: {id:payload._id.toString(),prodsNumber:prodsToRender.length},
                    head: {
                        styles: "/css/styles.css",
                        title: "Vista de productos"
                    }
                })
           
            default:
                return res.redirect(`/404?errorMessage=${internalResponse.payload}`)
        }
    });

    viewsRouter.get('/realtimeproducts',async(req,res)=>{
        const optionsPag = paginationManager(req);        
        const internalResponse = await productManager.getProducts(false,optionsPag)

        switch(internalResponse.status){
            case 'error':
                return res.redirect(`/404?errorMessage=${internalResponse.payload}`)

            case 'success':
                const {payload,...pagination} = internalResponse;
                const prodsToRender = payload.map((prod)=>{return {...prod, mainThumb:prod.thumbnails[0]}})
                return res.render("realTimeProducts", {
                    products: prodsToRender,
                    pagination: pagination,
                    head: {
                        styles: "/css/styles.css",
                        title: "Productos en tiempo real"
                    }
                })
           
            default:
                return res.redirect(`/404?errorMessage=${internalResponse.payload}`)
        }
    })


    // manejo de errores

    viewsRouter.get("/404", async (req, res) => {
        const query = req.query.errorMessage
        res.render("404", {
            message: query,
            head: {
                styles: "/css/styles.css",
                title: "404 - Página no encontrada"
            }
        })
    });

    // PRUEBAS

    // prueba de integración de vista para apiTester

    viewsRouter.get("/apitester", async (req, res) => {
        res.render("apiTester", {
            head: {
                styles: "/css/styles.css",
                title: "API REST Tester - Products & Carts"
            }
        })
    });

    // prueba de pagina dedicada con layout especial de producto

    viewsRouter.get("/products/:pid", async (req, res) => {
        const internalResponse = await productManager.getProducts(req.params.pid);
        switch(internalResponse.status){
            case 'error':
                return res.redirect(`/404?errorMessage=${internalResponse.payload}`)

            case 'success':
                const prodToRender = {...internalResponse.payload,id:internalResponse.payload._id.toString(), mainThumb:internalResponse.payload.thumbnails[0]}
                return res.render("detailProds", {
                    product: prodToRender,
                    head: {
                        styles: "/css/styles.css",
                        title: "Detalle del producto"
                    },
                    layout: 'product'
                })
           
            default:
                return res.redirect(`/404?errorMessage=${internalResponse.payload}`)
        }
    });

    return viewsRouter
}