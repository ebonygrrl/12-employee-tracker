class dbViews {
    constructor(sql) {
        this.sql = sql;
    }

    getSql() {
        return this.sql;
    }
}

module.exports = dbViews;