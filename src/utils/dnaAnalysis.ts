import { CODON_TABLE, COMPLEMENT, PURINES } from "./constants";

// Types
export interface SequenceStats {
  length: number;
  countA: number;
  countT: number;
  countC: number;
  countG: number;
  gcContent: number;
  atContent: number;
}

export interface Codon {
  sequence: string;
  position: number;
  aminoAcid: string;
  isStart: boolean;
  isStop: boolean;
}

export interface ORF {
  id: number;
  start: number;
  end: number;
  length: number;
  frame: number;
  strand: "+" | "-";
  sequence: string;
  proteinSequence: string;
}

export interface Mutation {
  position: number;
  original: string;
  mutated: string;
  type: "substitution" | "insertion" | "deletion";
  classification?: "transition" | "transversion";
}

export interface AlignmentResult {
  alignedSeq1: string;
  alignedSeq2: string;
  mutations: Mutation[];
  totalMutations: number;
  mutationRate: number;
  transitions: number;
  transversions: number;
  insertions: number;
  deletions: number;
}

// Validate DNA sequence (only A, T, C, G allowed)
export function validateDNASequence(sequence: string): {
  isValid: boolean;
  error?: string;
} {
  const cleanSequence = sequence.toUpperCase().replace(/\s/g, "");

  if (cleanSequence.length === 0) {
    return { isValid: false, error: "Sequence is empty" };
  }

  const invalidChars = cleanSequence.match(/[^ATCG]/g);
  if (invalidChars) {
    const uniqueInvalid = [...new Set(invalidChars)];
    return {
      isValid: false,
      error: `Invalid characters found: ${uniqueInvalid.join(", ")}. Only A, T, C, G are allowed.`,
    };
  }

  return { isValid: true };
}

// Parse FASTA format
export function parseFASTA(input: string): {
  header: string;
  sequence: string;
} {
  const lines = input.trim().split("\n");
  let header = "";
  let sequence = "";

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith(">")) {
      header = trimmedLine.substring(1).trim();
    } else {
      sequence += trimmedLine.toUpperCase().replace(/\s/g, "");
    }
  }

  // If no FASTA header, treat entire input as sequence
  if (!header && !input.trim().startsWith(">")) {
    sequence = input.toUpperCase().replace(/\s/g, "").replace(/\n/g, "");
    header = "Unnamed Sequence";
  }

  return { header, sequence };
}

// Calculate basic sequence statistics
export function calculateStats(sequence: string): SequenceStats {
  const seq = sequence.toUpperCase();
  const countA = (seq.match(/A/g) || []).length;
  const countT = (seq.match(/T/g) || []).length;
  const countC = (seq.match(/C/g) || []).length;
  const countG = (seq.match(/G/g) || []).length;

  const length = seq.length;
  const gcContent = length > 0 ? ((countG + countC) / length) * 100 : 0;
  const atContent = length > 0 ? ((countA + countT) / length) * 100 : 0;

  return {
    length,
    countA,
    countT,
    countC,
    countG,
    gcContent,
    atContent,
  };
}

// Get reverse complement of DNA sequence
export function getReverseComplement(sequence: string): string {
  const seq = sequence.toUpperCase();
  let complement = "";

  for (let i = seq.length - 1; i >= 0; i--) {
    complement += COMPLEMENT[seq[i]] || seq[i];
  }

  return complement;
}

// Get complement (without reversing)
export function getComplement(sequence: string): string {
  const seq = sequence.toUpperCase();
  let complement = "";

  for (let i = 0; i < seq.length; i++) {
    complement += COMPLEMENT[seq[i]] || seq[i];
  }

  return complement;
}

// Split sequence into codons
export function getCodons(sequence: string, frame: number = 0): Codon[] {
  const seq = sequence.toUpperCase();
  const codons: Codon[] = [];

  for (let i = frame; i < seq.length - 2; i += 3) {
    const codonSeq = seq.substring(i, i + 3);
    const aminoAcid = CODON_TABLE[codonSeq] || "?";

    codons.push({
      sequence: codonSeq,
      position: i,
      aminoAcid,
      isStart: codonSeq === "ATG",
      isStop: ["TAA", "TAG", "TGA"].includes(codonSeq),
    });
  }

  return codons;
}

