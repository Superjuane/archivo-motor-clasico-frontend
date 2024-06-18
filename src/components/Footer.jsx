import React from "react";
import "./Footer.css";
import { FaInstagram, FaLinkedin, FaGoogle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
    <footer className="Footer">
      <div className="Footer-content">
        <h3>Archivo Motor Clásico</h3>
        <p>
          hecho por Juane Olivan Lázaro
        </p>
        <ul className="Footer-socials">
          <li>
            <a href="#">
              <FaGoogle size={30} color="#DB4437" />
            </a>
          </li>
          {/* <li>
            <a href="#">
              <FaInstagram size={30} color="#C13584" />
            </a>
          </li>
          <li>
            <a href="#">
              <FaInstagram size={30} color="#C13584" />
            </a>
          </li> */}
          <li>
            <a href="#">
              <FaInstagram size={30} color="#C13584" />
            </a>
          </li>
          <li>
            <a href="#">
              <FaLinkedin size={30} color="#0077B5" />
            </a>
          </li>
        </ul>
      </div>
      <div className="Footer-bottom">
        <p>
          copyright &copy; <a href="/"> ArchivoMotorClásico</a>{" "}
        </p>
        <div className="Footer-menu">
          <ul className="f-menu">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/privacy">Política de privacidad y Aviso legal</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
