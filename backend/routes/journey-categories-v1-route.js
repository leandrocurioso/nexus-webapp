import { toTitleCase, isValidInt } from '../utils/functions.js';

class JourneyCategoriesV1Route {

    static BaseUri = '/api/v1/journey-categories'

    constructor(app, journeyCategoriesRepository) {
        this.app = app;
        this.journeyCategoriesRepository = journeyCategoriesRepository;
    }

    init() {
        this.app.get(`${JourneyCategoriesV1Route.BaseUri}`, this.getJourneyCategories.bind(this));
        this.app.post(`${JourneyCategoriesV1Route.BaseUri}`, this.postJourneyCategory.bind(this));
        this.app.delete(`${JourneyCategoriesV1Route.BaseUri}/:id`, this.deleteJourneyCategory.bind(this));
        this.app.get(`${JourneyCategoriesV1Route.BaseUri}/:id`, this.getJourneyCategory.bind(this));
    }

    async getJourneyCategories(req, res) {
        try {
            res.json({ 
                journeyCategories: await this.journeyCategoriesRepository.list(),
            });
        } catch(err) {
            throw err;
        }
    }

    async getJourneyCategory(req, res) {
        try {

            const validationsErrors = [];

            // Validate 
            if (!isValidInt(req.params.id)) {
                validationsErrors.push("O id da categoria de jornada é inválido!");
            }

            if (validationsErrors.length > 0) {
                return res.status(400).json({
                    errors: validationsErrors
                });
            }
            const journeyCategory = await this.journeyCategoriesRepository.getById(req.params.id);
            res.json(journeyCategory);
        } catch(err) {
            throw err;
        }
    }

    async postJourneyCategory(req, res) {
        try {
            const validationsErrors = [];

            // Validate 
            if (!req.body.journey_category_name || req.body.journey_category_name.length < 2) {
                validationsErrors.push("O nome da categoria de jornada é obrigatório!");
            }
            if (req.body.journey_category_id && Number.isNaN(req.body.journey_category_id)) {
                validationsErrors.push("O id da categoria de jornada está em formato incorreto!");
            }

            if (validationsErrors.length > 0) {
                return res.status(400).json({
                    errors: validationsErrors
                });
            }

            let journeyCategoryId = req.body.journey_category_id;
            req.body.journey_category_name = toTitleCase(req.body.journey_category_name);

            // Update
            if (req.body.journey_category_id && req.body.journey_category_id > 0) {
                await this.journeyCategoriesRepository.update(req.body)
            } else {
                // Create 
                journeyCategoryId = await this.journeyCategoriesRepository.create(req.body)
            }

            res.json({ journeyCategoryId });
        } catch(err) {
            throw err;
        }
    }

    async deleteJourneyCategory(req, res) {
        try {
            const validationsErrors = [];

            // Validate 
            if (!isValidInt(req.params.id)) {
                validationsErrors.push("O id da categoria de jornada é inválido!");
            }

            if (validationsErrors.length > 0) {
                return res.status(400).json({
                    errors: validationsErrors
                });
            }

            await this.journeyCategoriesRepository.delete(req.params.id);

            res.json({
                message: "success"
            });
        } catch(err) {
            throw err;
        }
    }
}

export default JourneyCategoriesV1Route;
