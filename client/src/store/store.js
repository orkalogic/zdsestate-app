import { jwtDecode } from "jwt-decode";
import { Signal } from "use-signals";

// Signal for the userData
export const userDataInitialState = {
  fullName: "",
  email: "",
  password: "",
  avatar: "",
};
export const userDataSignal = new Signal.State(userDataInitialState);

// Signal for token
export const authTokenSignal = new Signal.State(
  localStorage.getItem("authToken")
);

// Signal for the current user information
const getCurrentUser = () => {
  const currentUser = localStorage.getItem("authToken");
  return currentUser ? jwtDecode(currentUser.toString()) : null;
};
export const currentUserSignal = new Signal.State(getCurrentUser());

export const isLoadingSignal = new Signal.State(false);

export const filesSignal = new Signal.State([]);

export const formDataImgSignal = new Signal.State({
  imageUrls: [],
});

// export const stateSignal = new Signal.State({
//   isLoading: false,
//   error: null,
// });
