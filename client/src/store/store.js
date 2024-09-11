import { jwtDecode } from "jwt-decode";
import { Signal } from "use-signals";

// Signal for the userData
export const userDataInitialState = {
  fullName: "",
  email: "",
  password: "",
};
export const userDataSignal = new Signal.State(userDataInitialState);

// Signal for token
export const authTokenSignal = new Signal.State(
  localStorage.getItem("authToken")
);

// Signal for the current user information
export const currentUserSignal = new Signal.State(jwtDecode(authTokenSignal.get().toString()));
