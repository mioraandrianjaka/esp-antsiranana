// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Accueil from './components/Public/Accueil';
import FormationsList from './components/Public/FormationsList';
import FormationDetail from './components/Public/FormationDetail';
import Inscription from './components/Public/Inscription';
import EmploiTemps from './components/Public/EmploiTemps';
import Resultats from './components/Public/Resultats';
import CoursClasse from './components/Public/CoursClasse';
import Alumni from './components/Public/Alumni';
import AdminLogin from './components/Admin/AdminLogin';
import Dashboard from './components/Admin/Dashboard';
import Actualites from './components/Public/Actualites.jsx';
import './styles/index.css';

function App() {
    return (
        <Router>
            <Header />
            <main style={{ minHeight: 'calc(100vh - 200px)' }}>
                <Routes>
                    <Route path="/" element={<Accueil />} />
                    <Route path="/formations" element={<FormationsList />} />
                    <Route path="/formations/:code" element={<FormationDetail />} />
                    <Route path="/inscription" element={<Inscription />} />
                    <Route path="/emploi-temps" element={<EmploiTemps />} />
                    <Route path="/resultats" element={<Resultats />} />
                    <Route path="/cours" element={<CoursClasse />} />
                    <Route path="/alumni" element={<Alumni />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/*" element={<Dashboard />} />
                    <Route path="/actualites" element={<Actualites />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App; 