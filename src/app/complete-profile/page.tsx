"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CompleteProfilePage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (!user || userError) {
      setError("Not logged in.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("users").insert([
      {
        name,
        phone_number: phone,
        email: user.email,
        avatar_url: avatarUrl,
        auth_user_id: user.id,
      },
    ]);
    setLoading(false);

    if (insertError) {
      setError(insertError.message);
    } else {
      router.push("/chats");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
      <form
        className="w-[360px] bg-white rounded-xl shadow-lg p-8 flex flex-col items-center"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-2 border rounded mb-3 focus:outline-none focus:border-green-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="w-full px-4 py-2 border rounded mb-3 focus:outline-none focus:border-green-500"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Avatar URL (optional)"
          className="w-full px-4 py-2 border rounded mb-6 focus:outline-none focus:border-green-500"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded font-semibold hover:bg-green-600 transition"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
    </div>
  );
}
