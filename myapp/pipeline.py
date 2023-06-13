from social_core.exceptions import AuthException
from PIL import Image, ImageDraw, ImageFont
from django.conf import settings
import os
import random
# This is the custom function that will run when social user is authenticated 
def custom_pipeline(backend, response, **kwargs):
    """ when we successfully login with social account 
    kwargs and response will store all of the user information"""
    user = kwargs.get('user')
    if user:
        username = response.get('name')
        # username = response.get('email', '').split('@')[0]

        # Generate the avatar image
        # avatar_filename = f"{username}_avatar.png"
        # avatar_image_path = f"media/avatar/{avatar_filename}"  # Update with your desired file path
        # if not os.path.exists(avatar_image_path):
        #     avatar_image = generate_avatar(username[0])
        #     avatar_image.save(avatar_image_path)
        
        # Save the avatar image to a file
        
        # Assign the avatar URL to the user's avatar_url attribute
        avatar_url = response.get("picture")
        Author = get_author_model() 
        try:
            author = Author.objects.get(email=user.email)
            author.avatar_url = avatar_url
            author.is_social = True
            author.save()
        except Author.DoesNotExist:
            #if this is a new user then run create_user function to create an Author and set the avatar_url
            author = Author.objects.create_user(email=user.email, username=username, password=None)
            author.avatar_url = avatar_url
            author.is_social = True
            author.save()
    else:
        raise AuthException(backend, 'Failed to create user')

    return kwargs

def get_author_model():
    from django.apps import apps
    return apps.get_model(settings.AUTH_USER_MODEL)


# def generate_avatar(letter):
#     # Create a blank image with a colored background
#     size = (300,300)
#     background_color = get_random_color()
#     image = Image.new("RGB", size, background_color)

#     # Select a font and font size for the letter
#     font_size = 180
#     font = ImageFont.truetype("arial.ttf", font_size)

#     # Calculate the position to center the letter
#     text_width, text_height = font.getsize(letter)
#     x = (size[0] - text_width) // 2 
#     y = (size[1] - text_height) // 2 - 20

#     # Create a padded box around the letter
#     padding = 30
#     box_width = text_width + padding * 2
#     box_height = text_height + padding * 2
#     box_x = (size[0] - box_width) // 2
#     box_y = (size[1] - box_height) // 2 

#     # Draw the box with a darker background color
#     box_color = background_color
#     draw = ImageDraw.Draw(image)
#     draw.rectangle((box_x, box_y, box_x + box_width, box_y + box_height), fill=box_color)

#     # Draw the letter on the image with a dark text color
#     text_color = (60, 60, 60)
#     draw.text((x, y), letter, fill=text_color, font=font)

#     return image


# def get_random_color():
#     # Generate a random RGB color
#     r = random.randint(0, 255)
#     g = random.randint(0, 255)
#     b = random.randint(0, 255)
#     return (r, g, b)

