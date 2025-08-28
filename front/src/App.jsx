import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Saisis from "./pages/Saisis"
import Header from './components/Header'
import Dashboard from "./pages/Dashboard"

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path ="/saisis" element={<Saisis />} />
        <Route path ="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
