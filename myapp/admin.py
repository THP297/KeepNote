from django.contrib import admin
from .models import Note, NoteImage
from .models import Author
# from .models import CustomUser


class NoteAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'author','stored','background_color']

class NoteImageAdmin(admin.ModelAdmin):
    list_display = ['note','image']


admin.site.register(Note,NoteAdmin)
admin.site.register(NoteImage,NoteImageAdmin)
admin.site.register(Author)

