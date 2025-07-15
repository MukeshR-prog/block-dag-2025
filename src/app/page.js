"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="p-8">
      <h1 className="text-2xl mb-4">Welcome to CardSmart</h1>
      <button
        onClick={() => router.push("/login")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Login with Google
      </button>
    </main>
  );
}
