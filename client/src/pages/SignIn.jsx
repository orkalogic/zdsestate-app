import { Link, useNavigate } from "react-router-dom";
import { useSignal } from "use-signals";
import {
  userDataSignal,
  userDataInitialState,
  authTokenSignal,
  currentUserSignal,
} from "../store/store";
import axios from "axios";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import Notify from "../components/Notify";
import { jwtDecode } from "jwt-decode";

function SignIn() {
  const userDataState = useSignal(userDataSignal);
  const currentUserState = useSignal(currentUserSignal);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    userDataSignal.set({ ...userDataSignal.get(), [name]: value });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      let res = await axios.post(
        "http://localhost:4000/auth/login",
        userDataState
        //{ withCredentials: true } // Ensure cookies are sent along with the request
      );

      localStorage.setItem("authToken", res.data.token);
      authTokenSignal.set(localStorage.getItem("authToken"));

      // Set default Authorization header for future requests
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${authTokenSignal.get()}`;
      userDataSignal.set(userDataInitialState);
      setIsLoading(false);
      // notify("success", "Welcome!");
      authTokenSignal.get() &&
        currentUserSignal.set(jwtDecode(authTokenSignal.get().toString()));
      navigate("/listings");
      return;
    } catch (err) {
      setIsLoading(false);
      return Notify("error", err.response.data.msg);
    }
  };
  useEffect(() => {
    if (authTokenSignal.get()) {
      navigate("/listings");
    }
  }, []);

  return (
    <div className="flex max-w-md flex-col mx-auto justify-center h-lvh ">
      <h1 className="text-3xl text-center font font-semibold text-green-700 ">
        Sign In
      </h1>
      <form onSubmit={handleSignIn} className="flex max-w-md flex-col gap-4 ">
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

        <button
          disabled={isLoading}
          className="bg-green-500 p-2 rounded-md text-green-50 uppercase"
          type="submit"
        >
          {isLoading ? "Loading..." : "Sign In"}
        </button>
      </form>
      <div className="flex gap-2 mt-5 ">
        <p>Don't have an account?</p>
        <Link to="/sign-up">
          <span className="text-green-500 uppercase">Sign up</span>
        </Link>
      </div>
    </div>
  );
}

export default SignIn;
