class Rooms {
    /* ---- constructor ---- */
    constructor(opt) {
        if (!opt) opt = {};

        this.id = opt.id || null;
        this.name = opt.name || "";
        this.image = opt.image || "";
    }

}

module.exports = { Rooms };