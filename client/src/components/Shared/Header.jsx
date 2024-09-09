import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSignal } from "use-signals";
import { authTokenSignal } from "../../store/store";

function Header() {
  const authTokenState = useSignal(authTokenSignal);
  const Navigate = useNavigate();

  const handleSignOut = () => {
    if (authTokenSignal.get()) {
      localStorage.removeItem("authToken");
      authTokenSignal.set(null);
      Navigate("/");
    }
  };
  return (
    <header className="bg-green-100 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-2xl flex flex-wrap">
            <span className="text-green-500">ZDS</span>
            <span className="text-green-700">ESTATE</span>
          </h1>
        </Link>
        <form className="bg-green-200 min-w-64 md:min-w-72 p-2 px-3 sm:p-2.5 sm:px-4 rounded-lg flex justify-between items-center ">
          <label htmlFor="search">
            <input
              className="bg-transparent focus:outline-none "
              type="text"
              name="search"
              id="search"
              placeholder="Search..."
            />
          </label>
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4 font-bold">
          <Link to="/">
            <li className="hidden sm:inline text-green-700 hover:underline ">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-green-700 hover:underline ">
              About
            </li>
          </Link>
          {authTokenState && (
            <Link to="/listings">
              <li className="hidden sm:inline text-green-700 hover:underline ">
                My Listings
              </li>
            </Link>
          )}

          {!authTokenState ? (
            <Link to="/sign-in">
              <li className=" text-green-700 hover:underline ">Sign in</li>
            </Link>
          ) : (
            <li
              onClick={handleSignOut}
              className="cursor-pointer text-green-700 hover:underline"
            >
              Sign out
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;
