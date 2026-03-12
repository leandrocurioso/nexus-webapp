-- Desabilitar verificação de chaves estrangeiras para facilitar o DROP
SET FOREIGN_KEY_CHECKS = 0;

-- Drop das tabelas caso já existam
DROP TABLE IF EXISTS journeys;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS journey_categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS teams;

-- Reabilitar verificação de chaves estrangeiras
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Tabela: teams
CREATE TABLE teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active TINYINT(1) DEFAULT 1
);

-- 2. Tabela: projects
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active TINYINT(1) DEFAULT 1
);

-- 3. Tabela: products
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_team INT NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active TINYINT(1) DEFAULT 1,
    CONSTRAINT fk_product_team FOREIGN KEY (id_team) REFERENCES teams(id)
);

-- 4. Tabela: journey_categories
CREATE TABLE journey_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active TINYINT(1) DEFAULT 1
);

-- 5. Tabela: services
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_product INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    dependency_product_ids VARCHAR(600) NULL, -- Ex: 1,2,3
    orr TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active TINYINT(1) DEFAULT 1,
    CONSTRAINT fk_service_product FOREIGN KEY (id_product) REFERENCES products(id)
);

-- 6. Tabela: journeys
CREATE TABLE journeys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_journey_category INT NOT NULL,
    id_project INT NOT NULL,
    service_ids VARCHAR(600) NOT NULL, -- Ex: 1,2,3
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    critical TINYINT(1) DEFAULT 0,
    integrated_tests TINYINT(1) DEFAULT 0,
    slo TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active TINYINT(1) DEFAULT 1,
    CONSTRAINT fk_journey_category FOREIGN KEY (id_journey_category) REFERENCES journey_categories(id),
    CONSTRAINT fk_journey_project FOREIGN KEY (id_project) REFERENCES projects(id)
);