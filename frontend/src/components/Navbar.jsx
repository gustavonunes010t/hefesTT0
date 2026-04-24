import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      padding: "20px 5%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#F8F5F0",
      boxShadow: "0 2px 8px rgba(44, 95, 45, 0.08)"
    }}>
      <Link 
        to="/" 
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.8rem",
          fontWeight: 700,
          color: "#2C5F2D",
          textDecoration: "none"
        }}
      >
        Hefestto
      </Link>

      <div style={{ display: "flex", gap: "30px" }}>
        <Link 
          to="/" 
          style={{
            color: "#4A4A4A",
            textDecoration: "none",
            fontWeight: 500,
            transition: "color 0.3s"
          }}
          onMouseEnter={(e) => e.target.style.color = "#2C5F2D"}
          onMouseLeave={(e) => e.target.style.color = "#4A4A4A"}
        >
          Projetos
        </Link>
        <Link 
          to="/admin" 
          style={{
            color: "#4A4A4A",
            textDecoration: "none",
            fontWeight: 500,
            transition: "color 0.3s"
          }}
          onMouseEnter={(e) => e.target.style.color = "#2C5F2D"}
          onMouseLeave={(e) => e.target.style.color = "#4A4A4A"}
        >
          Painel
        </Link>
      </div>
    </nav>
  );
}