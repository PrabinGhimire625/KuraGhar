import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, resetStatus } from '../store/authSlice';
import { STATUS } from '../../globals/Status';
import { toast } from 'react-toastify';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.auth);
    const [errorMessage, setErrorMessage] = useState("");
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(register(userData));
    };

    useEffect(() => {
        if (status === STATUS.SUCCESS) {
            toast.success("Register successful");
            dispatch(resetStatus());
            navigate("/login");
        } else if (status === STATUS.ERROR) {
            toast.error("Registration failed. Please check your details.");
        } else {
            setErrorMessage("");
        }
    }, [status, navigate]);

    return (
        <section className="bg-white min-h-screen flex items-center justify-center px-6 py-8">
            <div className="flex flex-col items-center justify-center w-full max-w-md">
                <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8">
                    <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 mb-6">
                        Register an account
                    </h1>
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-800">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-800">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                                placeholder="prabinghimire625@gmail.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-800">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                        >
                            Register
                        </button>

                        <p className="text-sm font-light text-gray-600 ml-16">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-medium text-indigo-600 hover:underline"
                            >
                                Login here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Register;