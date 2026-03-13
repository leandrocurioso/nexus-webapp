
class ProductsV1Route {

    static BaseUri = '/api/v1/products'

    constructor(app, db) {
        this.app = app;
        this.db = db;
    }

    init() {
        this.app.get(`${ProductsV1Route.BaseUri}`, this.getProducts.bind(this));
    }

    async getProducts(req, res) {
        try {
            const [rows] = await this.db.query('SELECT * FROM products');
            res.json(rows);
        } catch (err) {
            throw err;
        }
    }

}


export default ProductsV1Route;