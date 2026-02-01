import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import {
    Home,
    Dna,
    GitCompare,
    Box,
    Menu,
    X,
    Sun,
    Moon,
    Github,
    Sparkles,
    Languages
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();

    // Handle scroll effect for header
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const navItems = [
        { path: '/', label: t('nav.home'), icon: Home },
        { path: '/single', label: t('nav.single'), icon: Dna },
        { path: '/compare', label: t('nav.compare'), icon: GitCompare },
        { path: '/visualize', label: t('nav.visualize'), icon: Box },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <header
                className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50'
                    : 'bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 dark:from-teal-800 dark:via-emerald-800 dark:to-cyan-800'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                            <motion.div
                                className="relative"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                    className="w-8 h-8 sm:w-10 sm:h-10"
                                >
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                        <defs>
                                            <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor={scrolled ? '#0d9488' : '#ffffff'} />
                                                <stop offset="100%" stopColor={scrolled ? '#06b6d4' : '#a5f3fc'} />
                                            </linearGradient>
                                        </defs>
                                        <path
                                            d="M30 10 Q50 25 70 10 Q50 25 30 40 Q50 55 70 40 Q50 55 30 70 Q50 85 70 70 Q50 85 30 90"
                                            fill="none"
                                            stroke="url(#dnaGradient)"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M70 10 Q50 25 30 10 Q50 25 70 40 Q50 55 30 40 Q50 55 70 70 Q50 85 30 70 Q50 85 70 90"
                                            fill="none"
                                            stroke="url(#dnaGradient)"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </motion.div>
                                <motion.div
                                    className="absolute -top-1 -right-1"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Sparkles className={`w-3 h-3 sm:w-4 sm:h-4 ${scrolled ? 'text-amber-500' : 'text-amber-300'}`} />
                                </motion.div>
                            </motion.div>
                            <div>
                                <h1 className={`text-base sm:text-xl font-bold transition-colors ${scrolled ? 'text-slate-800 dark:text-white' : 'text-white'
                                    }`}>
                                    DNA Analyzer
                                </h1>
                                <p className={`text-[10px] sm:text-xs transition-colors ${scrolled ? 'text-slate-500 dark:text-slate-400' : 'text-teal-100'
                                    }`}>
                                    Sequence Analysis Tool
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="relative"
                                    >
                                        <motion.div
                                            className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200 ${scrolled
                                                ? isActive
                                                    ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30'
                                                    : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                : isActive
                                                    ? 'bg-white/20 text-white'
                                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                                                }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{item.label}</span>
                                        </motion.div>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className={`absolute -bottom-1 left-2 right-2 h-0.5 rounded-full ${scrolled ? 'bg-teal-500' : 'bg-white'
                                                    }`}
                                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right side actions */}
                        <div className="flex items-center gap-2">
                            {/* Language toggle */}
                            <motion.button
                                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                                className={`p-2 rounded-xl transition-colors flex items-center gap-1.5 ${scrolled
                                    ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Toggle language"
                            >
                                <Languages className="w-5 h-5" />
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={language}
                                        initial={{ y: -10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 10, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="text-xs font-bold uppercase"
                                    >
                                        {language}
                                    </motion.span>
                                </AnimatePresence>
                            </motion.button>

                            {/* Theme toggle */}
                            <motion.button
                                onClick={toggleTheme}
                                className={`p-2 rounded-xl transition-colors ${scrolled
                                    ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Toggle theme"
                            >
                                <AnimatePresence mode="wait">
                                    {theme === 'dark' ? (
                                        <motion.div
                                            key="sun"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Sun className="w-5 h-5" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="moon"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Moon className="w-5 h-5" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>

                            {/* Mobile menu button */}
                            <div className="md:hidden">
                                <motion.button
                                    className={`p-2 rounded-xl transition-colors ${scrolled
                                        ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        : 'text-white/80 hover:text-white hover:bg-white/10'
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label="Toggle mobile menu"
                                >
                                    <AnimatePresence mode="wait">
                                        {isMobileMenuOpen ? (
                                            <motion.div
                                                key="close"
                                                initial={{ rotate: -90, opacity: 0 }}
                                                animate={{ rotate: 0, opacity: 1 }}
                                                exit={{ rotate: 90, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <X className="w-6 h-6" />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="menu"
                                                initial={{ rotate: 90, opacity: 0 }}
                                                animate={{ rotate: 0, opacity: 1 }}
                                                exit={{ rotate: -90, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Menu className="w-6 h-6" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile navigation */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            className="md:hidden overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            <div className="flex flex-col px-4 py-3 gap-1">
                                {navItems.map((item, index) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <motion.div
                                            key={item.path}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link
                                                to={item.path}
                                                className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-all ${isActive
                                                    ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span>{item.label}</span>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Main content */}
            <main className="flex-1">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
                >
                    {children}
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 dark:bg-black text-slate-400 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Logo and description */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8">
                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                    <path
                                        d="M30 10 Q50 25 70 10 Q50 25 30 40 Q50 55 70 40 Q50 55 30 70 Q50 85 70 70 Q50 85 30 90"
                                        fill="none"
                                        stroke="#14b8a6"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M70 10 Q50 25 30 10 Q50 25 70 40 Q50 55 30 40 Q50 55 70 70 Q50 85 30 70 Q50 85 70 90"
                                        fill="none"
                                        stroke="#14b8a6"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">DNA Sequence Analysis Tool</p>
                                <p className="text-xs">INEZARENE Hamed Abdelaziz</p>
                            </div>
                        </div>

                        {/* Links */}
                        <div className="flex items-center gap-6 text-sm">
                            <span className="hidden sm:inline">{t('footer.builtBy')}</span>
                            <motion.a
                                href="https://github.com/Inzhamed/dna-sequence-analysis"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Github className="w-5 h-5" />
                                <span>GitHub</span>
                            </motion.a>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs">
                        <p>{t('footer.copyright')}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
