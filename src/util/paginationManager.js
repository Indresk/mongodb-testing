function paginationManager(req){
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const categoryFilter = req.query.category || null;
    const statusFilter = req.query.status || null;

    const filter = {};
    if(categoryFilter) filter.category = categoryFilter;
    if(statusFilter){
        switch(statusFilter){
            case "disponible":
                filter.status = true;
            break;
            case "agotado":
                filter.status = false;
            break;
        }
    };

    return {filter:filter,options:{page:page,limit:Math.min(limit, 50),lean:true}}
}

module.exports = paginationManager;
