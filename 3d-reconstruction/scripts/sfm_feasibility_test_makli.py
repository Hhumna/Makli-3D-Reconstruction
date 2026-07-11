"""
SfM feasibility test on the curated Makli Necropolis photo set.
PMW Internship 2026, AI-Based 3D Reconstruction Track

Before building the monocular reconstruction, this checks whether real
multi-view Structure from Motion (feature matching + triangulation, what
COLMAP actually does) is viable on the photos curated in
footage-research/images/. If it works, that's a stronger result than any
single-photo heuristic. If it doesn't, that's worth knowing and documenting
honestly rather than assumed either way -- the Makli photos here come from
different photographers, cameras, and shoot dates (sourced from Wikimedia
Commons), not a controlled multi-view capture, so this needs checking with
real numbers rather than assumed.
"""
import cv2
import numpy as np
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
IMG_DIR = os.path.join(SCRIPT_DIR, '..', 'footage-research', 'images')

# Update these filenames to match whatever you actually downloaded into
# footage-research/images/
pairs_to_test = [
    ('01-jam-nizamuddin-front.jpg', '02-makli-wide-hills.jpg'),
    ('01-jam-nizamuddin-front.jpg', '03-makli-panorama.jpg'),
    ('02-makli-wide-hills.jpg', '05-chhatri-tomb.jpg'),
]

print("Testing ORB feature matching + RANSAC geometric verification")
print("across pairs of the curated Makli Necropolis photos:\n")

for name_a, name_b in pairs_to_test:
    path_a = os.path.join(IMG_DIR, name_a)
    path_b = os.path.join(IMG_DIR, name_b)

    if not os.path.exists(path_a) or not os.path.exists(path_b):
        print(f"{name_a}  <->  {name_b}")
        print(f"    SKIPPED: one or both files not found in {IMG_DIR}")
        print(f"    (download the curated set first -- see project README)\n")
        continue

    img_a = cv2.imread(path_a, cv2.IMREAD_GRAYSCALE)
    img_b = cv2.imread(path_b, cv2.IMREAD_GRAYSCALE)

    orb = cv2.ORB_create(3000)
    kp_a, des_a = orb.detectAndCompute(img_a, None)
    kp_b, des_b = orb.detectAndCompute(img_b, None)

    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    matches = sorted(bf.match(des_a, des_b), key=lambda m: m.distance)
    top_matches = matches[:60]

    pts_a = np.float32([kp_a[m.queryIdx].pt for m in top_matches])
    pts_b = np.float32([kp_b[m.trainIdx].pt for m in top_matches])

    F, mask = cv2.findFundamentalMat(pts_a, pts_b, cv2.FM_RANSAC, 3, 0.99)
    inliers = int(mask.ravel().sum()) if mask is not None else 0

    print(f"{name_a}  <->  {name_b}")
    print(f"    keypoints: {len(kp_a)} and {len(kp_b)}")
    print(f"    candidate matches (best 60 by descriptor distance): {len(top_matches)}")
    print(f"    RANSAC-verified geometrically consistent inliers: {inliers}")
    print()

print("Interpretation guide (based on the equivalent Taxila/Badshahi test):")
print("- Single-digit to low-double-digit inliers out of thousands of")
print("  keypoints per photo = not enough overlap for real triangulation.")
print("  Document this honestly and fall back to the monocular heuristic")
print("  approach (build_ply_reconstruction.py) instead of forcing a")
print("  geometrically meaningless point cloud out of weak matches.")
print("- If you see consistently strong double/triple-digit inlier counts")
print("  across multiple pairs, real SfM (e.g. via COLMAP) may actually be")
print("  viable here -- worth trying before falling back to monocular.")
