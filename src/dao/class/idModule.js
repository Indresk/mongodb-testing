class IdModule{
    async setID(elements){
        try {
            const ids = elements.map((e)=>e.id).sort((a,b) => a-b);
            this.id = this.#findFreeId(ids)
        } catch (error) {
            console.log(`Error en el seteo de ID del producto: `,error.message)
        }
    }

    #findFreeId(ids){
        if (ids.length === 0) return 1;
        for (let i = 0; i < ids.length; i++) {
            const expected = i + 1;
            if (ids[i] !== expected) {
                return expected;
            }
        }
        return ids[ids.length - 1] + 1;
    }
}

module.exports = IdModule;