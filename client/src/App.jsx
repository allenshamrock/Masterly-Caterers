import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Recipes from "./pages/Recipes";
import Recipe from "./pages/Recipe";
import Blogs from "./pages/Blogs";
import BlogPost from './pages/BlogPost'
import Gallery from "./pages/Gallery";
import Services from "./pages/Services";
const App = () => {
  return (
    <main>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:id" element={<Recipe />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogPost />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/services" element={<Services />} />
      </Routes>
      <Footer />
    </main>
  );
};

export default App;
