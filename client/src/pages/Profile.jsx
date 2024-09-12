import React, { useEffect, useRef, useState } from "react";
import {
  currentUserSignal,
  userDataSignal,
  isLoadingSignal,
  authTokenSignal,
} from "../store/store";
import { useSignal } from "use-signals";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Notify from "../components/Notify";

function Profile() {
  let currentUserState = useSignal(currentUserSignal);
  const isLoadingState = useSignal(isLoadingSignal);
  const Navigate = useNavigate();
  const fileRef = useRef(null);
  const [imageFile, setImageFile] = useState(undefined);
  const [imagePercentage, setImagePercentage] = useState(0);
  const [imgUploadErr, setImgUploadErr] = useState(false);
  const [formData, setFormData] = useState({});

  const handleImageUpload = (file) => {
    const storage = getStorage(app);
    const imageName = new Date().getTime() + file.name;
    const storageRef = ref(storage, imageName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercentage(Math.round(progress));
      },
      (error) => {
        setImgUploadErr(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) =>
          setFormData({ ...formData, avatar: downloadUrl })
        );
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle the update
  const handleSubmit = async (e) => {
    e.preventDefault();
    isLoadingSignal.set(true);
    try {
      const currentUser = currentUserSignal.get();

      const res = await axios.post(
        `http://localhost:4000/users/update/${currentUser.id}`,
        formData,

        {
          headers: {
            Authorization: `Bearer ${authTokenSignal.get()}`, // Add authorization token here
          },
          // withCredentials: true // Ensure cookies are sent along with the request
        }
      );
      // Update the signal with the new user data (including the new avatar)
      currentUserSignal.set({
        ...currentUserSignal.get(),
        avatar: formData.avatar,
        fullName: formData.fullName,
      });

      isLoadingSignal.set(false);
      Navigate("/profile");
      return Notify("success", res.data.msg);
    } catch (err) {
      isLoadingSignal.set(false);
      return Notify("error", err.response.data.msg);
    }
  };

  // Delete a user
  const handleDeleteUser = async () => {
    isLoadingSignal.set(true);
    try {
      const currentUser = currentUserSignal.get();
      const res = await axios.delete(
        `http://localhost:4000/users/delete/${currentUser.id}`
      );

      if (authTokenSignal.get()) {
        localStorage.removeItem("authToken");
        authTokenSignal.set(null);
        currentUserSignal.set(null);
        Navigate("/sign-in");
        isLoadingSignal.set(false);
      }
      return Notify("success", res.data.msg);
    } catch (err) {
      isLoadingSignal.set(false);
      return Notify("error", err.response.data.msg);
    }
  };

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

  useEffect(() => {
    if (imageFile) {
      handleImageUpload(imageFile);
    }
  }, [imageFile]);

  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="form-class flex  flex-col gap-4 items-center w-full"
      >
        <input
          onChange={(e) => setImageFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className="self-center rounded-full h-24 w-24 object-cover mt-2 cursor-pointer "
          src={currentUserState?.avatar || formData.avatar}
          alt="Profile avatar"
        />
        <p className="text-sm self-center">
          {imgUploadErr ? (
            <span className="text-rose-600">
              Error while uploading the image (image must be less than 2 mb)!
            </span>
          ) : imagePercentage > 0 && imagePercentage < 100 ? (
            <span className="text-green-900">
              {" "}
              {`Uploading ${imagePercentage}%`}
            </span>
          ) : (
            imagePercentage == 100 && (
              <span className="text-green-500">
                Image successfully uploaded!
              </span>
            )
          )}
        </p>
        <label htmlFor="full-name">
          <input
            className="border p-3 rounded-lg "
            type="text"
            id="full-name"
            name="fullName"
            placeholder="Full name"
            defaultValue={currentUserState.fullName}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="email">
          <input
            className="border p-3 rounded-lg "
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            defaultValue={currentUserState.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          <input
            className="border p-3 rounded-lg"
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={currentUserState.password}
            onChange={handleChange}
          />
        </label>
        <button
          disabled={isLoadingState}
          className="bg-green-500 font-semibold p-2 w-full rounded-lg text-green-100 uppercase hover:opacity-90"
        >
          {isLoadingState ? "Loading..." : "Update"}
        </button>
        <Link
          className="uppercase font-semibold bg-green-100 text-green-900 p-2 rounded-lg w-full text-center border-2 border-green-500 hover:border-green-700 hover:opacity-85 "
          to="/create-listing"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-rose-600 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-rose-600 cursor-pointer">
          Sign out
        </span>
      </div>
    </div>
  );
}

export default Profile;
