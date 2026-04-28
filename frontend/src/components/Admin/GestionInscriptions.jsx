import React, { useState, useEffect } from 'react';
import { adminGetInscriptions, adminUpdateInscriptionStatus } from '../../services/api';

function GestionInscriptions() {
    const [inscriptions, setInscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const chargerInscriptions = async () => {
        try {
            const res = await adminGetInscriptions();
            setInscriptions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        chargerInscriptions();
    }, []);

    const handleUpdateStatus = async (id, statut) => {
        try {
            await adminUpdateInscriptionStatus(id, { statut });
            chargerInscriptions();
            alert(`Inscription ${statut === 'approved' ? 'validee' : 'rejetee'}`);
        } catch (err) {
            alert('Erreur');
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;

    const getStatusBadge = (statut) => {
        const styles = {
            pending: { background: '#ffc107', color: '#333' },
            approved: { background: '#28a745', color: 'white' },
            rejected: { background: '#dc3545', color: 'white' }
        };
        const labels = {
            pending: 'En attente',
            approved: 'Validee',
            rejected: 'Rejetee'
        };
        return (
            <span style={{ padding: '4px 8px', borderRadius: '4px', ...styles[statut] }}>
                {labels[statut]}
            </span>
        );
    };

    return (
        <div>
            <h2>Gestion des inscriptions</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Classe</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inscriptions.length === 0 ? (
                        <tr><td colSpan="6" style={{ textAlign: 'center' }}>Aucune inscription</td></tr>
                    ) : (
                        inscriptions.map(i => (
                            <tr key={i.id_inscription}>
                                <td>{new Date(i.date_inscription).toLocaleDateString()}</td>
                                <td>{i.nom} {i.prenom}</td>
                                <td>{i.email}</td>
                                <td>{i.classe_nom || '-'}</td>
                                <td>{getStatusBadge(i.statut)}</td>
                                <td>
                                    {i.statut === 'pending' && (
                                        <>
                                            <button className="btn-edit" onClick={() => handleUpdateStatus(i.id_inscription, 'approved')}>
                                                Valider
                                            </button>
                                            <button className="btn-delete" onClick={() => handleUpdateStatus(i.id_inscription, 'rejected')}>
                                                Rejeter
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default GestionInscriptions;