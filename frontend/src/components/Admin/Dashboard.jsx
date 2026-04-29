import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
    FaTachometerAlt, 
    FaNewspaper, 
    FaChalkboardTeacher, 
    FaUserPlus, 
    FaCog,
    FaSignOutAlt, 
    FaUserLock,
    FaDatabase
} from 'react-icons/fa';
import GestionActualites from './GestionActualites';
import GestionClasses from './GestionClasses';
import GestionInscriptions from './GestionInscriptions';
import Parametres from './Parametres';
import DashboardAccueil from './DashboardAccueil';
import GestionDonnees from './GestionDonnees';

function Dashboard() {
    const navigate = useNavigate();
    const [adminEmail, setAdminEmail] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('adminEmail');
        if (!token) {
            navigate('/admin/login');
        } else {
            setAdminEmail(email || 'Admin');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('adminEmail');
        navigate('/admin/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 150px)' }}>
            <div className="admin-sidebar">
                <div className="admin-profile">
                    <div className="admin-avatar">
                        <FaUserLock size={32} />
                    </div>
                    <h4>{adminEmail}</h4>
                    <p>Administrateur</p>
                </div>
                <hr />
                <nav className="admin-nav">
                    <Link to="/admin">
                        <FaTachometerAlt /> Tableau de bord
                    </Link>
                    <Link to="/admin/actualites">
                        <FaNewspaper /> Actualités
                    </Link>
                    <Link to="/admin/classes">
                        <FaChalkboardTeacher /> Classes & Documents
                    </Link>
                    <Link to="/admin/donnees">
                        <FaDatabase /> Gestion données
                    </Link>
                    <Link to="/admin/inscriptions">
                        <FaUserPlus /> Inscriptions
                    </Link>
                    <Link to="/admin/parametres">
                        <FaCog /> Paramètres
                    </Link>
                </nav>
                <hr />
                <button onClick={handleLogout} className="logout-btn">
                    <FaSignOutAlt /> Déconnexion
                </button>
            </div>

            <div className="admin-content">
                <Routes>
                    <Route path="/" element={<DashboardAccueil />} />
                    <Route path="/actualites" element={<GestionActualites />} />
                    <Route path="/classes" element={<GestionClasses />} />
                    <Route path="/inscriptions" element={<GestionInscriptions />} />
                    <Route path="/donnees" element={<GestionDonnees />} />
                    <Route path="/parametres" element={<Parametres />} />
                </Routes>
            </div>
        </div>
    );
}

export default Dashboard;