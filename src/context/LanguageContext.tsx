import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.single': 'Single Analysis',
        'nav.compare': 'Compare',
        'nav.visualize': '3D View',

        // Home page
        'home.badge': 'Bioinformatics Analysis Tool',
        'home.title1': 'DNA Sequence',
        'home.title2': 'Analysis Tool',
        'home.subtitle': 'A powerful web application for analyzing DNA sequences, detecting Open Reading Frames, translating proteins, and visualizing molecular structures in stunning 3D.',
        'home.startAnalysis': 'Start Analysis',
        'home.viewGithub': 'Source Code',
        'home.codons': 'Codons Supported',
        'home.aminoAcids': 'Amino Acids',
        'home.readingFrames': 'Reading Frames',
        'home.visualization': 'Visualization',
        'home.featuresTitle': 'Powerful Analysis Features',
        'home.featuresSubtitle': 'Everything you need for comprehensive DNA sequence analysis in one place',
        'home.feature1.title': 'Single Sequence Analysis',
        'home.feature1.desc': 'Comprehensive DNA analysis with statistics, codon mapping, ORF detection, and protein translation.',
        'home.feature2.title': 'Sequence Comparison',
        'home.feature2.desc': 'Advanced alignment algorithms to detect mutations, classify changes, and compare protein sequences.',
        'home.feature3.title': '3D Visualization',
        'home.feature3.desc': 'Interactive WebGL-powered 3D protein visualization with real-time rotation and zoom.',
        'home.explore': 'Explore',
        'home.capabilitiesTitle': 'Comprehensive Capabilities',
        'home.capabilitiesSubtitle': 'From basic statistics to advanced protein analysis',
        'home.cap1': 'GC/AT content analysis',
        'home.cap2': 'Reverse complement',
        'home.cap3': 'ORF detection',
        'home.cap4': 'Protein translation',
        'home.cap5': 'Codon identification',
        'home.cap6': 'Mutation classification',
        'home.cap7': 'Mutation rate analysis',
        'home.cap8': 'Color-coded visualization',
        'home.demoTitle': 'Try It With a Sample Sequence',
        'home.demoSubtitle': 'Get started instantly with a sample human insulin gene sequence. See the power of our analysis tools in action.',
        'home.demoPoint1': 'Instant analysis results',
        'home.demoPoint2': 'Accurate codon translation',
        'home.demoPoint3': 'Works in any browser',
        'home.trySample': 'Try Sample Sequence',
        'home.ctaTitle': 'Ready to Analyze Your DNA Sequences?',
        'home.ctaSubtitle': 'Start exploring your genetic data with powerful analysis tools and beautiful visualizations.',
        'home.getStarted': 'Get Started Now',

        // Single Sequence Analysis
        'single.title': 'Single Sequence Analysis',
        'single.subtitle': 'Analyze a single DNA sequence for statistics, codons, ORFs, and protein translation',
        'single.inputTitle': 'Input Sequence',
        'single.inputLabel': 'Enter DNA sequence (FASTA format or raw sequence)',
        'single.uploadFasta': 'Upload FASTA',
        'single.loadSample': 'Load Sample',
        'single.clear': 'Clear',
        'single.analyze': 'Analyze Sequence',
        'single.readingFrame': 'Reading Frame:',
        'single.minOrfLength': 'Min ORF Length:',
        'single.sequence': 'Sequence:',
        'single.statsTitle': 'Sequence Statistics',
        'single.length': 'Length (bp)',
        'single.adenine': 'Adenine (A)',
        'single.thymine': 'Thymine (T)',
        'single.cytosine': 'Cytosine (C)',
        'single.guanine': 'Guanine (G)',
        'single.gcContent': 'GC Content',
        'single.atContent': 'AT Content',
        'single.codons': 'Codons',
        'single.originalSeq': 'Original Sequence (5\' → 3\')',
        'single.reverseComp': 'Reverse Complement (3\' → 5\')',
        'single.codonsTitle': 'Codons (Frame',
        'single.startCodon': 'Start codon',
        'single.stopCodon': 'Stop codon',
        'single.orfsTitle': 'Open Reading Frames (ORFs)',
        'single.orfsFound': 'Found {count} ORF(s) with minimum length of {length} bp',
        'single.noOrfs': 'No ORFs found with the current minimum length setting.',
        'single.proteinTitle': 'Translated Protein Sequence (Frame',
        'single.hydrophobic': 'Hydrophobic',
        'single.polar': 'Polar',
        'single.positive': 'Positive',
        'single.negative': 'Negative',
        'single.special': 'Special',
        'single.stop': 'Stop',
        'single.proteinLength': 'Length:',
        'single.aminoAcids': 'amino acids',
        'single.viewIn3D': 'View in 3D',

        // Table headers
        'table.id': 'ID',
        'table.frame': 'Frame',
        'table.strand': 'Strand',
        'table.start': 'Start',
        'table.end': 'End',
        'table.length': 'Length',
        'table.protein': 'Protein',
        'table.position': 'Position',
        'table.original': 'Original',
        'table.mutated': 'Mutated',
        'table.type': 'Type',
        'table.classification': 'Classification',

        // Two Sequence Comparison
        'compare.title': 'Two-Sequence Comparison',
        'compare.subtitle': 'Compare two DNA sequences to detect mutations and analyze differences',
        'compare.inputTitle': 'Input Sequences',
        'compare.seq1Label': 'Sequence 1 (Original)',
        'compare.seq2Label': 'Sequence 2 (Mutated/Compared)',
        'compare.upload': 'Upload',
        'compare.loadSamples': 'Load Samples',
        'compare.compareBtn': 'Compare Sequences',
        'compare.mutationStats': 'Mutation Statistics',
        'compare.totalMutations': 'Total Mutations',
        'compare.mutationRate': 'Mutation Rate',
        'compare.transitions': 'Transitions',
        'compare.transversions': 'Transversions',
        'compare.insertions': 'Insertions',
        'compare.deletions': 'Deletions',
        'compare.alignmentTitle': 'Sequence Alignment',
        'compare.transition': 'Transition',
        'compare.transversion': 'Transversion',
        'compare.insertion': 'Insertion',
        'compare.deletion': 'Deletion',
        'compare.mutationDetails': 'Mutation Details',
        'compare.noMutations': 'No mutations detected - sequences are identical.',
        'compare.showingFirst': 'Showing first 50 of {count} mutations',
        'compare.orfComparison': 'ORF Comparison',
        'compare.seq1Orfs': 'Sequence 1 ORFs',
        'compare.seq2Orfs': 'Sequence 2 ORFs',
        'compare.noOrfsFound': 'No ORFs found',
        'compare.proteinComparison': 'Protein Sequence Comparison',
        'compare.protein1': 'Protein 1',
        'compare.protein2': 'Protein 2',
        'compare.diffSeq1': 'Different in Seq1',
        'compare.diffSeq2': 'Different in Seq2',
        'compare.viewIn3D': 'View in 3D',

        // Visualization
        'viz.title': '3D Visualization',
        'viz.subtitle': 'Interactive 3D view of protein structures',
        'viz.viewMode': 'View Mode:',
        'viz.proteinChain': 'Protein Chain',
        'viz.dnaHelix': 'DNA Helix',
        'viz.compareProteins': 'Compare Proteins',
        'viz.showLabels': 'Show Labels',
        'viz.noSequence': 'No Sequence Data',
        'viz.noSequenceDesc': 'Please analyze a sequence first in the Single Sequence Analysis or Two-Sequence Comparison tab.',
        'viz.colorLegend': 'Color Legend',
        'viz.proteinSequences': 'Protein Sequences',
        'viz.proteinChainDesc': 'Shows the translated protein as a 3D alpha-helix structure. Each sphere represents an amino acid, colored by its chemical properties.',
        'viz.dnaHelixDesc': 'Displays the iconic double helix structure of DNA. The two strands (teal & indigo) are connected by colored base pairs (A-T and G-C).',
        'viz.compareProteinsDesc': 'Shows two protein chains side by side. Highlighted spheres indicate positions where amino acids differ between the sequences.',
        'viz.autoRotateHint': 'Auto-rotating • Scroll to zoom • Drag to pause rotation',

        // Footer
        'footer.builtBy': 'Built by INEZARENE Hamed Abdelaziz',
        'footer.copyright': '© 2026 DNA Sequence Analysis Tool',
    },
    fr: {
        // Navigation
        'nav.home': 'Accueil',
        'nav.single': 'Analyse Simple',
        'nav.compare': 'Comparer',
        'nav.visualize': 'Vue 3D',

        // Home page
        'home.badge': 'Outil d\'Analyse Bioinformatique',
        'home.title1': 'Séquence ADN',
        'home.title2': 'Outil d\'Analyse',
        'home.subtitle': 'Une application web puissante pour analyser les séquences ADN, détecter les cadres de lecture ouverts, traduire les protéines et visualiser les structures moléculaires en 3D.',
        'home.startAnalysis': 'Commencer l\'Analyse',
        'home.viewGithub': 'Voir le Code Source',
        'home.codons': 'Codons Supportés',
        'home.aminoAcids': 'Acides Aminés',
        'home.readingFrames': 'Cadres de Lecture',
        'home.visualization': 'Visualisation',
        'home.featuresTitle': 'Fonctionnalités Puissantes',
        'home.featuresSubtitle': 'Tout ce dont vous avez besoin pour une analyse complète des séquences ADN',
        'home.feature1.title': 'Analyse de Séquence Unique',
        'home.feature1.desc': 'Analyse ADN complète avec statistiques, cartographie des codons, détection ORF et traduction protéique.',
        'home.feature2.title': 'Comparaison de Séquences',
        'home.feature2.desc': 'Algorithmes d\'alignement avancés pour détecter les mutations, classifier les changements et comparer les séquences protéiques.',
        'home.feature3.title': 'Visualisation 3D',
        'home.feature3.desc': 'Visualisation 3D interactive des protéines avec rotation et zoom en temps réel.',
        'home.explore': 'Explorer',
        'home.capabilitiesTitle': 'Capacités Complètes',
        'home.capabilitiesSubtitle': 'Des statistiques de base à l\'analyse protéique avancée',
        'home.cap1': 'Analyse du contenu GC/AT',
        'home.cap2': 'Complément inverse',
        'home.cap3': 'Détection ORF',
        'home.cap4': 'Traduction protéique',
        'home.cap5': 'Identification des codons',
        'home.cap6': 'Classification des mutations',
        'home.cap7': 'Analyse du taux de mutation',
        'home.cap8': 'Visualisation colorée',
        'home.demoTitle': 'Essayez avec une Séquence Exemple',
        'home.demoSubtitle': 'Commencez instantanément avec un fragment du gène de l\'insuline humaine. Découvrez la puissance de nos outils d\'analyse.',
        'home.demoPoint1': 'Résultats d\'analyse instantanés',
        'home.demoPoint2': 'Traduction précise des codons',
        'home.demoPoint3': 'Fonctionne dans tout navigateur',
        'home.trySample': 'Essayer l\'Exemple',
        'home.ctaTitle': 'Prêt à Analyser vos Séquences ADN ?',
        'home.ctaSubtitle': 'Explorez vos données génétiques avec des outils d\'analyse puissants et de belles visualisations.',
        'home.getStarted': 'Commencer Maintenant',

        // Single Sequence Analysis
        'single.title': 'Analyse de Séquence Unique',
        'single.subtitle': 'Analysez une séquence ADN pour les statistiques, codons, ORFs et traduction protéique',
        'single.inputTitle': 'Séquence d\'Entrée',
        'single.inputLabel': 'Entrez la séquence ADN (format FASTA ou séquence brute)',
        'single.uploadFasta': 'Télécharger FASTA',
        'single.loadSample': 'Charger Exemple',
        'single.clear': 'Effacer',
        'single.analyze': 'Analyser la Séquence',
        'single.readingFrame': 'Cadre de Lecture :',
        'single.minOrfLength': 'Longueur Min ORF :',
        'single.sequence': 'Séquence :',
        'single.statsTitle': 'Statistiques de la Séquence',
        'single.length': 'Longueur (pb)',
        'single.adenine': 'Adénine (A)',
        'single.thymine': 'Thymine (T)',
        'single.cytosine': 'Cytosine (C)',
        'single.guanine': 'Guanine (G)',
        'single.gcContent': 'Contenu GC',
        'single.atContent': 'Contenu AT',
        'single.codons': 'Codons',
        'single.originalSeq': 'Séquence Originale (5\' → 3\')',
        'single.reverseComp': 'Complément Inverse (3\' → 5\')',
        'single.codonsTitle': 'Codons (Cadre',
        'single.startCodon': 'Codon de départ',
        'single.stopCodon': 'Codon stop',
        'single.orfsTitle': 'Cadres de Lecture Ouverts (ORFs)',
        'single.orfsFound': '{count} ORF(s) trouvé(s) avec une longueur minimale de {length} pb',
        'single.noOrfs': 'Aucun ORF trouvé avec le paramètre de longueur minimale actuel.',
        'single.proteinTitle': 'Séquence Protéique Traduite (Cadre',
        'single.hydrophobic': 'Hydrophobe',
        'single.polar': 'Polaire',
        'single.positive': 'Positif',
        'single.negative': 'Négatif',
        'single.special': 'Spécial',
        'single.stop': 'Stop',
        'single.proteinLength': 'Longueur :',
        'single.aminoAcids': 'acides aminés',
        'single.viewIn3D': 'Voir en 3D',

        // Table headers
        'table.id': 'ID',
        'table.frame': 'Cadre',
        'table.strand': 'Brin',
        'table.start': 'Début',
        'table.end': 'Fin',
        'table.length': 'Longueur',
        'table.protein': 'Protéine',
        'table.position': 'Position',
        'table.original': 'Original',
        'table.mutated': 'Muté',
        'table.type': 'Type',
        'table.classification': 'Classification',

        // Two Sequence Comparison
        'compare.title': 'Comparaison de Deux Séquences',
        'compare.subtitle': 'Comparez deux séquences ADN pour détecter les mutations et analyser les différences',
        'compare.inputTitle': 'Séquences d\'Entrée',
        'compare.seq1Label': 'Séquence 1 (Originale)',
        'compare.seq2Label': 'Séquence 2 (Mutée/Comparée)',
        'compare.upload': 'Télécharger',
        'compare.loadSamples': 'Charger Exemples',
        'compare.compareBtn': 'Comparer les Séquences',
        'compare.mutationStats': 'Statistiques des Mutations',
        'compare.totalMutations': 'Total Mutations',
        'compare.mutationRate': 'Taux de Mutation',
        'compare.transitions': 'Transitions',
        'compare.transversions': 'Transversions',
        'compare.insertions': 'Insertions',
        'compare.deletions': 'Délétions',
        'compare.alignmentTitle': 'Alignement des Séquences',
        'compare.transition': 'Transition',
        'compare.transversion': 'Transversion',
        'compare.insertion': 'Insertion',
        'compare.deletion': 'Délétion',
        'compare.mutationDetails': 'Détails des Mutations',
        'compare.noMutations': 'Aucune mutation détectée - les séquences sont identiques.',
        'compare.showingFirst': 'Affichage des 50 premières sur {count} mutations',
        'compare.orfComparison': 'Comparaison des ORFs',
        'compare.seq1Orfs': 'ORFs Séquence 1',
        'compare.seq2Orfs': 'ORFs Séquence 2',
        'compare.noOrfsFound': 'Aucun ORF trouvé',
        'compare.proteinComparison': 'Comparaison des Séquences Protéiques',
        'compare.protein1': 'Protéine 1',
        'compare.protein2': 'Protéine 2',
        'compare.diffSeq1': 'Différent dans Seq1',
        'compare.diffSeq2': 'Différent dans Seq2',
        'compare.viewIn3D': 'Voir en 3D',

        // Visualization
        'viz.title': 'Visualisation 3D',
        'viz.subtitle': 'Vue 3D interactive des structures protéiques',
        'viz.viewMode': 'Mode de Vue :',
        'viz.proteinChain': 'Chaîne Protéique',
        'viz.dnaHelix': 'Hélice ADN',
        'viz.compareProteins': 'Comparer Protéines',
        'viz.showLabels': 'Afficher Étiquettes',
        'viz.noSequence': 'Aucune Donnée de Séquence',
        'viz.noSequenceDesc': 'Veuillez d\'abord analyser une séquence dans l\'onglet Analyse de Séquence Unique ou Comparaison de Deux Séquences.',
        'viz.colorLegend': 'Légende des Couleurs',
        'viz.proteinSequences': 'Séquences Protéiques',
        'viz.proteinChainDesc': 'Affiche la protéine traduite sous forme de structure alpha-hélice 3D. Chaque sphère représente un acide aminé, coloré selon ses propriétés chimiques.',
        'viz.dnaHelixDesc': 'Affiche la structure emblématique de la double hélice de l\'ADN. Les deux brins (turquoise et indigo) sont reliés par des paires de bases colorées (A-T et G-C).',
        'viz.compareProteinsDesc': 'Affiche deux chaînes protéiques côte à côte. Les sphères surlignées indiquent les positions où les acides aminés diffèrent entre les séquences.',
        'viz.autoRotateHint': 'Rotation auto • Défiler pour zoomer • Glisser pour arrêter',

        // Footer
        'footer.builtBy': 'Construit par INEZARENE Hamed Abdelaziz',
        'footer.copyright': '© 2026 Outil d\'Analyse de Séquences ADN',
    },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('language') as Language;
            if (saved && (saved === 'en' || saved === 'fr')) {
                return saved;
            }
            // Check browser language
            const browserLang = navigator.language.substring(0, 2);
            return browserLang === 'fr' ? 'fr' : 'en';
        }
        return 'en';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