// Translate DNA to protein
export function translateToProtein(
  sequence: string,
  frame: number = 0,
): string {
  const codons = getCodons(sequence, frame);
  return codons.map((c) => c.aminoAcid).join("");
}

// Find all ORFs in all reading frames
export function findORFs(sequence: string, minLength: number = 30): ORF[] {
  const orfs: ORF[] = [];
  let orfId = 1;

  // Check both strands
  const strands: Array<{ seq: string; strand: "+" | "-" }> = [
    { seq: sequence.toUpperCase(), strand: "+" },
    { seq: getReverseComplement(sequence), strand: "-" },
  ];

  for (const { seq, strand } of strands) {
    // Check all three reading frames
    for (let frame = 0; frame < 3; frame++) {
      let inORF = false;
      let orfStart = -1;
      let currentProtein = "";

      for (let i = frame; i < seq.length - 2; i += 3) {
        const codon = seq.substring(i, i + 3);
        const aminoAcid = CODON_TABLE[codon] || "?";

        if (!inORF && codon === "ATG") {
          // Start codon found
          inORF = true;
          orfStart = i;
          currentProtein = aminoAcid;
        } else if (inORF) {
          if (["TAA", "TAG", "TGA"].includes(codon)) {
            // Stop codon found - end of ORF
            const orfSeq = seq.substring(orfStart, i + 3);
            if (orfSeq.length >= minLength) {
              orfs.push({
                id: orfId++,
                start: orfStart,
                end: i + 2,
                length: orfSeq.length,
                frame: frame + 1,
                strand,
                sequence: orfSeq,
                proteinSequence: currentProtein,
              });
            }
            inORF = false;
            currentProtein = "";
          } else {
            currentProtein += aminoAcid;
          }
        }
      }

      // Handle case where ORF extends to end of sequence
      if (inORF && orfStart !== -1) {
        const orfSeq = seq.substring(orfStart);
        if (orfSeq.length >= minLength) {
          orfs.push({
            id: orfId++,
            start: orfStart,
            end: seq.length - 1,
            length: orfSeq.length,
            frame: frame + 1,
            strand,
            sequence: orfSeq,
            proteinSequence: currentProtein,
          });
        }
      }
    }
  }

  // Sort by length (longest first)
  return orfs.sort((a, b) => b.length - a.length);
}

