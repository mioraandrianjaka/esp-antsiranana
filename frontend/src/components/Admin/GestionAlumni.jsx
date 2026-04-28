import React, { useState, useEffect } from 'react';
import { adminGetPendingAlumni, adminValidateAlumni, adminDeleteAlumni } from '../../services/api';

function GestionAlumni() {
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);

    const chargerAlumni = async () => {
        try {
            const res = await adminGetPendingAlumni();
            setAlumni(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        chargerAlumni();
    }, []);

    const handleValidate = async (id) => {
        try {
            await adminValidateAlumni(id);
            chargerAlumni();
            alert('Alumni valide');
        } catch (err) {
            alert('Erreur');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cette contribution ?')) {
            try {
                await adminDeleteAlumni(id);
                chargerAlumni();
            } catch (err) {
                alert('Erreur');
            }
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div>
            <h2>Contributions Alumni (en attente)</h2>
            {alumni.length === 0 ? (
                <div className="card">Aucune contribution en attente</div>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Nom complet</th>
                            <th>Filiere</th>
                            <th>Promotion</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alumni.map(a => (
                            <tr key={a.id_alumni}>
                                <td>{new Date(a.submitted_at).toLocaleDateString()}</td>
                                <td>{a.nom_complet}</td>
                                <td>{a.filiere}</td>
                                <td>{a.promotion || '-'}</td>
                                <td>{a.email || '-'}</td>
                                <td>
                                    <button className="btn-edit" onClick={() => handleValidate(a.id_alumni)}>Valider</button>
                                    <button className="btn-delete" onClick={() => handleDelete(a.id_alumni)}>Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default GestionAlumni;