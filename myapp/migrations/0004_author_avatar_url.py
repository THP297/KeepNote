# Generated by Django 4.2.1 on 2023-06-06 13:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0003_note_background_color'),
    ]

    operations = [
        migrations.AddField(
            model_name='author',
            name='avatar_url',
            field=models.ImageField(blank=True, null=True, upload_to='avatar/'),
        ),
    ]
