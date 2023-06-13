from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class AuthorManager(BaseUserManager):
    def create_user(self, email, username,password=None):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        author = self.model(email=email, username=username)
        author.set_password(password)
        author.save(using=self._db)
        return author

    def create_superuser(self, email, username, password=None):
        author = self.create_user(email, username, password)
        author.is_admin = True
        author.save(using=self._db)
        return author

class Author(AbstractBaseUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100)
    avatar_url = models.ImageField(upload_to='avatar/',blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_social = models.BooleanField(default=False)
    objects = AuthorManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username
    
    def has_module_perms(self, app_label):
        return True
    
    def has_perm(self, perm, obj=None):
        return True

    def is_staff(self):
        return self.is_admin
    
class Note(models.Model):
    title = models.CharField(max_length=50, blank=True)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    stored = models.BooleanField(default=False)
    removed = models.BooleanField(default=False)
    background_color = models.CharField(max_length=20, blank=True)
    def __str__(self):
        return self.title

class NoteImage(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='post_images/')

    def __str__(self):
        return self.image.name  



