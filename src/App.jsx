import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "@fontsource/inter";
// Importing pages
import ScrollToTop from "./hooks/useScrollToTop";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Home />
    </Router>
  );
}

export default App;
