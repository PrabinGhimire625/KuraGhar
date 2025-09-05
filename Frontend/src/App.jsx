import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Navbar from "./globals/Navbar";
import store from "./pages/store/store";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from "react-redux";
import Profile from "./pages/auth/Profile";
import ListUser from "./pages/ListUser";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Navbar />
        <div className="pt-16"> {/* Padding for fixed navbar */}
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/userList" element={<ListUser />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
