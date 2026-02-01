import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GitCompare,
    FileText,
    FlaskConical,
    Trash2,
    Play,
    Upload,
    Search,
    BarChart3,
    Sparkles,
    AlertTriangle,
    Box,
} from 'lucide-react';
import {
    validateDNASequence,
    parseFASTA,
    alignSequences,
    findORFs,
    translateToProtein,
    getNucleotideColorClass,
    getAminoAcidColorClass,
    AlignmentResult,
    ORF,
} from '../utils/dnaAnalysis';
import { SequenceData } from '../App';
import { staggerContainer, staggerItem, fadeInUp } from '../hooks/useScrollAnimation';
import { useLanguage } from '../context/LanguageContext';

interface Props {
    sequenceData: SequenceData;
    setSequenceData: React.Dispatch<React.SetStateAction<SequenceData>>;
}

const TwoSequenceComparison = ({ setSequenceData }: Props) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [, setSequence1] = useState('');
    const [, setSequence2] = useState('');
    const [header1, setHeader1] = useState('');
    const [header2, setHeader2] = useState('');
    const [error, setError] = useState('');
    const [alignment, setAlignment] = useState<AlignmentResult | null>(null);
    const [orfs1, setOrfs1] = useState<ORF[]>([]);
    const [orfs2, setOrfs2] = useState<ORF[]>([]);
    const [protein1, setProtein1] = useState('');
    const [protein2, setProtein2] = useState('');
    const [isAnalyzed, setIsAnalyzed] = useState(false);

    const handleFileUpload = (
        event: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setter(content);
            };
            reader.readAsText(file);
        }
    };

    const compareSequences = useCallback(() => {
        setError('');
        setIsAnalyzed(false);

        // Parse FASTA format
        const parsed1 = parseFASTA(input1);
        const parsed2 = parseFASTA(input2);

        // Validate sequences
        const validation1 = validateDNASequence(parsed1.sequence);
        const validation2 = validateDNASequence(parsed2.sequence);

        if (!validation1.isValid) {
            setError(`Sequence 1: ${validation1.error}`);
            return;
        }
        if (!validation2.isValid) {
            setError(`Sequence 2: ${validation2.error}`);
            return;
        }

        // Set sequence data
        setSequence1(parsed1.sequence);
        setSequence2(parsed2.sequence);
        setHeader1(parsed1.header);
        setHeader2(parsed2.header);
        setSequenceData({
            sequence1: parsed1.sequence,
            sequence2: parsed2.sequence,
            header1: parsed1.header,
            header2: parsed2.header,
        });

        // Align sequences
        const alignmentResult = alignSequences(parsed1.sequence, parsed2.sequence);
        setAlignment(alignmentResult);

        // Find ORFs
        setOrfs1(findORFs(parsed1.sequence, 30));
        setOrfs2(findORFs(parsed2.sequence, 30));

        // Translate to protein
        setProtein1(translateToProtein(parsed1.sequence, 0));
        setProtein2(translateToProtein(parsed2.sequence, 0));

        setIsAnalyzed(true);
    }, [input1, input2, setSequenceData]);

    const clearAll = () => {
        setInput1('');
        setInput2('');
        setSequence1('');
        setSequence2('');
        setHeader1('');
        setHeader2('');
        setError('');
        setAlignment(null);
        setOrfs1([]);
        setOrfs2([]);
        setProtein1('');
        setProtein2('');
        setIsAnalyzed(false);
    };

    const loadSamples = () => {
        setInput1(`>Original_Sequence
ATGGCCCTGTGGATGCGCCTCCTGCCCCTGCTGGCGCTGCTGGCCCTCTGGGGACCTGACCCAGCCGCAGCCT
TTGTGAACCAACACCTGTGCGGCTCACACCTGGTGGAAGCTCTCTACCTAGTGTGCGGGGAACGAGGCTTCTT
CTACACACCCAAGACCCGCCGGGAGGCAGAGGACCTGCAGGTGGGGCAGGTGGAGCTGGGCGGGGGCCCTGGT`);

        setInput2(`>Mutated_Sequence
ATGGCCCTGTGGATGCGCCTCCTGCCCCTGCTGGCGCTGCTGGCCCTCTGGGGACCTGACCCAGCCGCAGCCT
TTGTGAACCAACACCTGTGCGGCTCACACCTGGTGGAAGCTCTCTACCAAGTGTGCGGGGAACGAGGCTTCTT
CTACACACCCAAGACCCGCCGGGAGGCAGAGGACCTGCAGGTGGGGCAGGTGGAGCTGGGCGGGGGCCCTGAT`);
    };

    const getMutationClass = (mutation: { type: string; classification?: string }) => {
        if (mutation.type === 'insertion') return 'mutation-insertion';
        if (mutation.type === 'deletion') return 'mutation-deletion';
        if (mutation.classification === 'transition') return 'mutation-transition';
        if (mutation.classification === 'transversion') return 'mutation-transversion';
        return 'bg-gray-200 dark:bg-gray-700';
    };

    return (
        <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
        >
            {/* Header */}
            <motion.div variants={fadeInUp} className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <GitCompare className="w-6 h-6 text-white" />
                        </div>
                        Two-Sequence Comparison
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Compare two DNA sequences to detect mutations and analyze differences</p>
                </div>
            </motion.div>

            {/* Input Section */}
            <motion.div variants={staggerItem} className="card">
                <h2 className="card-header">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span>Input Sequences</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Sequence 1 */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Sequence 1 (Original)
                        </label>
                        <textarea
                            value={input1}
                            onChange={(e) => setInput1(e.target.value)}
                            placeholder=">Sequence_1&#10;ATGGCCCTGTGGATG..."
                            className="textarea h-32"
                        />
                        <label className="btn btn-secondary cursor-pointer text-sm flex items-center gap-2 w-fit">
                            <Upload className="w-4 h-4" />
                            <span>Upload</span>
                            <input
                                type="file"
                                accept=".fasta,.fa,.txt"
                                onChange={(e) => handleFileUpload(e, setInput1)}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Sequence 2 */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Sequence 2 (Mutated/Compared)
                        </label>
                        <textarea
                            value={input2}
                            onChange={(e) => setInput2(e.target.value)}
                            placeholder=">Sequence_2&#10;ATGGCCCTGTGGATG..."
                            className="textarea h-32"
                        />
                        <label className="btn btn-secondary cursor-pointer text-sm flex items-center gap-2 w-fit">
                            <Upload className="w-4 h-4" />
                            <span>Upload</span>
                            <input
                                type="file"
                                accept=".fasta,.fa,.txt"
                                onChange={(e) => handleFileUpload(e, setInput2)}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-6">
                    <button onClick={loadSamples} className="btn btn-secondary flex items-center gap-2">
                        <FlaskConical className="w-4 h-4" />
                        Load Samples
                    </button>
                    <button onClick={clearAll} className="btn btn-secondary flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Clear
                    </button>
                    <button
                        onClick={compareSequences}
                        disabled={!input1.trim() || !input2.trim()}
                        className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Play className="w-4 h-4" />
                        Compare Sequences
                    </button>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mt-4 flex items-center gap-2"
                    >
                        <AlertTriangle className="w-5 h-5" />
                        {error}
                    </motion.div>
                )}
            </motion.div>

            {/* Results */}
            <AnimatePresence>
                {isAnalyzed && alignment && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, y: -20 }}
                        variants={staggerContainer}
                        className="space-y-6"
                    >
                        {/* Sequence Headers */}
                        <motion.div variants={staggerItem} className="flex flex-col md:flex-row gap-4 items-stretch">
                            <div className="flex-1 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 px-4 py-3 rounded-xl">
                                <span className="font-medium text-teal-800 dark:text-teal-300">Sequence 1: </span>
                                <span className="text-teal-700 dark:text-teal-400">{header1}</span>
                            </div>
                            <div className="flex-1 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 px-4 py-3 rounded-xl">
                                <span className="font-medium text-indigo-800 dark:text-indigo-300">Sequence 2: </span>
                                <span className="text-indigo-700 dark:text-indigo-400">{header2}</span>
                            </div>
                            <button
                                onClick={() => navigate('/visualize', { state: { viewMode: 'comparison' } })}
                                className="btn btn-primary flex items-center justify-center gap-2 px-6"
                            >
                                <Box className="w-4 h-4" />
                                {t('compare.viewIn3D')}
                            </button>
                        </motion.div>

                        {/* Mutation Statistics */}
                        <motion.div variants={staggerItem} className="card">
                            <h2 className="card-header">
                                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span>Mutation Statistics</span>
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                                <motion.div whileHover={{ scale: 1.03 }} className="stat-card">
                                    <div className="stat-value">{alignment.totalMutations}</div>
                                    <div className="stat-label">Total Mutations</div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.03 }} className="stat-card bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30">
                                    <div className="stat-value text-red-600 dark:text-red-400">{alignment.mutationRate.toFixed(2)}%</div>
                                    <div className="stat-label">Mutation Rate</div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.03 }} className="stat-card">
                                    <div className="stat-value text-blue-600 dark:text-blue-400">{alignment.transitions}</div>
                                    <div className="stat-label">Transitions</div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.03 }} className="stat-card">
                                    <div className="stat-value text-orange-600 dark:text-orange-400">{alignment.transversions}</div>
                                    <div className="stat-label">Transversions</div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.03 }} className="stat-card">
                                    <div className="stat-value text-green-600 dark:text-green-400">{alignment.insertions}</div>
                                    <div className="stat-label">Insertions</div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.03 }} className="stat-card">
                                    <div className="stat-value text-red-600 dark:text-red-400">{alignment.deletions}</div>
                                    <div className="stat-label">Deletions</div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Alignment Visualization */}
                        <motion.div variants={staggerItem} className="card">
                            <h2 className="card-header">
                                <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span>Sequence Alignment</span>
                            </h2>
                            <div className="mb-4 flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="mutation-transition">A→G</span>
                                    <span className="text-slate-600 dark:text-slate-400">Transition</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="mutation-transversion">A→C</span>
                                    <span className="text-slate-600 dark:text-slate-400">Transversion</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="mutation-insertion">+A</span>
                                    <span className="text-slate-600 dark:text-slate-400">Insertion</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="mutation-deletion">-A</span>
                                    <span className="text-slate-600 dark:text-slate-400">Deletion</span>
                                </div>
                            </div>
                            <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto font-mono text-sm">
                                {/* Sequence 1 */}
                                <div className="flex items-center mb-2">
                                    <span className="text-slate-400 w-16 flex-shrink-0">Seq1:</span>
                                    <div className="flex flex-wrap">
                                        {alignment.alignedSeq1.split('').map((nucleotide, index) => {
                                            const seq2Nucleotide = alignment.alignedSeq2[index];
                                            const isDifferent = nucleotide !== seq2Nucleotide;
                                            return (
                                                <span
                                                    key={index}
                                                    className={`${nucleotide === '-'
                                                        ? 'text-gray-500'
                                                        : isDifferent
                                                            ? 'bg-red-500/30 text-red-300'
                                                            : getNucleotideColorClass(nucleotide).replace('text-', 'text-').replace('-500', '-400')
                                                        } px-0.5`}
                                                >
                                                    {nucleotide}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                                {/* Match line */}
                                <div className="flex items-center mb-2">
                                    <span className="text-slate-400 w-16 flex-shrink-0"></span>
                                    <div className="flex flex-wrap">
                                        {alignment.alignedSeq1.split('').map((nucleotide, index) => {
                                            const seq2Nucleotide = alignment.alignedSeq2[index];
                                            return (
                                                <span key={index} className="text-slate-500 px-0.5">
                                                    {nucleotide === seq2Nucleotide ? '|' : nucleotide === '-' || seq2Nucleotide === '-' ? ' ' : '×'}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                                {/* Sequence 2 */}
                                <div className="flex items-center">
                                    <span className="text-slate-400 w-16 flex-shrink-0">Seq2:</span>
                                    <div className="flex flex-wrap">
                                        {alignment.alignedSeq2.split('').map((nucleotide, index) => {
                                            const seq1Nucleotide = alignment.alignedSeq1[index];
                                            const isDifferent = nucleotide !== seq1Nucleotide;
                                            return (
                                                <span
                                                    key={index}
                                                    className={`${nucleotide === '-'
                                                        ? 'text-gray-500'
                                                        : isDifferent
                                                            ? 'bg-green-500/30 text-green-300'
                                                            : getNucleotideColorClass(nucleotide).replace('text-', 'text-').replace('-500', '-400')
                                                        } px-0.5`}
                                                >
                                                    {nucleotide}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Mutation Details */}
                        <motion.div variants={staggerItem} className="card">
                            <h2 className="card-header">
                                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span>Mutation Details</span>
                            </h2>
                            {alignment.mutations.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Position</th>
                                                <th>Original</th>
                                                <th>Mutated</th>
                                                <th>Type</th>
                                                <th>Classification</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {alignment.mutations.slice(0, 50).map((mutation, index) => (
                                                <tr key={index}>
                                                    <td>{mutation.position + 1}</td>
                                                    <td>
                                                        <span className={`font-mono font-bold ${getNucleotideColorClass(mutation.original)}`}>
                                                            {mutation.original}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`font-mono font-bold ${getNucleotideColorClass(mutation.mutated)}`}>
                                                            {mutation.mutated}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getMutationClass(mutation)}`}>
                                                            {mutation.type}
                                                        </span>
                                                    </td>
                                                    <td className="capitalize text-slate-600 dark:text-slate-400">
                                                        {mutation.classification || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {alignment.mutations.length > 50 && (
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 px-3">
                                            Showing first 50 of {alignment.mutations.length} mutations
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-slate-500 dark:text-slate-400">No mutations detected - sequences are identical.</p>
                            )}
                        </motion.div>

                        {/* ORF Comparison */}
                        <motion.div variants={staggerItem} className="card">
                            <h2 className="card-header">
                                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span>ORF Comparison</span>
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-3">Sequence 1 ORFs ({orfs1.length})</h3>
                                    {orfs1.length > 0 ? (
                                        <div className="space-y-2">
                                            {orfs1.slice(0, 5).map((orf) => (
                                                <div key={orf.id} className="bg-teal-50 dark:bg-teal-900/30 rounded-xl p-3 text-sm">
                                                    <div className="font-medium text-teal-800 dark:text-teal-300">
                                                        ORF {orf.id} (Frame +{orf.frame}, {orf.strand} strand)
                                                    </div>
                                                    <div className="text-teal-600 dark:text-teal-400">
                                                        Position: {orf.start} - {orf.end} ({orf.length} bp)
                                                    </div>
                                                    <div className="font-mono text-xs text-teal-700 dark:text-teal-500 mt-1 truncate">
                                                        {orf.proteinSequence.substring(0, 40)}...
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">No ORFs found</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-3">Sequence 2 ORFs ({orfs2.length})</h3>
                                    {orfs2.length > 0 ? (
                                        <div className="space-y-2">
                                            {orfs2.slice(0, 5).map((orf) => (
                                                <div key={orf.id} className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-3 text-sm">
                                                    <div className="font-medium text-indigo-800 dark:text-indigo-300">
                                                        ORF {orf.id} (Frame +{orf.frame}, {orf.strand} strand)
                                                    </div>
                                                    <div className="text-indigo-600 dark:text-indigo-400">
                                                        Position: {orf.start} - {orf.end} ({orf.length} bp)
                                                    </div>
                                                    <div className="font-mono text-xs text-indigo-700 dark:text-indigo-500 mt-1 truncate">
                                                        {orf.proteinSequence.substring(0, 40)}...
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">No ORFs found</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Protein Comparison */}
                        <motion.div variants={staggerItem} className="card">
                            <h2 className="card-header">
                                <FlaskConical className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span>Protein Sequence Comparison</span>
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-3">Protein 1 ({protein1.length} aa)</h3>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 overflow-x-auto">
                                        <div className="protein-sequence">
                                            {protein1.split('').map((aa, index) => {
                                                const isDifferent = index < protein2.length && aa !== protein2[index];
                                                return (
                                                    <motion.span
                                                        key={index}
                                                        whileHover={{ scale: 1.2 }}
                                                        className={`amino-acid ${getAminoAcidColorClass(aa)} ${isDifferent ? 'ring-2 ring-red-500' : ''
                                                            }`}
                                                        title={aa}
                                                    >
                                                        {aa}
                                                    </motion.span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-3">Protein 2 ({protein2.length} aa)</h3>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 overflow-x-auto">
                                        <div className="protein-sequence">
                                            {protein2.split('').map((aa, index) => {
                                                const isDifferent = index < protein1.length && aa !== protein1[index];
                                                return (
                                                    <motion.span
                                                        key={index}
                                                        whileHover={{ scale: 1.2 }}
                                                        className={`amino-acid ${getAminoAcidColorClass(aa)} ${isDifferent ? 'ring-2 ring-green-500' : ''
                                                            }`}
                                                        title={aa}
                                                    >
                                                        {aa}
                                                    </motion.span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-slate-600 dark:text-slate-400 flex flex-wrap gap-6">
                                <span className="inline-flex items-center gap-2">
                                    <span className="w-4 h-4 rounded border-2 border-red-500"></span>
                                    <span>Different in Seq1</span>
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <span className="w-4 h-4 rounded border-2 border-green-500"></span>
                                    <span>Different in Seq2</span>
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default TwoSequenceComparison;
