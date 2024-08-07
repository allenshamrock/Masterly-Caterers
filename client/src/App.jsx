import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Recipes from "./pages/Recipes";
import Recipe from "./pages/Recipe";
const App = () => {
  return (
    <main>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:id" element={<Recipe/>} />
      </Routes>
      <Footer />
    </main>
  );
};

export default App;
