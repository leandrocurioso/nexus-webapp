# Gemini

## 1. Project Description & Models

The project is a web app for catalog of services, it should handle entities like:

**teams**

id (int)
name (string) -> Unique 
created_at (datetime) 
updated_at (datetime) 
active (int) -> 0|1 

**projects**

id (int)
name (string) -> Unique
created_at (datetime)
updated_at (datetime)
active (int) -> 0|1 

**products**

id (int)
id_team (int) -> FK to teams.id
name (string) -> Unique
created_at (datetime)
updated_at (datetime)
active (int) -> 0|1 

**journey_category**
id (int)
name (string)  -> Unique
description (text)
created_at (datetime)
updated_at (datetime)
active (int) -> 0|1 

**journey**

id (int)
id_journey_category (int) -> FK to journey_category.id
id_project (int) -> FK to projects.id
service_ids (string) VARCHAR(600)
name (string)
description (text)
critical (int) -> 0|1
integrated_tests (int) -> 0|1
slo (text)
created_at (datetime)
updated_at (datetime)
active (int) -> 0|1 

**services**

id (int)
id_product (int) -> FK to products.id
name (string)
description (text)
orr (text)
created_at (datetime)
updated_at (datetime)
active (int) -> 0|1 

## 3. Backend API

**Project must be inside /backend folder**

The generate

**Language**: Nodejs 24
**Database**: MySQL 8.4 LTS
**Database Driver**: mysql2 - https://www.npmjs.com/package/mysql2 use version 3.19,0

The database should be initialized by docker-compose.yaml file located in the root project directory.

## 3.1 Database Seed

The database seed should read json files from *seeds** folder.

## 4. Frontend

**Project must be inside /frontend folder**

The frontend should be a Vue 3 app for the backend;
**URI: /products**
Also use:

**CSS Tailwind** https://v2.tailwindcss.com/docs/guides/vue-3-vite


## 4.1 Page Design Layout

The base wireframe should be like:

```
----------------------------
HEADER
----------------------------

Menu    Page Content
----- | ---------------------
      |
      |
----- | ---------------------

----------------------------
FOOTER
----------------------------
```

**Menu items**

- **Início**: Loads the initial page content that contains information about nexus app; **URI: /index**

- **Squads**: Loads the squads page content that contains information and CRUD operations for Squads entity; **URI: /squads**

- **Produtos**: Loads the products page content that contains information and CRUD operations for Squads entity; **URI: /products**

- **Servicos**: Loads the services page content that contains information and CRUD operations for Squads entity; **URI: /services**

**List of Pages**

- **Início**: Loads the initial page content that contains information about nexus app; **URI: /index**

- **Squads**: 
- Grid to list squads with columns (Id, Name, Actions).
- Search field above the grid to filter table register by name;
- A **create** button to open a new page with the form to handle entity creation;
- The action column must contain operation to **edit** the entity and **delete** the entity.
- Use icons to make more friendly;
- **URI: /squads**

- **Produtos**: 
- Grid to list squads with columns (Id, Name, Actions).
- Search field above the grid to filter table register by name;
- A **create** button to open a new page with the form to handle entity creation;
- The action column must contain operation to **edit** the entity and **delete** the entity.
- Use icons to make more friendly;
- **URI: /products**

- **Serviços**: 
- Grid to list squads with columns (Id, Name, Actions).
- Search field above the grid to filter table register by name;
- A **create** button to open a new page with the form to handle entity creation;
- The action column must contain operation to **edit** the entity and **delete** the entity.
- Use icons to make more friendly;
- **URI: /services**

The grid in the pages should obey the entity model in
of section **1. Project Description & Models**.

## 4. Architecture

User -> Browser -> Frontend -> API -> Database

**IMPORTANT**: The app should be a nodejs monolithic project, with the frontend and backend in the same project.

## 5. ENV Variables

NEXUS_APP_PORT: 3000
MYSQL_CONNECTION_STRING: ""


## 6. Scripts

Create and documents the scripts in a folder called **scripts** in the root project directory. It MUST use Makefile to create and manage the scripts. The database initialization should be by docker-compose.yaml file located in the root project directory.

Makefile commands and scripts description:

- **run-local**: Destroy all docker infra related to the project and start it again, use docker profile for this and also start the nodejs app. The script should be in the folder **scripts** and called **run-local.sh**;
- **stop-local**: Stop all docker infra related to the project. The script should be in the folder **scripts** and called **stop-local.sh**;
- **restart-local**: Stop all docker infra related to the project and start it again, use docker profile for this and also start the nodejs app. The script should be in the folder **scripts** and called **restart-local.sh**;
- **process-db-ssed**: This command will clean all tables from database and re-add the conent based on the seed files inside **seeds** folder.

This commands call automatically be used by AI Agent to manage the project execution.


