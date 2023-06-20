from django import forms
from .models import Note
from .models import Author

# from .models import CustomUser

class NoteForm(forms.ModelForm):

    class Meta:
        model = Note
        fields = ('title', 'content')
        widgets = {
            'title': forms.TextInput(attrs={'class': 'note-title',"placeholder":"Tiêu đề"}),
            'content': forms.Textarea(attrs={'class':'note-textarea','rows': "auto" ,"placeholder":"Tạo ghi chú"}),
        }
        labels = {
            'title': 'Tiêu đề',
            'content': 'Nội dung',
        }
    

class RegistrationForm(forms.Form):
    username = forms.CharField(max_length=100)
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)
    image = forms.ImageField()
    def save(self):
        user = Author.objects.create_user(email=self.cleaned_data['email'],username=self.cleaned_data['username']
            ,password=self.cleaned_data['password'])
        user.avatar_url = self.cleaned_data['image']
        user.save()
        
        
    
            

# class CustomUserCreationForm(forms.ModelForm):
#     class Meta:
#         model = CustomUser
#         fields = ['username', 'password', 'email']
#         widgets = {
#             'username': forms.TextInput(attrs={'id': 'username', 'required': True, 'placeholder': 'Username'}),
#             'password': forms.TextInput(attrs={'id': 'password', 'required': True, 'placeholder': 'Password'}),
#             'email': forms.TextInput(attrs={'id': 'email', 'required': True, 'placeholder': 'Email'}),
#         }


