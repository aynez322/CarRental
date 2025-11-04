import React from 'react';
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
      </div>
    </section>
  );
}