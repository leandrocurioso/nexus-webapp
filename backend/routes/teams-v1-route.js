
class TeamsV1Route {

    static BaseUri = '/api/v1/teams'

    constructor(app, db) {
        this.app = app;
        this.db = db;
    }

    init() {
        this.app.get(`${TeamsV1Route.BaseUri}`, this.getTeams.bind(this));
    }

    async getTeams(req, res) {
        try {
            const [rows] = await this.db.query('SELECT * FROM teams');
            res.json(rows);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

}


export default TeamsV1Route;