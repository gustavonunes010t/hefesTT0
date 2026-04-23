export default function Hero() {
  return (
    <section style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 80px",
      background: "var(--bege)",
      position: "relative"
    }}>
      
      {/* TEXTO */}
      <div style={{ maxWidth: "520px" }}>
        <h1 style={{
          fontSize: "4.8rem",
          lineHeight: "1.05",
          margin: 0,
          letterSpacing: "-1px"
        }}>
          Arquitetura com <br /> identidade natural
        </h1>

        <p style={{
          marginTop: "25px",
          color: "#666",
          fontSize: "1rem"
        }}>
          Projetos pensados com tempo, intenção e respeito ao espaço.
        </p>
      </div>

      {/* IMAGEM */}
      <img 
        src="/images/projeto1.png"
        style={{
          width: "48%",
          height: "75vh",
          objectFit: "cover",
          borderRadius: "16px",
          boxShadow: "0 30px 60px rgba(0,0,0,0.2)"
        }}
      />
    </section>
  );
}