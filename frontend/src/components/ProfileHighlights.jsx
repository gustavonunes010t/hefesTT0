const highlights = [
  {
    title: "Dúvidas",
    text: "Primeira conversa para entender seu momento."
  },
  {
    title: "Clientes",
    text: "Processo próximo, visual e organizado."
  },
  {
    title: "Orçamentos",
    text: "Atendimento direto pelo WhatsApp."
  },
  {
    title: "Anápolis GO",
    text: "Projetos locais e acompanhamento à distância."
  }
];

export default function ProfileHighlights() {
  return (
    <section className="profile-highlights">
      {highlights.map((item) => (
        <article key={item.title}>
          <span className="highlight-mark" aria-hidden="true" />
          <div>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
