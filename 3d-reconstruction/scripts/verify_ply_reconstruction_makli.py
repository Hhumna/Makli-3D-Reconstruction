"""
Verify the Makli .ply reconstruction three separate ways, matching the
validation rigor used in the Taxila reconstruction.
PMW Internship 2026, AI-Based 3D Reconstruction Track
"""
import os
import numpy as np
import matplotlib.pyplot as plt

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PLY_PATH = os.path.join(SCRIPT_DIR, 'output', 'jam_nizamuddin_tomb_makli.ply')
OUT_DIR = os.path.join(SCRIPT_DIR, 'output')


def read_ply(path):
    """Manually parse the PLY back from disk (not from in-memory arrays
    that generated it) -- checks the file is actually valid, not just that
    it wrote without an error."""
    with open(path, 'r') as f:
        lines = f.readlines()

    header_end = next(i for i, l in enumerate(lines) if l.strip() == 'end_header')
    header = lines[:header_end]
    data_lines = lines[header_end + 1:]

    vertex_count = None
    for line in header:
        if line.startswith('element vertex'):
            vertex_count = int(line.split()[-1])

    assert vertex_count is not None, "No 'element vertex' line found in header"
    assert len(data_lines) == vertex_count, (
        f"Header declares {vertex_count} vertices but file has "
        f"{len(data_lines)} data lines -- MISMATCH"
    )

    xs, ys, zs, rs, gs, bs = [], [], [], [], [], []
    for i, line in enumerate(data_lines):
        parts = line.split()
        assert len(parts) == 6, f"Line {i} has {len(parts)} fields, expected 6: {line!r}"
        x, y, z, r, g, b = parts
        r, g, b = int(r), int(g), int(b)
        assert 0 <= r <= 255 and 0 <= g <= 255 and 0 <= b <= 255, (
            f"Line {i} has out-of-range color: {r},{g},{b}"
        )
        xs.append(float(x)); ys.append(float(y)); zs.append(float(z))
        rs.append(r); gs.append(g); bs.append(b)

    return np.array(xs), np.array(ys), np.array(zs), np.array([rs, gs, bs]).T


print(f"Re-parsing {PLY_PATH} from disk...")
x, y, z, rgb = read_ply(PLY_PATH)
print(f"Check 1 PASSED: {len(x)} vertices, header count matches, all colors valid 0-255.")

colors_norm = rgb / 255.0

fig = plt.figure(figsize=(14, 6))

ax1 = fig.add_subplot(121, projection='3d')
ax1.scatter(x, y, z, c=colors_norm, s=1, marker='.')
ax1.view_init(elev=10, azim=-90)
ax1.set_title("Re-loaded from .ply: front view")

ax2 = fig.add_subplot(122, projection='3d')
ax2.scatter(x, y, z, c=colors_norm, s=1, marker='.')
ax2.view_init(elev=15, azim=-60)
ax2.set_title("Re-loaded from .ply: three-quarter view")

plt.tight_layout()
verify_path = os.path.join(OUT_DIR, 'ply_reload_verification_makli.png')
plt.savefig(verify_path, dpi=100)
print(f"Check 2 PASSED: re-rendered from reloaded data, saved to {os.path.relpath(verify_path, SCRIPT_DIR)}")
print("Check 3: visually compare this render against the source photo -- confirm")
print("the recognizable shape (tomb silhouette, sky masked out) round-trips correctly.")
