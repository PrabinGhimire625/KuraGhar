import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Navbar from "./globals/Navbar";
import store from "./store/store";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from "react-redux";
import Profile from "./pages/auth/Profile";
import UserSearch from "./pages/search/UserSearch";
import Landing from "./pages/landing/Landing";
import SingleUser from "./pages/user/SingleUser";
import FriendRequest from "./pages/friendRequest/FriendRequest";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Navbar />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/singleUser/:id" element={<SingleUser />} />
            <Route path="/search" element={<UserSearch />} />

            <Route path="/friendRequest" element={<FriendRequest />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
