import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Saisis from "./pages/Saisis"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path ="/saisis" element={<Saisis />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
