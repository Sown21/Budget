import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Saisis from "./pages/Saisis"
import Header from './components/Header'
import Dashboard from "./pages/Dashboard"
import SideBar from './components/SideBar'

function App() {

  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <SideBar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/saisis" element={<Saisis />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
