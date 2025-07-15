"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../../store/authStore";
import Navbar from "./components/navbar";

const Page = () => {
  const { user, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;
  return (
    <div className="h-full w-full flex ">
      <div className="bg-red-500 w-[30%] h-screen">
        {" "}
        <Navbar />
      </div>
      <div className="bg-blue-600 w-[70%] h-screen">
        <h1 className="text-2xl mb-2">Dashboard</h1>
        <p>Welcome, {user.displayName}</p>
      </div>
    </div>
  );
};

export default Page;
