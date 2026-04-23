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

      <section style={{ padding: "40px" }}>
        <h2>Projetos</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px"
        }}>
          {projects.map(p => (
            <div key={p._id} style={{
              background: "#fff",
              borderRadius: "10px",
              overflow: "hidden"
            }}>
              <img src={p.image} style={{ width: "100%" }} />
              <div style={{ padding: "10px" }}>
                <h3>{p.title}</h3>
                <p>{p.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}