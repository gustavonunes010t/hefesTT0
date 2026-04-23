import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

export default function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/projects")
      .then(res => setProjects(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      <Navbar />
      <Hero />

      <section style={{ padding: "100px 80px" }}>
        <h2 style={{ marginBottom: "50px", fontSize: "2.5rem" }}>
          Projetos
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "40px"
          }}
        >
          {projects.map((p) => (
            <div
              key={p._id}
              style={{
                position: "relative",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer"
              }}

              // 🔥 HOVER PREMIUM
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector("img");
                const overlay = e.currentTarget.querySelector(".overlay");

                img.style.transform = "scale(1.08)";
                overlay.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector("img");
                const overlay = e.currentTarget.querySelector(".overlay");

                img.style.transform = "scale(1)";
                overlay.style.opacity = "0";
              }}
            >
              {/* IMAGEM */}
              <img
                src={p.image}
                alt={p.title}
                style={{
                  width: "100%",
                  height: "320px",
                  objectFit: "cover",
                  transition: "0.6s"
                }}
              />

              {/* OVERLAY (LUXO REAL) */}
              <div
                className="overlay"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  padding: "30px",
                  background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
                  color: "#fff",
                  opacity: 0,
                  transition: "0.4s"
                }}
              >
                <h3 style={{ margin: 0 }}>{p.title}</h3>
                <p style={{ marginTop: "5px", fontSize: "0.9rem" }}>
                  {p.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}