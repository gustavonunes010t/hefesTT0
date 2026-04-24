import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand-link">
        <span className="brand-mark" aria-hidden="true">
          <span />
        </span>
        <span className="brand-text">
          hefestto
          <small>arquitetura</small>
        </span>
      </Link>

      <div className="nav-links">
        <Link to="/">Projetos</Link>
        <Link to="/fale-comigo">Fale comigo</Link>
        <Link to="/admin">Painel</Link>
      </div>
    </nav>
  );
}
