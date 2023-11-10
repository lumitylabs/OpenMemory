import React from 'react'
import ReactDOM from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Home from "./pages/Home"
import Memory from "./pages/Memory"
import './index.css'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memory/:memoryid" element={<Memory />} />
        </Routes>
      </BrowserRouter>
    </div>
  );