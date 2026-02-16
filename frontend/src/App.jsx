// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import BlogDetails from "./pages/BlogDetails";
import Profile from "./pages/Profile";
import Topics from "./pages/Topics";
import Navbar from "./components/Navbar";
import ChangePassword from "./pages/ChangePassword"; 


// Inside <Routes>



function AppWrapper() {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/profile" element={<Profile />} />
        
<Route path="/change-password" element={<ChangePassword />} />
        <Route path="/topics" element={<Topics />} />
        
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
