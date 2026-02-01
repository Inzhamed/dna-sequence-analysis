import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { SequenceData } from '../App';
import { translateToProtein, getAminoAcidColorClass } from '../utils/dnaAnalysis';
import { AMINO_ACID_PROPERTIES } from '../utils/constants';
import {
    Box,
    Eye,
    Palette,
    FlaskConical,
    AlertTriangle,
    Info,
    X,
} from 'lucide-react';
import { staggerContainer, staggerItem, fadeInUp } from '../hooks/useScrollAnimation';
import { useLanguage } from '../context/LanguageContext';

interface Props {
    sequenceData: SequenceData;
}

// Amino acid colors based on properties (more vibrant for 3D)
const AA_COLORS: Record<string, string> = {
    // Hydrophobic - Yellow/Gold
    'A': '#FFD700', 'V': '#FFD700', 'I': '#FFD700', 'L': '#FFD700',
    'M': '#FFD700', 'F': '#FFD700', 'W': '#FFD700', 'P': '#FFD700',
    // Polar - Cyan/Blue
    'S': '#00CED1', 'T': '#00CED1', 'C': '#00CED1', 'Y': '#00CED1',
    'N': '#00CED1', 'Q': '#00CED1',
    // Positive - Red
    'K': '#FF6B6B', 'R': '#FF6B6B', 'H': '#FF6B6B',
    // Negative - Purple
    'D': '#9B59B6', 'E': '#9B59B6',
    // Special - Green
    'G': '#2ECC71',
    // Stop - Dark Gray
    '*': '#444444',
};

// Single amino acid sphere component
interface AminoAcidSphereProps {
    position: [number, number, number];
    aminoAcid: string;
    index: number;
    highlighted?: boolean;
    showLabel?: boolean;
    onClick?: () => void;
}

const AminoAcidSphere = ({ position, aminoAcid, index, highlighted, showLabel, onClick }: AminoAcidSphereProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const color = AA_COLORS[aminoAcid] || '#888888';

    useFrame((state) => {
        if (meshRef.current && highlighted) {
            meshRef.current.scale.setScalar(1.3 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
        }
    });

    return (
        <group position={position}>
            <mesh ref={meshRef} onClick={onClick}>
                <sphereGeometry args={[0.4, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    metalness={0.3}
                    roughness={0.4}
                    emissive={highlighted ? color : '#000000'}
                    emissiveIntensity={highlighted ? 0.3 : 0}
                />
            </mesh>
            {showLabel && (
                <Html position={[0, 0.8, 0]} center distanceFactor={10}>
                    <div className="bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-bold whitespace-nowrap">
                        {aminoAcid}{index + 1}
                    </div>
                </Html>
            )}
        </group>
    );
};

// Protein backbone line
interface BackboneProps {
    positions: [number, number, number][];
    color?: string;
}

const Backbone = ({ positions, color = '#666666' }: BackboneProps) => {
    const points = useMemo(() => {
        return positions.map(p => new THREE.Vector3(...p));
    }, [positions]);

    const lineGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return geometry;
    }, [points]);

    return (
        <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color, linewidth: 2 }))} />
    );
};

// Protein chain component
interface ProteinChainProps {
    sequence: string;
    offset?: [number, number, number];
    comparisonSequence?: string;
    color?: string;
    showLabels?: boolean;
}

const ProteinChain = ({ sequence, offset = [0, 0, 0], comparisonSequence, color, showLabels }: ProteinChainProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Generate 3D helix-like positions for amino acids
    const positions = useMemo(() => {
        const pos: [number, number, number][] = [];
        const helixRadius = 2;
        const helixPitch = 0.5;
        const angularStep = (Math.PI * 2) / 18; // ~18 residues per turn

        for (let i = 0; i < sequence.length; i++) {
            const angle = i * angularStep;
            const x = helixRadius * Math.cos(angle) + offset[0];
            const y = i * helixPitch + offset[1];
            const z = helixRadius * Math.sin(angle) + offset[2];
            pos.push([x, y, z]);
        }
        return pos;
    }, [sequence, offset]);

    return (
        <group ref={groupRef}>
            {/* Backbone */}
            <Backbone positions={positions} color={color || '#888888'} />

            {/* Amino acid spheres */}
            {sequence.split('').map((aa, index) => {
                const isDifferent = comparisonSequence && index < comparisonSequence.length && aa !== comparisonSequence[index];
                // Show labels every 5th amino acid to avoid clutter, or when highlighted
                const shouldShowLabel = showLabels && (index % 5 === 0 || isDifferent || hoveredIndex === index);
                return (
                    <AminoAcidSphere
                        key={index}
                        position={positions[index]}
                        aminoAcid={aa}
                        index={index}
                        highlighted={isDifferent || hoveredIndex === index}
                        showLabel={shouldShowLabel}
                        onClick={() => setHoveredIndex(hoveredIndex === index ? null : index)}
                    />
                );
            })}
        </group>
    );
};

