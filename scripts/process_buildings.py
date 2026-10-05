import os
from PIL import Image
import rembg

image_map = {
    "cefet": r"C:\Users\nextm\.gemini\antigravity\brain\5a85962a-8140-4059-b2e3-4a1532aa6ed2\pixel_cefet_building_1791215844013.jpg",
    "chemtech": r"C:\Users\nextm\.gemini\antigravity\brain\5a85962a-8140-4059-b2e3-4a1532aa6ed2\pixel_chemtech_front_building_1791216103160.jpg",
    "uff": r"C:\Users\nextm\.gemini\antigravity\brain\5a85962a-8140-4059-b2e3-4a1532aa6ed2\pixel_uff_building_1791215947319.jpg",
    "cid": r"C:\Users\nextm\.gemini\antigravity\brain\5a85962a-8140-4059-b2e3-4a1532aa6ed2\pixel_cid_uff_building_1791215984198.jpg",
    "coppead": r"C:\Users\nextm\.gemini\antigravity\brain\5a85962a-8140-4059-b2e3-4a1532aa6ed2\pixel_coppead_building_1791216024578.jpg",
    "baxijen": r"C:\Users\nextm\.gemini\antigravity\brain\5a85962a-8140-4059-b2e3-4a1532aa6ed2\pixel_baxijen_building_1791216063766.jpg",
}

output_dir = r"C:\Users\nextm\.gemini\antigravity\scratch\portfolio\public\game\buildings"
os.makedirs(output_dir, exist_ok=True)

session = rembg.new_session()

for name, src_path in image_map.items():
    print(f"Processing {name} from {src_path}...")
    if not os.path.exists(src_path):
        print(f"Error: {src_path} does not exist!")
        continue
    
    with Image.open(src_path) as img:
        # Remove white background
        transparent_img = rembg.remove(img, session=session)
        
        # Crop transparent borders to fit exactly
        bbox = transparent_img.getbbox()
        if bbox:
            cropped = transparent_img.crop(bbox)
        else:
            cropped = transparent_img
            
        out_path = os.path.join(output_dir, f"{name}.png")
        cropped.save(out_path, format="PNG")
        print(f"Saved {out_path} with size {cropped.size}")

print("All building sprites processed successfully!")
