# DNA Sequence Analysis Tool

A comprehensive bioinformatics web application for analyzing DNA sequences, detecting Open Reading Frames (ORFs), translating proteins, and visualizing molecular structures in 3D.

![DNA Analyzer](https://img.shields.io/badge/React-18.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue?logo=tailwindcss)
![Three.js](https://img.shields.io/badge/Three.js-0.160-black?logo=threedotjs)

## 🧬 Features

### Single Sequence Analysis
- **Sequence Statistics**: Calculate length, nucleotide counts (A, T, C, G), GC content, and AT content
- **Reverse Complement**: Generate the reverse complement sequence (3' → 5')
- **Codon Analysis**: Display codons grouped in triplets with start (ATG) and stop (TAA, TAG, TGA) codon highlighting
- **ORF Detection**: Find all Open Reading Frames across all six reading frames
- **Protein Translation**: Translate DNA to protein using the standard genetic code

### Two-Sequence Comparison
- **Global Alignment**: Needleman-Wunsch algorithm for optimal sequence alignment
- **Mutation Detection**: Identify substitutions, insertions, and deletions
- **Mutation Classification**: Distinguish between transitions and transversions
- **Mutation Statistics**: Calculate total mutations, mutation rate, and breakdown by type
- **ORF Comparison**: Compare ORFs between sequences
- **Protein Comparison**: Side-by-side protein sequence comparison with differences highlighted

### 3D Visualization
- **Protein Structure**: Interactive 3D representation of protein chains as alpha helix
- **DNA Double Helix**: Animated DNA double helix visualization
- **Comparison View**: Side-by-side 3D comparison of two protein sequences
- **Interactive Controls**: Rotate, zoom, and pan the 3D models
- **Color-coded Amino Acids**: Based on biochemical properties (hydrophobic, polar, charged)

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Inzhamed/dna-sequence-analysis.git
cd dna-sequence-analysis
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📖 Usage

### Input Formats

The application accepts DNA sequences in:
- **FASTA format**: Starting with `>header_name` followed by the sequence
- **Raw sequence**: Plain DNA sequence (A, T, C, G characters only)

Example FASTA:
```
>Human_Insulin_Gene
ATGGCCCTGTGGATGCGCCTCCTGCCCCTGCTGGCGCTGCTGGCCCTCTGG
GGACCTGACCCAGCCGCAGCCTTTGTGAACCAACACCTGTGCGGCTCACAC
CTGGTGGAAGCTCTCTACCTAGTGTGCGGGGAACGAGGCTTCTTCTACACAC
```

### Color Coding

#### Nucleotides
- 🟢 **A (Adenine)**: Green
- 🔴 **T (Thymine)**: Red
- 🔵 **C (Cytosine)**: Blue
- 🟡 **G (Guanine)**: Orange/Amber

#### Amino Acids (by property)
- 🟡 **Hydrophobic**: A, V, I, L, M, F, W, P
- 🔵 **Polar**: S, T, C, Y, N, Q
- 🔴 **Positive charge**: K, R, H
- 🟣 **Negative charge**: D, E
- 🟢 **Special**: G (Glycine)

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js with React Three Fiber
- **Animations**: Framer Motion
- **Routing**: React Router v6

## 📁 Project Structure

```
dna-sequence-analysis/
├── public/
│   └── dna-icon.svg
├── src/
│   ├── components/
│   │   └── Layout.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── SingleSequenceAnalysis.tsx
│   │   ├── TwoSequenceComparison.tsx
│   │   └── Visualization.tsx
│   ├── utils/
│   │   ├── constants.ts
│   │   └── dnaAnalysis.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🧪 Algorithms

### Needleman-Wunsch Alignment
Global sequence alignment using dynamic programming with:
- Match score: +2
- Mismatch penalty: -1
- Gap penalty: -2

### ORF Detection
Scans all six reading frames (3 forward + 3 reverse) for:
- Start codon: ATG
- Stop codons: TAA, TAG, TGA
- Configurable minimum length

### Mutation Classification
- **Transition**: Purine ↔ Purine (A↔G) or Pyrimidine ↔ Pyrimidine (C↔T)
- **Transversion**: Purine ↔ Pyrimidine

## 🚢 Deployment

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Inzhamed/dna-sequence-analysis)



## 👤 Author

**Inezarene Hamed Abdelaziz**  
Software engineer / Master 1 Bioinformatics Student - BioGen Module TP Project

## 🙏 Acknowledgments

- Standard genetic code table from NCBI
- Color schemes inspired by standard bioinformatics conventions
- 3D visualization inspired by molecular biology software
