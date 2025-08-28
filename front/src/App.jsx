import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Saisis from "./pages/Saisis"
import Header from './components/Header'

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path ="/saisis" element={<Saisis />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
