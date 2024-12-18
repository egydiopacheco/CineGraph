import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

export const FilmesGrid = () => {
  const [title, setTitulo] = useState("");
  const [genre, setGenero] = useState("");
  const [director, setDiretor] = useState("");
  const [release_date, setLancamento] = useState();
  const [filmes, setFilmes] = useState([]);

  const getMovies = () => {
    return axios
      .get("http://127.0.0.1:8000/api/info/")
      .then((response) => {
        return response.data.movies;
      })
      .catch((error) => {
        console.error(error);
        return [];
      });
  };

  const getRecommendedMovies = () => {
    return axios
      .get("http://127.0.0.1:8000/api/recommendations/", {
        params: {
          search_query: title ? title.trim() : undefined,
          genre: genre ? genre.trim() : undefined,
          director: director ? director.trim() : undefined,
          release_date: release_date
            ? dayjs(release_date).format("YYYY-MM-DD")
            : undefined,
        },
      })
      .then(async (response) => {
        const allMovies = await getMovies();

        return allMovies.filter((item) =>
          response.data.top_movies.some((item2) => item2.title === item.title)
        );
      })
      .catch((error) => {
        console.error(error);
        return [];
      });
  };

  const onSearch = async () => {
    let movies = [];
    if (title || genre || director || release_date) {
      movies = await getRecommendedMovies();
    } else {
      movies = await getMovies();
    }
    setFilmes(movies);
  };

  useEffect(() => {
    onSearch();
  }, []);

  function formatarData(dataStr) {
    if (dataStr) {
      const [ano, mes, dia] = dataStr.split("-");
      return `${dia}/${mes}/${ano}`;
    }
    return "";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <form
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6,1fr)",
          gap: "24px",
        }}
      >
        <TextField
          label="Buscar por título"
          value={title}
          onChange={(event) => setTitulo(event.target.value)}
          variant="standard"
        />

        <TextField
          label="Buscar por gênero"
          value={genre}
          onChange={(event) => setGenero(event.target.value)}
          variant="standard"
        />

        <TextField
          label="Buscar por diretor"
          value={director}
          onChange={(event) => setDiretor(event.target.value)}
          variant="standard"
        />

        <DatePicker
          label="Buscar por data de lançamento"
          value={release_date}
          onChange={(newValue) => setLancamento(newValue)}
          slotProps={{ textField: { variant: "standard" } }}
          format="DD/MM/YYYY"
        />

        <Button variant="contained" onClick={onSearch}>
          Buscar
        </Button>
      </form>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Título original</TableCell>
              <TableCell>Título PT</TableCell>
              <TableCell align="left">Descrição</TableCell>
              <TableCell align="left">Gênero</TableCell>
              <TableCell align="left">Diretor</TableCell>
              <TableCell align="left">Duração (minutos)</TableCell>
              <TableCell align="left">Data de lançamento</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filmes.map((filme) => (
              <TableRow
                key={filme.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {filme.titlePtBr}
                </TableCell>
                <TableCell component="th" scope="row">
                  {filme.title}
                </TableCell>
                <TableCell align="left">{filme.description}</TableCell>
                <TableCell align="left">{filme.genre}</TableCell>
                <TableCell align="left">{filme.director}</TableCell>
                <TableCell align="left">{filme.runtime}</TableCell>
                <TableCell align="left">
                  {formatarData(filme.release_date)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

function FilmesRecomendados() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <h1>Filmes</h1>

      <FilmesGrid />
    </div>
  );
}

export default FilmesRecomendados;
