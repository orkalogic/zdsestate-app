import React, { useEffect } from "react";
import { authTokenSignal } from "../store/store";

function Listings() {
//   useEffect(() => {
//     if (!authTokenSignal.get()) {
//       navigate("/sign-in");
//     }
//   }, []);
  return (
    <div className="text-4xl">
      <h1>Listings page</h1>
    </div>
  );
}

export default Listings;
