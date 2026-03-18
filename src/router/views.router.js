const express = require('express')

module.exports = function ({ productManager }) {
    const viewsRouter = express.Router()
    viewsRouter.use(express.json())

    viewsRouter.get("/", async (req, res) => {
        const internalResponse = await productManager.getProducts();
        switch(internalResponse.status){
            case 'failed':
                return res.redirect(`/404?errorMessage=${internalResponse.message}`)

            case 'success':
                const prodsToRender = internalResponse.content.map((prod)=>{return {...prod, mainThumb:prod.thumbnail[0]}})
                return res.render("home", {
                    products: prodsToRender,
                    head: {
                        styles: "/css/styles.css",
                        title: "Vista de productos"
                    }
                })
           
            default:
                return res.redirect(`/404?errorMessage=${internalResponse.message}`)
        }
    });

    viewsRouter.get('/realtimeproducts',async(req,res)=>{
        const internalResponse = await productManager.getProducts();
        switch(internalResponse.status){
            case 'failed':
                return res.redirect(`/404?errorMessage=${internalResponse.message}`)

            case 'success':
                const prodsToRender = internalResponse.content.map((prod)=>{return {...prod, mainThumb:prod.thumbnail[0]}})
                return res.render("realTimeProducts", {
                    products: prodsToRender,
                    head: {
                        styles: "/css/styles.css",
                        title: "Productos en tiempo real"
                    }
                })
           
            default:
                return res.redirect(`/404?errorMessage=${internalResponse.message}`)
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

    viewsRouter.get("/product/:pid", async (req, res) => {
        const internalResponse = await productManager.getProducts(req.params.pid);
        switch(internalResponse.status){
            case 'failed':
                return res.redirect(`/404?errorMessage=${internalResponse.message}`)

            case 'success':
                const prodToRender = {...internalResponse.content , mainThumb:internalResponse.content.thumbnail[0]}
                return res.render("detailProds", {
                    product: prodToRender,
                    head: {
                        styles: "/css/styles.css",
                        title: "Detalle del producto"
                    },
                    layout: 'product'
                })
           
            default:
                return res.redirect(`/404?errorMessage=${internalResponse.message}`)
        }
    });

    return viewsRouter
}