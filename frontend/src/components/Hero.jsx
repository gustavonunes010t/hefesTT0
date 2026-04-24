import heroImage from "../assets/hero.png";
import { contactInfo } from "../config/contact";

export default function Hero() {
  return (
    <section
      className="hero"
      style={{ backgroundImage: `linear-gradient(90deg, rgba(30, 45, 29, 0.86) 0%, rgba(58, 76, 49, 0.52) 48%, rgba(30, 45, 29, 0.18) 100%), url(${heroImage})` }}
    >
      <div className="hero-content">
        <span className="hero-kicker">Anápolis GO + à distância</span>
        <h1>Arquitetura feita com tempo, intenção e cuidado.</h1>
        <p>
          Projetos que transformam rotina em aconchego: luz quente, materiais naturais
          e soluções pensadas para viver melhor.
        </p>

        <div className="hero-actions">
          <a className="primary-button" href={contactInfo.whatsappUrl} target="_blank" rel="noreferrer">
            Orçamento pelo WhatsApp
          </a>
          <a className="ghost-button light" href="#projetos">
            Ver projetos
          </a>
        </div>

        <div className="hero-signature">
          <strong>Design por @{contactInfo.instagram}</strong>
          <span>Residencial, comercial e interiores com alma brasileira.</span>
        </div>
      </div>
    </section>
  );
}
