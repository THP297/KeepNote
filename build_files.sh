python3.9 pipenv shell
python3.9 -m pipenv install -r requirements.txt

python3.9 manage.py makemigrations --noinput
python3.9 manage.py makemirations --noinput

python3.9 manage.py collectstatic --noinput --clear