// Standard genetic code - codon to amino acid mapping
export const CODON_TABLE: Record<string, string> = {
  // Phenylalanine (F)
  TTT: "F",
  TTC: "F",
  // Leucine (L)
  TTA: "L",
  TTG: "L",
  CTT: "L",
  CTC: "L",
  CTA: "L",
  CTG: "L",
  // Isoleucine (I)
  ATT: "I",
  ATC: "I",
  ATA: "I",
  // Methionine (M) - Start codon
  ATG: "M",
  // Valine (V)
  GTT: "V",
  GTC: "V",
  GTA: "V",
  GTG: "V",
  // Serine (S)
  TCT: "S",
  TCC: "S",
  TCA: "S",
  TCG: "S",
  AGT: "S",
  AGC: "S",
  // Proline (P)
  CCT: "P",
  CCC: "P",
  CCA: "P",
  CCG: "P",
  // Threonine (T)
  ACT: "T",
  ACC: "T",
  ACA: "T",
  ACG: "T",
  // Alanine (A)
  GCT: "A",
  GCC: "A",
  GCA: "A",
  GCG: "A",
  // Tyrosine (Y)
  TAT: "Y",
  TAC: "Y",
  // Stop codons (*)
  TAA: "*",
  TAG: "*",
  TGA: "*",
  // Histidine (H)
  CAT: "H",
  CAC: "H",
  // Glutamine (Q)
  CAA: "Q",
  CAG: "Q",
  // Asparagine (N)
  AAT: "N",
  AAC: "N",
  // Lysine (K)
  AAA: "K",
  AAG: "K",
  // Aspartic acid (D)
  GAT: "D",
  GAC: "D",
  // Glutamic acid (E)
  GAA: "E",
  GAG: "E",
  // Cysteine (C)
  TGT: "C",
  TGC: "C",
  // Tryptophan (W)
  TGG: "W",
  // Arginine (R)
  CGT: "R",
  CGC: "R",
  CGA: "R",
  CGG: "R",
  AGA: "R",
  AGG: "R",
  // Glycine (G)
  GGT: "G",
  GGC: "G",
  GGA: "G",
  GGG: "G",
};

// Amino acid properties for coloring
export const AMINO_ACID_PROPERTIES: Record<
  string,
  { type: string; name: string; abbreviation: string }
> = {
  A: { type: "hydrophobic", name: "Alanine", abbreviation: "Ala" },
  V: { type: "hydrophobic", name: "Valine", abbreviation: "Val" },
  I: { type: "hydrophobic", name: "Isoleucine", abbreviation: "Ile" },
  L: { type: "hydrophobic", name: "Leucine", abbreviation: "Leu" },
  M: { type: "hydrophobic", name: "Methionine", abbreviation: "Met" },
  F: { type: "hydrophobic", name: "Phenylalanine", abbreviation: "Phe" },
  W: { type: "hydrophobic", name: "Tryptophan", abbreviation: "Trp" },
  P: { type: "hydrophobic", name: "Proline", abbreviation: "Pro" },
  G: { type: "special", name: "Glycine", abbreviation: "Gly" },
  S: { type: "polar", name: "Serine", abbreviation: "Ser" },
  T: { type: "polar", name: "Threonine", abbreviation: "Thr" },
  C: { type: "polar", name: "Cysteine", abbreviation: "Cys" },
  Y: { type: "polar", name: "Tyrosine", abbreviation: "Tyr" },
  N: { type: "polar", name: "Asparagine", abbreviation: "Asn" },
  Q: { type: "polar", name: "Glutamine", abbreviation: "Gln" },
  K: { type: "positive", name: "Lysine", abbreviation: "Lys" },
  R: { type: "positive", name: "Arginine", abbreviation: "Arg" },
  H: { type: "positive", name: "Histidine", abbreviation: "His" },
  D: { type: "negative", name: "Aspartic acid", abbreviation: "Asp" },
  E: { type: "negative", name: "Glutamic acid", abbreviation: "Glu" },
  "*": { type: "special", name: "Stop", abbreviation: "Stop" },
};

// Nucleotide complement mapping
export const COMPLEMENT: Record<string, string> = {
  A: "T",
  T: "A",
  C: "G",
  G: "C",
};

// Purines and Pyrimidines for mutation classification
export const PURINES = ["A", "G"];
export const PYRIMIDINES = ["C", "T"];

// CPK colors for atoms (for 3D visualization)
export const CPK_COLORS: Record<string, string> = {
  C: "#909090", // Carbon - Gray
  N: "#3050F8", // Nitrogen - Blue
  O: "#FF0D0D", // Oxygen - Red
  S: "#FFFF30", // Sulfur - Yellow
  H: "#FFFFFF", // Hydrogen - White
  P: "#FF8000", // Phosphorus - Orange
};
