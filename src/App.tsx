import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/Layout.tsx';
import SingleSequenceAnalysis from './pages/SingleSequenceAnalysis.tsx';
import TwoSequenceComparison from './pages/TwoSequenceComparison.tsx';
import Visualization from './pages/Visualization.tsx';
import Home from './pages/Home.tsx';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

export interface SequenceData {
    sequence1: string;
    sequence2: string;
    header1: string;
    header2: string;
}

function App() {
    const [sequenceData, setSequenceData] = useState<SequenceData>({
        sequence1: '',
        sequence2: '',
        header1: '',
        header2: '',
    });

    return (
        <ThemeProvider>
            <LanguageProvider>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route
                                path="/single"
                                element={
                                    <SingleSequenceAnalysis
                                        sequenceData={sequenceData}
                                        setSequenceData={setSequenceData}
                                    />
                                }
                            />
                            <Route
                                path="/compare"
                                element={
                                    <TwoSequenceComparison
                                        sequenceData={sequenceData}
                                        setSequenceData={setSequenceData}
                                    />
                                }
                            />
                            <Route
                                path="/visualize"
                                element={
                                    <Visualization
                                        sequenceData={sequenceData}
                                    />
                                }
                            />
                        </Routes>
                    </Layout>
                </Router>
            </LanguageProvider>
        </ThemeProvider>
    );
}

export default App;
