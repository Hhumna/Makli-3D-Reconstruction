# Download Makli images from Wikimedia Commons
import requests
import os

images = [
    ("hero-skyline.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Overview_of_Makli_Hills.jpg/1200px-Overview_of_Makli_Hills.jpg"),
    ("tile-detail.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/PK_Thatta_asv2020-02_img15_Makli_Necropolis.jpg/1200px-PK_Thatta_asv2020-02_img15_Makli_Necropolis.jpg"),
    ("carving-detail.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/PK_Thatta_asv2020-02_img11_Makli_Necropolis.jpg/1200px-PK_Thatta_asv2020-02_img11_Makli_Necropolis.jpg"),
    ("tomb-jam-nizamuddin.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Tomb_of_Sultan_Jam_Nizamuddin.jpg/1200px-Tomb_of_Sultan_Jam_Nizamuddin.jpg"),
    ("tomb-isa-khan.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Isa_Khan_Tomb_Entrance.jpg/1200px-Isa_Khan_Tomb_Entrance.jpg"),
]

# Set proper User-Agent
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

os.chdir("public/images")

for filename, url in images:
    try:
        print(f"Downloading {filename}...")
        response = requests.get(url, timeout=30, stream=True, headers=headers)
        if response.status_code == 200:
            with open(filename, 'wb') as f:
                f.write(response.content)
            size = os.path.getsize(filename)
            print(f"✓ {filename} - {size} bytes")
        else:
            print(f"✗ {filename} - HTTP {response.status_code}")
    except Exception as e:
        print(f"✗ {filename} - {str(e)}")

print("\nFiles in directory:")
for f in os.listdir("."):
    if f.endswith(".jpg"):
        size = os.path.getsize(f)
        print(f"{f} - {size} bytes")
