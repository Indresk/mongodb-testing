
// implementación por medio de HTTP

async function runSocketFlow(action,productManager,socketServer){
    const internalResponse = await productManager.getProducts();
    const prodsToRender = internalResponse.content.map((prod)=>{return {...prod, mainThumb:prod.thumbnail[0]}})
    socketServer.emit("prods-updated", {prods:prodsToRender, status:internalResponse.status,message:internalResponse.message,action} )
    
}

module.exports = runSocketFlow;

// acciones para devolver al flujo
// - create
// - delete
// - modify

// Primera implementación de actualización en tiempo real con recepción de socket enviado directamente - Pensado sobre app.js

// socketServer.on("connection", (client)=>{
//     // client.broadcast.emit("new-user-connected", client.id)

//     client.on("get-update", async ({action})=>{
//         const internalResponse = await productManager.getProducts();
//         const prodsToRender = internalResponse.content.map((prod)=>{return {...prod, mainThumb:prod.thumbnail[0]}})
//         socketServer.emit("prods-updated", {prods:prodsToRender, status:internalResponse.status,message:internalResponse.message,action} )
//     })
// })