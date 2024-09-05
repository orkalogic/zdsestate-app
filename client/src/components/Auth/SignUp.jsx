// "use client";

import { useSignal } from "use-signals";
import { userDataSignal, userDataInitialState } from "../../store/store";
import axios from "axios";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";

function SignUp() {
  const userDataState = useSignal(userDataSignal);
  const handleChange = (e) => {
    const { name, value } = e.target;
    userDataSignal.set({ ...userDataSignal.get(), [name]: value });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:4000/auth/register", userDataState);
      console.log("User registered successfully.");
      userDataSignal(userDataInitialState);
    } catch (err) {
      console.log("Registration failed!", err.msg);
    }
    userDataSignal.set(userDataInitialState);
    console.log(userDataSignal.get());
  };
  return (
    <form
      onSubmit={handleRegistration}
      className="flex max-w-md flex-col gap-4"
    >
      <div>
        <div className="mb-2 block">
          <Label htmlFor="fullName" value="Your full name" />
        </div>
        <TextInput
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Your Full Name"
          required
          value={userDataState.fullName}
          onChange={handleChange}
          color="gray"
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email" value="Your email" />
        </div>
        <TextInput
          id="email"
          name="email"
          type="email"
          placeholder="name@gmail.com"
          required
          value={userDataState.email}
          onChange={handleChange}
          color="gray"
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password" value="Your password" />
        </div>
        <TextInput
          id="password"
          name="password"
          type="password"
          required
          value={userDataState.password}
          onChange={handleChange}
          color="gray"
        />
      </div>
      {/* <div className="flex items-center gap-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember">Remember me</Label>
      </div> */}
      <Button type="submit">Sign Up</Button>
    </form>
  );
}

export default SignUp;
