import React, { useState } from "react";
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import {
  authTokenSignal,
  currentUserSignal,
  isLoadingSignal,
} from "../store/store";
import { useSignal } from "use-signals";

function DropDown() {
  const [isOpen, setIsOpen] = useState(false);
  const Navigate = useNavigate();
  const currentUserState = useSignal(currentUserSignal); // Using the signal directly
  const isLoadingState = useSignal(isLoadingSignal);

  const handleSignOut = () => {
    isLoadingSignal.set(true);
    try {
      if (authTokenSignal.get()) {
        localStorage.removeItem("authToken");
        authTokenSignal.set(null);
        Navigate("/");
        isLoadingSignal.set(false);
      }
    } catch (error) {
      console.log({ error: error.message });
    }
  };

  if (isLoadingSignal.get()) {
    return <div>Loading...</div>; // Replace with your loading component or spinner
  }

  return (
    <div className="relative flex flex-col items-center rounded-lg">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex gap-1 items-center justify-center hover: rounded-lg  tracking-wider active:text-green-700 "
      >
        <div className="flex gap-2 justify-center items-center">
          <img
            className="self-center rounded-full h-7 w-7 object-cover mt-2 cursor-pointer"
            src={currentUserState.avatar || "/path/to/default/avatar.png"} // Default avatar if not available
            alt="avatar"
          />
          {(!isLoadingState && currentUserState.fullName) || "User"}{" "}
          {/* Fallback if no name is available */}
        </div>
        {!isOpen ? (
          <AiOutlineCaretDown className="h-4" />
        ) : (
          <AiOutlineCaretUp className="h-4" />
        )}
      </button>

      {isOpen && (
        <ul className="bg-green-100 absolute top-12 flex flex-col items-start rounded-lg p-0 w-full">
          <Link
            className="w-full"
            onClick={() => setIsOpen(false)}
            to="/profile"
          >
            <li className="w-full hover:bg-green-50 border-l-transparent hover:border-l-green-700 border-l-2 pl-2 py-2">
              Profile
            </li>
          </Link>
          <hr className="border border-b border-green-400 w-full my-2 text-start" />
          <li
            onClick={handleSignOut}
            className="w-full hover:bg-green-50 border-l-transparent hover:border-l-green-700 border-l-2 pl-2 py-2"
          >
            Sign out
          </li>
        </ul>
      )}
    </div>
  );
}

export default DropDown;
