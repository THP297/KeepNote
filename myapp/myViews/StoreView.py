from myapp.models import Note, NoteImage
from myapp.forms import NoteForm
from django.http import JsonResponse
import json
from django.shortcuts import render, redirect



def store(request):
    if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest': # condition to check whether the request is sent by Ajax
        if request.POST.get("requestType") == "type1":
            form = NoteForm(request.POST, request.FILES)
            if form.is_valid():
                note = form.save(commit=False)
                note.author = request.user
                note.stored = not note.stored
                note.save()

                images = request.FILES.getlist("images")
                for image in images:
                    note_image = NoteImage(note=note, image=image)
                    note_image.save()
                response = {
                    'success': True,
                    'note_id': note.id,
                    'title': note.title,
                    'content': note.content,
                    'images': [str(type(image)) for image in images],
                    'stored':True,
                }
            return JsonResponse(response)

        elif request.POST.get("requestType") == "type2":
            imageIds= request.POST.get("ids")
            newImages = request.FILES.getlist('newImages')
            title = request.POST.get("title")
            content = request.POST.get("content")
            noteId = request.POST.get("noteId")
            note = Note.objects.get(id=noteId)
            note.stored = not note.stored

            if imageIds:
                imageIds = imageIds.split(",")
                imageIds = [int(id) for id in imageIds]
                removeImages = NoteImage.objects.filter(id__in=imageIds)
                removeImages.delete()
            if newImages:
                for image in newImages:
                    note_image = NoteImage(note=note, image=image)
                    note_image.save()
            note.title = title 
            note.content = content
            note.save()

            response= {
                "success":True,
                "imgID":imageIds,
                "newImages":[str(image) for image in newImages],
                'stored':True,
            }
            return JsonResponse(response)
        
        else:
            data = json.loads(request.body)
            selectedNotes = data.get("selectedNotes")
            storeNotes = Note.objects.filter(id__in=selectedNotes)
            for note in storeNotes:
                note.stored = not note.stored
                note.save()
            response = {
                "selectedNotes":selectedNotes
            }
            return JsonResponse(response)
        
    elif request.method == 'POST':
        note_id = request.POST.get('note_id') #this get function used to get the value of the matched element by name
        note = Note.objects.get(id=note_id) 
        note.stored = not note.stored
        note.save()
        current_url = request.POST.get("current_url")
        current_url = current_url +"?stored=true"
        return redirect(current_url)

    else:
        stored_notes = Note.objects.filter(stored=True, author=request.user, removed=False)
        return render(request, 'stored_notes.html', {'notes': stored_notes})