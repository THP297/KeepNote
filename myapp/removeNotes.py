from .models import Note 

def all():
    notes = Note.objects.all()
    notes.delete()
