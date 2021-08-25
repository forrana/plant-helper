#!/bin/bash

# Import env vars
export $(cat .env | xargs)

# Apply database migrations
echo "Apply database migrations"
python manage.py makemigrations
python manage.py migrate
python manage.py loaddata plantsCatalog

# Start server
echo "Starting server"
gunicorn --bind 0.0.0.0:8000 app.wsgi
