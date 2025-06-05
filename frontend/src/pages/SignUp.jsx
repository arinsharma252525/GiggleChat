import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignUp = () => {
  let navigate = useNavigate();
  const [showPassword, setshowPassword] = useState(false);
  const [userName, setuserName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  let dispatch = useDispatch();

  const handleSignup = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          userName,
          email,
          password,
        },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      navigate('/profile')
      setuserName("");
      setemail("");
      setpassword("");
      setloading(false);
      seterror("");
    } catch (error) {
      setloading(false);
      seterror(error.response?.data?.message || "Signup failed");
      console.log(error);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-[#1e1e2e] flex justify-center items-center">
      <div className="w-full max-w-[400px] h-[70%] bg-[#2a2e39] rounded-lg shadow-gray-400 shadow-lg flex flex-col ">
        <h1 className="text-gray-500 font-bold text-[30px] flex justify-center items-center mt-8">
          Welcome to GiggleChat
        </h1>

        <form
          className="w-full flex flex-col gap-[20px] justify-center items-center"
          onSubmit={handleSignup}
        >
          <input
            type="text"
            placeholder="Enter your name"
            className="w-[90%] h-[40px] outline-none border-2 border-none px-[20px] py-[10px] mt-4 bg-white rounded-lg shadow-gray-200 shadow-md hover:shadow-inner"
            onChange={(e) => setuserName(e.target.value)}
            value={userName}
          />
          <input
            type="text"
            placeholder="Enter your email"
            className="w-[90%] h-[40px] outline-none border-2  px-[20px] py-[10px] mt-2 bg-white rounded-lg border-none shadow-gray-200 shadow-md hover:shadow-inner"
            onChange={(e) => setemail(e.target.value)}
            value={email}
          />
          <div className="w-[90%] h-[40px] mt-2 overflow-hidden rounded-lg shadow-gray-200 shadow-md hover:shadow-inner relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full h-full outline-none px-[20px] py-[10px] bg-white"
              onChange={(e) => setpassword(e.target.value)}
              value={password}
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 text-sm font-semibold"
              onClick={() => setshowPassword((prev) => !prev)}
            >
              {showPassword ? "hide" : "show"}
            </span>
          </div>
          {error && (
            <p className="text-cyan-300 text-sm font-semibold">{error}</p>
          )}
          <button
            className="w-[200px] h-[40px] px-[20px] py-[10px] bg-cyan-300 rounded-2xl shadow-gray-400 shadow-md mt-2 font-semibold hover:shadow-inner"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
          <p className="text-gray-500 cursor-pointer">
            Already have an account?{" "}
            <span
              className="text-cyan-300 text-bold"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
