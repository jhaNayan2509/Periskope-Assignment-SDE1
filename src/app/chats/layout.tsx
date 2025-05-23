"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Topbar from "@/components/Topbar";
import VerticalSidebar from "@/components/VerticalSidebar";
import Sidebar from "@/components/Sidebar";

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let redirectTimeout: NodeJS.Timeout;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setNotLoggedIn(true);
        redirectTimeout = setTimeout(() => {
          router.replace("/login");
        }, 1500);
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          setNotLoggedIn(true);
          redirectTimeout = setTimeout(() => {
            router.replace("/login");
          }, 1500);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
      if (redirectTimeout) clearTimeout(redirectTimeout);
    };
  }, [router]);

  if (notLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f0f2f5]">
        <div className="bg-white border border-yellow-400 text-yellow-700 px-8 py-6 rounded shadow text-lg font-semibold">
          You are not logged in. Redirecting...
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f0f2f5]">
        <div className="bg-white border px-8 py-6 rounded shadow text-lg font-semibold text-gray-600">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f0f2f5]">
      <VerticalSidebar />
      <div className="ml-14 flex flex-col h-screen">
        <Topbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 flex flex-col bg-[#f8fafb]">{children}</div>
        </div>
      </div>
    </div>
  );
}
