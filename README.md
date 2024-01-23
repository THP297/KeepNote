# KeepNotes

📝 This is a Django-based web application that provides a platform for users to manage and store notes.

## Project Structure

### MyApp
The `myapp` directory contains the core functionality of the application. It includes models for the application data in `models.py`, forms in `forms.py`, and views in the `myViews` directory. The `myViews` directory contains various views for handling different aspects of the application, such as adding notes, modifying views, and storing views.

The `myapp` directory also includes a `pipeline.py` file for handling avatar URLs and a `removeNotes.py` file for handling note removal.

### MyKeep
The `mykeep` directory contains the settings for the Django project in `settings.py`, as well as the main URL configurations in `urls.py`. It also includes `asgi.py` and `wsgi.py` files for ASGI and WSGI compatibility.

## Static Files
The project includes a `static` directory for static files such as CSS, images, and JavaScript, and a `staticfiles` directory for collected static files.

## Templates
The `templates` directory contains HTML templates for the application, including `add_note.html`, `base.html`, and `garbage.html`.

## Database
The project uses SQLite as its database, as indicated by the `db.sqlite3` file.

## Installation
To install the project, you can use pip and the provided `requirements.txt` file:

`pip install -r requirements.txt`

Then, you can run the Django project with the provided manage.py script:

`python manage.py runserver`

