class ProjectsRepository {

    constructor(db) {
        this.db = db;
    }

    async list() {
        const [rows] = await this.db.query(`SELECT * FROM projects WHERE active = 1`);

        return rows;
    }

}

export default ProjectsRepository;