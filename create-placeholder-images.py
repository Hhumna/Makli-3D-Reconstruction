"""Generate placeholder Makli images"""
from PIL import Image, ImageDraw, ImageFont
import os

os.chdir("public/images")

# Image configurations
images = [
    {
        "file": "hero-skyline.jpg",
        "title": "Overview of Makli",
        "color": (139, 90, 43)  # Brown
    },
    {
        "file": "tile-detail.jpg",
        "title": "Tile Details",
        "color": (25, 107, 115)  # Teal
    },
    {
        "file": "carving-detail.jpg",
        "title": "Carved Details",
        "color": (201, 185, 154)  # Tan
    },
    {
        "file": "tomb-jam-nizamuddin.jpg",
        "title": "Jam Nizamuddin Tomb",
        "color": (101, 67, 33)  # Dark brown
    },
    {
        "file": "tomb-isa-khan.jpg",
        "title": "Isa Khan Tomb",
        "color": (160, 120, 80)  # Medium brown
    }
]

for img_config in images:
    # Create image with gradient-like effect
    img = Image.new('RGB', (1200, 800), img_config["color"])
    draw = ImageDraw.Draw(img)
    
    # Add lighter rectangle for visual interest
    draw.rectangle([(100, 100), (1100, 700)], outline=(255, 255, 255), width=3)
    
    # Add text
    text = img_config["title"] + "\nMakli Necropolis"
    try:
        # Try to use default font
        draw.text((600, 400), text, fill=(255, 255, 255), anchor="mm", align="center")
    except:
        # Fallback if font issues
        draw.text((600, 400), text, fill=(255, 255, 255))
    
    # Save image
    img.save(img_config["file"], "JPEG", quality=85)
    size = os.path.getsize(img_config["file"])
    print(f"✓ Created {img_config['file']} - {size} bytes")

print("\nFiles created:")
for f in os.listdir("."):
    if f.endswith(".jpg"):
        size = os.path.getsize(f)
        print(f"{f} - {size} bytes")
