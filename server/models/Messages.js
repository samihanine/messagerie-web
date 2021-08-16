class Messages {
    /* ---- constructor ---- */
    constructor(opt) {
        if (!opt) opt = {};

        this.id = opt.id || null;
        this.text = opt.text || "";
        this.creation_date = opt.creation_date || new Date();
        this.room_id = opt.room_id;
        this.user_id = opt.user_id;
    }

}

module.exports = { Messages };