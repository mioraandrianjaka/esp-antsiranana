// frontend/src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
    throw new Error('REACT_APP_API_URL is not defined. Please set it in your .env file.');
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token aux requetes admin
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Routes publiques
export const getActualites = () => api.get('/actualites');
export const getFormations = () => api.get('/formations');
export const getFormationByCode = (code) => api.get(`/formations/${code}`);
export const getClasses = () => api.get('/classes');
export const getEmploiTemps = (classe) => api.get('/emploi-temps', { params: { classe } });
export const getResultats = (classe) => api.get('/resultats', { params: { classe } });
export const verifyCoursPassword = (data) => api.post('/cours/verify', data);
export const adminUpdatePassword = (data) => api.post('/admin/change-password', data);
export const getCoursFiles = (idClasse) => api.get(`/cours/${idClasse}`);
export const uploadCoursFile = (formData) => api.post('/cours/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const getInscriptionStatut = () => api.get('/inscriptions/statut');
export const submitInscription = (data) => api.post('/inscriptions', data);
export const getAlumni = () => api.get('/alumni');
export const submitAlumni = (data) => api.post('/alumni', data);

// Routes admin
export const adminLogin = (data) => api.post('/admin/login', data);
export const adminGetActualites = () => api.get('/admin/actualites');
export const adminCreateActualite = (formData) => api.post('/admin/actualites', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const adminUpdateActualite = (id, data) => api.put(`/admin/actualites/${id}`, data);
export const adminDeleteActualite = (id) => api.delete(`/admin/actualites/${id}`);
export const adminGetClasses = () => api.get('/admin/classes');
export const adminUpdateClassePassword = (id, data) => api.put(`/admin/classes/${id}/motdepasse`, data);
export const adminUploadEmploiTemps = (formData) => api.post('/admin/emploi-temps', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const adminUploadResultats = (formData) => api.post('/admin/resultats', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const adminGetInscriptions = () => api.get('/admin/inscriptions');
export const adminUpdateInscriptionStatus = (id, data) => api.put(`/admin/inscriptions/${id}/statut`, data);
export const adminGetParametres = () => api.get('/admin/parametres');
export const adminUpdateParametre = (cle, data) => api.put(`/admin/parametres/${cle}`, data);
export const adminGetPendingAlumni = () => api.get('/admin/alumni');
export const adminValidateAlumni = (id) => api.put(`/admin/alumni/${id}/valider`);
export const adminDeleteAlumni = (id) => api.delete(`/admin/alumni/${id}`);

export default api;