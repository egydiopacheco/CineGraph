import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
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
import React, { useEffect, useMemo, useState } from "react";

function Filmes() {
  const [filmes, setFilmes] = useState([]);
  const [titulo_original, setTitulo] = useState("");
  const [titulo_portugues, setTituloPt] = useState("");
  const [descricao, setDescricao] = useState("");
  const [genero, setGenero] = useState("");
  const [diretor, setDiretor] = useState("");
  const [elenco, setElenco] = useState([]);
  const [duracao, setDuracao] = useState(0);
  const [lancamento, setLancamento] = useState();
  const [atores, setAtores] = useState([]);
  const [diretores, setDiretores] = useState([]);
  const [generos, setGeneros] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/filmes/")
      .then((response) => {
        setFilmes(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/diretores/")
      .then((response) => {
        setDiretores(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/atores/")
      .then((response) => {
        setAtores(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/generos/")
      .then((response) => {
        setGeneros(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://127.0.0.1:8000/filmes/create/", {
        titulo_original,
        titulo_portugues,
        descricao,
        genero,
        diretor,
        elenco: elenco.toString(),
        duracao,
        lancamento: lancamento.format("YYYY-MM-DD").substring(0, 10),
        classificacao: 0,
      })
      .then((response) => {
        alert("Filme criado com sucesso!");

        setFilmes([...filmes, response.data]);
        setTitulo("");
        setTituloPt("");
        setDescricao("");
        setGenero("");
        setDiretor("");
        setElenco([]);
        setDuracao(0);
        setLancamento(null);
      })
      .catch((error) => {
        alert("Erro ao criar filme");
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Cadastrar Filme</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6,1fr)",
          gap: "24px",
        }}
      >
        <TextField
          label="Título original"
          value={titulo_original}
          onChange={(event) => setTitulo(event.target.value)}
        />
        <TextField
          label="Título em português"
          value={titulo_portugues}
          onChange={(event) => setTituloPt(event.target.value)}
        />
        <TextField
          label="Descrição"
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
        />

        <FormControl fullWidth>
          <InputLabel>Gênero</InputLabel>

          <Select
            value={genero}
            label="Gênero"
            onChange={(e) => {
              setGenero(e.target.value);
            }}
          >
            {generos.map((item) => (
              <MenuItem value={item.nome}>{item.nome}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Diretor</InputLabel>

          <Select
            value={genero}
            label="Diretor"
            onChange={(e) => {
              setDiretor(e.target.value);
            }}
          >
            {diretores.map((item) => (
              <MenuItem value={item.nome}>{item.nome}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Elenco</InputLabel>

          <Select
            value={elenco}
            label="Elenco"
            onChange={(e) => {
              setElenco(e.target.value);
              console.log(e);
            }}
            multiple={true}
          >
            {atores.map((item) => (
              <MenuItem value={item.nome}>{item.nome}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Duração (minutos)"
          value={duracao}
          onChange={(event) => setDuracao(event.target.value)}
          type="number"
        />

        <DatePicker
          label="Data de lançamento"
          value={lancamento}
          onChange={(newValue) => setLancamento(newValue)}
          format="DD/MM/YYYY"
        />

        <Button type="submit" variant="contained">
          Cadastrar filme
        </Button>
      </form>

      <h1>Filmes</h1>

      <FilmesGrid filmes={filmes} />
    </div>
  );
}

export default Filmes;

export const FilmesGrid = ({ filmes = [] }) => {
  const [titulo_original, setTitulo] = useState("");
  const [titulo_portugues, setTituloPt] = useState("");
  const [genero, setGenero] = useState("");
  const [diretor, setDiretor] = useState("");
  const [elenco, setElenco] = useState("");
  const [lancamento, setLancamento] = useState();

  function formatarData(dataStr) {
    if (dataStr) {
      const [ano, mes, dia] = dataStr.split("-");
      return `${dia}/${mes}/${ano}`;
    }
    return "";
  }

  const filteredFilmes = useMemo(() => {
    let initialFilters = structuredClone(filmes);

    if (titulo_original) {
      initialFilters = initialFilters.filter((filme) =>
        filme.titulo_original
          .toLowerCase()
          .includes(titulo_original.toLowerCase())
      );
    }

    if (titulo_portugues) {
      initialFilters = initialFilters.filter((filme) =>
        filme.titulo_portugues
          .toLowerCase()
          .includes(titulo_portugues.toLowerCase())
      );
    }

    if (genero) {
      initialFilters = initialFilters.filter((filme) =>
        filme.genero.toLowerCase().includes(genero.toLowerCase())
      );
    }

    if (diretor) {
      initialFilters = initialFilters.filter((filme) =>
        filme.diretor.toLowerCase().includes(diretor.toLowerCase())
      );
    }

    if (elenco) {
      initialFilters = initialFilters.filter((filme) =>
        filme.elenco.toLowerCase().includes(elenco.toLowerCase())
      );
    }
    if (lancamento) {
      initialFilters = initialFilters.filter((filme) =>
        filme.lancamento.includes(
          lancamento.format("YYYY-MM-DD").substring(0, 10)
        )
      );
    }

    return initialFilters;
  }, [
    titulo_original,
    titulo_portugues,
    genero,
    diretor,
    elenco,
    lancamento,
    filmes,
  ]);
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
          value={titulo_original}
          onChange={(event) => setTitulo(event.target.value)}
          variant="standard"
        />
        <TextField
          label="Buscar por título em português"
          value={titulo_portugues}
          onChange={(event) => setTituloPt(event.target.value)}
          variant="standard"
        />
        <TextField
          label="Buscar por gênero"
          value={genero}
          onChange={(event) => setGenero(event.target.value)}
          variant="standard"
        />

        <TextField
          label="Buscar por diretor"
          value={diretor}
          onChange={(event) => setDiretor(event.target.value)}
          variant="standard"
        />
        <TextField
          label="Buscar por elenco"
          value={elenco}
          onChange={(event) => setElenco(event.target.value)}
          variant="standard"
        />

        <DatePicker
          label="Buscar por data de lançamento"
          value={lancamento}
          onChange={(newValue) => setLancamento(newValue)}
          slotProps={{ textField: { variant: "standard" } }}
          format="DD/MM/YYYY"
        />
      </form>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell align="left">Descrição</TableCell>
              <TableCell align="left">Gênero</TableCell>
              <TableCell align="left">Diretor</TableCell>
              <TableCell align="left">Elenco</TableCell>
              <TableCell align="left">Duração (minutos)</TableCell>
              <TableCell align="left">Data de lançamento</TableCell>
              <TableCell align="left">Classificação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFilmes.map((filme) => (
              <TableRow
                key={filme.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {filme.titulo_original}
                </TableCell>
                <TableCell align="left">{filme.descricao}</TableCell>
                <TableCell align="left">{filme.genero}</TableCell>
                <TableCell align="left">{filme.diretor}</TableCell>
                <TableCell align="left">{filme.elenco}</TableCell>
                <TableCell align="left">{filme.duracao}</TableCell>
                <TableCell align="left">
                  {formatarData(filme.lancamento)}
                </TableCell>
                <TableCell align="left">{filme.classificacao}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
