from myapp.models import Note
from django.http import JsonResponse
import json

def changeColor(request):
    if request.method == "POST":
        data = json.loads(request.body)
        if data.get("type") == "type1":
            backgroundColor = data.get("backgroundColor")
            noteId = data.get("noteId")
            note = Note.objects.get(id=noteId)
            note.background_color = backgroundColor
            note.save()
            response = {
                "background_color":backgroundColor,
                "noteId":noteId,
            }
            return JsonResponse(response)
        elif data.get("type") == "type2":
            selectedNotesId = data.get("selectedNotes")
            changeColorNotes = Note.objects.filter(id__in=selectedNotesId)
            backgroundColor = data.get("backgroundColor")
            
            for note in changeColorNotes:
                note.background_color = backgroundColor
                note.save()
            response = {
                "selectedNotesId": selectedNotesId,
                "background_color":backgroundColor,


            }
            return JsonResponse(response)