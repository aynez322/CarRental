import React from 'react';
import { IoLocationSharp } from 'react-icons/io5';
import './Contact.css';

export default function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-inner">
        <div className="contact-panel">
          <header className="contact-header">
            <h2>Contact</h2>
            <p>If you have questions or want to rent a car, contact us:</p>
          </header>

          <div className="contact-body">
            <div className="contact-left">
              <p className="contact-line"><strong>Office:  </strong>Str. Septimiu Mureșan 1-4, Cluj-Napoca, Romania</p>
              <p className="contact-line"><strong>Email:  </strong>
                <a href="mailto:info@carrentalcluj.ro">info@carrentalcluj.ro</a>
              </p>
              <p className="contact-line"><strong>Phone:  </strong>
                <a href="tel:+40750000000">+40 750 000 000</a>
              </p>
            </div>

            <div className="contact-right">
              <h3>Opening hours</h3>
              <p className="contact-line"><strong>Mon - Fri:</strong> 08:00 - 19:00</p>
              <p className="contact-line"><strong>Sat:</strong> 09:00 - 15:00</p>
              <p className="contact-line"><strong>Sun:</strong> Closed</p>
            </div>
          </div>
        </div>

        <div className="location-section">
          <div className="location-header">
            <IoLocationSharp className="location-icon" />
            <h3>Our location</h3>
          </div>
          <p className="location-subtitle">Cluj-Napoca, Romania</p>
          <div className="location-map">
            <iframe
              title="Our Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2732.6!2d23.6!3d46.77!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47490c1f916c0b8d%3A0x7e8b2f9a8c0d4e2a!2sStrada%20Septimiu%20Mure%C8%99an%201-4%2C%20Cluj-Napoca%2C%20Romania!5e0!3m2!1sen!2sro!4v1704988800000!5m2!1sen!2sro"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}