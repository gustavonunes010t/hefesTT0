import heroImage from "../assets/hero.png";
import { contactInfo } from "../config/contact";

export default function ArchitectBio() {
  return (
    <section className="architect-bio">
      <div className="bio-copy">
        <span>Bibliografia do arquiteto</span>
        <h2>{contactInfo.architectName}: design para fazer parte disso.</h2>
        <p>
          À frente da Hefestto Arquitetura, Kevyn desenvolve projetos com uma leitura
          sensível do morar: acolhimento, funcionalidade, luz, textura e memória.
          Atende em Anápolis GO e também à distância.
        </p>

        <div className="bio-tags">
          <span>Interiores</span>
          <span>Residencial</span>
          <span>Comercial</span>
          <span>Consultoria</span>
        </div>
      </div>

      <img src={heroImage} alt="Referência visual de arquitetura Hefestto" />
    </section>
  );
}
