#!/bin/bash
# Install Pipenv
pip install pipenv

# Activate virtual environment
pipenv install --dev

# Run build commands
pipenv run python manage.py makemigrations --noinput
pipenv run python manage.py migrate --noinput
pipenv run python manage.py collectstatic --noinput --clear
