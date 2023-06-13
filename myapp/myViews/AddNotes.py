from django.shortcuts import render, redirect
from myapp.models import Note, NoteImage
from ..forms import NoteForm

def add_note(request):
    query = request.GET.get('q')
    if query:
        # Handle search request
        notes = Note.objects.filter(title__icontains=query)
        return render(request, 'add_note.html', {'notes': notes, 'query': query})
    else:
        # Handle add note request
        if request.method == 'POST':
            form = NoteForm(request.POST, request.FILES)
            notes = Note.objects.filter(author=request.user,removed=False)
            if form.is_valid():
                note = form.save(commit=False)
                images = request.FILES.getlist("images") # getlist to get the files in the input type file with name is "images"
                if request.user.is_authenticated:
                    note.author = request.user
                note.save()
                # Create the NoteImage objects for each image
                for image in images:
                    # Check if the image is already associated with the note
                        note_image = NoteImage(note=note, image=image)
                        note_image.save()

            return redirect('home')

        else:
            form = NoteForm()
            param1 = request.GET.get("stored")
            if request.user.is_authenticated:
                notes = Note.objects.filter(author=request.user, removed=False,stored=False)
            else:
                notes = None
            return render(request, 'add_note.html', {'form': form, 'notes': notes,"stored":param1})