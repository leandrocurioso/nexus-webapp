import Repository from "./repository.js";

class JourneysRepository extends Repository {

    constructor(db) {
        super(db);
    }

    getBaseSelectQuery() {
        return `
             SELECT 			
                j.id as journey_id,
                j.name AS journey_name,
                j.service_ids AS journey_service_ids,
				j.description AS journey_description,
				j.slo AS journey_slo,
				j.critical AS journey_critical,               
				j.integrated_tests AS journey_integrated_tests,               
				j.created_at AS journey_created_at,
				j.updated_at AS journey_updated_at,
				j.active AS journey_active, 
                p.id AS project_id,
                p.name AS project_name,
                jc.id AS journey_category_id,
                jc.name AS journey_category_name
            FROM 
                journeys j
            INNER JOIN 
                projects p ON j.id_project = p.id
            INNER JOIN 
                journey_categories jc ON j.id_journey_category = jc.id
        `;
    }

    async list() {
        const [rows] = await this.db.query(this.getBaseSelectQuery());
        return rows;
    }

    async create(payload) {
        const sql = `
            INSERT INTO journeys
            (
                name,
                id_journey_category,
                id_project,
                service_ids,
                description,
                critical,
                slo,
                active,
                integrated_tests
            )  VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const values = [
            payload.journey_name,
            parseInt(payload.journey_category_id, 10),
            parseInt(payload.project_id, 10),
            payload.related_journey_service_ids,
            payload.journey_description,
            payload.journey_critical,
            payload.journey_slo,
            payload.active,
            payload.journey_integrated_test,
        ];
            
        const [result] = await this.db.execute(sql, values);
        return result.insertId;
    }

    async update(payload) {
        const sql = `
            UPDATE journeys
            SET 
                name = ?,
                id_journey_category = ?,
                id_project = ?,
                service_ids = ?,
                description = ?,
                critical = ?,
                slo = ?,
                active = ?,
                integrated_tests = ?,
                updated_at = NOW()
            WHERE 
                id = ?;
        `;
        const values = [
            payload.journey_name,
            parseInt(payload.journey_category_id, 10),
            parseInt(payload.project_id, 10),
            payload.related_journey_service_ids,
            payload.journey_description,
            payload.journey_critical,
            payload.journey_slo,
            payload.active,
            payload.journey_integrated_test,
            parseInt(payload.journey_id, 10),
        ];

        const [result] = await this.db.execute(sql, values);
        return result.insertId;
    }

    async delete(id) {
        const sql = `DELETE FROM journeys WHERE id = ?`;
        const [result] = await this.db.execute(sql, [id]);
        return result.affectedRows > 0;
    }

    async getById(id) {
        const sql = `
            ${this.getBaseSelectQuery()}
            WHERE j.id = ?;
        `;

        const [result] = await this.db.execute(sql, [id]);
        if (result.length > 0) return result[0];
        return null;
    }


}

export default JourneysRepository;