// Needleman-Wunsch global alignment algorithm (simplified)
export function alignSequences(seq1: string, seq2: string): AlignmentResult {
  const s1 = seq1.toUpperCase();
  const s2 = seq2.toUpperCase();

  // Scoring parameters
  const match = 2;
  const mismatch = -1;
  const gap = -2;

  const m = s1.length;
  const n = s2.length;

  // Initialize scoring matrix
  const score: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // Initialize first row and column
  for (let i = 0; i <= m; i++) score[i][0] = i * gap;
  for (let j = 0; j <= n; j++) score[0][j] = j * gap;

  // Fill the scoring matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const matchScore =
        score[i - 1][j - 1] + (s1[i - 1] === s2[j - 1] ? match : mismatch);
      const deleteScore = score[i - 1][j] + gap;
      const insertScore = score[i][j - 1] + gap;
      score[i][j] = Math.max(matchScore, deleteScore, insertScore);
    }
  }

  // Traceback to get alignment
  let alignedSeq1 = "";
  let alignedSeq2 = "";
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (
      i > 0 &&
      j > 0 &&
      score[i][j] ===
        score[i - 1][j - 1] + (s1[i - 1] === s2[j - 1] ? match : mismatch)
    ) {
      alignedSeq1 = s1[i - 1] + alignedSeq1;
      alignedSeq2 = s2[j - 1] + alignedSeq2;
      i--;
      j--;
    } else if (i > 0 && score[i][j] === score[i - 1][j] + gap) {
      alignedSeq1 = s1[i - 1] + alignedSeq1;
      alignedSeq2 = "-" + alignedSeq2;
      i--;
    } else {
      alignedSeq1 = "-" + alignedSeq1;
      alignedSeq2 = s2[j - 1] + alignedSeq2;
      j--;
    }
  }

  // Analyze mutations
  const mutations: Mutation[] = [];
  let transitions = 0;
  let transversions = 0;
  let insertions = 0;
  let deletions = 0;

  for (let pos = 0; pos < alignedSeq1.length; pos++) {
    const base1 = alignedSeq1[pos];
    const base2 = alignedSeq2[pos];

    if (base1 !== base2) {
      if (base1 === "-") {
        mutations.push({
          position: pos,
          original: "-",
          mutated: base2,
          type: "insertion",
        });
        insertions++;
      } else if (base2 === "-") {
        mutations.push({
          position: pos,
          original: base1,
          mutated: "-",
          type: "deletion",
        });
        deletions++;
      } else {
        // Substitution - classify as transition or transversion
        const isPurine1 = PURINES.includes(base1);
        const isPurine2 = PURINES.includes(base2);
        const classification: "transition" | "transversion" =
          isPurine1 === isPurine2 ? "transition" : "transversion";

        mutations.push({
          position: pos,
          original: base1,
          mutated: base2,
          type: "substitution",
          classification,
        });

        if (classification === "transition") {
          transitions++;
        } else {
          transversions++;
        }
      }
    }
  }

  const totalMutations = mutations.length;
  const mutationRate =
    alignedSeq1.length > 0 ? (totalMutations / alignedSeq1.length) * 100 : 0;

  return {
    alignedSeq1,
    alignedSeq2,
    mutations,
    totalMutations,
    mutationRate,
    transitions,
    transversions,
    insertions,
    deletions,
  };
}

// Format sequence for display (with line breaks)
export function formatSequence(
  sequence: string,
  lineLength: number = 60,
): string {
  const lines: string[] = [];
  for (let i = 0; i < sequence.length; i += lineLength) {
    lines.push(sequence.substring(i, i + lineLength));
  }
  return lines.join("\n");
}

// Get nucleotide color class
export function getNucleotideColorClass(nucleotide: string): string {
  const colors: Record<string, string> = {
    A: "text-green-500",
    T: "text-red-500",
    C: "text-blue-500",
    G: "text-amber-500",
  };
  return colors[nucleotide.toUpperCase()] || "text-gray-500";
}

// Get amino acid color class based on properties
export function getAminoAcidColorClass(aminoAcid: string): string {
  const colorMap: Record<string, string> = {
    // Hydrophobic - Yellow
    A: "bg-yellow-200 text-yellow-800",
    V: "bg-yellow-200 text-yellow-800",
    I: "bg-yellow-200 text-yellow-800",
    L: "bg-yellow-200 text-yellow-800",
    M: "bg-yellow-200 text-yellow-800",
    F: "bg-yellow-200 text-yellow-800",
    W: "bg-yellow-200 text-yellow-800",
    P: "bg-yellow-200 text-yellow-800",
    // Polar - Blue
    S: "bg-blue-200 text-blue-800",
    T: "bg-blue-200 text-blue-800",
    C: "bg-blue-200 text-blue-800",
    Y: "bg-blue-200 text-blue-800",
    N: "bg-blue-200 text-blue-800",
    Q: "bg-blue-200 text-blue-800",
    // Positive - Red
    K: "bg-red-200 text-red-800",
    R: "bg-red-200 text-red-800",
    H: "bg-red-200 text-red-800",
    // Negative - Purple
    D: "bg-purple-200 text-purple-800",
    E: "bg-purple-200 text-purple-800",
    // Special - Green
    G: "bg-green-200 text-green-800",
    "*": "bg-gray-800 text-white",
  };
  return colorMap[aminoAcid.toUpperCase()] || "bg-gray-200 text-gray-800";
}
