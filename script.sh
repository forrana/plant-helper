#!/usr/bin/env bash
docker-compose -f ./docker-compose.prod.yaml run app python manage.py "$@"
