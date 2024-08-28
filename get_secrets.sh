#!/bin/bash

namespace=$1
directory_to_save=$2

secrets=("wso2is-keystore-jks-secret" "wso2is-client-truststore-jks-secret" "wso2am-keystore-jks-secret" "wso2am-client-truststore-jks-secret")

for secret_name in "${secrets[@]}"; do
  wso2_app=$(echo $secret_name | awk '{print substr($0, 5, 2)}')
  values=$(kubectl --namespace $namespace get secrets $secret_name -o json | jq -r '.data | keys[] as $k | "\($k):\(.[$k])"')

  for file_content in $values; do
    file_name=$(echo $file_content | cut -d':' -f1)
    mkdir -p $directory_to_save/$wso2_app
    echo $file_content | cut -d':' -f2 | base64 --decode >$directory_to_save/$wso2_app/$file_name
    echo "Created $directory_to_save/$file_name"
  done

done

#values=$(kubectl --namespace $namespace get secrets $secret_name -o json | jq -r '.data | keys[] as $k | "\($k):\(.[$k])"')
#for file_content in $values; do
#done
