import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, resetStatus } from "../store/authSlice";
import { STATUS } from "../../globals/Status";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(userData));
  };

  useEffect(() => {
    if (status === STATUS.SUCCESS) {
      toast.success("Login successful");
      dispatch(resetStatus());
      navigate("/"); // redirect to home/chat page
    } else if (status === STATUS.ERROR) {
      toast.error("Login failed. Please check your credentials.");
      dispatch(resetStatus());
    }
  }, [status, navigate, dispatch]);

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 mb-6 text-center">
            Login to your account
          </h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-800">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-800">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              Login
            </button>

            <p className="text-sm font-light text-gray-600 text-center">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:underline"
              >
                Register here
              </Link>
            </p>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} KuraGhar. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
