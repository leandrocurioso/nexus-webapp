docker-build: 
	docker build -t nexus:latest .

docker-publish: docker-build
	docker tag nexus leandrocurioso/nexus:latest
	docker push leandrocurioso/nexus:latest

docker-run:
	docker run -p 3020:3010 nexus:latest

deploy-k8s:
	chmod +x ./scripts/deploy-k8s.sh
	./scripts/deploy-k8s.sh

nexus-port-forward:
	kubectl port-forward service/nexus 3020:3010
