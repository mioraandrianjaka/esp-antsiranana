import React from 'react';
import { Link } from 'react-router-dom';
import { 
    FaHome, 
    FaGraduationCap, 
    FaNewspaper, 
    FaUserPlus, 
    FaCalendarAlt, 
    FaLock,
    FaLaptop,
    FaChartLine
} from 'react-icons/fa';

function Header() {
    return (
        <header className="header-white">
            <div className="container header-container">
                <Link to="/" className="logo-white">
                    <img src="/images/logo-esp.jpg" alt="ESP Antsiranana" className="logo-img" />
                </Link>
                <nav className="nav-white">
                    <Link to="/"><FaHome /> Accueil</Link>
                    <Link to="/actualites"><FaNewspaper /> Actualités</Link>
                    <Link to="/inscription"><FaUserPlus /> Inscription</Link>
                    <Link to="/formations"><FaGraduationCap /> Formation</Link>
                    <Link to="/cours"><FaLaptop /> Accès Cours</Link>
                    <Link to="/emploi-temps"><FaCalendarAlt /> EDT</Link>
                    <Link to="/resultats"><FaChartLine /> Résultats</Link>
                    <Link to="/admin/login"><FaLock /> Admin</Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;