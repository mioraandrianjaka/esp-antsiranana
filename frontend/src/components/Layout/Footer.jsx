// frontend/src/components/Layout/Footer.jsx
import React from 'react';

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-info">
                        <h3>ESP Antsiranana</h3>
                        <p>Ecole Superieure Polytechnique d'Antsiranana</p>
                        <p>Depuis 1976</p>
                    </div>
                    <div className="footer-contact">
                        <h3>Contact</h3>
                        <p>Adresse: Lazaret CUR Antsiranana, 201</p>
                        <p>Telephone: +261 32 98 089 95</p>
                        <p>Email: secretariat.direction@espantsiranana.mg</p>
                    </div>
                    <div className="footer-hours">
                        <h3>Horaires</h3>
                        <p>Lundi - Vendredi: 07h30 - 11h30</p>
                        <p>et 14h30 - 17h30</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>copyright 2025 - Ecole Superieure Polytechnique d'Antsiranana</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;