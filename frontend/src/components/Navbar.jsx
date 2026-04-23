export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "20px"
    }}>
      <h2 style={{ color: "var(--marrom)" }}>Hefestto</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <a>Projetos</a>
        <a>Sobre</a>
        <a>Contato</a>
      </div>
    </nav>
  );
}