import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ptBR from "dayjs/locale/pt-br";
import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Filmes from "./components/Filmes";
import FilmesRecomendados from "./components/FilmesRecomendados";
import Usuarios from "./components/Usuarios";

function App() {
  return (
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={ptBR}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Sistema de recomendação de filmes
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Início
            </Button>
            <Button color="inherit" component={Link} to="/filmes">
              Filmes
            </Button>
            <Button color="inherit" component={Link} to="/usuarios">
              Usuários
            </Button>
          </Toolbar>
        </AppBar>
        <div style={{ padding: "16px 32px" }}>
          <Routes>
            <Route path="/" element={<FilmesRecomendados />} />
            <Route path="/filmes" element={<Filmes />} />
            <Route path="/usuarios" element={<Usuarios />} />
          </Routes>
        </div>
      </LocalizationProvider>
    </BrowserRouter>
  );
}

export default App;
