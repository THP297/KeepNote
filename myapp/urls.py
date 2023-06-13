from django.urls import path
from .myViews.ModifyView import  modify
from .myViews.AddNotes import add_note
from .myViews.StoreView import store
from .myViews.RemoveView import remove
from .myViews.LoginVew import  login_view
from .myViews.SignUpView import signUp
from .myViews.BackgroundColor import changeColor

from django.contrib.auth import views as auth_views
from django.urls import reverse_lazy
from django.contrib.auth.decorators import login_required

urlpatterns = [
    path('', login_required(add_note,login_url='/login'), name='home'),
    path('store/', login_required(store), name='store'),
    path('garbage/', login_required(remove), name='garbage'),
    path('modify/',modify, name='modify'),
    path('register/', signUp,name='register'),
    path('login/', login_view, name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page=reverse_lazy('login')),name='logout'),
    path('change_color/',changeColor,name="changeColor"),
]
