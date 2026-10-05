from PIL import Image
import numpy as np

def inspect_image(path, name):
    img = Image.open(path)
    print(f"=== {name} ({img.size}) ===")
    # convert to grayscale and threshold to find non-white areas
    arr = np.array(img.convert("L"))
    # Non-white pixels (value < 245)
    mask = arr < 240
    print(f"Non-white pixel count: {np.sum(mask)}")
    
inspect_image(r"C:\Users\nextm\.gemini\antigravity\brain\5a85962a-8140-4059-b2e3-4a1532aa6ed2\pixel_character_spritesheet_1791217813225.jpg", "Character Spritesheet")
inspect_image(r"C:\Users\nextm\.gemini\antigravity\brain\5a85962a-8140-4059-b2e3-4a1532aa6ed2\pixel_topdown_player_spritesheet_1791217856572.jpg", "TopDown Spritesheet")
inspect_image(r"C:\Users\nextm\.gemini\antigravity\brain\5a85962a-8140-4059-b2e3-4a1532aa6ed2\pixel_game_obstacles_1791217899893.jpg", "Obstacles")
