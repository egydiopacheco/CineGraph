import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import React, { useState } from "react";

function Filmes() {
  const [titulo_original, setTitulo] = useState("");
  const [titulo_portugues, setTituloPt] = useState("");
  const [descricao, setDescricao] = useState("");
  const [genero, setGenero] = useState("");
  const [diretor, setDiretor] = useState("");
  const [duracao, setDuracao] = useState(0);
  const [lancamento, setLancamento] = useState();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      titulo_original &&
      titulo_portugues &&
      descricao &&
      genero &&
      diretor &&
      duracao &&
      lancamento
    ) {
      axios
        .post("http://127.0.0.1:8000/filmes/create/", {
          titulo_original,
          titulo_portugues,
          descricao,
          genero,
          diretor,
          duracao,
          lancamento: lancamento.format("YYYY-MM-DD").substring(0, 10),
          classificacao: 0,
        })
        .then(() => {
          alert("Filme criado com sucesso!");

          setTitulo("");
          setTituloPt("");
          setDescricao("");
          setGenero("");
          setDiretor("");
          setDuracao(0);
          setLancamento(null);
        })
        .catch((error) => {
          alert("Erro ao criar filme");
          console.error(error);
        });
    } else {
      alert("Insira todos os campos para cadastrar");
    }
  };

  return (
    <div>
      <h1>Cadastrar Filme</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
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

        <TextField
          label="Gênero"
          value={genero}
          onChange={(event) => setGenero(event.target.value)}
        />

        <TextField
          label="Diretor"
          value={diretor}
          onChange={(event) => setDiretor(event.target.value)}
        />

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
    </div>
  );
}

export default Filmes;
