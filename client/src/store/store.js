import { Signal } from "use-signals";

export const userDataInitialState = {
  fullName: "",
  email: "",
  password: "",
};
export const userDataSignal = new Signal.State(userDataInitialState);
