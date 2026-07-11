# Makli Necropolis — Digital Preservation Project

Live site: https://makli-3d-reconstruction.netlify.app/

A research-led, educational, and visually structured web presentation focused on the historical, architectural, and conservation significance of Makli Necropolis in Thatta, Pakistan.

This repository contains two connected parts:

1. A React + Vite website presenting the Makli Necropolis story, its architecture, location, digital preservation vision, and source log.
2. An individual 3D reconstruction workflow using curated Makli imagery and script-based point cloud generation.

---

## Project Vision

Makli Necropolis is one of the most important funerary landscapes in the world and a major UNESCO World Heritage Site. This project was created to present the site in a clean, professional, and historically grounded way, combining research, structure, and digital storytelling.

The objective was to build a public-facing project page that communicates:

- the historical layers of Makli Necropolis
- the architecture and ornamentation of its tombs
- the spatial context of the site in Thatta
- the urgency of preservation and conservation
- the potential of digital documentation and 3D reconstruction for heritage preservation

---

## Team Makli

This project was carried out under the team name Team Makli, led by Humna Sadia.

### Project Leadership

Humna Sadia served as the project lead and primary researcher for the Makli Necropolis preservation website. She was responsible for the historical research, content development, website design and implementation, and overall project coordination.

### Team Roles

- Humna Sadia — Project Lead / Research Lead: led the project, conducted the research, developed the project narrative, and created the website presentation
- Muhammad Ammar — Presentation Slide Contribution: created the presentation slide for the project
- 3D Reconstruction Task — completed individually as a separate contribution within the overall project scope

> The website and research narrative were developed under the leadership of Humna Sadia, while the 3D reconstruction task was handled independently as a separate individual contribution.

---

## Project Scope

The project is divided into two major components:

### 1. Website Presentation

The website presents Makli Necropolis through a responsive and engaging storytelling layout, including:

- Hero section with an atmospheric visual introduction
- Historical timeline of the Samma, Arghun, Tarkhan, and Mughal periods
- Architecture section focused on carved stone, ornament, and architectural language
- Location section with geographic context and site photography
- Digital reconstruction section explaining the concept of preservation through 3D documentation
- Preservation section covering threats and conservation urgency
- Sources section documenting references and supporting research

### 2. 3D Reconstruction Task

As part of the digital preservation angle, a separate individual reconstruction workflow was implemented using curated Makli imagery and point-cloud generation logic.

This work includes:

- feasibility testing for real multi-view reconstruction
- a fallback monocular heuristic reconstruction approach
- a standard `.ply` export for 3D visualization
- validation scripts to verify the generated output structure and file integrity

---

## Repository Structure

```text
.
├── src/                           # React site source files
├── public/images/                 # Locally stored site imagery
├── 3d-reconstruction/
│   ├── footage-research/images/   # Curated Makli imagery
│   └── scripts/
│       ├── build_ply_reconstruction_makli.py
│       ├── sfm_feasibility_test_makli.py
│       └── verify_ply_reconstruction_makli.py
├── package.json                   # Vite/React project scripts
└── README.md
```

---

## Tech Stack

- React 19
- Vite 8
- CSS custom styling for the site
- Three.js / React Three Fiber integration for 3D-related content support
- Python scripts for reconstruction and validation

---

## Running the Project Locally

### Install dependencies

```bash
npm install
```

### Start the development site

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## 3D Reconstruction Workflow

The 3D reconstruction component was completed as an individual task within the Makli project scope and follows a transparent, evidence-based workflow.

### Step 1: Tested whether real multi-view SfM was viable first

Before choosing the final reconstruction approach, I tested whether genuine multi-view Structure-from-Motion was feasible using the curated Makli Necropolis imagery in `3d-reconstruction/footage-research/images/`.

The feasibility test was run across three image pairs:

1. `01-jam-nizamuddin-front.jpg` ↔ `02-makli-wide-hills.jpg`
2. `01-jam-nizamuddin-front.jpg` ↔ `03-makli-panorama.jpg`
3. `02-makli-wide-hills.jpg` ↔ `05-chhatri-tomb.jpg`

The real results were:

- Pair 1: 2,987 and 3,000 keypoints; 60 candidate matches; 11 RANSAC-verified inliers
- Pair 2: 2,987 and 2,965 keypoints; 60 candidate matches; 11 RANSAC-verified inliers
- Pair 3: 3,000 and 3,000 keypoints; 60 candidate matches; 11 RANSAC-verified inliers

These values show consistently weak geometric overlap across the available curated photos. Because the Makli image set contains images from different photographers, cameras, and lighting conditions rather than a controlled multi-view capture, real triangulation was not reliable enough for a meaningful 3D reconstruction.

### Step 2: Built a monocular reconstruction instead and exported a real `.ply`

Since real multi-view SfM was not viable on the provided curated set, I used a monocular heuristic reconstruction approach on a single strong front-facing Makli tomb image. This was then exported as a standard ASCII `.ply` point cloud file.

The actual reconstruction output from the current repository is:

- Source photo size: `500 × 469`
- Sky/haze masked out: `40,667` of `234,500` pixels (`17.3%`)
- Point cloud size: `48,436` vertices
- Depth range: `2.55` to `5.00` (relative units, not metric)
- Output file: `3d-reconstruction/scripts/output/jam_nizamuddin_tomb_makli.ply`
- File size: `1580.2 KB`

This approach is honest and transparent: it is a monocular heuristic depth estimate rather than a fully controlled multi-view photogrammetry pipeline.

### Step 3: Verified the `.ply` output in three ways

The reconstruction was validated using the repository verification script, which confirms the output is structurally consistent and can be reloaded from disk:

1. The file was re-parsed from disk and the header vertex count was confirmed to match the number of data lines exactly.
2. Every data row was checked to ensure it contained six valid fields with color values in the expected `0–255` range.
3. The point cloud was re-rendered from the saved file to generate `3d-reconstruction/scripts/output/ply_reload_verification_makli.png`.

### Scripts Used

- `3d-reconstruction/scripts/sfm_feasibility_test_makli.py`
  - tests whether real multi-view reconstruction from curated imagery is feasible

- `3d-reconstruction/scripts/build_ply_reconstruction_makli.py`
  - builds the `.ply` reconstruction output using a heuristic monocular approach

- `3d-reconstruction/scripts/verify_ply_reconstruction_makli.py`
  - validates that the exported `.ply` file is structurally consistent and correctly parsed from disk

### Important Note

This reconstruction is a practical, honest experiment based on a curated heritage image set. It is not a fully controlled photogrammetry workflow, but it provides a valid and documented method for exploring 3D reconstruction for Makli Necropolis documentation and preservation research.

---

## Deployment
The project is currently deployed on Netlify:

- Live link: https://makli-3d-reconstruction.netlify.app/
This project is a static frontend and can be deployed using any standard static hosting service.

### Recommended deployment options

- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages

For a Vite app, the typical workflow is:

1. run `npm run build`
2. deploy the generated `dist/` folder

---

## Project Outcome

This project presents Makli Necropolis as both:

- a historical and architectural narrative site for public understanding
- a digital preservation case study that demonstrates how modern documentation workflows can support heritage protection

The result is a clean, research-informed website and an individual 3D reconstruction experiment that together reflect the broader goals of preservation, documentation, and digital storytelling.

---

## Acknowledgements

Special thanks to Team Makli, with particular recognition to Humna Sadia for leading the project, driving the research, and developing the website presentation. Muhammad Ammar is also acknowledged for preparing the presentation slide contribution.

This project was completed with a strong emphasis on responsible documentation, research clarity, and digital heritage communication.
