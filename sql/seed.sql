-- 1. Insert Teams
INSERT INTO teams (name) VALUES 
('Mythbusters'),
('Gyodai'),
('CloudWalkers'),
('Machi Picchu'),
('Ringo Starr'),
('Elpis'),
('MAAT'),
('Pressman'),
('Defy Hope'),
('Ghost'),
('Armada'),
('Containers PaaS'),
('Containers Products'),
('Moneyball'),
('Zeno');

-- 2. Insert Projects
INSERT INTO projects (name) VALUES 
('Camada Zero');

-- 3. Insert Products (Referencing id_team)
INSERT INTO products (id_team, name) VALUES 
(1, 'Compass Router HTTP'),
(1, 'Compass Router Kafka'),
(2, 'Compass Data'),
(2, 'CompassDB'),
(2, 'Compass HC'),
(1, 'Compass Reconciliator HTTP'),
(1, 'Compass Reconciliator Kafka'),
(3, 'Cloud Adapter'),
(7, 'CEEP'),
(9, 'Controlplane (Agent)'),
(9, 'czctl'),
(4, 'WebConsole'),
(10, 'Pipelines');

-- 4. Insert Services (Referencing id_product)
-- INSERT INTO services 
-- (id_product, name, description) 
-- VALUES 
-- (13,  'Carregar célula', 'Orquestrador para colocar uma célula em carga'),
-- (11, 'Carregar célula', 'CLI para colocar uma célula em carga'),
-- (10,  'Carregar célula', 'API para colocar uma célula em carga pelo controlplane'),
-- (1,  'Carregar célula', 'API para colocar uma célula em carga pelo Compass');

-- 5. Insert Journey Categories
INSERT INTO journey_categories
(name, description) 
VALUES 
('On Boarding', 'Jornadas relacionadas ao processo de on boarding'),
('Pós On Boarding', 'Jornadas relacionadas ao processo de pós on boarding'),
('Deployments', 'Jornadas relacionadas ao processo de deploy'),
('Ações de Crise', 'Jornadas relacionadas a ações específicas, como colocar uma célula em carga');
