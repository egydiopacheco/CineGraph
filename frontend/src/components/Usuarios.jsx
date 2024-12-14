import { Button, List, ListItem, ListItemText } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    axios.get('/api/usuarios')
      .then(response => {
        setUsuarios(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('/api/usuarios', { nome, email })
      .then(response => {
        setUsuarios([...usuarios, response.data]);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Usuários</h1>
      <List>
        {usuarios.map(usuario => (
          <ListItem key={usuario.id}>
            <ListItemText primary={usuario.nome} />
          </ListItem>
        ))}
      </List>
      <form onSubmit={handleSubmit}>
        <input type="text" value={nome} onChange={(event) => setNome(event.target.value)} placeholder="Nome" />
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
        <Button type="submit">Cadastrar</Button>
      </form>
    </div>
  );
}

export default Usuarios;
``