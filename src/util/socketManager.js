// implementación por medio de HTTP

async function runSocketFlow(action,socketServer){
    socketServer.emit("prods-updated", {action} )
}

module.exports = runSocketFlow;