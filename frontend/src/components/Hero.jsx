export default function Hero() {
  return (
    <section style={{
      height: "80vh",
      background: "linear-gradient(180deg, rgba(28,42,28,0.65) 0%, rgba(28,42,28,0) 60%), url('/hero-bg.jpg') center/cover",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      color: "#fff",
      padding: "0 5%"
    }}>
      <div>
        <h1 style={{
          fontSize: "4rem",
          marginBottom: "20px",
          fontFamily: "'Playfair Display', serif",
          textShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}>
          Arquitetura que Inspira
        </h1>
        <p style={{
          fontSize: "1.3rem",
          maxWidth: "600px",
          margin: "0 auto",
          opacity: 0.95
        }}>
          Transformando espaços em experiências únicas, 
          onde natureza e sofisticação se encontram.
        </p>
      </div>
    </section>
  );
}