// Loading component
const LoadingScreen = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
        <div className="text-center">
            <motion.div
                className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-slate-400">Loading 3D Scene...</p>
        </div>
    </div>
);

const Visualization = ({ sequenceData }: Props) => {
    const { t } = useLanguage();
    const location = useLocation();
    const [viewMode, setViewMode] = useState<'protein' | 'comparison'>(
        (location.state as { viewMode?: 'protein' | 'comparison' })?.viewMode || 'protein'
    );
    const [protein1, setProtein1] = useState('');
    const [protein2, setProtein2] = useState('');
    const [showInfoCard, setShowInfoCard] = useState(true);
    useEffect(() => {
        if (sequenceData.sequence1) {
            setProtein1(translateToProtein(sequenceData.sequence1, 0));
        }
        if (sequenceData.sequence2) {
            setProtein2(translateToProtein(sequenceData.sequence2, 0));
        }
    }, [sequenceData]);

    const hasSequence1 = sequenceData.sequence1.length > 0;

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
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                            <Box className="w-6 h-6 text-white" />
                        </div>
                        {t('viz.title')}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">{t('viz.subtitle')}</p>
                </div>
            </motion.div>

            {/* Controls */}
            <motion.div variants={staggerItem} className="card">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('viz.viewMode')}</label>
                        <select
                            value={viewMode}
                            onChange={(e) => setViewMode(e.target.value as 'protein' | 'comparison')}
                            className="input w-48"
                        >
                            <option value="protein">{t('viz.proteinChain')}</option>
                            <option value="comparison">{t('viz.compareProteins')}</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* No sequence warning */}
            {!hasSequence1 && (
                <motion.div variants={staggerItem} className="card bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        <div>
                            <h3 className="font-medium text-amber-800 dark:text-amber-300">{t('viz.noSequence')}</h3>
                            <p className="text-sm text-amber-700 dark:text-amber-400">
                                {t('viz.noSequenceDesc')}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* 3D Viewer */}
            <motion.div variants={staggerItem} className="card p-0 overflow-hidden">
                <div className="viewer-container relative">
                    <Suspense fallback={<LoadingScreen />}>
                        <Canvas camera={{ position: [30, 25, 30], fov: 50 }} key={viewMode}>
                            <OrbitControls
                                enablePan={true}
                                enableZoom={true}
                                enableRotate={true}
                                autoRotate={true}
                                autoRotateSpeed={0.5}
                                minDistance={10}
                                maxDistance={150}
                                target={[0, 20, 0]}
                            />
                            <ambientLight intensity={0.6} />
                            <pointLight position={[10, 10, 10]} intensity={1.2} />
                            <pointLight position={[-10, -10, -10]} intensity={0.6} />

                            <AnimatePresence>
                                {viewMode === 'protein' && protein1 && (
                                    <ProteinChain
                                        sequence={protein1.substring(0, 100)}
                                        offset={[0, 0, 0]}
                                    />
                                )}

                                {viewMode === 'comparison' && protein1 && (
                                    <>
                                        <ProteinChain
                                            sequence={protein1.substring(0, 100)}
                                            offset={[-5, 0, 0]}
                                            comparisonSequence={protein2.substring(0, 100)}
                                            color="#0d9488"
                                        />
                                        {protein2 && (
                                            <ProteinChain
                                                sequence={protein2.substring(0, 100)}
                                                offset={[5, 0, 0]}
                                                comparisonSequence={protein1.substring(0, 100)}
                                                color="#6366f1"
                                            />
                                        )}
                                    </>
                                )}
                            </AnimatePresence>

                            {/* Grid helper - more subtle */}
                            <gridHelper args={[50, 50, '#1e293b', '#0f172a']} />
                        </Canvas>
                    </Suspense>

                    {/* View Mode Info Card */}
                    {showInfoCard ? (
                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/60 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 py-1.5 sm:px-4 sm:py-3 text-white max-w-[10rem] sm:max-w-xs">
                            <div className="flex items-start gap-1.5 sm:gap-2">
                                <Info className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 text-teal-400 flex-shrink-0" />
                                <div className="text-xs sm:text-sm flex-1">
                                    {viewMode === 'protein' && (
                                        <>
                                            <strong className="text-teal-400">{t('viz.proteinChain')}</strong>
                                            <p className="text-slate-300 mt-1">{t('viz.proteinChainDesc')}</p>
                                        </>
                                    )}
                                    {viewMode === 'comparison' && (
                                        <>
                                            <strong className="text-teal-400">{t('viz.compareProteins')}</strong>
                                            <p className="text-slate-300 mt-1">{t('viz.compareProteinsDesc')}</p>
                                        </>
                                    )}
                                </div>
                                <button
                                    onClick={() => setShowInfoCard(false)}
                                    className="text-slate-400 hover:text-white transition-colors p-0.5 -mr-1 -mt-0.5"
                                    aria-label="Close"
                                >
                                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowInfoCard(true)}
                            className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/60 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 text-teal-400 hover:text-teal-300 transition-colors"
                            aria-label="Show info"
                        >
                            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    )}

                    {/* Controls overlay */}
                    <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-black/60 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 py-1.5 sm:px-4 sm:py-3 text-white text-xs sm:text-sm">
                        <p className="text-slate-300">{t('viz.autoRotateHint')}</p>
                    </div>
                </div>
            </motion.div>

            {/* Legend */}
            <motion.div variants={staggerItem} className="card">
                <h2 className="card-header">
                    <Palette className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    <span>{t('viz.colorLegend')}</span>
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/30">
                        <div className="w-8 h-8 rounded-full bg-yellow-400"></div>
                        <div>
                            <div className="font-medium text-slate-800 dark:text-slate-200">{t('single.hydrophobic')}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">A, V, I, L, M, F, W, P</div>
                        </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/30">
                        <div className="w-8 h-8 rounded-full bg-cyan-400"></div>
                        <div>
                            <div className="font-medium text-slate-800 dark:text-slate-200">{t('single.polar')}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">S, T, C, Y, N, Q</div>
                        </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/30">
                        <div className="w-8 h-8 rounded-full bg-red-400"></div>
                        <div>
                            <div className="font-medium text-slate-800 dark:text-slate-200">{t('single.positive')}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">K, R, H</div>
                        </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/30">
                        <div className="w-8 h-8 rounded-full bg-purple-400"></div>
                        <div>
                            <div className="font-medium text-slate-800 dark:text-slate-200">{t('single.negative')}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">D, E</div>
                        </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/30">
                        <div className="w-8 h-8 rounded-full bg-green-400"></div>
                        <div>
                            <div className="font-medium text-slate-800 dark:text-slate-200">{t('single.special')}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">G (Glycine)</div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Protein sequences display */}
            {(protein1 || protein2) && (
                <motion.div variants={staggerItem} className="card">
                    <h2 className="card-header">
                        <FlaskConical className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                        <span>{t('viz.proteinSequences')}</span>
                    </h2>
                    <div className="space-y-4">
                        {protein1 && (
                            <div>
                                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Protein 1: {sequenceData.header1 || 'Sequence 1'} ({protein1.length} aa)
                                </h3>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 overflow-x-auto">
                                    <div className="protein-sequence">
                                        {protein1.split('').map((aa, index) => (
                                            <motion.span
                                                key={index}
                                                whileHover={{ scale: 1.2 }}
                                                className={`amino-acid ${getAminoAcidColorClass(aa)}`}
                                                title={`${aa} - ${AMINO_ACID_PROPERTIES[aa]?.name || 'Unknown'}`}
                                            >
                                                {aa}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {protein2 && (
                            <div>
                                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Protein 2: {sequenceData.header2 || 'Sequence 2'} ({protein2.length} aa)
                                </h3>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 overflow-x-auto">
                                    <div className="protein-sequence">
                                        {protein2.split('').map((aa, index) => (
                                            <motion.span
                                                key={index}
                                                whileHover={{ scale: 1.2 }}
                                                className={`amino-acid ${getAminoAcidColorClass(aa)}`}
                                                title={`${aa} - ${AMINO_ACID_PROPERTIES[aa]?.name || 'Unknown'}`}
                                            >
                                                {aa}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Visualization;
