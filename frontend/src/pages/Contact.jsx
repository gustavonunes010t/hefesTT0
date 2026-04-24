import Navbar from "../components/Navbar";
import { contactInfo } from "../config/contact";

export default function Contact() {
  return (
    <>
      <Navbar />

      <main className="contact-page">
        <section className="contact-hero">
          <span>Fale comigo</span>
          <h1>Vamos arquitetar seus sonhos.</h1>
          <p>
            Orçamentos, dúvidas e primeiros passos pelo WhatsApp. Para acompanhar
            bastidores, clientes e referências, siga o Instagram da Hefestto.
          </p>

          <div className="contact-actions">
            <a className="primary-button" href={contactInfo.whatsappUrl} target="_blank" rel="noreferrer">
              Chamar no WhatsApp
            </a>
            <a className="ghost-button light" href={contactInfo.instagramUrl} target="_blank" rel="noreferrer">
              Ver Instagram
            </a>
          </div>
        </section>

        <section className="contact-grid">
          {contactInfo.email && (
            <a className="contact-card" href={`mailto:${contactInfo.email}`}>
              <span>Email</span>
              <strong>{contactInfo.email}</strong>
              <p>Envie briefing, plantas, imagens de referência e detalhes do imóvel.</p>
            </a>
          )}

          <a className="contact-card featured" href={contactInfo.whatsappUrl} target="_blank" rel="noreferrer">
            <span>WhatsApp</span>
            <strong>{contactInfo.whatsapp}</strong>
            <p>Canal direto para falar com {contactInfo.architectName} e iniciar seu atendimento.</p>
          </a>

          <a className="contact-card" href={contactInfo.instagramUrl} target="_blank" rel="noreferrer">
            <span>Instagram</span>
            <strong>@{contactInfo.instagram}</strong>
            <p>Acompanhe referências, bastidores, obras e projetos publicados.</p>
          </a>
        </section>
      </main>
    </>
  );
}
