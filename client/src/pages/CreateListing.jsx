import React, { useState } from "react";
import {
  filesSignal,
  formDataImgSignal,
  isLoadingSignal,
} from "../store/store";
import { useSignal } from "use-signals";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import Notify from "../components/Notify";

function CreateListing() {
  const filesState = useSignal(filesSignal);
  const formDataImgState = useSignal(formDataImgSignal);
  const isLoadingState = useSignal(isLoadingSignal);

  const handleImageSubmit = () => {
    if (
      filesState.length > 0 &&
      filesState.length + formDataImgState.imageUrls.length < 4
    ) {
      isLoadingSignal.set(true);
      const images = [];

      for (let i = 0; i < filesState.length; i++) {
        images.push(storeImage(filesState[i]));
      }
      Promise.all(images)
        .then((urls) => {
          formDataImgSignal.set({
            ...formDataImgSignal.get(),
            imageUrls: formDataImgSignal.get().imageUrls.concat(urls),
          });
          isLoadingSignal.set(false);
        })
        .catch((err) => {
          isLoadingSignal.set(false);
          Notify("error", "Image upload failed (2 mb max per image)");
        });
    } else {
      isLoadingSignal.set(false);
      Notify("error", "You can only upload 4 images per listing");
    }
  };

  const storeImage = async (filesState) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + filesState.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, filesState);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleImgDelete = (index) => {
    formDataImgSignal.set({
      ...formDataImgSignal.get(),
      imageUrls: formDataImgSignal
        .get()
        .imageUrls.filter((_, i) => i !== index),
    });
  };
  return (
    <div className="p-3 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1 ">
          <input
            className="border p-3 rounded-lg"
            type="text"
            name="name"
            id="name"
            placeholder="name"
            maxLength={62}
            minLength={10}
            required
          />
          <textarea
            className="border p-3 rounded-lg"
            type="text"
            name="description"
            id="description"
            placeholder="Description"
            required
          />
          <input
            className="border p-3 rounded-lg"
            type="text"
            name="address"
            id="address"
            placeholder="Address"
            maxLength={62}
            minLength={10}
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" name="sale" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="rent" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="parking"
                id="parking"
                className="w-5"
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="furnished"
                id="furnished"
                className="w-5"
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="offer" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="bedrooms"
                id="bedrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-green-500 rounded-lg"
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="bathrooms"
                id="bathrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-green-500 rounded-lg"
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg">
              <input
                type="number"
                name="regularPrice"
                id="regularPrice"
                min={1}
                max={10}
                required
                className="p-3 border border-green-500  rounded-lg"
              />
              <div className="flex flex-col text-center items-center">
                <p>Regular Price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="discountPrice"
                name="discountPrice"
                id="bedrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-green-500 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold ">
            Images:
            <span className="font-normal text-slate-600 ml-2">
              The first image will be the cover (max 4)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => filesSignal.set(e.target.files)}
              className="p-3 border border-green-500 rounded w-full"
              type="file"
              name="images"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={isLoadingState}
              onClick={handleImageSubmit}
              className="bg-green-50 font-bold p-2 w-full rounded-lg text-green-500 border border-green-700 uppercase hover:shadow-lg "
            >
              {isLoadingState ? "Loading..." : "Upload"}
            </button>
          </div>
          {formDataImgState.imageUrls.length > 0 &&
            formDataImgState.imageUrls.map((url, index) => {
              return (
                <div
                  key={index}
                  className="flex justify-between p-3 border items-center "
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="text-green-600 w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleImgDelete(index)}
                    className="p-3 text-rose-800 rounded-lg uppercase  hover:opacity-65"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          <button className="uppercase font-bold p-3 bg-green-700 text-green-100 rounded-lg hover:opacity-90 disabled::opacity-75">
            Create Listing
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateListing;
