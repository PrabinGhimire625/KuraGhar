import { useEffect, useState } from "react";
import { FiSearch, FiBell, FiUserPlus, FiPlus, FiUser } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resetStatus } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";

function Navbar() {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const localStorageToken = localStorage.getItem("token");
        setIsLoggedIn(!!localStorageToken || !!token);
    }, [token]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            if (searchQuery.trim()) {
                const newUrl = `/search?query=${searchQuery.trim()}`;
                if (
                    location.pathname !== "/search" ||
                    location.search !== `?query=${searchQuery.trim()}`
                ) {
                    navigate(newUrl);
                }
            }
        }, 300);

        return () => clearTimeout(debounce);
    }, [searchQuery, location.pathname, location.search, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        dispatch(resetStatus()); // make sure this clears Redux token
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
                        <input
                            type="text"
                            placeholder="Search books..."
                            className="px-3 py-1.5 rounded-md border border-gray-300 w-64 hidden md:block"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Link
                            to="/"
                            className="p-2 rounded-full hover:bg-gray-200 text-gray-700 transition"
                        >
                            <FiPlus size={20} />
                        </Link>

                        <Link to="/friendRequest" className="p-2 rounded-full hover:bg-gray-200 text-gray-700 transition">
                            <FiUserPlus size={20} />
                        </Link>

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
