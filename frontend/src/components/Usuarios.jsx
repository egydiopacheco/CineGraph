import { Button, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import React, { useEffect, useState } from "react";
function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [contato, setContato] = useState("");
  const [email, setEmail] = useState("");

  const getUsers = () => {
    axios
      .get("http://127.0.0.1:8000/individuos/")
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getUsers();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://127.0.0.1:8000/individuos/create", {
        nome,
        idade,
        contato,
        email,
      })
      .then(() => {
        alert("Usuário criado com sucesso!");
        setNome("");
        setIdade("");
        setContato("");
        setEmail("");
        getUsers();
      })
      .catch((error) => {
        alert("Erro ao criar usuário");
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Cadastrar Usuário</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "24px" }}>
        <TextField
          label="Nome"
          value={nome}
          onChange={(event) => setNome(event.target.value)}
        />

        <TextField
          label="Idade"
          value={idade}
          onChange={(event) => setIdade(event.target.value)}
        />

        <TextField
          label="Contato"
          value={contato}
          onChange={(event) => setContato(event.target.value)}
        />

        <TextField
          label="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <Button type="submit" variant="contained">
          Cadastrar usuário
        </Button>
      </form>

      <h1>Usuários cadastrados</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="left">Nome</TableCell>
              <TableCell align="left">Idade</TableCell>
              <TableCell align="left">Contato</TableCell>
              <TableCell align="left">Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow
                key={usuario.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {usuario.id}
                </TableCell>
                <TableCell align="left">{usuario.nome}</TableCell>
                <TableCell align="left">{usuario.idade}</TableCell>
                <TableCell align="left">{usuario.contato}</TableCell>
                <TableCell align="left">{usuario.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Usuarios;
