import { toTitleCase, isValidInt } from '../utils/functions.js';

class JourneysV1Route {

    static BaseUri = '/api/v1/journeys'

    constructor(app, journeysRepository, journeyCategoriesRepository, projectsRepository, serviceRepository, productsRepository) {
        this.app = app;
        this.journeysRepository = journeysRepository;
        this.journeyCategoriesRepository = journeyCategoriesRepository;
        this.projectsRepository = projectsRepository;
        this.serviceRepository = serviceRepository;
        this.productsRepository = productsRepository;
    }

    init() {
        this.app.get(`${JourneysV1Route.BaseUri}`, this.getJourneys.bind(this));
        this.app.post(`${JourneysV1Route.BaseUri}`, this.postJourney.bind(this));
        this.app.delete(`${JourneysV1Route.BaseUri}/:id`, this.deleteJourney.bind(this));
        this.app.get(`${JourneysV1Route.BaseUri}/:id`, this.getJourney.bind(this));
        this.app.get(`${JourneysV1Route.BaseUri}/view/:id`, this.getJourneyView.bind(this));
    }

    async getJourneys(req, res) {
        res.json({ 
            journeys: await this.journeysRepository.list(),
            journey_categories: await this.journeyCategoriesRepository.list(),
            services: await this.serviceRepository.list(),
            projects: await this.projectsRepository.list()
        });
    }

    async getJourney(req, res) {
        const validationsErrors = [];

        // Validate 
        if (!req.params.id || !isValidInt(req.params.id)) {
            validationsErrors.push("O id da jornada é inválido!");
        }

        if (validationsErrors.length > 0) {
            return res.status(400).json({
                errors: validationsErrors
            });
        }

        const item = await this.journeysRepository.getById(req.params.id);

        res.json(item)
    }

    async getJourneyView(req, res) {

        const validationsErrors = [];

        // Validate 
        if (!req.params.id || !isValidInt(req.params.id)) {
            validationsErrors.push("O id da jornada é inválido!");
        }

        if (validationsErrors.length > 0) {
            return res.status(400).json({
                errors: validationsErrors
            });
        }

        const item = await this.journeysRepository.getById(req.params.id);
        if (item) {
            const ids = item.journey_service_ids.split(",")
            item.services = await this.serviceRepository.getByIds(ids)
        }
        
        res.json({
            journey: item,
            products: await this.productsRepository.list()
        })
    }

    async postJourney(req, res) {
        const validationsErrors = [];

        // Validate 
        if (!req.body.journey_name || req.body.journey_name.length < 2) {
            validationsErrors.push("O nome da jornada é obrigatória!");
        }

        if (!req.body.project_id || Number.isNaN(parseInt(req.body.project_id, 10))) {
            validationsErrors.push("A seleção do projeto é obrigatória!");
        }

        if (!req.body.project_id || Number.isNaN(parseInt(req.body.project_id, 10)) === 0) {
            validationsErrors.push("A seleção da categoria da jornada é obrigatória!");
        }

        if (req.body.related_journey_service_ids && req.body.related_journey_service_ids.split(",").filter(v => v.trim() === '').length > 0) {
            validationsErrors.push("Os serviços relacionados estão em formato incorreto!");
        }
        
        if (req.body.journey_id && Number.isNaN(req.body.journey_id)) {
            validationsErrors.push("O id da jornada está em formato incorreto!");
        }

        if (validationsErrors.length > 0) {
            return res.status(400).json({
                errors: validationsErrors
            });
        }

        let journeyId = req.body.journey_id;
        req.body.journey_name = toTitleCase(req.body.journey_name);

        // Update
        if (req.body.journey_id && req.body.journey_id > 0) {
             await this.journeysRepository.update(req.body)
        } else {
            // Create 
            journeyId = await this.journeysRepository.create(req.body)
        }

        res.json({ journeyId });
    }

    async deleteJourney(req, res) {
          const validationsErrors = [];

        // Validate 
        if (!isValidInt(req.params.id)) {
            validationsErrors.push("O id da jornada é inválido!");
        }

        if (validationsErrors.length > 0) {
            return res.status(400).json({
                errors: validationsErrors
            });
        }

        await this.journeysRepository.delete(req.params.id);

        res.json({
            message: "success"
        })
    }
}

export default JourneysV1Route;
