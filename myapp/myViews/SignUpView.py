from myapp.forms import RegistrationForm
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect

def signUp(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST, request.FILES)
        if form.is_valid():
            # Check if the image field is empty
            image = request.FILES.get('image')
            if not image:
                form.add_error('image', 'Please upload an image.')
            else:
                form.save()
                return redirect('login')
    else:
        form = RegistrationForm()

    return render(request, 'registration/register.html', {'form': form})
