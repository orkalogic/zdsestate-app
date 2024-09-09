// "use client";

import { Link, useNavigate } from "react-router-dom";
import { useSignal } from "use-signals";
import {
  userDataSignal,
  userDataInitialState,
  authTokenSignal,
} from "../store/store";
import axios from "axios";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";

function SignUp() {
  const userDataState = useSignal(userDataSignal);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    userDataSignal.set({ ...userDataSignal.get(), [name]: value });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("http://localhost:4000/auth/register", userDataState);
      console.log("User registered successfully.");
      userDataSignal.set(userDataInitialState);
      setIsLoading(false);
      // notify("success", "Registration successful.");
      navigate("/sign-in");
      return;
    } catch (err) {
      setIsLoading(false);
      return notify("error", err.response.data.msg);
    }
    //
    // console.log(userDataSignal.get());
  };

  useEffect(() => {
    if (authTokenSignal.get()) {
      navigate("/listings");
    }
  }, []);

  function notify(option, message) {
    switch (option) {
      case "success":
        toast.success(message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        break;
      case "error":
        toast.error(message, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        break;
      default:
        toast.warning("Couldn't Register a user!");
        break;
    }
  }

  return (
    <div className="flex max-w-md flex-col mx-auto justify-center h-lvh ">
      <h1 className="text-3xl text-center font font-semibold text-green-700 ">
        Sign Up
      </h1>
      <form
        onSubmit={handleRegistration}
        className="flex max-w-md flex-col gap-4 "
      >
        <div>
          <div className="mb-2 block">
            <Label htmlFor="fullName" value="Your full name" />
          </div>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Your Full Name"
            required
            value={userDataState.fullName}
            onChange={handleChange}
            className="border-2 border-green-500 focus:border-green-700 focus:outline-none w-[450px] p-2 rounded-md "
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Your email" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="name@gmail.com"
            required
            value={userDataState.email}
            onChange={handleChange}
            className="border-2 border-green-500 focus:border-green-700 focus:outline-none w-[450px] p-2 rounded-md "
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="Your password" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={userDataState.password}
            onChange={handleChange}
            className="border-2 border-green-500 focus:border-green-700 focus:outline-none w-[450px] p-2 rounded-md "
          />
        </div>
        {/* <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <label htmlFor="remember" className="text-green-700 text-lg">
            Remember me
          </label>
        </div> */}
        <button
          disabled={isLoading}
          className="bg-green-500 p-2 rounded-md text-green-50"
          type="submit"
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-5 ">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-green-500">Sign in</span>
        </Link>
      </div>

      <ToastContainer />
    </div>
  );
}

export default SignUp;
