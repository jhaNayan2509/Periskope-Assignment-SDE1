"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For signup
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else if (data.user) {
        window.localStorage.setItem("sb-user-id", data.user.id);
        // Check if user exists in our users table by auth_user_id
        const { data: existing, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("auth_user_id", data.user.id)
          .maybeSingle();

        if (!existing && !fetchError) {
          router.push("/complete-profile");
        } else if (existing) {
          router.push("/chats");
        } else if (fetchError) {
          setError(fetchError.message);
        }
      }
    } else {
      // Sign up
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess(
          "Registration successful! Please check your email for a confirmation link before logging in."
        );
        setMode("login");
        setEmail("");
        setPassword("");
        setName("");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
      <form
        className="w-[360px] bg-white rounded-xl shadow-lg p-8 flex flex-col items-center"
        onSubmit={handleSubmit}
      >
        <div className="w-16 h-16 mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-green-600 font-bold text-2xl">P</span>
        </div>
        <h1 className="text-2xl font-bold mb-4">
          {mode === "login" ? "Login to Periskope" : "Sign Up for Periskope"}
        </h1>
        {success && (
          <div className="text-green-600 mb-3 text-center">{success}</div>
        )}
        {mode === "signup" && (
          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 border rounded mb-3 focus:outline-none focus:border-green-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded mb-3 focus:outline-none focus:border-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded mb-6 focus:outline-none focus:border-green-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded font-semibold hover:bg-green-600 transition"
        >
          {mode === "login" ? "Login" : "Sign Up"}
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}

        <div className="mt-4 text-sm text-gray-600">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                className="text-green-600 underline"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                  setSuccess(null);
                }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="text-green-600 underline"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setSuccess(null);
                }}
              >
                Login
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
