export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "30px 80px",
      position: "absolute",
      width: "100%",
      top: 0,
      zIndex: 10
    }}>
      <h2 style={{
        fontFamily: "Cormorant Garamond",
        fontWeight: 500,
        letterSpacing: "1px"
      }}>
        Hefestto
      </h2>

      <div style={{
        display: "flex",
        gap: "30px",
        fontSize: "0.9rem"
      }}>
        <span>Projetos</span>
        <span>Sobre</span>
        <span>Contato</span>
      </div>
    </nav>
  );
}