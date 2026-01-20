import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import FolderGallery from "./pages/FolderGallery";
import ClientGallery from "./pages/ClientGallery";
import Home from "./pages/Home";
import About from "./pages/About";
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/folder/:folderId" element={<FolderGallery />} />
      <Route path="/gallery/:shareToken" element={<ClientGallery />} />
    </Routes>
  );
}

export default App;
