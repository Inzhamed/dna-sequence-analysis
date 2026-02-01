import { useState, useCallback, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    FlaskConical,
    Trash2,
    Play,
    Upload,
    RefreshCw,
    Target,
    BarChart3,
    Dna,
    Sparkles,
    Box,
} from 'lucide-react';
import {
    validateDNASequence,
    parseFASTA,
    calculateStats,
    getReverseComplement,
    getCodons,
    findORFs,
    translateToProtein,
    getNucleotideColorClass,
    getAminoAcidColorClass,
    SequenceStats,
    Codon,
    ORF,
} from '../utils/dnaAnalysis';
import { SequenceData } from '../App';
import { staggerContainer, staggerItem, fadeInUp } from '../hooks/useScrollAnimation';
import { useLanguage } from '../context/LanguageContext';

interface Props {
    sequenceData: SequenceData;
    setSequenceData: React.Dispatch<React.SetStateAction<SequenceData>>;
}

const SingleSequenceAnalysis = ({ setSequenceData }: Props) => {
    const { t } = useLanguage();
    const location = useLocation();
    const [inputText, setInputText] = useState('');
    const [sequence, setSequence] = useState('');
    const [header, setHeader] = useState('');
    const [error, setError] = useState('');
    const [stats, setStats] = useState<SequenceStats | null>(null);
    const [reverseComp, setReverseComp] = useState('');
    const [codons, setCodons] = useState<Codon[]>([]);
    const [orfs, setOrfs] = useState<ORF[]>([]);
    const [protein, setProtein] = useState('');
    const [selectedFrame, setSelectedFrame] = useState(0);
    const [minOrfLength, setMinOrfLength] = useState(30);
    const [isAnalyzed, setIsAnalyzed] = useState(false);
    const [sampleLoaded, setSampleLoaded] = useState(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setInputText(content);
            };
            reader.readAsText(file);
        }
    };

    const analyzeSequence = useCallback(() => {
        setError('');
        setIsAnalyzed(false);

        // Parse FASTA format
        const { header: parsedHeader, sequence: parsedSequence } = parseFASTA(inputText);

        // Validate sequence
        const validation = validateDNASequence(parsedSequence);
        if (!validation.isValid) {
            setError(validation.error || 'Invalid sequence');
            return;
        }

        // Set sequence data
        setSequence(parsedSequence);
        setHeader(parsedHeader);
        setSequenceData(prev => ({
            ...prev,
            sequence1: parsedSequence,
            header1: parsedHeader,
        }));

        // Calculate statistics
        setStats(calculateStats(parsedSequence));

        // Get reverse complement
        setReverseComp(getReverseComplement(parsedSequence));

        // Get codons for selected frame
        setCodons(getCodons(parsedSequence, selectedFrame));

        // Find ORFs
        setOrfs(findORFs(parsedSequence, minOrfLength));

        // Translate to protein
        setProtein(translateToProtein(parsedSequence, selectedFrame));

        setIsAnalyzed(true);
    }, [inputText, selectedFrame, minOrfLength, setSequenceData]);

    const handleFrameChange = (frame: number) => {
        setSelectedFrame(frame);
        if (sequence) {
            setCodons(getCodons(sequence, frame));
            setProtein(translateToProtein(sequence, frame));
        }
    };

    const clearAll = () => {
        setInputText('');
        setSequence('');
        setHeader('');
        setError('');
        setStats(null);
        setReverseComp('');
        setCodons([]);
        setOrfs([]);
        setProtein('');
        setIsAnalyzed(false);
    };

    const loadSample = () => {
        const sampleSequence = `>Human_Insulin_Gene_Fragment
ATGGCCCTGTGGATGCGCCTCCTGCCCCTGCTGGCGCTGCTGGCCCTCTGGGGACCTGACCCAGCCGCAGCCT
TTGTGAACCAACACCTGTGCGGCTCACACCTGGTGGAAGCTCTCTACCTAGTGTGCGGGGAACGAGGCTTCTT
CTACACACCCAAGACCCGCCGGGAGGCAGAGGACCTGCAGGTGGGGCAGGTGGAGCTGGGCGGGGGCCCTGGT
GCAGGCAGCCTGCAGCCCTTGGCCCTGGAGGGGTCCCTGCAGAAGCGTGGCATTGTGGAACAATGCTGTACCA
GCATCTGCTCCCTCTACCAGCTGGAGAACTACTGCAACTAG`;
        setInputText(sampleSequence);
        return sampleSequence;
    };

    // Auto-load sample when navigating from homepage "Try Sample" button
    useEffect(() => {
        if (location.state?.loadSample && !sampleLoaded) {
            loadSample();
            setSampleLoaded(true);
            // Clear the navigation state to prevent re-triggering
            window.history.replaceState({}, document.title);
        }
    }, [location.state, sampleLoaded]);

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
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                            <Dna className="w-6 h-6 text-white" />
                        </div>
                        {t('single.title')}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">{t('single.subtitle')}</p>
                </div>
            </motion.div>

            {/* Input Section */}
            <motion.div variants={staggerItem} className="card">
                <h2 className="card-header">
                    <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span>{t('single.inputTitle')}</span>
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            {t('single.inputLabel')}
                        </label>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder=">Sequence_Name&#10;ATGGCCCTGTGGATGCGCCTCCTG..."
                            className="textarea h-40"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <label className="btn btn-secondary cursor-pointer flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            <span>{t('single.uploadFasta')}</span>
                            <input
                                type="file"
                                accept=".fasta,.fa,.txt"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>
                        <button onClick={loadSample} className="btn btn-secondary flex items-center gap-2">
                            <FlaskConical className="w-4 h-4" />
                            {t('single.loadSample')}
                        </button>
                        <button onClick={clearAll} className="btn btn-secondary flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            {t('single.clear')}
                        </button>
                        <button
                            onClick={analyzeSequence}
                            disabled={!inputText.trim()}
                            className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Play className="w-4 h-4" />
                            {t('single.analyze')}
                        </button>
                    </div>

                    {/* Settings */}
                    <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('single.readingFrame')}</label>
                            <select
                                value={selectedFrame}
                                onChange={(e) => handleFrameChange(Number(e.target.value))}
                                className="input w-24"
                            >
                                <option value={0}>+1</option>
                                <option value={1}>+2</option>
                                <option value={2}>+3</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('single.minOrfLength')}</label>
                            <input
                                type="number"
                                value={minOrfLength}
                                onChange={(e) => setMinOrfLength(Number(e.target.value))}
                                className="input w-24"
                                min={9}
                                step={3}
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl flex items-center gap-2"
                        >
                            <span className="text-lg">⚠️</span> {error}
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Results */}
            <AnimatePresence>
                {isAnalyzed && stats && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, y: -20 }}
                        variants={staggerContainer}
                        className="space-y-6"
                    >
                        {/* Header info */}
                        {header && (
                            <motion.div variants={staggerItem} className="bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 px-3 py-2 sm:px-4 sm:py-3 rounded-xl flex items-center justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                    <span className="font-medium text-xs sm:text-base text-teal-800 dark:text-teal-300">{t('single.sequence')} </span>
                                    <span className="text-xs sm:text-base text-teal-700 dark:text-teal-400 break-all">{header}</span>
                                </div>
                                <Link
                                    to="/visualize"
                                    className="btn btn-primary flex items-center gap-1 sm:gap-2 text-xs sm:text-sm flex-shrink-0 px-2 py-1.5 sm:px-4 sm:py-2"
                                >
                                    <Box className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden xs:inline">{t('single.viewIn3D')}</span>
                                    <span className="xs:hidden">3D</span>
                                </Link>
                            </motion.div>
                        )}

                        {/* Statistics Grid */}
                        <motion.div variants={staggerItem} className="card">
                            <h2 className="card-header">
                                <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                <span>{t('single.statsTitle')}</span>
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                                <motion.div whileHover={{ scale: 1.03 }} className="stat-card">
                                    <div className="stat-value">{stats.length}</div>
                                    <div className="stat-label">{t('single.length')}</div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.03 }} className="stat-card">
                                    <div className="stat-value text-green-600 dark:text-green-400">{stats.countA}</div>
                                    <div className="stat-label">{t('single.adenine')}</div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.03 }} className="stat-card">
                                    <div className="stat-value text-red-600 dark:text-red-400">{stats.countT}</div>
                                    <div className="stat-label">{t('single.thymine')}</div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.03 }} className="stat-card">
                                    <div className="stat-value text-blue-600 dark:text-blue-400">{stats.countC}</div>
                                    <div className="stat-label">{t('single.cytosine')}</div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.03 }} className="stat-card">
                                    <div className="stat-value text-amber-600 dark:text-amber-400">{stats.countG}</div>
                                    <div className="stat-label">{t('single.guanine')}</div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.03 }} className="stat-card bg-gradient-to-br from-blue-50 to-amber-50 dark:from-blue-900/30 dark:to-amber-900/30">
                                    <div className="stat-value text-indigo-600 dark:text-indigo-400">{stats.gcContent.toFixed(2)}%</div>
                                    <div className="stat-label">{t('single.gcContent')}</div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.03 }} className="stat-card bg-gradient-to-br from-green-50 to-red-50 dark:from-green-900/30 dark:to-red-900/30">
                                    <div className="stat-value text-pink-600 dark:text-pink-400">{stats.atContent.toFixed(2)}%</div>
                                    <div className="stat-label">{t('single.atContent')}</div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.03 }} className="stat-card">
                                    <div className="stat-value">{Math.floor(stats.length / 3)}</div>
                                    <div className="stat-label">{t('single.codons')}</div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Original Sequence */}
                        <motion.div variants={staggerItem} className="card">
                            <h2 className="card-header">
                                <Dna className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                <span>{t('single.originalSeq')}</span>
                            </h2>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 overflow-x-auto">
                                <div className="dna-sequence flex flex-wrap">
                                    {sequence.split('').map((nucleotide, index) => (
                                        <span
                                            key={index}
                                            className={`${getNucleotideColorClass(nucleotide)} font-semibold`}
                                        >
                                            {nucleotide}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Reverse Complement */}
                        <motion.div variants={staggerItem} className="card">
                            <h2 className="card-header">
                                <RefreshCw className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                <span>{t('single.reverseComp')}</span>
                            </h2>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 overflow-x-auto">
                                <div className="dna-sequence flex flex-wrap">
                                    {reverseComp.split('').map((nucleotide, index) => (
                                        <span
                                            key={index}
                                            className={`${getNucleotideColorClass(nucleotide)} font-semibold`}
                                        >
                                            {nucleotide}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Codons */}
                        <motion.div variants={staggerItem} className="card">
                            <h2 className="card-header">
                                <Target className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                <span>{t('single.codonsTitle')} +{selectedFrame + 1})</span>
                            </h2>
                            <div className="mb-4 flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="codon codon-start">ATG</span>
                                    <span className="text-slate-600 dark:text-slate-400">{t('single.startCodon')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="codon codon-stop">TAA</span>
                                    <span className="text-slate-600 dark:text-slate-400">{t('single.stopCodon')}</span>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 overflow-x-auto">
                                <div className="flex flex-wrap gap-1">
                                    {codons.map((codon, index) => (
                                        <motion.span
                                            key={index}
                                            whileHover={{ scale: 1.1 }}
                                            className={`codon ${codon.isStart
                                                ? 'codon-start'
                                                : codon.isStop
                                                    ? 'codon-stop'
                                                    : 'codon-regular'
                                                }`}
                                            title={`Position: ${codon.position}, Amino Acid: ${codon.aminoAcid}`}
                                        >
                                            {codon.sequence}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* ORFs */}
                        <motion.div variants={staggerItem} className="card">
                            <h2 className="card-header">
                                <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                <span>{t('single.orfsTitle')}</span>
                            </h2>
                            {orfs.length > 0 ? (
                                <div className="space-y-4">
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                                        {t('single.orfsFound').replace('{count}', String(orfs.length)).replace('{length}', String(minOrfLength))}
                                    </p>
                                    <div className="overflow-x-auto">
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    <th>{t('table.id')}</th>
                                                    <th>{t('table.frame')}</th>
                                                    <th>{t('table.strand')}</th>
                                                    <th>{t('table.start')}</th>
                                                    <th>{t('table.end')}</th>
                                                    <th>{t('table.length')}</th>
                                                    <th>{t('table.protein')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orfs.map((orf) => (
                                                    <tr key={orf.id}>
                                                        <td>{orf.id}</td>
                                                        <td>+{orf.frame}</td>
                                                        <td>
                                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${orf.strand === '+'
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                                                                }`}>
                                                                {orf.strand}
                                                            </span>
                                                        </td>
                                                        <td>{orf.start}</td>
                                                        <td>{orf.end}</td>
                                                        <td>{orf.length} bp</td>
                                                        <td className="font-mono text-xs max-w-xs truncate">
                                                            {orf.proteinSequence.substring(0, 30)}
                                                            {orf.proteinSequence.length > 30 && '...'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-500 dark:text-slate-400">{t('single.noOrfs')}</p>
                            )}
                        </motion.div>

                        {/* Protein Sequence */}
                        <motion.div variants={staggerItem} className="card">
                            <h2 className="card-header">
                                <FlaskConical className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                <span>{t('single.proteinTitle')} +{selectedFrame + 1})</span>
                            </h2>
                            <div className="mb-4 flex flex-wrap gap-3 text-xs">
                                <div className="flex items-center gap-1">
                                    <span className="w-4 h-4 rounded bg-yellow-200 dark:bg-yellow-700"></span>
                                    <span className="text-slate-600 dark:text-slate-400">{t('single.hydrophobic')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-4 h-4 rounded bg-blue-200 dark:bg-blue-700"></span>
                                    <span className="text-slate-600 dark:text-slate-400">{t('single.polar')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-4 h-4 rounded bg-red-200 dark:bg-red-700"></span>
                                    <span className="text-slate-600 dark:text-slate-400">{t('single.positive')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-4 h-4 rounded bg-purple-200 dark:bg-purple-700"></span>
                                    <span className="text-slate-600 dark:text-slate-400">{t('single.negative')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-4 h-4 rounded bg-green-200 dark:bg-green-700"></span>
                                    <span className="text-slate-600 dark:text-slate-400">{t('single.special')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-4 h-4 rounded bg-gray-800 dark:bg-gray-600"></span>
                                    <span className="text-slate-600 dark:text-slate-400">{t('single.stop')}</span>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 overflow-x-auto">
                                <div className="protein-sequence">
                                    {protein.split('').map((aa, index) => (
                                        <motion.span
                                            key={index}
                                            whileHover={{ scale: 1.2 }}
                                            className={`amino-acid ${getAminoAcidColorClass(aa)}`}
                                            title={aa}
                                        >
                                            {aa}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                                <span className="font-medium">{t('single.proteinLength')} </span>
                                {protein.length} {t('single.aminoAcids')}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SingleSequenceAnalysis;
