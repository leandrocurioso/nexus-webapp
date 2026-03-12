import Repository from "./repository.js";

class ServiceRepository extends Repository {

    constructor(db) {
        super(db);
    }

    getBaseSelectQuery() {
        return `SELECT 			
                s.id as service_id,
                s.name AS service_name,
                s.dependency_product_ids AS service_dependency_product_ids,
                s.description AS service_description,
                s.orr AS service_orr,
                s.created_at AS service_created_at,
                s.updated_at AS service_updated_at,
                s.active AS service_active,
                prod.id AS product_id,
                prod.name AS product_name,
                t.id AS team_id,
                t.name AS team_name
            FROM 
                services s
            INNER JOIN 
                products prod ON s.id_product = prod.id
            INNER JOIN 
                teams t ON prod.id_team = t.id`
    }

    async list() {
        const [rows] = await this.db.query(this.getBaseSelectQuery());

        return rows;
    }

    async create(payload) {
        const sql = `
            INSERT INTO services
            (
                id_product,
                name,
                description,
                orr,
                active,
                dependency_product_ids
            )  VALUES  (?, ?, ?, ?, ?, ?);
        `;

        const values = [
            parseInt(payload.product_id, 10),
            payload.service_name,
            payload.service_description,
            payload.service_orr,
            payload.active,
            payload.dependency_product_ids,
        ];
            
        const [result] = await this.db.execute(sql, values);
        return result.insertId;
    }

    async update(payload) {
        const sql = `
            UPDATE services
            SET 
                id_product = ?,
                name = ?,
                description = ?,
                orr = ?,
                active = ?,
                dependency_product_ids = ?,
                updated_at = NOW()
            WHERE 
                id = ?;
        `;

        const values = [
            parseInt(payload.product_id, 10),
            payload.service_name,
            payload.service_description,
            payload.service_orr,
            payload.active,
            payload.dependency_product_ids,
            parseInt(payload.service_id, 10),
        ];
            
        const [result] = await this.db.execute(sql, values);
        return result.insertId;
    }

    async delete(id) {
        const sql = `DELETE FROM services WHERE id = ?`;
        const [result] = await this.db.execute(sql, [id]);
        return result.affectedRows > 0;
    }

    async getById(id) {
        const sql = `
            SELECT *
            FROM services
            WHERE id = ?
        `;

        const [result] = await this.db.execute(sql, [id]);
        if (result.length > 0) return result[0];
        return null;
    }

    async getById(id) {
        const sql = `
            ${this.getBaseSelectQuery()}
            WHERE s.id = ?
        `;

        const [result] = await this.db.execute(sql, [id]);
        if (result.length > 0) return result[0];
        return null;
    }

    async getByIds(ids) {

        let sqlWhere = "";
        for (let index = 0; index < ids.length; index++) {
            const id = ids[index];
            if (index === 0) {
                sqlWhere += `s.id = ? \n`
                continue;
            }
            sqlWhere += `OR s.id = ? \n`
        }

        const sql = `
            ${this.getBaseSelectQuery()}
            WHERE 
                ${sqlWhere}
        `;

        const [result] = await this.db.execute(sql, ids);
        if (result.length > 0) return result;
        return [];
    }

}

export default ServiceRepository;