import React from "react";

function OAuth() {
    const handdleGoogleAuth=()=>{
        
    }
  return (
    <button
    onClick={handdleGoogleAuth}
      type="button"
      className="bg-rose-800 text-green-50 uppercase rounded-lg p-2 hover:opacity-95 "
    >
      Continue with Google
    </button>
  );
}

export default OAuth;
