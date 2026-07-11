# Makli Necropolis — Digital Preservation Project

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

The 3D reconstruction component was created as an individual task and follows a transparent, evidence-based workflow.

### Scripts

- `3d-reconstruction/scripts/sfm_feasibility_test_makli.py`
  - tests whether real multi-view reconstruction from curated imagery is feasible

- `3d-reconstruction/scripts/build_ply_reconstruction_makli.py`
  - builds the `.ply` reconstruction output using a heuristic monocular approach

- `3d-reconstruction/scripts/verify_ply_reconstruction_makli.py`
  - validates that the exported `.ply` file is structurally consistent and correctly parsed from disk

### Output

The generated point cloud is stored here:

- `3d-reconstruction/scripts/output/jam_nizamuddin_tomb_makli.ply`

A verification visualization is also included:

- `3d-reconstruction/scripts/output/ply_reload_verification_makli.png`

### Important Note

This reconstruction is a practical, honest reconstruction experiment using curated imagery and a heuristic approach. It is not a full photogrammetry pipeline with controlled multi-image geometry, but it demonstrates a valid conversion workflow for heritage documentation research and visualization.

---

## Deployment

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
