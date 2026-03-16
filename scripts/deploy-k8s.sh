#/bin/bash

kubectl delete cm mysql-initdb
kubectl delete service db
kubectl delete service nexus
kubectl delete deploy db
kubectl delete deploy nexus
sleep 5
kubectl create -f ./k8s/deployment.yaml
