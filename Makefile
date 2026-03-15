docker-build: 
	docker build -t nexus:latest .

docker-publish: docker-build
	docker tag nexus leandrocurioso/nexus:latest
	docker push leandrocurioso/nexus:latest

docker-run:
	docker run -p 3020:3010 nexus:latest
