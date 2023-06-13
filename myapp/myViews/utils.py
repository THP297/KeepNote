from PIL import Image, ImageDraw, ImageFont
import random


def generate_image(username):
    # Set the image size and font properties
    image_size = (200, 200)
    font_size = 100
    font_path = 'path/to/your/font.ttf'

    # Generate a random color for the image background
    background_color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))

    # Create a new image with the specified background color
    image = Image.new('RGB', image_size, background_color)
    draw = ImageDraw.Draw(image)

    # Choose a random color for the text
    text_color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))

    # Set the font and draw the first letter of the username
    font = ImageFont.truetype(font_path, font_size)
    text = username[0].upper()  # Get the first letter and convert to uppercase
    text_width, text_height = draw.textsize(text, font=font)
    text_position = ((image_size[0] - text_width) // 2, (image_size[1] - text_height) // 2)
    draw.text(text_position, text, font=font, fill=text_color)

    # Save the image to a file
    image_path = f'media/avatar/{username}.png'
    print(image_path)
    image.save(image_path)

    # Return the path to the generated image
    return image_path
