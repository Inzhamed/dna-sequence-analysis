import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import {
  Dna,
  GitCompare,
  Box,
  ArrowRight,
  Sparkles,
  BarChart3,
  RefreshCw,
  Target,
  FlaskConical,
  Search,
  FileText,
  TrendingUp,
  Palette,
  Play,
  Github,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import {
  staggerContainer,
  staggerItem,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn
} from '../hooks/useScrollAnimation';
import { useLanguage } from '../context/LanguageContext';

// Animated DNA Helix Background Component
const DNAHelixBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute top-0 left-0 w-full h-full opacity-5 dark:opacity-10"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="helixGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        {[...Array(5)].map((_, i) => (
          <g key={i} transform={`translate(${i * 200}, 0)`}>
            <motion.path
              d="M100 0 Q150 100 100 200 Q50 300 100 400 Q150 500 100 600 Q50 700 100 800 Q150 900 100 1000"
              fill="none"
              stroke="url(#helixGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, delay: i * 0.2, ease: "easeInOut" }}
            />
            <motion.path
              d="M100 0 Q50 100 100 200 Q150 300 100 400 Q50 500 100 600 Q150 700 100 800 Q50 900 100 1000"
              fill="none"
              stroke="url(#helixGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, delay: i * 0.2 + 0.5, ease: "easeInOut" }}
            />
          </g>
        ))}
      </svg>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

const Home = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const { t } = useLanguage();

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const features = [
    {
      icon: Dna,
      title: t('home.feature1.title'),
      description: t('home.feature1.desc'),
      link: '/single',
      gradient: 'from-emerald-500 to-teal-600',
      bgGlow: 'group-hover:shadow-emerald-500/25',
    },
    {
      icon: GitCompare,
      title: t('home.feature2.title'),
      description: t('home.feature2.desc'),
      link: '/compare',
      gradient: 'from-blue-500 to-indigo-600',
      bgGlow: 'group-hover:shadow-blue-500/25',
    },
    {
      icon: Box,
      title: t('home.feature3.title'),
      description: t('home.feature3.desc'),
      link: '/visualize',
      gradient: 'from-violet-500 to-purple-600',
      bgGlow: 'group-hover:shadow-violet-500/25',
    },
  ];

  const capabilities = [
    { icon: BarChart3, text: t('home.cap1'), color: 'text-emerald-500' },
    { icon: RefreshCw, text: t('home.cap2'), color: 'text-cyan-500' },
    { icon: Target, text: t('home.cap3'), color: 'text-blue-500' },
    { icon: FlaskConical, text: t('home.cap4'), color: 'text-violet-500' },
    { icon: Search, text: t('home.cap5'), color: 'text-pink-500' },
    { icon: FileText, text: t('home.cap6'), color: 'text-orange-500' },
    { icon: TrendingUp, text: t('home.cap7'), color: 'text-red-500' },
    { icon: Palette, text: t('home.cap8'), color: 'text-amber-500' },
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <DNAHelixBackground />

        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-50 dark:from-transparent dark:via-slate-950/50 dark:to-slate-950"
          style={{ y: backgroundY }}
        />

        <div className="relative z-10 text-center max-w-5xl mx-auto py-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500/10 to-cyan-500/10 dark:from-teal-500/20 dark:to-cyan-500/20 border border-teal-500/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-teal-500" />
            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
              {t('home.badge')}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
              {t('home.title1')}
            </span>
            <br />
            <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              {t('home.title2')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t('home.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/single">
              <motion.button
                className="group relative px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-2xl font-semibold shadow-lg shadow-teal-500/25 overflow-hidden"
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(20, 184, 166, 0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  {t('home.startAnalysis')}
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>

            <motion.a
              href="https://github.com/Inzhamed/dna-sequence-analysis"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-semibold flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Github className="w-5 h-5" />
              {t('home.viewGithub')}
            </motion.a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-slate-300 dark:border-slate-700 flex justify-center pt-2"
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5], y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-teal-500"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24"
      >
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t('home.featuresTitle')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('home.featuresSubtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.link}
                variants={staggerItem}
                custom={index}
              >
                <Link to={feature.link} className="block h-full">
                  <motion.div
                    className={`group relative h-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl ${feature.bgGlow} transition-all duration-500`}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Gradient border on hover */}
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl`} />

                    {/* Icon */}
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                      {feature.description}
                    </p>

                    <motion.div
                      className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold"
                      whileHover={{ x: 5 }}
                    >
                      <span>{t('home.explore')}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Capabilities Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('home.capabilitiesTitle')}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {t('home.capabilitiesSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {capabilities.map((cap, index) => {
              const Icon = cap.icon;
              return (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="group relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 backdrop-blur-sm">
                    <Icon className={`w-8 h-8 ${cap.color} mb-4 group-hover:scale-110 transition-transform`} />
                    <p className="text-slate-300 text-sm font-medium">{cap.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Demo Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeInLeft}>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              {t('home.demoTitle')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              {t('home.demoSubtitle')}
            </p>

            <div className="space-y-4">
              {[
                { icon: Zap, text: t('home.demoPoint1') },
                { icon: Shield, text: t('home.demoPoint2') },
                { icon: Globe, text: t('home.demoPoint3') },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item.text}</span>
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              onClick={() => navigate('/single', { state: { loadSample: true } })}
              className="mt-8 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-teal-500/25"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-5 h-5" />
              {t('home.trySample')}
            </motion.button>
          </motion.div>

          <motion.div variants={fadeInRight}>
            <div className="relative">
              {/* Code block with glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-3xl blur-2xl"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <div className="relative bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800 overflow-hidden">
                {/* Terminal header */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-slate-500 text-sm font-mono">sample_sequence.fasta</span>
                </div>

                {/* Code content */}
                <div className="font-mono text-sm overflow-x-auto">
                  <div className="text-teal-400 mb-2">&gt;Human_Insulin_Gene</div>
                  <motion.div
                    className="text-slate-300 break-all leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-green-400">ATG</span>
                    <span className="text-emerald-400">GCC</span>
                    <span className="text-cyan-400">CTG</span>
                    <span className="text-teal-400">TGG</span>
                    <span className="text-green-400">ATG</span>
                    <span className="text-emerald-400">CGC</span>
                    <span className="text-cyan-400">CTC</span>
                    <span className="text-teal-400">CTG</span>
                    <span className="text-green-400">CCC</span>
                    <span className="text-emerald-400">CTG</span>
                    <span className="text-cyan-400">CTG</span>
                    <span className="text-teal-400">GCG</span>
                    <span className="text-green-400">CTG</span>
                    <span className="text-emerald-400">CTG</span>
                    <span className="text-cyan-400">GCC</span>
                    <span className="text-teal-400">CTC</span>
                    <span className="text-green-400">TGG</span>
                    <span className="text-emerald-400">GGA</span>
                    <span className="text-cyan-400">CCT</span>
                    <span className="text-teal-400">GAC</span>
                    <span className="text-slate-500">...</span>
                  </motion.div>
                </div>

                {/* Animated cursor */}
                <motion.div
                  className="inline-block w-2 h-5 bg-teal-500 ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={scaleIn}
        className="py-24"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 p-12 text-center">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('home.ctaTitle')}
            </h2>
            <p className="text-teal-100 max-w-2xl mx-auto mb-8">
              {t('home.ctaSubtitle')}
            </p>
            <Link to="/single">
              <motion.button
                className="px-8 py-4 bg-white text-teal-600 rounded-2xl font-bold shadow-lg flex items-center gap-2 mx-auto"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)' }}
                whileTap={{ scale: 0.95 }}
              >
                {t('home.getStarted')}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
