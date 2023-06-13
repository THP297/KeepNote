from myapp.models import Note, NoteImage
from django.http import JsonResponse


def modify(request):
    if request.method == "POST":
        if request.POST.get("requestType") == 'type1':
            imageIds= request.POST.get("ids")
            newImages = request.FILES.getlist('newImages')
            title = request.POST.get("title")
            content = request.POST.get("content")
            noteId = request.POST.get("noteId")
            note = Note.objects.get(id=noteId)
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
            }
            return JsonResponse(response)
        
        elif request.POST.get("requestType") == 'type2':
            noteId = request.POST.get("id")
            newImages = request.FILES.getlist('Images')
            note = Note.objects.get(id=noteId)
            for image in newImages:
                    note_image = NoteImage(note=note, image=image)
                    note_image.save()
            note.save()
            response = {
                'Images': [image.name for image in newImages],
                'success':True,
                'id':noteId,
            }
            return JsonResponse(response)
    
    
        