class JourneyCategoriesRepository {

    constructor(db) {
        this.db = db;
    }

    async list() {
        const [rows] = await this.db.query(`SELECT * FROM journey_categories WHERE active = 1`);
        return rows;
    }

}

export default JourneyCategoriesRepository;