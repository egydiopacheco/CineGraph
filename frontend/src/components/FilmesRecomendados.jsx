import axios from "axios";
import React, { useEffect, useState } from "react";
import { FilmesGrid } from "./Filmes";

function FilmesRecomendados() {
  const [filmes, setFilmes] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/filmes/recomendados")
      .then((response) => {
        setFilmes(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <h1>Filmes recomendados</h1>

      <FilmesGrid filmes={filmes} />
    </div>
  );
}

export default FilmesRecomendados;
