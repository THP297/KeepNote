from django.shortcuts import render, redirect
from myapp.models import Note
from django.http import JsonResponse
import json
from django.urls import reverse_lazy


def remove(request):
    if request.method == 'DELETE':
        data = json.loads(request.body)
        if data.get("type") == "type1":
            if data.get('name') == 'only':
                note_id = data.get('note_id')
                note = Note.objects.get(id=note_id)
                note.delete() 
                response = {
                    'redirect_url':reverse_lazy(request.resolver_match.view_name),
                    "type":data.get("type")

                }
                return JsonResponse(response)
            elif data.get('name') == 'all':
                notes = Note.objects.filter(removed=True)
                notes.delete()
                ''' request.resolver_match.view_name return the url that 
                currently send request to the view function '''
                response = {
                    'redirect_url':reverse_lazy(request.resolver_match.view_name),
                    "type":data.get("type")
                }
                return JsonResponse(response)
        elif data.get("type") == "type2":
            selectedNotes = data.get("selectedNotes")
            removeNotes = Note.objects.filter(id__in=selectedNotes)
            for note in removeNotes:
                note.removed = not note.removed
                note.save()
            response = {
                "selectedNotes": selectedNotes
            }
            return JsonResponse(response)
        elif data.get("type") == "type3":
            selectedNotes = data.get("selectedNotes")
            print(selectedNotes)
            removeNotes = Note.objects.filter(id__in=selectedNotes)
            for note in removeNotes:
                note.delete()
                
            response = {
                "selectedNotes": selectedNotes
            }
            return JsonResponse(response)
        elif data.get("type") == "type4":
            selectedNotes = data.get("selectedNotes")
            print(selectedNotes)
            removeNotes = Note.objects.filter(id__in=selectedNotes)
            for note in removeNotes:
                note.removed = not note.removed
                note.save()
            response = {
                "selectedNotes": selectedNotes
            }
            return JsonResponse(response)


    elif request.method == 'POST':
        note_id = request.POST.get('note_id')
        note = Note.objects.get(id=note_id)
        note.removed = not note.removed
        note.save()
        current_url = request.POST.get("current_url")
        current_url = current_url +"?removed=true"

        return redirect(current_url)
    else:
        removed_notes = Note.objects.filter(removed=True, author=request.user)
        return render(request, 'garbage.html', {'notes': removed_notes})