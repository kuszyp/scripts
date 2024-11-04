#!/bin/bash

namespace=$1
output_directory=$2

db_names=("wso2am_db" "wso2am_shared_db")
db_user="postgres"
db_port=54328
db_password=$(kubectl get secret wso2db-pgo-cluster-pguser-$db_user -o yaml -n $namespace | grep password | awk '{print $2}' | base64 -d)
db_pod=$(kubectl get pods -n $namespace --show-labels | grep master | grep pgo | awk '{print $1}')

kubectl port-forward pod/$db_pod $db_port:5432 -n $namespace &

for db_name in "${db_names[@]}"; do
  echo "db_user: $db_user"
  echo "db_password: $db_password"
  echo "db_name: $db_name"
  mkdir -p "$output_directory/$db_name"
  sleep 2

  PGPASSWORD="$db_password" pg_dump -h localhost -p $db_port -U $db_user -j 4 -Fd -b -v -f "$output_directory/$db_name" $db_name
  echo ""
  echo ""
  echo "---------------------------------"
  echo "- Created backup of: $db_name"
  echo "---------------------------------"
  echo ""
  echo ""
done

kill -9 $(ps -ef | grep "kubectl port-forward pod/$db_pod $db_port:5432 -n $namespace" | grep -v "grep" | awk '{print $2}')
