import { Button, List, ListItem, ListItemText } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Filmes() {
  const [filmes, setFilmes] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    axios.get('/api/filmes')
      .then(response => {
        setFilmes(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('/api/filmes', { titulo, descricao })
      .then(response => {
        setFilmes([...filmes, response.data]);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Filmes</h1>
      <List>
        {filmes.map(filme => (
          <ListItem key={filme.id}>
            <ListItemText primary={filme.titulo} />
          </ListItem>
        ))}
      </List>
      <form onSubmit={handleSubmit}>
        <input type="text" value={titulo} onChange={(event) => setTitulo(event.target.value)} placeholder="Título" />
        <input type="text" value={descricao} onChange={(event) => setDescricao(event.target.value)} placeholder="Descrição" />
        <Button type="submit">Cadastrar</Button>
      </form>
    </div>
  );
}

export default Filmes;