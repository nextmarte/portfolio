import os
from PIL import Image
import numpy as np
from scipy import ndimage
import rembg

os.makedirs("public/game/sprites", exist_ok=True)
session = rembg.new_session()

def extract_and_slice_obstacles():
    path = r"C:\Users\nextm\.gemini\antigravity\brain\5a85962a-8140-4059-b2e3-4a1532aa6ed2\pixel_game_obstacles_1791217899893.jpg"
    print("Processing obstacles...")
    with Image.open(path) as img:
        # Remove background first
        trans = rembg.remove(img, session=session)
        arr = np.array(trans)
        alpha = arr[:, :, 3] > 20
        
        # Label components along x axis
        labeled, num_features = ndimage.label(alpha)
        objs = ndimage.find_objects(labeled)
        
        # Filter valid obstacles by area
        valid_boxes = []
        for sl in objs:
            h = sl[0].stop - sl[0].start
            w = sl[1].stop - sl[1].start
            if w > 40 and h > 60:
                valid_boxes.append((sl[1].start, sl))
                
        # Sort left to right
        valid_boxes.sort(key=lambda x: x[0])
        print(f"Found {len(valid_boxes)} obstacle components")
        
        names = ["glitch_bug", "server_rack", "firewall", "hazard_cone"]
        for i, (x_start, sl) in enumerate(valid_boxes[:4]):
            cropped = trans.crop((sl[1].start, sl[0].start, sl[1].stop, sl[0].stop))
            # Trim extra margins
            bbox = cropped.getbbox()
            if bbox:
                cropped = cropped.crop(bbox)
            out_name = names[i] if i < len(names) else f"obs_{i}"
            out_file = f"public/game/sprites/{out_name}.png"
            cropped.save(out_file)
            print(f"Saved {out_file} ({cropped.size})")

def extract_and_slice_player():
    path = r"C:\Users\nextm\.gemini\antigravity\brain\5a85962a-8140-4059-b2e3-4a1532aa6ed2\pixel_character_spritesheet_1791217813225.jpg"
    print("Processing player spritesheet...")
    with Image.open(path) as img:
        trans = rembg.remove(img, session=session)
        arr = np.array(trans)
        alpha = arr[:, :, 3] > 20
        
        labeled, num_features = ndimage.label(alpha)
        objs = ndimage.find_objects(labeled)
        
        valid_boxes = []
        for sl in objs:
            h = sl[0].stop - sl[0].start
            w = sl[1].stop - sl[1].start
            if w > 40 and h > 100:
                # center y, center x
                cy = (sl[0].start + sl[0].stop) // 2
                cx = (sl[1].start + sl[1].stop) // 2
                valid_boxes.append((cy, cx, sl))
                
        # Sort by row (cy < 512 is row 1, else row 2) then x
        row1 = [b for b in valid_boxes if b[0] < 512]
        row2 = [b for b in valid_boxes if b[0] >= 512]
        row1.sort(key=lambda b: b[1])
        row2.sort(key=lambda b: b[1])
        
        all_sorted = row1 + row2
        print(f"Found {len(all_sorted)} player poses (row1: {len(row1)}, row2: {len(row2)})")
        
        # Names mapping
        # row1: idle, run_1, run_2
        # row2: walk_laptop, run_3, run_4, jump
        pose_names = [
            "player_idle", "player_run_0", "player_run_1",
            "player_walk", "player_run_2", "player_run_3", "player_jump"
        ]
        
        for i, (cy, cx, sl) in enumerate(all_sorted):
            cropped = trans.crop((sl[1].start, sl[0].start, sl[1].stop, sl[0].stop))
            bbox = cropped.getbbox()
            if bbox:
                cropped = cropped.crop(bbox)
            p_name = pose_names[i] if i < len(pose_names) else f"player_pose_{i}"
            out_file = f"public/game/sprites/{p_name}.png"
            cropped.save(out_file)
            print(f"Saved {out_file} ({cropped.size})")

def extract_and_slice_topdown():
    path = r"C:\Users\nextm\.gemini\antigravity\brain\5a85962a-8140-4059-b2e3-4a1532aa6ed2\pixel_topdown_player_spritesheet_1791217856572.jpg"
    print("Processing topdown spritesheet...")
    with Image.open(path) as img:
        trans = rembg.remove(img, session=session)
        arr = np.array(trans)
        alpha = arr[:, :, 3] > 20
        
        # Ignore top header text (first 100px) and right label text (last 150px)
        alpha[:100, :] = False
        alpha[:, 850:] = False
        
        labeled, num_features = ndimage.label(alpha)
        objs = ndimage.find_objects(labeled)
        
        valid_boxes = []
        for sl in objs:
            h = sl[0].stop - sl[0].start
            w = sl[1].stop - sl[1].start
            if w > 30 and h > 80:
                cy = (sl[0].start + sl[0].stop) // 2
                cx = (sl[1].start + sl[1].stop) // 2
                valid_boxes.append((cy, cx, sl))
                
        # Grid sorting: group into rows
        # Typically 4 rows (walk 1..4) and 4 cols (down, up, right, left)
        valid_boxes.sort(key=lambda b: (b[0] // 220, b[1]))
        print(f"Found {len(valid_boxes)} topdown frames")
        
        for i, (cy, cx, sl) in enumerate(valid_boxes):
            cropped = trans.crop((sl[1].start, sl[0].start, sl[1].stop, sl[0].stop))
            bbox = cropped.getbbox()
            if bbox:
                cropped = cropped.crop(bbox)
            out_file = f"public/game/sprites/topdown_frame_{i}.png"
            cropped.save(out_file)
            print(f"Saved {out_file} ({cropped.size})")

extract_and_slice_obstacles()
extract_and_slice_player()
extract_and_slice_topdown()
print("All sprites sliced successfully!")
