class Users {
    /* ---- constructor ---- */
    constructor(opt) {
        if (!opt) opt = {};

        this.id = opt.id || null;
        this.pseudo = opt.pseudo || null;
        this.mail = opt.mail || "";
        this.password = opt.password || null;
        this.image = opt.image || "https://img.icons8.com/office/16/ffffff/person-male-skin-type-4.png";
        this.creation_date = opt.creation_date || new Date().toDateString();
        this.description = opt.description || "";
        this.privilege = opt.privilege || 1;
    }

}

module.exports = { Users };