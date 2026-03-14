build:
	chmod +x scripts/build.sh
	bash scripts/build.sh

docker-build: 
	docker build -t nexus:latest --build-arg SERVER_API_HOST=http://localhost:3020 .

docker-publish: docker-build
	docker tag nexus leandrocurioso/nexus:latest
	docker push leandrocurioso/nexus:latest

docker-run:
	docker run -p 3020:3010 nexus:latest
