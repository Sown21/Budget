import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from './components/SideBar';
import Dashboard from './pages/Dashboard';
import Saisis from './pages/Saisis';
import Categories from './pages/Categories';
import { UserProvider } from './context/UserContext';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="flex h-screen bg-gray-100">
          <SideBar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/saisis" element={<Saisis />} />
              <Route path="/categories" element={<Categories />} />
            </Routes>
          </main>
        </div>
      </Router>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </UserProvider>
  );
}

export default App;
