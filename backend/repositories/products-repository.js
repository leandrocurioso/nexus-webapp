class ProductsRepository {

    constructor(db) {
        this.db = db;
    }

    getBaseSelectQuery() {
        return `
            SELECT 
                p.id AS product_id,
                p.name AS product_name,
				t.id AS team_id,
                t.name AS team_name
            FROM 
                products p
            INNER JOIN 
                teams t ON p.id_team = t.id
        `;
    }

    async list() {
        const [rows] = await this.db.query(this.getBaseSelectQuery());

        return rows;
    }

}

export default ProductsRepository;