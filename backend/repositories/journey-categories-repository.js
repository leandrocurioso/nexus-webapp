class JourneyCategoriesRepository {

    constructor(db) {
        this.db = db;
    }

    getBaseSelectQuery() {
        return `
            SELECT 
                jc.id AS journey_category_id,
                jc.name AS journey_category_name,
                jc.description AS journey_category_description,
                jc.active AS journey_category_active,
                jc.created_at AS journey_category_created_at,
                jc.updated_at AS journey_category_updated_at
            FROM 
                journey_categories jc
        `;
    }

    async list() {
        const [rows] = await this.db.query(this.getBaseSelectQuery());
        return rows;
    }

    async create(payload) {
        const sql = `
            INSERT INTO journey_categories
            (
                name,
                description,
                active
            )  VALUES  (?, ?, ?);
        `;

        const values = [
            payload.journey_category_name,
            payload.journey_category_description,
            payload.active
        ];
            
        const [result] = await this.db.execute(sql, values);
        return result.insertId;
    }

    async delete(id) {
        const sql = `DELETE FROM journey_categories WHERE id = ?`;
        const [result] = await this.db.execute(sql, [id]);
        return result.affectedRows > 0;
    }

    async update(payload) {
        const sql = `
            UPDATE journey_categories
            SET 
                name = ?,
                description = ?,
                active = ?,
                updated_at = NOW()
            WHERE 
                id = ?;
        `;
        
        const values = [
            payload.journey_category_name,
            payload.journey_category_description,
            payload.active,
            payload.journey_category_id
        ];

        const [result] = await this.db.execute(sql, values);
        return result.insertId;
    }

    async getById(id) {
        const sql = `
            ${this.getBaseSelectQuery()}
            WHERE jc.id = ?;
        `;

        const [result] = await this.db.execute(sql, [id]);
        if (result.length > 0) return result[0];
        return null;
    }

}

export default JourneyCategoriesRepository;