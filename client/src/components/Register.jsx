import React from "react";
import { signal } from "@preact/signals-react";
import axios from "axios";
import { Input, Button } from "@shadcn/ui";
import { useNavigate } from "react-router-dom";

const fullName = signal("");
const email = signal("");
const password = signal("");
const confirmPassword = signal("");
const error = signal("");
const loading = signal(false);

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.value !== confirmPassword.value) {
      error.value = "Passwords do not match!";
      return;
    }

    try {
      loading.value = true;
      const response = await axios.post("/auth/register", {
        fullName: fullName.value,
        email: email.value,
        password: password.value,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/home"); // Redirect after successful registration
    } catch (err) {
      error.value = err.response?.data?.message || "Registration failed!";
    } finally {
      loading.value = false;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>
        {error.value && (
          <div className="p-2 text-red-600 bg-red-100 border border-red-400 rounded">
            {error.value}
          </div>
        )}
        <Input
          type="text"
          placeholder="Full Name"
          value={fullName.value}
          onChange={(e) => (fullName.value = e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email.value}
          onChange={(e) => (email.value = e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password.value}
          onChange={(e) => (password.value = e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword.value}
          onChange={(e) => (confirmPassword.value = e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading.value}>
          {loading.value ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default Register;
