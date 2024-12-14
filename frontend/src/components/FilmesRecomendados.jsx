import { List, ListItem, ListItemText } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function FilmesRecomendados() {
  const [filmes, setFilmes] = useState([]);

  useEffect(() => {
    axios.get('/api/filmes')
      .then(response => {
        setFilmes(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <List>
      {filmes.map(filme => (
        <ListItem key={filme.id}>
          <ListItemText primary={filme.titulo} />
        </ListItem>
      ))}
    </List>
  );
}

export default FilmesRecomendados;