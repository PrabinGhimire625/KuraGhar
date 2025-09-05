import { useEffect, useState } from "react";
import {
    FiSearch,
    FiBell,
    FiUserPlus,
    FiPlus,
    FiUser,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { resetStatus } from "../pages/store/authSlice";
import { useDispatch, useSelector } from "react-redux";

function Navbar() {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    console.log("token in navbar", token)
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const localStorageToken = localStorage.getItem('token');
        setIsLoggedIn(!!localStorageToken || !!token);
    }, [dispatch, token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        dispatch(resetStatus());
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-md w-full z-50 fixed top-0 left-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/">
                            <h1 className="text-gray-800 text-2xl font-bold">Messenger</h1>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full hover:bg-gray-200 text-gray-700 transition">
                            <FiSearch size={20} />
                        </button>
                        <Link to="/userList" className="p-2 rounded-full hover:bg-gray-200 text-gray-700 transition">
                            <FiPlus size={20} />
                        </Link>
                        <button className="p-2 rounded-full hover:bg-gray-200 text-gray-700 transition">
                            <FiUserPlus size={20} />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-200 text-gray-700 transition">
                            <FiBell size={20} />
                        </button>

                        {!isLoggedIn ? (
                            <>
                                <Link
                                    to="/login"
                                    className="px-3 py-1 rounded hover:bg-gray-200 text-gray-700 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-3 py-1 rounded hover:bg-gray-200 text-gray-700 transition"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/profile"
                                    className="px-3 py-1 rounded hover:bg-gray-200 text-gray-700 transition flex items-center gap-1"
                                >
                                    <FiUser size={18} /> Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1 rounded hover:bg-gray-200 text-gray-700 transition"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
