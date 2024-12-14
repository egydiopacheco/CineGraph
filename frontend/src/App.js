import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Filmes from "./components/Filmes";
import Usuarios from "./components/Usuarios";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/filmes" element={<Filmes />} />
        <Route path="/usuarios" element={<Usuarios />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
