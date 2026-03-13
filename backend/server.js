import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import basicAuth from 'express-basic-auth';

import { fileURLToPath } from 'url';
import { initDb } from './db.js';

import TeamsV1Route from './routes/teams-v1-route.js';
import ProductsV1Route from './routes/products-v1-route.js'
import ServicesV1Route from './routes/services-v1-route.js'
import JourneysV1Route from './routes/journeys-v1-route.js'
import JourneyCategoriesV1Route from './routes/journey-categories-v1-route.js'

import ServiceRepository from "./repositories/services-repository.js";
import ProductsRepository from "./repositories/products-repository.js";
import ProjectsRepository from "./repositories/projects-repository.js";
import JourneysRepository from "./repositories/journeys-repository.js";
import JourneyCategoriesRepository from "./repositories/journey-categories-repository.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.NEXUS_APP_PORT || 3010;

// Init DB and Start Server
initDb()
    .then((db) => {
        console.log('Database connected and initialized.');

        const serviceRepository = new ServiceRepository(db);
        const productsRepository = new ProductsRepository(db);
        const projectsRepository = new ProjectsRepository(db);
        const journeysRepository = new JourneysRepository(db);
        const journeyCategoriesRepository = new JourneyCategoriesRepository(db);

        const routes = [
            new TeamsV1Route(app, db),
            new ProductsV1Route(app, db),
            new ServicesV1Route(app, serviceRepository, productsRepository),
            new JourneysV1Route(app, journeysRepository, journeyCategoriesRepository, projectsRepository, serviceRepository, productsRepository),
            new JourneyCategoriesV1Route(app, journeyCategoriesRepository),
        ];
        
        routes.forEach(route => {
            route.init();
        });


        // Configure the auth middleware
        app.use(basicAuth({
            users: { 'admin': 'cz123456!' },
            challenge: true, // This pops up the browser login prompt
            unauthorizedResponse: {
                success: false,
                message: "401 Unauthorized: Access Denied"
            }
        }));

        // Serve frontend
        app.use(express.static(path.join(__dirname, '../frontend')));
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
        });

        app.use((err, req, res, next) => {
            console.log(err)
            const statusCode = err.status || 500;
            res.status(statusCode).json({
                success: false,
                message: err.message || 'Internal Server Error',
                stack: process.env.NODE_ENV === 'production' ? null : err.stack,
            });
        })

        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error:', err.message);
        process.exit(1);
    });
