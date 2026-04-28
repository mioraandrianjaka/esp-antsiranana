import React, { useState, useEffect } from 'react';
import { 
    FaNewspaper, 
    FaChalkboardTeacher, 
    FaUserPlus, 
    FaClock,
    FaCog
} from 'react-icons/fa';
import { 
    adminGetActualites, 
    adminGetClasses, 
    adminGetInscriptions
} from '../../services/api';

function DashboardAccueil() {
    const [stats, setStats] = useState({
        actualites: 0,
        classes: 0,
        inscriptions: 0,
        inscriptionsEnAttente: 0
    });
    const [recentActualites, setRecentActualites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        chargerStats();
    }, []);

    const chargerStats = async () => {
        try {
            const [actualitesRes, classesRes, inscriptionsRes] = await Promise.all([
                adminGetActualites(),
                adminGetClasses(),
                adminGetInscriptions()
            ]);

            const inscriptions = inscriptionsRes.data;
            const enAttente = inscriptions.filter(i => i.statut === 'pending').length;

            setStats({
                actualites: actualitesRes.data.length,
                classes: classesRes.data.length,
                inscriptions: inscriptions.length,
                inscriptionsEnAttente: enAttente
            });
            setRecentActualites(actualitesRes.data.slice(0, 5));
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Chargement du tableau de bord...</p>
            </div>
        );
    }

    const statCards = [
        { title: 'Actualités', value: stats.actualites, icon: <FaNewspaper />, color: '#3b82f6' },
        { title: 'Classes', value: stats.classes, icon: <FaChalkboardTeacher />, color: '#10b981' },
        { title: 'Inscriptions', value: stats.inscriptions, icon: <FaUserPlus />, color: '#f59e0b' },
        { title: 'Inscriptions en attente', value: stats.inscriptionsEnAttente, icon: <FaClock />, color: '#ef4444' }
    ];

    return (
        <div>
            <h2>Tableau de bord</h2>
            <p>Bienvenue dans l'espace d'administration de l'ESP Antsiranana</p>

            <div className="stats-grid">
                {statCards.map((card, index) => (
                    <div key={index} className="stat-card" style={{ borderLeftColor: card.color }}>
                        <div className="stat-icon" style={{ color: card.color }}>{card.icon}</div>
                        <div className="stat-info">
                            <h3>{card.value}</h3>
                            <p>{card.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="recent-section">
                <h3>Dernières actualités publiées</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Titre</th>
                            <th>Date</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentActualites.length === 0 ? (
                            <tr>
                                <td colSpan="3">Aucune actualité</td>
                            </tr>
                        ) : (
                            recentActualites.map(actu => (
                                <tr key={actu.id_actu}>
                                    <td>{actu.titre}</td>
                                    <td>{new Date(actu.date_publication).toLocaleDateString()}</td>
                                    <td><span className="badge-success">Publiée</span></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="quick-actions">
                <h3>Actions rapides</h3>
                <div className="actions-grid">
                    <a href="/admin/actualites" className="action-card">
                        <FaNewspaper /> Nouvelle actualité
                    </a>
                    <a href="/admin/classes" className="action-card">
                        <FaChalkboardTeacher /> Gérer les classes
                    </a>
                    <a href="/admin/inscriptions" className="action-card">
                        <FaUserPlus /> Voir les inscriptions
                    </a>
                    <a href="/admin/parametres" className="action-card">
                        <FaCog /> Paramètres
                    </a>
                </div>
            </div>
        </div>
    );
}

export default DashboardAccueil;