function paginationManager(req){
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const categoryFilter = req.query.category || null;
    const statusFilter = req.query.status || null;
    const sortBy = req.query.sortBy || null;
    const sortDir = req.query.sortDir || null;
    const minPrice = parseInt(req.query.minPrice) || null;
    const maxPrice = parseInt(req.query.maxPrice) || null;
    const stock = parseInt(req.query.stock) || null;

    const filter = {};
    if(categoryFilter && categoryFilter !== 'null') filter.category = categoryFilter;
    switch(statusFilter){
        case "disponible":
            filter.status = true;
        break;
        case "agotado":
            filter.status = false;
        break;
    }
    if(minPrice || maxPrice){
        filter.price = {};
        if(minPrice) filter.price.$gte = minPrice;
        if(maxPrice) filter.price.$lte = maxPrice;
    }
    if(stock)filter.stock = {$gte:stock};

    const options = {
        page:page,
        limit:Math.min(limit, 50),
        lean:true
    }

    if(sortBy&&sortDir){
        switch(sortDir){
            case "asc":
                options.sort = {[sortBy]:1};
            break;
            case "desc":
                options.sort = {[sortBy]:-1};
            break;
        }
    }

    return {filter:filter,options:options}
}

module.exports = paginationManager;
