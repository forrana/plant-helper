#!/bin/sh
docker exec -it plant-helper_web_1 certbot --nginx -n -d plants.ml --email plant.assistant.ml@gmail.com --agree-tos