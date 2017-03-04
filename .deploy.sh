#!/bin/bash

PRODUCTION="production"

ENV=$1
if [ $# -eq 0 ]; then
   echo 'Enviroment to deploy is not defined'
else
  if [ $ENV = $PRODUCTION ]; then
    echo '#####Building production app#######'
    grunt build_production
    echo '#####Cleaning production########'
    ssh ampamo@rsalesforce.com 'rm -rf /var/adatec/webapps/rsales_front/dist_deploy'
    ssh ampamo@rsalesforce.com 'mkdir /var/adatec/webapps/rsales_front/dist_deploy'
    echo '#####Uploading production app######'
    scp -r dist/* ampamo@rsalesforce.com:/var/adatec/webapps/rsales_front/dist_deploy/
    ssh ampamo@rsalesforce.com 'rm -rf /var/adatec/webapps/rsales_front/dist/*'
    ssh ampamo@rsalesforce.com 'mv /var/adatec/webapps/rsales_front/dist_deploy/* /var/adatec/webapps/rsales_front/dist/'
    ssh ampamo@rsalesforce.com 'rm -rf /var/adatec/webapps/rsales_front/dist_deploy'
  fi
fi
