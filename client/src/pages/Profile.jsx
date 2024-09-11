import React, { useEffect } from "react";
import { currentUserSignal } from "../store/store";
import { useSignal } from "use-signals";

function Profile() {
  let currentUserState = useSignal(currentUserSignal);

  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="form-class flex  flex-col gap-4 items-center w-full">
        <img
          className="self-center rounded-full h-24 w-24 object-cover mt-2 cursor-pointer "
          src={currentUserState.currentUser.avatar}
          alt=""
        />
        <label for="full-name">
          <input
            className="border p-3 rounded-lg "
            type="text"
            id="full-name"
            name="fullName"
            placeholder="Full name"
          />
        </label>
        <label for="email">
          <input
            className="border p-3 rounded-lg "
            type="email"
            id="email"
            name="email"
            placeholder="Email"
          />
        </label>
        <label for="password">
          <input
            className="border p-3 rounded-lg"
            type="text"
            id="password"
            name="password"
            placeholder="Password"
          />
        </label>
        <button className="bg-green-500 font-semibold p-2 w-full rounded-md text-green-100 uppercase">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-rose-600 cursor-pointer">Delete account</span>
        <span className="text-rose-600 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}

export default Profile;
