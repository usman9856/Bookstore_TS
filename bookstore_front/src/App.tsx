import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/SideBar'; // Import the Sidebar component
import HomePage from './components/HomePage';
import Authentication from './components/Authentication';
import './App.css'
import Library from './components/Library';
function Root() {
  // Use the useLocation hook at the top level of the component
  const location = useLocation();

  return (
    <div className="flex">
      {/* Conditionally render Sidebar based on the current route */}
      {location.pathname !== '/Authentication' && <div className="w-60 bg-gray-800 text-white flex-none">        <Sidebar />        </div>}
      <div className={`flex-grow ${location.pathname === '/Authentication' ? 'w-full' : 'p-6'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Authentication" element={<Authentication />} />
          <Route path="/Library" element={<Library />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Root />
    </Router>
  );
}