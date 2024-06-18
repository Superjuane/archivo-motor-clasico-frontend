import React from 'react';
import './Contact.css';

const Contact = () => {
    return (
        <div className='Contact-container'>
            <h1>Contacto</h1>
            <p>Para cualquier consulta, solicitud de información o ejercicio de derechos relacionados con sus datos personales, puede ponerse en contacto con nosotros a través de los siguientes medios:</p>
            <div className="Contact-Point">
                <h2>Datos de Contacto</h2>
                <p>Archivo Motor Clásico</p>
                <p>Dirección: ... </p>
                <p>Teléfono: +34 65 00 ·· ···</p>
                <p>Correo Electrónico: archivomotorclasico@gmail.com</p>
            </div>
            <div className="Contact-Point">
                <h2>Formulario de Contacto</h2>
                <p>Puede también enviarnos un mensaje a través de nuestro <a className='Contact-Point-link' href="[URL del Formulario de Contacto]">formulario de contacto</a> disponible en el sitio web.</p>
            </div>
            <div className="Contact-Point">
                <h2>Redes Sociales</h2>
                <p>Síganos en nuestras redes sociales para estar al día con las últimas novedades y eventos:</p>
                <ul>
                    <li><a href="[URL de Facebook]" className='Contact-Point-link'>Facebook</a></li>
                    <li><a href="[URL de Twitter]" className='Contact-Point-link'>Twitter</a></li>
                    <li><a href="[URL de Instagram]" className='Contact-Point-link'>Instagram</a></li>
                </ul>
            </div>
            <div className="Contact-Point">
                <h2>Horario de Atención</h2>
                <p>Nuestro horario de atención al público es:</p>
                <ul>
                    <li>Lunes a Viernes: 9:00 - 18:00</li>
                    <li>Sábados: 10:00 - 14:00</li>
                    <li>Domingos y Festivos: Cerrado</li>
                </ul>
            </div>
        </div>
    );
};

export default Contact;