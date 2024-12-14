import { AppBar, Button, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Sistema de recomendação de filmes
          </Typography>
          <Button component={Link} to="/filmes">
            Filmes
          </Button>
          <Button component={Link} to="/usuarios">
            Usuários
          </Button>
        </Toolbar>
      </AppBar>
      <h1>Início</h1>
      <FilmesRecomendados />
    </div>
  );
}

export default Home;
