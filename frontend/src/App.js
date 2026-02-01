import "./App.css";

// Router
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Components
import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";
import Chat from "./components/chat/Chat";

// Pages
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import EditProfile from "./pages/EditProfile/EditProfile";
import Profile from "./pages/Profile/Profile";
import Photo from "./pages/Photo/Photo";
import Search from "./pages/Search/Search";

// Routes
import RequireAuth from "./routes/RequireAuth";
import PublicRoute from "./routes/PublicRoute";

function AppLayout() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="App">
      <NavBar />

      <div className="w-full px-6 pt-16">
        <Routes>
          {/* Rotas públicas */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Rotas protegidas */}
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<EditProfile />} />
            <Route path="/users/:id" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/photos/:id" element={<Photo />} />
          </Route>
        </Routes>
      </div>

      {!isAuthPage && <Chat />}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;