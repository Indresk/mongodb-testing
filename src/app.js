const express = require('express');
const open = require('open');
const path = require('path');
const handlebars = require('express-handlebars')
const socketIO = require('socket.io')
const mongoose = require('mongoose')
require('dotenv').config();

const apiCartRouter = require('./router/apiCarts.router.js')
const apiProdsRouter = require('./router/apiProds.router.js')
const viewsRouter = require('./router/views.router.js')

const ProductManager = require('./dao/class/ProductManager.js')
const CartManager = require('./dao/class/CartManager.js');

const puerto = 8080;
const MONGOKEY = process.env.MONGOKEY

const productManager = new ProductManager()
const cartManager = new CartManager(productManager)

const app = express()

// escuchar puerto y seteo de socket

const httpServer = app.listen(puerto,()=>{
    console.log(`Servidor levantado en el puerto ${puerto}`)
    mongoose.connect(MONGOKEY).then((e)=>console.log("Conexión establecida con estado: ",e.connections[0]._readyState));
    // open.openApp(`http://localhost:${puerto}`) 
})

const socketServer = new socketIO.Server(httpServer);

// seteo de handlebars

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.set("partials", __dirname + "/views/partials");

// seteo de directorio estatico

app.use(express.static(__dirname + "/public"));

// seteo de rutas

app.use("/", viewsRouter({productManager}));
app.use('/api/carts',apiCartRouter({cartManager}))
app.use('/api/products',apiProdsRouter({productManager,socketServer}))