import { toTitleCase, isValidInt } from '../utils/functions.js';

class ServicesV1Route {

    static BaseUri = '/api/v1/services'

    constructor(app, serviceRepository, productsRepository) {
        this.app = app;
        this.serviceRepository = serviceRepository;
        this.productsRepository = productsRepository;
    }

    init() {
        this.app.get(`${ServicesV1Route.BaseUri}`, this.getServices.bind(this));
        this.app.post(`${ServicesV1Route.BaseUri}`, this.postService.bind(this));
        this.app.delete(`${ServicesV1Route.BaseUri}/:id`, this.deleteService.bind(this));
        this.app.get(`${ServicesV1Route.BaseUri}/:id`, this.getService.bind(this));
    }

    async getServices(req, res) {
        try {
            res.json({ 
                services: await this.serviceRepository.list(),
                products: await this.productsRepository.list()
            });
        } catch (err) {
            throw err;
        }
    }

    async getService(req, res) {
        try {
            const validationsErrors = [];

            // Validate 
            if (!isValidInt(req.params.id)) {
                validationsErrors.push("O id do serviço é inválido!");
            }

            if (validationsErrors.length > 0) {
                return res.status(400).json({
                    errors: validationsErrors
                });
            }
            const service = await this.serviceRepository.getById(req.params.id);
            res.json(service);
        } catch (err) {
            throw err;
        }
    }

    async postService(req, res) {
        const validationsErrors = [];

        // Validate 
        if (!req.body.service_name || req.body.service_name.length < 2) {
            validationsErrors.push("O nome do serviço é obrigatório!");
        }

        if (!req.body.product_id || Number.isNaN(parseInt(req.body.product_id, 10))) {
            validationsErrors.push("A seleção do produto é obrigatória!");
        }

        if (req.body.dependency_product_ids && req.body.dependency_product_ids.split(",").filter(v => v.trim() === '').length > 0) {
            validationsErrors.push("A dependências do produto está em formato incorreto!");
        }
        
        if (req.body.service_id && Number.isNaN(req.body.service_id)) {
            validationsErrors.push("O id do produto está em formato incorreto!");
        }

        if (req.body.dependency_product_ids && req.body.dependency_product_ids.length > 0) {
            const foundProdIdx = req.body.dependency_product_ids.split(",").findIndex(x => x === req.body.product_id);
            if (foundProdIdx !== -1) {
                validationsErrors.push("Você não pode colocar um produto dependente já selecionado em produto!");
            }
        }

        if (validationsErrors.length > 0) {
            return res.status(400).json({
                errors: validationsErrors
            });
        }

        let serviceId = req.body.service_id;
        req.body.service_name = toTitleCase(req.body.service_name);

        // Update
        if (req.body.service_id && req.body.service_id > 0) {
             await this.serviceRepository.update(req.body)
        } else {
            // Create 
            serviceId = await this.serviceRepository.create(req.body)
        }

        res.json({ serviceId });
    }

    async deleteService(req, res) {
          const validationsErrors = [];

        // Validate 
        if (!isValidInt(req.params.id)) {
            validationsErrors.push("O id do serviço é inválido!");
        }

        if (validationsErrors.length > 0) {
            return res.status(400).json({
                errors: validationsErrors
            });
        }

        await this.serviceRepository.delete(req.params.id);

        res.json({
            message: "success"
        })
    }
}

export default ServicesV1Route;
